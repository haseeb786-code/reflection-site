import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testLogin() {
  console.log('=== TEST WP-ADMIN LOGIN & RATE-LIMIT CHECK ===');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1440,900',
      '--host-rules=MAP reflectionelite.ataanalytiq.com 191.101.228.14'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  console.log('1. Navigating to https://reflectionelite.ataanalytiq.com/wp-login.php ...');
  const t0 = Date.now();
  const resp = await page.goto('https://reflectionelite.ataanalytiq.com/wp-login.php', { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log(`Loaded wp-login.php in ${Date.now() - t0}ms with HTTP status: ${resp.status()}`);

  // Screenshot login screen
  await page.screenshot({ path: 'before_after_evidence/login_screen_initial.png' });
  console.log('Saved: before_after_evidence/login_screen_initial.png');

  // Check for rate limiting / Cloudflare / Hostinger block
  const pageContent = await page.content();
  const title = await page.title();
  console.log('Initial page title:', title);

  if (pageContent.includes('Cloudflare') || pageContent.includes('Attention Required') || pageContent.includes('Too Many Requests') || pageContent.includes('captcha')) {
    console.error('DETECTED BLOCK / RATE LIMIT / CAPTCHA on initial page load!');
  }

  // Type credentials
  console.log('2. Submitting login credentials...');
  await page.waitForSelector('#user_login', { timeout: 10000 });
  await page.type('#user_login', 'reflectionelite');
  await page.type('#user_pass', 'process.env.PROD_WP_PASS || ""');
  await page.click('#wp-submit');

  console.log('3. Waiting for navigation after submit...');
  const t1 = Date.now();
  await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log(`Navigation completed in ${Date.now() - t1}ms!`);

  const currentUrl = page.url();
  const currentTitle = await page.title();
  console.log('Current URL after login:', currentUrl);
  console.log('Current Title after login:', currentTitle);

  // Capture screenshot immediately after login
  await page.screenshot({ path: 'before_after_evidence/after_login_attempt.png' });
  console.log('Saved: before_after_evidence/after_login_attempt.png');

  // Save new cookies
  const freshCookies = await page.cookies();
  console.log('Fresh cookies received:', freshCookies.length);
  fs.writeFileSync('wp_session_cookies.json', JSON.stringify(freshCookies, null, 2));
  console.log('Updated wp_session_cookies.json');

  // Now test navigating to plugins.php with domcontentloaded and waitForSelector
  console.log('4. Navigating to wp-admin/plugins.php with domcontentloaded + waitForSelector...');
  const t2 = Date.now();
  await page.goto('https://reflectionelite.ataanalytiq.com/wp-admin/plugins.php', { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log(`plugins.php loaded in ${Date.now() - t2}ms`);
  
  await page.waitForSelector('#the-list tr', { timeout: 15000 });
  console.log('Plugins table selector found!');
  await page.screenshot({ path: 'before_after_evidence/plugins_page_loaded.png' });
  console.log('Saved: before_after_evidence/plugins_page_loaded.png');

  await browser.close();
  console.log('=== TEST COMPLETED SUCCESSFULLY ===');
}

testLogin().catch(e => {
  console.error('TEST FAILED:', e);
});
