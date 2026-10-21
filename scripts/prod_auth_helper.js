import fs from 'fs';
import path from 'path';
import dns from 'dns';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

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
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim();
          envVars[key] = val;
        }
      }
    }
  }
  return envVars;
}

export async function getProdAuth() {
  const env = loadEnv();
  const siteUrl = env.PROD_WP_URL || 'https://reflectionelite.com';
  const username = env.PROD_WP_USER;
  const password = env.PROD_WP_PASS;

  if (!username || !password) {
    throw new Error('Missing PROD_WP_USER or PROD_WP_PASS in .env');
  }

  const params = new URLSearchParams();
  params.append('log', username);
  params.append('pwd', password);
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${siteUrl}/wp-admin/`);
  params.append('testcookie', '1');

  const loginRes = await fetch(`${siteUrl}/wp-login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
    redirect: 'manual'
  });

  const cookies = loginRes.headers.getSetCookie().map(c => c.split(';')[0]).join('; ');

  const adminRes = await fetch(`${siteUrl}/wp-admin/index.php`, {
    headers: { 'Cookie': cookies }
  });
  const adminHtml = await adminRes.text();
  const match = adminHtml.match(/wpApiSettings\s*=\s*\{[^}]*?"nonce":"([^"]+)"/);
  const nonce = match ? match[1] : null;

  return { siteUrl, cookies, nonce };
}
