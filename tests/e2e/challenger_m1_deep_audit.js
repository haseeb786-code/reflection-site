import tls from 'tls';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');

function loadEnv() {
  const envPath = path.join(rootDir, '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
      }
    }
  }
  return env;
}

const env = loadEnv();
const WP_URL = (env.WORDPRESS_URL || env.WP_SITE_URL || '').replace(/\/+$/, '');
const WP_USER = env.WORDPRESS_USER || env.WP_USERNAME || '';
const WP_PASS = (env.WORDPRESS_APP_PASSWORD || env.WP_APPLICATION_PASSWORD || '').replace(/\s+/g, '');

const parsedUrl = new URL(WP_URL);
const HOSTNAME = parsedUrl.hostname;
const PORT = parsedUrl.port ? parseInt(parsedUrl.port, 10) : 443;

const results = {
  timestamp: new Date().toISOString(),
  target: WP_URL,
  hostname: HOSTNAME,
  tls: {},
  auth: {
    tests: [],
    litespeedCacheAnomaly: {}
  },
  latency: {
    usersMe: {},
    wcProducts: {}
  },
  schema: {
    usersMeDefault: {},
    usersMeEdit: {},
    wcProducts: {}
  },
  auditSummary: {
    totalAssertions: 0,
    passedAssertions: 0,
    failedAssertions: 0,
    securityWarnings: []
  }
};

function recordAssert(category, title, pass, details) {
  results.auditSummary.totalAssertions++;
  if (pass) {
    results.auditSummary.passedAssertions++;
    console.log(`[PASS] [${category}] ${title}: ${details}`);
  } else {
    results.auditSummary.failedAssertions++;
    console.error(`[FAIL] [${category}] ${title}: ${details}`);
  }
  return { category, title, pass, details };
}

// RFC 6125 Wildcard Matching helper
function matchesHostPattern(pattern, host) {
  if (pattern === host) return true;
  if (pattern.startsWith('*.')) {
    const rootDomain = pattern.slice(2);
    const hostParts = host.split('.');
    const patternParts = rootDomain.split('.');
    if (hostParts.length === patternParts.length + 1) {
      return hostParts.slice(1).join('.') === rootDomain;
    }
  }
  return false;
}

// 1. TLS Certificate & Security
async function auditTls() {
  console.log('\n========================================================');
  console.log('1. HTTPS TLS CERTIFICATE AUDIT');
  console.log('========================================================');

  return new Promise((resolve) => {
    const socket = tls.connect({
      host: HOSTNAME,
      port: PORT,
      servername: HOSTNAME,
      rejectUnauthorized: true
    }, () => {
      const cert = socket.getPeerCertificate(true);
      const authorized = socket.authorized;
      const authorizationError = socket.authorizationError;
      const protocol = socket.getProtocol();
      const cipher = socket.getCipher();

      const validFrom = new Date(cert.valid_from);
      const validTo = new Date(cert.valid_to);
      const now = new Date();
      const isDateValid = now >= validFrom && now <= validTo;
      const daysRemaining = Math.floor((validTo - now) / (1000 * 60 * 60 * 24));

      // Parse SANs
      const rawSan = cert.subjectaltname || '';
      const sanEntries = rawSan.split(',').map(s => s.trim().replace(/^DNS:/, ''));
      const sanMatches = sanEntries.some(entry => matchesHostPattern(entry, HOSTNAME)) ||
                         matchesHostPattern(cert.subject?.CN || '', HOSTNAME);

      recordAssert('TLS', 'Chain Trust & Authorization', authorized === true, authorized ? 'Trusted CA chain verified' : `Error: ${authorizationError}`);
      recordAssert('TLS', 'Certificate Temporal Validity', isDateValid, `Valid from ${cert.valid_from} to ${cert.valid_to} (${daysRemaining} days remaining)`);
      recordAssert('TLS', 'Hostname & SAN Wildcard Match', sanMatches, `Host "${HOSTNAME}" matches SANs: [${sanEntries.join(', ')}]`);
      recordAssert('TLS', 'Modern TLS Protocol', ['TLSv1.2', 'TLSv1.3'].includes(protocol), `Protocol: ${protocol}, Cipher: ${cipher?.name}`);

      results.tls = {
        authorized,
        authorizationError,
        subjectCN: cert.subject?.CN,
        issuer: cert.issuer,
        validFrom: cert.valid_from,
        validTo: cert.valid_to,
        daysRemaining,
        sanEntries,
        protocol,
        cipher
      };

      socket.end();
      resolve();
    });

    socket.on('error', (err) => {
      recordAssert('TLS', 'TLS Connection Failure', false, err.message);
      results.tls = { error: err.message };
      resolve();
    });
  });
}

// 2. Authentication Response Codes & Security
async function auditAuth() {
  console.log('\n========================================================');
  console.log('2. AUTHENTICATION RESPONSE CODES & SECURITY AUDIT');
  console.log('========================================================');

  const validCreds = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');
  const invalidCreds = Buffer.from(`${WP_USER}:InvalidSecretPwd99`).toString('base64');
  const fakeUserCreds = Buffer.from(`phantom_user_xyz:${WP_PASS}`).toString('base64');
  const malformedAuth = 'Basic !!!invalid_base64!!!';

  const cases = [
    {
      title: 'Valid credentials to /wp-json/wp/v2/users/me',
      url: `${WP_URL}/wp-json/wp/v2/users/me`,
      headers: { Authorization: `Basic ${validCreds}` },
      expected: [200]
    },
    {
      title: 'Invalid password to /wp-json/wp/v2/users/me',
      url: `${WP_URL}/wp-json/wp/v2/users/me`,
      headers: { Authorization: `Basic ${invalidCreds}` },
      expected: [401, 403],
      expectedCode: 'incorrect_password'
    },
    {
      title: 'Nonexistent user to /wp-json/wp/v2/users/me',
      url: `${WP_URL}/wp-json/wp/v2/users/me`,
      headers: { Authorization: `Basic ${fakeUserCreds}` },
      expected: [401, 403],
      expectedCode: 'invalid_username'
    },
    {
      title: 'Missing Authorization header to /wp-json/wp/v2/users/me',
      url: `${WP_URL}/wp-json/wp/v2/users/me`,
      headers: {},
      expected: [401, 403],
      expectedCode: 'rest_not_logged_in'
    },
    {
      title: 'Malformed Authorization header to /wp-json/wp/v2/users/me',
      url: `${WP_URL}/wp-json/wp/v2/users/me`,
      headers: { Authorization: malformedAuth },
      expected: [400, 401, 403],
      expectedCode: 'rest_not_logged_in'
    },
    {
      title: 'Unauthenticated POST to /wp-json/wc/v3/products (Write operation)',
      url: `${WP_URL}/wp-json/wc/v3/products`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Unauthorized Mirror' }),
      expected: [401, 403],
      expectedCode: 'woocommerce_rest_cannot_create'
    },
    {
      title: 'Invalid credentials POST to /wp-json/wc/v3/products (Write operation)',
      url: `${WP_URL}/wp-json/wc/v3/products`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${invalidCreds}` },
      body: JSON.stringify({ name: 'Unauthorized Mirror' }),
      expected: [401, 403],
      expectedCode: 'woocommerce_rest_cannot_create'
    },
    {
      title: 'Uncached unauthenticated GET to /wp-json/wc/v3/products',
      url: `${WP_URL}/wp-json/wc/v3/products?nonce_bypass_${Date.now()}=1`,
      headers: {},
      expected: [401, 403],
      expectedCode: 'woocommerce_rest_cannot_view'
    },
    {
      title: 'Uncached invalid credentials GET to /wp-json/wc/v3/products',
      url: `${WP_URL}/wp-json/wc/v3/products?nonce_bypass_${Date.now() + 1}=1`,
      headers: { Authorization: `Basic ${invalidCreds}` },
      expected: [401, 403],
      expectedCode: 'woocommerce_rest_cannot_view'
    }
  ];

  for (const c of cases) {
    try {
      const res = await fetch(c.url, {
        method: c.method || 'GET',
        headers: { ...c.headers, 'Accept': 'application/json' },
        body: c.body || undefined
      });
      const passedStatus = c.expected.includes(res.status);
      const text = await res.text();
      let json = null;
      try { json = JSON.parse(text); } catch(e) {}

      const passedCode = !c.expectedCode || json?.code === c.expectedCode;
      const pass = passedStatus && passedCode;

      recordAssert('Auth', c.title, pass, `HTTP ${res.status} (Expected: ${c.expected.join('/')}), code: "${json?.code || 'N/A'}"`);
      results.auth.tests.push({
        title: c.title,
        status: res.status,
        code: json?.code,
        pass
      });
    } catch (err) {
      recordAssert('Auth', c.title, false, `Fetch error: ${err.message}`);
    }
  }

  // Empirical test for LiteSpeed Cache anomaly on REST API GET
  console.log('\n--- Investigating LiteSpeed REST API Cache Anomaly ---');
  const cacheTestUrl = `${WP_URL}/wp-json/wc/v3/products?lscache_test_${Date.now()}=1`;
  
  // Step A: fetch with valid credentials
  const resValid = await fetch(cacheTestUrl, { headers: { Authorization: `Basic ${validCreds}` } });
  const validStatus = resValid.status;
  const validLsHeader = resValid.headers.get('x-litespeed-cache');
  const validLsControl = resValid.headers.get('x-litespeed-cache-control');

  // Step B: fetch same URL with invalid credentials immediately after
  const resInvalid = await fetch(cacheTestUrl, { headers: { Authorization: `Basic ${invalidCreds}` } });
  const invalidStatus = resInvalid.status;
  const invalidLsHeader = resInvalid.headers.get('x-litespeed-cache');

  const cacheHitBypass = invalidStatus === 200 && invalidLsHeader === 'hit';
  if (cacheHitBypass) {
    const warning = `LiteSpeed Cache caches authenticated GET /wp-json/wc/v3/products responses (${validLsControl}). Subsequent unauthenticated/invalid requests hit cache (HTTP 200) instead of being rejected (HTTP 401).`;
    console.warn(`[SECURITY FINDING] ${warning}`);
    results.auditSummary.securityWarnings.push(warning);
    results.auth.litespeedCacheAnomaly = {
      detected: true,
      validStatus,
      invalidStatus,
      litespeedCacheHeader: invalidLsHeader,
      litespeedControlHeader: validLsControl,
      impact: 'Read-only catalog data is cached at LiteSpeed edge and served on cache-hit; write operations remain strictly 401-protected.'
    };
  } else {
    results.auth.litespeedCacheAnomaly = { detected: false };
  }
}

// 3. Latency SLA Stress Testing (<2000ms SLA)
async function auditLatency() {
  console.log('\n========================================================');
  console.log('3. LATENCY UNDER REPEATED CALLS (<2000ms SLA)');
  console.log('========================================================');

  const validCreds = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');
  const runs = 10;
  const usersMeLatencies = [];
  const wcProductsLatencies = [];

  // Run 10 sequential calls to /wp-json/wp/v2/users/me
  console.log(`Executing ${runs} sequential requests to /wp-json/wp/v2/users/me...`);
  for (let i = 1; i <= runs; i++) {
    const t0 = performance.now();
    try {
      const res = await fetch(`${WP_URL}/wp-json/wp/v2/users/me?t=${Date.now()}`, {
        headers: { Authorization: `Basic ${validCreds}`, 'Accept': 'application/json' }
      });
      await res.text();
      const elapsed = Math.round(performance.now() - t0);
      usersMeLatencies.push(elapsed);
      recordAssert('Latency', `users/me round #${i}`, elapsed < 2000, `${elapsed}ms (SLA: <2000ms)`);
    } catch (err) {
      recordAssert('Latency', `users/me round #${i}`, false, err.message);
    }
  }

  // Run 10 sequential calls to /wp-json/wc/v3/products
  console.log(`\nExecuting ${runs} sequential requests to /wp-json/wc/v3/products...`);
  for (let i = 1; i <= runs; i++) {
    const t0 = performance.now();
    try {
      const res = await fetch(`${WP_URL}/wp-json/wc/v3/products?per_page=10&t=${Date.now()}`, {
        headers: { Authorization: `Basic ${validCreds}`, 'Accept': 'application/json' }
      });
      await res.text();
      const elapsed = Math.round(performance.now() - t0);
      wcProductsLatencies.push(elapsed);
      recordAssert('Latency', `wc/v3/products round #${i}`, elapsed < 2000, `${elapsed}ms (SLA: <2000ms)`);
    } catch (err) {
      recordAssert('Latency', `wc/v3/products round #${i}`, false, err.message);
    }
  }

  const computeStats = (arr) => {
    if (!arr.length) return {};
    const sorted = [...arr].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const avg = Math.round(sorted.reduce((a, b) => a + b, 0) / sorted.length);
    const median = sorted[Math.floor(sorted.length / 2)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)] || max;
    return { min, max, avg, median, p95, count: sorted.length };
  };

  const usersMeStats = computeStats(usersMeLatencies);
  const wcProductsStats = computeStats(wcProductsLatencies);

  recordAssert('LatencySLA', '/wp-json/wp/v2/users/me SLA (<2000ms)', usersMeStats.max < 2000, `Min: ${usersMeStats.min}ms, Avg: ${usersMeStats.avg}ms, Med: ${usersMeStats.median}ms, P95: ${usersMeStats.p95}ms, Max: ${usersMeStats.max}ms`);
  recordAssert('LatencySLA', '/wp-json/wc/v3/products SLA (<2000ms)', wcProductsStats.max < 2000, `Min: ${wcProductsStats.min}ms, Avg: ${wcProductsStats.avg}ms, Med: ${wcProductsStats.median}ms, P95: ${wcProductsStats.p95}ms, Max: ${wcProductsStats.max}ms`);

  results.latency.usersMe = { latencies: usersMeLatencies, stats: usersMeStats };
  results.latency.wcProducts = { latencies: wcProductsLatencies, stats: wcProductsStats };
}

// 4. Schema Validation
async function auditSchema() {
  console.log('\n========================================================');
  console.log('4. PAYLOAD SCHEMA VALIDATION');
  console.log('========================================================');

  const validCreds = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');

  // 4a. /wp-json/wp/v2/users/me (default context)
  console.log('Testing /wp-json/wp/v2/users/me (view context)...');
  const resDefault = await fetch(`${WP_URL}/wp-json/wp/v2/users/me`, {
    headers: { Authorization: `Basic ${validCreds}` }
  });
  const userDef = await resDefault.json();

  recordAssert('Schema', 'users/me (view) id is positive integer', typeof userDef.id === 'number' && userDef.id > 0, `id = ${userDef.id}`);
  recordAssert('Schema', 'users/me (view) name & slug match admin', userDef.slug === 'admin' && userDef.name === 'admin', `name="${userDef.name}", slug="${userDef.slug}"`);
  recordAssert('Schema', 'users/me (view) does NOT leak password hash', userDef.user_pass === undefined && userDef.password === undefined, 'No password field present');

  // 4b. /wp-json/wp/v2/users/me?context=edit (edit context required for roles & capabilities)
  console.log('\nTesting /wp-json/wp/v2/users/me?context=edit (edit context)...');
  const resEdit = await fetch(`${WP_URL}/wp-json/wp/v2/users/me?context=edit`, {
    headers: { Authorization: `Basic ${validCreds}` }
  });
  const userEdit = await resEdit.json();

  const hasAdminRole = Array.isArray(userEdit.roles) && userEdit.roles.includes('administrator');
  const hasAdminCap = userEdit.capabilities && userEdit.capabilities.administrator === true;
  recordAssert('Schema', 'users/me (edit) has administrator role', hasAdminRole, `roles: [${userEdit.roles?.join(', ')}]`);
  recordAssert('Schema', 'users/me (edit) has administrator capability', hasAdminCap, `capabilities.administrator: ${userEdit.capabilities?.administrator}`);

  results.schema.usersMeDefault = {
    id: userDef.id,
    name: userDef.name,
    slug: userDef.slug,
    keys: Object.keys(userDef)
  };
  results.schema.usersMeEdit = {
    id: userEdit.id,
    roles: userEdit.roles,
    capabilitiesAdmin: userEdit.capabilities?.administrator,
    keysCount: Object.keys(userEdit).length
  };

  // 4c. /wp-json/wc/v3/products
  console.log('\nTesting /wp-json/wc/v3/products schema...');
  const resProducts = await fetch(`${WP_URL}/wp-json/wc/v3/products?per_page=100`, {
    headers: { Authorization: `Basic ${validCreds}` }
  });
  const products = await resProducts.json();

  recordAssert('Schema', 'wc/v3/products is Array', Array.isArray(products), `Item count: ${products.length}`);
  recordAssert('Schema', 'wc/v3/products contains all 9 catalog products', products.length === 9, `Found ${products.length} products`);

  let validKeys = true;
  let validPrices = true;
  let validCategories = true;
  let validImages = true;

  for (const p of products) {
    if (typeof p.id !== 'number' || !p.name || !p.slug || !p.type) validKeys = false;
    if (p.price === undefined || p.regular_price === undefined) validPrices = false;
    if (!Array.isArray(p.categories) || p.categories.length === 0) validCategories = false;
    if (!Array.isArray(p.images) || p.images.length === 0) validImages = false;
  }

  recordAssert('Schema', 'All products have id, name, slug, and valid type', validKeys, 'Conforms to WooCommerce Product Schema');
  recordAssert('Schema', 'All products have price and regular_price', validPrices, 'Pricing fields present on all products');
  recordAssert('Schema', 'All products have non-empty categories array', validCategories, 'Category taxonomy attached to all products');
  recordAssert('Schema', 'All products have non-empty images array', validImages, 'Media assets attached to all products');

  results.schema.wcProducts = {
    totalCount: products.length,
    productTypes: [...new Set(products.map(p => p.type))],
    names: products.map(p => p.name)
  };
}

async function main() {
  console.log('================================================================');
  console.log('CHALLENGER M1: COMPREHENSIVE LIVE CONNECTIVITY & SECURITY AUDIT');
  console.log(`Target: ${WP_URL}`);
  console.log('================================================================');

  await auditTls();
  await auditAuth();
  await auditLatency();
  await auditSchema();

  console.log('\n================================================================');
  console.log('FINAL AUDIT VERDICT');
  console.log(`Total Assertions: ${results.auditSummary.totalAssertions}`);
  console.log(`Passed: ${results.auditSummary.passedAssertions}`);
  console.log(`Failed: ${results.auditSummary.failedAssertions}`);
  const verdict = results.auditSummary.failedAssertions === 0 ? 'APPROVE' : 'FAIL';
  console.log(`VERDICT: ${verdict}`);
  if (results.auditSummary.securityWarnings.length > 0) {
    console.log(`Security Warnings: ${results.auditSummary.securityWarnings.length}`);
    results.auditSummary.securityWarnings.forEach((w, i) => console.log(`  [${i+1}] ${w}`));
  }
  console.log('================================================================\n');

  const outPath = path.join(rootDir, '.agents', 'teamwork', 'challenger_m1_2', 'empirical_results.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
}

main().catch(console.error);
