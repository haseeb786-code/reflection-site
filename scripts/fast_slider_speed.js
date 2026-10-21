import https from 'https';
import fs from 'fs';
import path from 'path';

function loadEnv() {
  const envPath = path.resolve('.env');
  const envVars = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          envVars[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
        }
      }
    }
  }
  return envVars;
}

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request({ ...options, family: 4, timeout: 20000 }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')); });
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  const env = loadEnv();
  const username = env.PROD_WP_USER;
  const password = env.PROD_WP_PASS;

  console.log('1. Authenticating...');
  const loginBody = new URLSearchParams({
    log: username,
    pwd: password,
    'wp-submit': 'Log In',
    redirect_to: 'https://reflectionelite.com/wp-admin/',
    testcookie: '1'
  }).toString();

  const loginRes = await request({
    hostname: 'reflectionelite.com',
    port: 443,
    path: '/wp-login.php',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(loginBody)
    }
  }, loginBody);

  const cookies = (loginRes.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ');

  const adminRes = await request({
    hostname: 'reflectionelite.com',
    port: 443,
    path: '/wp-admin/index.php',
    method: 'GET',
    headers: { 'Cookie': cookies }
  });

  const nonceMatch = adminRes.body.match(/wpApiSettings\s*=\s*\{[^}]*?"nonce":"([^"]+)"/);
  const nonce = nonceMatch ? nonceMatch[1] : null;
  if (!nonce) throw new Error('Nonce not found');

  // 2. Fetch Page 68
  console.log('2. Fetching Page 68...');
  const pageRes = await request({
    hostname: 'reflectionelite.com',
    port: 443,
    path: '/wp-json/wp/v2/pages/68?context=edit',
    method: 'GET',
    headers: { 'Cookie': cookies, 'X-WP-Nonce': nonce }
  });

  const pageData = JSON.parse(pageRes.body);
  let content = pageData.content?.raw || '';

  // 3. Make auto slider faster: change autoplaySpeed to 2000ms (2s) and transition to 0.45s
  console.log('3. Updating auto slider speed...');
  content = content.replace(/const autoplaySpeed = \d+;/g, 'const autoplaySpeed = 2000;');
  content = content.replace(/transition: transform 0\.65s/g, 'transition: transform 0.45s');

  // 4. Save Page 68
  console.log('4. Saving Page 68...');
  const postData = JSON.stringify({ content });
  const updateRes = await request({
    hostname: 'reflectionelite.com',
    port: 443,
    path: '/wp-json/wp/v2/pages/68',
    method: 'POST',
    headers: {
      'Cookie': cookies,
      'X-WP-Nonce': nonce,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, postData);

  if (updateRes.statusCode !== 200) {
    throw new Error('Update failed with status ' + updateRes.statusCode);
  }

  console.log('✅ Page 68 updated: Slider speed is now fast (2.0s interval, 0.45s smooth glide).');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
