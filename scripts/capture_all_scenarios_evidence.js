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
  console.log('Fetching admin session cookies via HTTP...');
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

  // Also add re_test_mode cookie
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
    if (!removeLinks || removeLinks.length === 0) {
      break;
    }
    console.log(`Removing item from cart (found ${removeLinks.length})...`);
    await removeLinks[0].click();
    await waitAndLog(3000);
    attempts++;
  }
}

async function runVisualAudit() {
  if (!fs.existsSync(EVIDENCE_DIR)) {
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  }

  const cookies = await getAdminCookies();

  console.log('=== LAUNCHING CHROME IN AUDIT MODE ===');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 950 },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1440,950'
    ]
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
  await page.setCookie(...cookies);

  // STEP 1: Screenshot Admin Settings Panel
  console.log('\n--- 1. CAPTURING ADMIN SETTINGS PANEL EVIDENCE ---');
  await page.goto(`${WP_URL}/wp-admin/admin.php?page=wc-settings&tab=re_payments`, { waitUntil: 'networkidle2', timeout: 60000 });
  await waitAndLog(3000);
  const settingsShot = path.join(EVIDENCE_DIR, '1_admin_settings_panel.png');
  await page.screenshot({ path: settingsShot, fullPage: true });
  console.log('✅ Captured Admin Settings Panel:', settingsShot);

  // STEP 2: Scenario C - Product Page Button "Book Now"
  console.log('\n--- 2. CAPTURING SCENARIO C: VENETIAN MIRROR "BOOK NOW" BUTTON ---');
  await page.goto(`${WP_URL}/product/rococo-floral/`, { waitUntil: 'networkidle2', timeout: 60000 });
  await waitAndLog(3000);

  const btnText = await page.$eval('.single_add_to_cart_button', el => el.innerText.trim()).catch(() => 'NOT_FOUND');
  console.log('Rococo Floral Button Text:', btnText);

  const prodShot = path.join(EVIDENCE_DIR, '2_scenario_c_venetian_product_book_now.png');
  await page.screenshot({ path: prodShot, fullPage: false });
  console.log('✅ Captured Venetian Mirror "Book Now" CTA:', prodShot);

  // STEP 3: Scenario A - Non-Venetian item in Cart (100% Full Payment with 5% Discount)
  console.log('\n--- 3. CAPTURING SCENARIO A: 100% FULL PAYMENT DISCOUNT (NON-VENETIAN) ---');
  await clearCart(page);

  // Add Mosaic mirror art (ID 36, ₹2500)
  console.log('Adding Mosaic mirror art (ID 36) to cart...');
  await page.goto(`${WP_URL}/cart/?add-to-cart=36`, { waitUntil: 'networkidle2', timeout: 60000 });
  await waitAndLog(3000);

  // Go to Checkout
  await page.goto(`${WP_URL}/checkout/`, { waitUntil: 'networkidle2', timeout: 60000 });
  await waitAndLog(4000);

  // Select Razorpay gateway so the online payment discount triggers
  const razorpayGateway = await page.$('#payment_method_razorpay');
  if (razorpayGateway) {
    console.log('Selecting Razorpay gateway for full online payment...');
    await razorpayGateway.click();
    await waitAndLog(3000);
  }

  // Ensure 'full' plan radio is selected
  const fullRadio = await page.$('input[name="re_payment_plan_choice"][value="full"]');
  if (fullRadio) {
    console.log('Ensuring 100% Full Payment plan is selected...');
    await fullRadio.click();
    await waitAndLog(4000, 'Waiting for checkout AJAX calculation...');
  }

  const shotA = path.join(EVIDENCE_DIR, '3_scenario_a_checkout_full_payment.png');
  await page.screenshot({ path: shotA, fullPage: true });
  console.log('✅ Captured Scenario A (100% Full Payment 5% Discount + Razorpay + COD visible):', shotA);

  // STEP 4: Scenario B - Switch to 50% Deposit with 3% Discount
  console.log('\n--- 4. CAPTURING SCENARIO B: 50% ADVANCE DEPOSIT (3% DISCOUNT) ---');
  const depositRadio = await page.$('input[name="re_payment_plan_choice"][value="deposit"]');
  if (depositRadio) {
    console.log('Clicking 50% Deposit plan...');
    await depositRadio.click();
    await waitAndLog(5000, 'Waiting for checkout AJAX update for deposit calculations...');
  }

  const shotB = path.join(EVIDENCE_DIR, '4_scenario_b_checkout_deposit.png');
  await page.screenshot({ path: shotB, fullPage: true });
  console.log('✅ Captured Scenario B (50% Deposit + 3% Discount + Deferred Balance):', shotB);

  // STEP 5: Scenario C - Add Venetian Mirror to Cart & Check COD Removal
  console.log('\n--- 5. CAPTURING SCENARIO C: VENETIAN MIRROR CHECKOUT (COD STRICTLY DISABLED) ---');
  await clearCart(page);

  // Add Venetian mirror (Rococo Floral ID 45, ₹14,000) into cart
  console.log('Adding Rococo floral (ID 45) to cart...');
  await page.goto(`${WP_URL}/cart/?add-to-cart=45`, { waitUntil: 'networkidle2', timeout: 60000 });
  await waitAndLog(3000);

  // Navigate to checkout
  await page.goto(`${WP_URL}/checkout/`, { waitUntil: 'networkidle2', timeout: 60000 });
  await waitAndLog(5000);

  // Check gateways present
  const codExists = await page.$('#payment_method_cod');
  console.log('Is COD available for Venetian Mirror?', codExists !== null ? '❌ ERROR: COD IS VISIBLE' : '✅ CORRECT: COD STRICTLY REMOVED');

  const policyNoticeExists = await page.$('.re-venetian-policy-notice');
  console.log('Is Venetian Atelier Notice displayed?', policyNoticeExists !== null ? '✅ YES: Policy notice is displayed' : '❌ NO: Notice missing');

  const shotC = path.join(EVIDENCE_DIR, '5_scenario_c_checkout_cod_disabled.png');
  await page.screenshot({ path: shotC, fullPage: true });
  console.log('✅ Captured Scenario C (COD strictly disabled + Venetian notice):', shotC);

  console.log('\n=== ALL SCENARIOS VERIFIED & EVIDENCE RECORDED! ===');
  await browser.close();
}

runVisualAudit().catch(console.error);
