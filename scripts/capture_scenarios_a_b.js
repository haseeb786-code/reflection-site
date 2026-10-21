import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const WP_URL = 'https://reflectionelite.com';
const EVIDENCE_DIR = path.resolve('audit_evidence/screenshots');

async function waitAndLog(ms, msg) {
  if (msg) console.log(msg);
  await new Promise(r => setTimeout(r, ms));
}

async function getAdminCookies() {
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
      parsedCookies.push({
        name,
        value,
        domain: 'reflectionelite.com',
        path: '/'
      });
    }
  }

  parsedCookies.push({
    name: 're_test_mode',
    value: '1',
    domain: 'reflectionelite.com',
    path: '/'
  });

  return parsedCookies;
}

async function clearCart(page) {
  console.log('Emptying cart...');
  await page.goto(`${WP_URL}/cart/`, { waitUntil: 'networkidle2', timeout: 60000 });
  await waitAndLog(2000);
  
  let attempts = 0;
  while (attempts < 5) {
    const removeLinks = await page.$$('.woocommerce-cart-form a.remove');
    if (!removeLinks || removeLinks.length === 0) break;
    console.log(`Removing item from cart (found ${removeLinks.length})...`);
    await removeLinks[0].click();
    await waitAndLog(3000);
    attempts++;
  }
}

async function captureAB() {
  const cookies = await getAdminCookies();

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 950 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled', '--window-size=1440,950']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
  await page.setCookie(...cookies);

  // 1. Clear cart
  await clearCart(page);

  // 2. Add Mosaic mirror art (ID 36) via product page
  console.log('Visiting Mosaic Mirror Art product page...');
  await page.goto(`${WP_URL}/product/mosaic-mirror-art/`, { waitUntil: 'networkidle2', timeout: 60000 });
  await waitAndLog(2000);

  const addBtn = await page.$('.single_add_to_cart_button');
  if (addBtn) {
    console.log('Clicking Add to Cart on Mosaic Mirror Art...');
    await addBtn.click();
    await waitAndLog(4000);
  }

  // 3. Go to Checkout
  console.log('Navigating to checkout...');
  await page.goto(`${WP_URL}/checkout/`, { waitUntil: 'networkidle2', timeout: 60000 });
  await waitAndLog(4000);

  // 4. Select Razorpay
  const razorpayRadio = await page.$('#payment_method_razorpay');
  if (razorpayRadio) {
    console.log('Selecting Razorpay gateway...');
    await razorpayRadio.click();
    await waitAndLog(4000);
  }

  // 5. Select 100% Full Payment
  const fullRadio = await page.$('input[name="re_payment_plan_choice"][value="full"]');
  if (fullRadio) {
    console.log('Selecting 100% Full Payment Plan...');
    await fullRadio.click();
    await waitAndLog(4000);
  }

  const shotA = path.join(EVIDENCE_DIR, '3_scenario_a_checkout_full_payment.png');
  await page.screenshot({ path: shotA, fullPage: true });
  console.log('✅ Captured Scenario A:', shotA);

  // 6. Switch to 50% Deposit
  const depositRadio = await page.$('input[name="re_payment_plan_choice"][value="deposit"]');
  if (depositRadio) {
    console.log('Selecting 50% Advance Deposit Plan...');
    await depositRadio.click();
    await waitAndLog(5000);
  }

  const shotB = path.join(EVIDENCE_DIR, '4_scenario_b_checkout_deposit.png');
  await page.screenshot({ path: shotB, fullPage: true });
  console.log('✅ Captured Scenario B:', shotB);

  await browser.close();
}

captureAB().catch(console.error);
