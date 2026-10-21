import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const WP_URL = 'https://reflectionelite.com';
const SCREENSHOTS_DIR = path.resolve('audit_evidence', 'screenshots');

async function verifyFixes() {
  console.log('=== VERIFYING FIXES 1 & 2 ===\n');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push({ text: msg.text(), location: msg.location() });
      console.log(`[Browser Console Error]`, msg.text());
    }
  });

  const verificationResults = {
    razorpay403ErrorsOnPDP: 0,
    cartPageTableFound: false,
    checkoutPageFormFound: false,
    screenshots: []
  };

  // TEST 1: Check PDP for 403 errors (Fix 2 Verification)
  console.log('1. Checking PDP /product/antique-venetian-cushion/ for console 403 errors...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${WP_URL}/product/antique-venetian-cushion/`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  const p403s = consoleErrors.filter(e => e.text.includes('403') || e.text.includes('affordability'));
  verificationResults.razorpay403ErrorsOnPDP = p403s.length;
  console.log(`   Console 403/affordability errors count on PDP: ${p403s.length}`);

  // Add item to cart to test cart & checkout with an active session
  console.log('\n2. Adding item to cart for cart & checkout verification...');
  await page.click('.single_add_to_cart_button');
  await new Promise(r => setTimeout(r, 2500));

  // TEST 2: Check /cart/ (Fix 1 Verification)
  console.log('\n3. Verifying /cart/ on Desktop and Mobile...');
  await page.goto(`${WP_URL}/cart/`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  const cartCheck = await page.evaluate(() => {
    const table = document.querySelector('table.shop_table, .woocommerce-cart-form');
    const totals = document.querySelector('.cart_totals');
    return {
      hasTable: !!table,
      hasTotals: !!totals,
      itemCount: document.querySelectorAll('.cart_item').length,
      bodyTextSnippet: document.body.innerText.substring(0, 300)
    };
  });
  verificationResults.cartPageTableFound = cartCheck.hasTable;
  console.log('   Cart page check:', JSON.stringify(cartCheck));

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'fix_verified_cart_desktop.png') });
  console.log('   Saved: fix_verified_cart_desktop.png');

  // Mobile viewport cart
  await page.setViewport({ width: 375, height: 812 });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'fix_verified_cart_mobile.png') });
  console.log('   Saved: fix_verified_cart_mobile.png');

  // TEST 3: Check /checkout/ (Fix 1 Verification)
  console.log('\n4. Verifying /checkout/ on Desktop and Mobile...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${WP_URL}/checkout/`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  const checkoutCheck = await page.evaluate(() => {
    const form = document.querySelector('form.woocommerce-checkout');
    const billingName = document.querySelector('#billing_first_name');
    const rzpRadio = document.querySelector('#payment_method_razorpay');
    const placeOrderBtn = document.querySelector('#place_order');
    return {
      hasForm: !!form,
      hasBillingName: !!billingName,
      hasRzpRadio: !!rzpRadio,
      hasPlaceOrderBtn: !!placeOrderBtn,
      paymentBoxText: document.querySelector('#payment')?.innerText?.substring(0, 200) || ''
    };
  });
  verificationResults.checkoutPageFormFound = checkoutCheck.hasForm;
  console.log('   Checkout page check:', JSON.stringify(checkoutCheck));

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'fix_verified_checkout_desktop.png') });
  console.log('   Saved: fix_verified_checkout_desktop.png');

  // Mobile viewport checkout
  await page.setViewport({ width: 375, height: 812 });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'fix_verified_checkout_mobile.png') });
  console.log('   Saved: fix_verified_checkout_mobile.png');

  await browser.close();

  console.log('\n=== VERIFICATION SUMMARY ===');
  console.log(`Razorpay 403 Errors on PDP: ${verificationResults.razorpay403ErrorsOnPDP === 0 ? '✅ 0 (FIXED)' : '❌ STILL PRESENT'}`);
  console.log(`Cart Form Present: ${verificationResults.cartPageTableFound ? '✅ YES (FIXED)' : '❌ NO'}`);
  console.log(`Checkout Form Present: ${verificationResults.checkoutPageFormFound ? '✅ YES (FIXED)' : '❌ NO'}`);
}

verifyFixes().catch(console.error);
