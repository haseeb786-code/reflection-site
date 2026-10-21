import puppeteer from 'puppeteer-core';
import path from 'path';

const WP_URL = 'https://reflectionelite.com';
const EVIDENCE_DIR = path.resolve('audit_evidence/screenshots');

async function capture() {
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies1 = res1.headers.getSetCookie();
  const cookieHeader = cookies1.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/`);
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const cookies2 = res2.headers.getSetCookie();
  const allCookies = [...cookies1, ...cookies2];
  
  const parsedCookies = [];
  for (const raw of allCookies) {
    const parts = raw.split(';')[0].split('=');
    const name = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    if (name && value) {
      parsedCookies.push({ name, value, domain: 'reflectionelite.com', path: '/' });
    }
  }
  parsedCookies.push({ name: 're_test_mode', value: '1', domain: 'reflectionelite.com', path: '/' });

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 950 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled', '--window-size=1440,950']
  });

  const page = await browser.newPage();
  await page.setCookie(...parsedCookies);

  // Add non-venetian product (ID 23 - Customised Mirror or 36)
  console.log('Navigating to product 36...');
  await page.goto(`${WP_URL}/product/mosaic-mirror-art/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    const btn = document.querySelector('button[name="add-to-cart"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 4000));

  // Go to checkout
  console.log('Navigating to checkout...');
  await page.goto(`${WP_URL}/checkout/`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 3000));

  // Scenario A: Select Razorpay and Full Payment
  console.log('Setting Scenario A (Full Payment + Razorpay)...');
  await page.evaluate(() => {
    const fullRadio = document.querySelector('input[name="re_payment_plan_choice"][value="full"]');
    if (fullRadio) {
      fullRadio.checked = true;
      jQuery(fullRadio).trigger('change');
    }
    const rzp = document.querySelector('#payment_method_razorpay');
    if (rzp) {
      rzp.checked = true;
      jQuery(rzp).trigger('change');
    }
  });
  await new Promise(r => setTimeout(r, 4000));

  const shotA = path.join(EVIDENCE_DIR, '3_scenario_a_checkout_full_payment.png');
  await page.screenshot({ path: shotA, fullPage: true });
  console.log('✅ Captured Scenario A:', shotA);

  // Scenario B: Switch to Deposit
  console.log('Setting Scenario B (50% Deposit)...');
  await page.evaluate(() => {
    const depRadio = document.querySelector('input[name="re_payment_plan_choice"][value="deposit"]');
    if (depRadio) {
      depRadio.checked = true;
      jQuery(depRadio).trigger('change');
    }
  });
  await new Promise(r => setTimeout(r, 4000));

  const shotB = path.join(EVIDENCE_DIR, '4_scenario_b_checkout_deposit.png');
  await page.screenshot({ path: shotB, fullPage: true });
  console.log('✅ Captured Scenario B:', shotB);

  await browser.close();
  console.log('DONE!');
}

capture().catch(console.error);
