import puppeteer from 'puppeteer-core';
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
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim();
          envVars[key] = val;
        }
      }
    }
  }
  return envVars;
}

async function test() {
  const env = loadEnv();
  const siteUrl = env.PROD_WP_URL || 'https://reflectionelite.com';
  const username = env.PROD_WP_USER || 'admin';
  const password = env.PROD_WP_PASS;

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
  
  console.log('Navigating to wp-login.php...');
  await page.goto(`${siteUrl}/wp-login.php`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  console.log('URL:', page.url());
  console.log('Title:', await page.title());
  
  const loginInput = await page.$('#user_login');
  console.log('Found #user_login?', !!loginInput);
  
  if (loginInput && password) {
    await page.type('#user_login', username);
    await page.type('#user_pass', password);
    console.log('Submitting login form...');
    await page.click('#wp-submit');
    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(e => console.log('Navigation wait message:', e.message));
    console.log('Post-login URL:', page.url());
  }
  
  await browser.close();
}

test().catch(console.error);
