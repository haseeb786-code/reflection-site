import https from 'https';
import tls from 'tls';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');

// Load environment
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
  tls: null,
  authChallenges: [],
  latencyChallenges: [],
  schemaValidation: {
    usersMe: null,
    wcProducts: null
  },
  summary: {
    passed: 0,
    failed: 0,
    total: 0
  }
};

function recordAssert(group, testName, pass, details) {
  results.summary.total++;
  if (pass) {
    results.summary.passed++;
    console.log(`[PASS] [${group}] ${testName}: ${details}`);
  } else {
    results.summary.failed++;
    console.error(`[FAIL] [${group}] ${testName}: ${details}`);
  }
  return { group, testName, pass, details };
}

// 1. TLS Certificate Validation
async function testTlsCertificate() {
  console.log('\n--- 1. Testing TLS Certificate Validity ---');
  return new Promise((resolve) => {
    const options = {
      host: HOSTNAME,
      port: PORT,
      servername: HOSTNAME,
      rejectUnauthorized: true
    };

    const socket = tls.connect(options, () => {
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

      // Subject alternative names
      const san = cert.subjectaltname || '';

      recordAssert('TLS', 'Socket Authorized (Chain verification)', authorized === true, authorized ? 'Valid trusted certificate chain' : `Auth error: ${authorizationError}`);
      recordAssert('TLS', 'Certificate Date Validity', isDateValid, `Valid from ${cert.valid_from} to ${cert.valid_to} (${daysRemaining} days remaining)`);
      recordAssert('TLS', 'SAN matches hostname', san.includes(HOSTNAME) || cert.subject?.CN === HOSTNAME, `CN: ${cert.subject?.CN}, SAN: ${san}`);
      recordAssert('TLS', 'Modern TLS Protocol', ['TLSv1.2', 'TLSv1.3'].includes(protocol), `Negotiated: ${protocol}, Cipher: ${cipher?.name}`);

      results.tls = {
        authorized,
        authorizationError,
        subject: cert.subject,
        issuer: cert.issuer,
        validFrom: cert.valid_from,
        validTo: cert.valid_to,
        daysRemaining,
        protocol,
        cipher,
        subjectaltname: san
      };

      socket.end();
      resolve();
    });

    socket.on('error', (err) => {
      recordAssert('TLS', 'TLS Socket Connection', false, err.message);
      results.tls = { error: err.message };
      resolve();
    });
  });
}

// 2. Authentication Challenges
async function testAuthentication() {
  console.log('\n--- 2. Testing Valid vs Invalid Authentication ---');
  const validCreds = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');
  const invalidCreds = Buffer.from(`${WP_USER}:WrongPassword999`).toString('base64');
  const fakeUserCreds = Buffer.from(`nonexistent_user_abc:${WP_PASS}`).toString('base64');
  const malformedHeader = 'Basic ???notbase64???';

  const testCases = [
    {
      name: 'Valid credentials to /wp-json/wp/v2/users/me',
      endpoint: '/wp-json/wp/v2/users/me',
      headers: { Authorization: `Basic ${validCreds}` },
      expectedStatus: 200
    },
    {
      name: 'Valid credentials to /wp-json/wc/v3/products',
      endpoint: '/wp-json/wc/v3/products?per_page=1',
      headers: { Authorization: `Basic ${validCreds}` },
      expectedStatus: 200
    },
    {
      name: 'Invalid password to /wp-json/wp/v2/users/me',
      endpoint: '/wp-json/wp/v2/users/me',
      headers: { Authorization: `Basic ${invalidCreds}` },
      expectedStatus: [401, 403]
    },
    {
      name: 'Nonexistent user to /wp-json/wp/v2/users/me',
      endpoint: '/wp-json/wp/v2/users/me',
      headers: { Authorization: `Basic ${fakeUserCreds}` },
      expectedStatus: [401, 403]
    },
    {
      name: 'No auth header to /wp-json/wp/v2/users/me',
      endpoint: '/wp-json/wp/v2/users/me',
      headers: {},
      expectedStatus: [401, 403]
    },
    {
      name: 'Invalid credentials to /wp-json/wc/v3/products',
      endpoint: '/wp-json/wc/v3/products?per_page=1',
      headers: { Authorization: `Basic ${invalidCreds}` },
      expectedStatus: [401, 403]
    },
    {
      name: 'Malformed auth header to /wp-json/wp/v2/users/me',
      endpoint: '/wp-json/wp/v2/users/me',
      headers: { Authorization: malformedHeader },
      expectedStatus: [400, 401, 403]
    }
  ];

  for (const tc of testCases) {
    try {
      const res = await fetch(`${WP_URL}${tc.endpoint}`, {
        method: 'GET',
        headers: {
          ...tc.headers,
          'Accept': 'application/json'
        }
      });
      const acceptable = Array.isArray(tc.expectedStatus)
        ? tc.expectedStatus.includes(res.status)
        : res.status === tc.expectedStatus;

      const body = await res.text();
      let parsed = null;
      try { parsed = JSON.parse(body); } catch(e) {}

      const detail = `HTTP ${res.status} (Expected: ${tc.expectedStatus}) - Response code: ${parsed?.code || 'N/A'}`;
      recordAssert('Auth', tc.name, acceptable, detail);
      results.authChallenges.push({
        name: tc.name,
        endpoint: tc.endpoint,
        status: res.status,
        expectedStatus: tc.expectedStatus,
        passed: acceptable,
        responseCode: parsed?.code
      });
    } catch (err) {
      recordAssert('Auth', tc.name, false, `Fetch error: ${err.message}`);
    }
  }
}

// 3. Latency SLA Stress Test (<2000ms SLA under repeated calls)
async function testLatencySLA() {
  console.log('\n--- 3. Testing Latency Under Repeated Calls (<2000ms SLA) ---');
  const validCreds = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');
  const iterations = 8;
  const latenciesUsersMe = [];
  const latenciesWcProducts = [];

  console.log(`Running ${iterations} sequential requests to /wp-json/wp/v2/users/me...`);
  for (let i = 1; i <= iterations; i++) {
    const t0 = performance.now();
    try {
      const res = await fetch(`${WP_URL}/wp-json/wp/v2/users/me`, {
        headers: {
          Authorization: `Basic ${validCreds}`,
          'Accept': 'application/json'
        }
      });
      await res.text();
      const elapsed = Math.round(performance.now() - t0);
      latenciesUsersMe.push(elapsed);
      recordAssert('Latency', `/users/me call #${i}`, elapsed < 2000, `${elapsed}ms (SLA: <2000ms)`);
    } catch (err) {
      recordAssert('Latency', `/users/me call #${i}`, false, `Error: ${err.message}`);
    }
  }

  console.log(`\nRunning ${iterations} sequential requests to /wp-json/wc/v3/products...`);
  for (let i = 1; i <= iterations; i++) {
    const t0 = performance.now();
    try {
      const res = await fetch(`${WP_URL}/wp-json/wc/v3/products?per_page=10`, {
        headers: {
          Authorization: `Basic ${validCreds}`,
          'Accept': 'application/json'
        }
      });
      await res.text();
      const elapsed = Math.round(performance.now() - t0);
      latenciesWcProducts.push(elapsed);
      recordAssert('Latency', `/wc/v3/products call #${i}`, elapsed < 2000, `${elapsed}ms (SLA: <2000ms)`);
    } catch (err) {
      recordAssert('Latency', `/wc/v3/products call #${i}`, false, `Error: ${err.message}`);
    }
  }

  // Calculate statistics
  const calcStats = (arr) => {
    if (!arr.length) return {};
    const sorted = [...arr].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const avg = Math.round(sorted.reduce((s, v) => s + v, 0) / sorted.length);
    const p95 = sorted[Math.floor(sorted.length * 0.95)] || max;
    return { min, max, avg, p95, count: sorted.length };
  };

  const usersMeStats = calcStats(latenciesUsersMe);
  const wcProductsStats = calcStats(latenciesWcProducts);

  recordAssert('LatencySummary', '/users/me Max Latency vs 2000ms SLA', usersMeStats.max < 2000, `Min: ${usersMeStats.min}ms, Avg: ${usersMeStats.avg}ms, P95: ${usersMeStats.p95}ms, Max: ${usersMeStats.max}ms`);
  recordAssert('LatencySummary', '/wc/v3/products Max Latency vs 2000ms SLA', wcProductsStats.max < 2000, `Min: ${wcProductsStats.min}ms, Avg: ${wcProductsStats.avg}ms, P95: ${wcProductsStats.p95}ms, Max: ${wcProductsStats.max}ms`);

  results.latencyChallenges = {
    usersMe: { latencies: latenciesUsersMe, stats: usersMeStats },
    wcProducts: { latencies: latenciesWcProducts, stats: wcProductsStats }
  };
}

// 4. Payload Schema Validation
async function testSchemaValidation() {
  console.log('\n--- 4. Payload Schema Validation ---');
  const validCreds = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');

  // 4a. /wp-json/wp/v2/users/me
  try {
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/users/me`, {
      headers: {
        Authorization: `Basic ${validCreds}`,
        'Accept': 'application/json'
      }
    });
    const user = await res.json();

    const hasId = typeof user.id === 'number' && user.id > 0;
    const hasName = typeof user.name === 'string' && user.name.length > 0;
    const hasSlug = typeof user.slug === 'string' && user.slug.length > 0;
    const hasRoles = Array.isArray(user.roles) && user.roles.includes('administrator');
    const hasAdminCap = user.capabilities && user.capabilities.administrator === true;
    const noPasswordLeak = user.user_pass === undefined && user.password === undefined;

    recordAssert('Schema', 'users/me has numeric id', hasId, `id: ${user.id}`);
    recordAssert('Schema', 'users/me has string name & slug', hasName && hasSlug, `name: "${user.name}", slug: "${user.slug}"`);
    recordAssert('Schema', 'users/me roles include administrator', hasRoles, `roles: [${user.roles?.join(', ')}]`);
    recordAssert('Schema', 'users/me capabilities.administrator === true', hasAdminCap, `administrator: ${user.capabilities?.administrator}`);
    recordAssert('Schema', 'users/me does NOT leak password hash', noPasswordLeak, 'No user_pass or password field present');

    results.schemaValidation.usersMe = {
      id: user.id,
      name: user.name,
      slug: user.slug,
      roles: user.roles,
      capabilities: user.capabilities,
      keys: Object.keys(user)
    };
  } catch (err) {
    recordAssert('Schema', 'users/me fetch and schema check', false, err.message);
  }

  // 4b. /wp-json/wc/v3/products
  try {
    const res = await fetch(`${WP_URL}/wp-json/wc/v3/products?per_page=100`, {
      headers: {
        Authorization: `Basic ${validCreds}`,
        'Accept': 'application/json'
      }
    });
    const products = await res.json();

    const isArray = Array.isArray(products);
    recordAssert('Schema', 'wc/v3/products returns Array', isArray, `Returned ${products.length} items`);

    if (isArray && products.length > 0) {
      let allHaveIds = true;
      let allHaveNames = true;
      let allHaveValidTypes = true;
      let allHaveValidPricing = true;
      let allHaveCategories = true;
      let allHaveImages = true;

      for (const p of products) {
        if (typeof p.id !== 'number' || p.id <= 0) allHaveIds = false;
        if (typeof p.name !== 'string' || !p.name) allHaveNames = false;
        if (!['simple', 'variable', 'grouped', 'external'].includes(p.type)) allHaveValidTypes = false;
        if (p.price === undefined || p.regular_price === undefined) allHaveValidPricing = false;
        if (!Array.isArray(p.categories)) allHaveCategories = false;
        if (!Array.isArray(p.images)) allHaveImages = false;
      }

      recordAssert('Schema', 'wc/v3/products: all items have positive integer id', allHaveIds, 'All items have valid numeric id');
      recordAssert('Schema', 'wc/v3/products: all items have valid name string', allHaveNames, 'All items have string name');
      recordAssert('Schema', 'wc/v3/products: all items have valid WooCommerce type', allHaveValidTypes, 'All types simple/variable');
      recordAssert('Schema', 'wc/v3/products: all items have price and regular_price', allHaveValidPricing, 'All items have price fields');
      recordAssert('Schema', 'wc/v3/products: all items have categories array', allHaveCategories, 'Categories array present');
      recordAssert('Schema', 'wc/v3/products: all items have images array', allHaveImages, 'Images array present');

      results.schemaValidation.wcProducts = {
        count: products.length,
        sampleProduct: {
          id: products[0].id,
          name: products[0].name,
          slug: products[0].slug,
          type: products[0].type,
          price: products[0].price,
          regular_price: products[0].regular_price,
          category_count: products[0].categories?.length,
          image_count: products[0].images?.length
        }
      };
    }
  } catch (err) {
    recordAssert('Schema', 'wc/v3/products fetch and schema check', false, err.message);
  }
}

async function run() {
  console.log('========================================================');
  console.log('CHALLENGER M1: LIVE HOSTINGER CONNECTIVITY & SECURITY');
  console.log(`Target: ${WP_URL}`);
  console.log('========================================================');

  await testTlsCertificate();
  await testAuthentication();
  await testLatencySLA();
  await testSchemaValidation();

  console.log('\n========================================================');
  console.log('CHALLENGE SUMMARY');
  console.log(`Passed: ${results.summary.passed} / ${results.summary.total}`);
  console.log(`Failed: ${results.summary.failed} / ${results.summary.total}`);
  console.log(`Verdict: ${results.summary.failed === 0 ? 'APPROVE' : 'FAIL'}`);
  console.log('========================================================');

  // Save results JSON for handoff creation
  const outPath = path.join(rootDir, '.agents', 'teamwork', 'challenger_m1_2', 'empirical_results.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`Detailed results saved to: ${outPath}`);
}

run().catch(console.error);
