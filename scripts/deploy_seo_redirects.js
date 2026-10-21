import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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
const WP_URL = (env.WORDPRESS_URL || env.WP_SITE_URL || 'https://mediumpurple-salamander-731288.hostingersite.com').replace(/\/+$/, '');
const WP_USER = env.WORDPRESS_USER || env.WP_USERNAME || 'admin';
const WP_PASS = (env.WORDPRESS_APP_PASSWORD || env.WP_APPLICATION_PASSWORD || 'oOei QLY7 j1mC Wb6U Gndx qYFg').replace(/\s+/g, '');
const authHeader = {
  Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64')}`
};

function parseCsv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8').trim();
  const lines = content.split(/\r?\n/);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',');
    if (parts.length >= 3) {
      rows.push({
        source: parts[0].trim(),
        target: parts[1].trim(),
        code: parseInt(parts[2].trim(), 10) || 301
      });
    }
  }
  return rows;
}

async function getExistingRedirects() {
  const res = await fetch(`${WP_URL}/wp-json/redirection/v1/redirect?per_page=100`, {
    headers: { ...authHeader, 'Content-Type': 'application/json' }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch redirects: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.items || [];
}

async function createRedirect(source, target, code = 301, groupId = 1) {
  const payload = {
    url: source,
    action_data: { url: target },
    action_type: 'url',
    action_code: code,
    match_type: 'url',
    group_id: groupId
  };

  const res = await fetch(`${WP_URL}/wp-json/redirection/v1/redirect`, {
    method: 'POST',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to create redirect for ${source}: ${res.status} ${errText}`);
  }

  const data = await res.json();
  return data;
}

async function main() {
  console.log('======================================================================');
  console.log('🚀 DEPLOYING SEO 301 REDIRECTS TO WORDPRESS REDIRECTION PLUGIN');
  console.log(`   Target Site: ${WP_URL}`);
  console.log('======================================================================\n');

  const csvPath = path.join(rootDir, 'data', 'seo_301_redirects.csv');
  if (!fs.existsSync(csvPath)) {
    console.error(`Error: CSV file not found at ${csvPath}`);
    process.exit(1);
  }

  const rules = parseCsv(csvPath);
  console.log(`Loaded ${rules.length} redirect rules from data/seo_301_redirects.csv\n`);

  console.log('Querying existing rules from Redirection plugin API...');
  const existing = await getExistingRedirects();
  console.log(`Found ${existing.length} existing rules in Redirection database.\n`);

  const existingMap = new Map();
  for (const item of existing) {
    existingMap.set(item.url, item);
  }

  let createdCount = 0;
  let skippedCount = 0;

  for (const rule of rules) {
    if (existingMap.has(rule.source)) {
      const current = existingMap.get(rule.source);
      console.log(`[EXISTS] Rule for "${rule.source}" -> "${current.action_data?.url || rule.target}" (ID: ${current.id})`);
      skippedCount++;
    } else {
      console.log(`[CREATING] "${rule.source}" -> "${rule.target}" (${rule.code})...`);
      try {
        await createRedirect(rule.source, rule.target, rule.code, 1);
        console.log(`  -> Successfully deployed rule: ${rule.source}`);
        createdCount++;
        // Small delay between requests to avoid rate limits
        await new Promise(r => setTimeout(r, 200));
      } catch (err) {
        console.error(`  -> ERROR deploying ${rule.source}:`, err.message);
      }
    }
  }

  console.log(`\nDeployment phase complete: ${createdCount} created, ${skippedCount} already existed.\n`);

  console.log('Re-querying Redirection API to confirm total active rules...');
  const updatedList = await getExistingRedirects();
  console.log(`Total rules in Redirection database: ${updatedList.length} (Target: >= 18)\n`);

  console.log('======================================================================');
  console.log('🔍 VERIFYING LIVE HTTP REDIRECTS ACROSS ALL 18 CSV ROUTES');
  console.log('======================================================================\n');

  const results = [];
  let passCount = 0;
  let failCount = 0;

  for (const rule of rules) {
    const fullUrl = `${WP_URL}${rule.source}`;
    try {
      const res = await fetch(fullUrl, { redirect: 'manual' });
      const status = res.status;
      const location = res.headers.get('location') || '';

      const isRedirect = status === 301 || status === 302 || status === 308;
      const locationMatches = location === rule.target || 
                              location === `${WP_URL}${rule.target}` || 
                              location.endsWith(rule.target);

      const passed = isRedirect && locationMatches;

      if (passed) {
        passCount++;
        console.log(`[PASS] ${rule.source}`);
        console.log(`       Status: HTTP ${status} | Location: ${location}`);
      } else {
        failCount++;
        console.error(`[FAIL] ${rule.source}`);
        console.error(`       Expected: HTTP 301 -> ${rule.target}`);
        console.error(`       Actual:   HTTP ${status} -> ${location || '(none)'}`);
      }

      results.push({
        source: rule.source,
        expectedTarget: rule.target,
        status,
        location,
        passed
      });
    } catch (err) {
      failCount++;
      console.error(`[ERROR] Fetch error for ${rule.source}:`, err.message);
      results.push({
        source: rule.source,
        expectedTarget: rule.target,
        status: 0,
        location: '',
        passed: false,
        error: err.message
      });
    }
  }

  console.log('\n======================================================================');
  console.log(`VERIFICATION SUMMARY: ${passCount} PASSED, ${failCount} FAILED out of ${rules.length}`);
  console.log('======================================================================\n');

  // Verify the 7 previously failing legacy routes specifically
  const previouslyFailing = [
    '/products/venetian-mirror',
    '/product/venetian-mirror/',
    '/collections/diy-glass-mirror',
    '/collections/frame-mirror',
    '/collections/led-mirror',
    '/collections/vanished-murano-mirror',
    '/collections/venetian-mirror'
  ];

  console.log('--- SPECIFIC CHECK ON 7 PREVIOUSLY FAILING ROUTES ---');
  let previouslyFailingAllPassed = true;
  for (const pf of previouslyFailing) {
    const match = results.find(r => r.source === pf);
    if (match && match.passed) {
      console.log(`[REMEDIATED] ${pf} -> HTTP ${match.status} -> ${match.location}`);
    } else {
      console.error(`[STILL FAILING] ${pf} -> HTTP ${match?.status || 'N/A'}`);
      previouslyFailingAllPassed = false;
    }
  }

  if (failCount > 0 || !previouslyFailingAllPassed || updatedList.length < 18) {
    console.error('\n❌ SEO Redirect Remediation did not meet all pass criteria!');
    process.exit(1);
  }

  console.log('\n✅ ALL 18 REDIRECT RULES VERIFIED LIVE WITH ZERO 404s!');
}

main().catch(err => {
  console.error('Fatal deployment error:', err);
  process.exit(1);
});
