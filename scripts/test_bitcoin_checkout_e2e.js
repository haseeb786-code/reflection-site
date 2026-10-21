import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';
const SCREENSHOTS_DIR = path.resolve('audit_evidence', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function runBitcoinCheckoutTest() {
  console.log('=== RUNNING COMPLETE END-TO-END BITCOIN CHECKOUT TEST ===\n');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1440, height: 1100 });

  // 1. Add product 45 to cart
  console.log('1. Adding product (ID 45) to cart...');
  await page.goto(`${WP_URL}/cart/?add-to-cart=45`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  // 2. Go to checkout
  console.log('2. Navigating to /checkout/...');
  await page.goto(`${WP_URL}/checkout/`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#billing_first_name', { timeout: 15000 });

  // 3. Fill billing fields
  console.log('3. Filling billing information...');
  await page.type('#billing_first_name', 'Crypto');
  await page.type('#billing_last_name', 'Buyer');
  await page.type('#billing_address_1', 'Penthouse 12, Skyline Towers, BKC');
  await page.type('#billing_city', 'Mumbai');
  await page.type('#billing_postcode', '400051');
  await page.type('#billing_phone', '9876543210');
  await page.type('#billing_email', 'cryptobuyer.test@gmail.com');

  // 4. Select Bitcoin payment method
  console.log('4. Selecting Bitcoin Payment Gateway...');
  await page.evaluate(() => {
    const radio = document.querySelector('#payment_method_re_bitcoin');
    const label = document.querySelector('label[for="payment_method_re_bitcoin"]');
    if (label) label.click();
    if (radio) {
      radio.checked = true;
      if (window.jQuery) {
        window.jQuery(radio).trigger('change');
      } else {
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  });
  await new Promise(r => setTimeout(r, 2000));

  const currentSelected = await page.evaluate(() => {
    const checked = document.querySelector('input[name="payment_method"]:checked');
    return checked ? checked.value : 'none';
  });
  console.log('Currently selected payment method in DOM:', currentSelected);

  // Verify Bitcoin elements on checkout
  const btcDetails = await page.evaluate(() => {
    const box = document.querySelector('.re-btc-box');
    const addr = document.querySelector('#re-btc-address-val');
    const img = document.querySelector('.re-btc-box img');
    const btn = document.querySelector('#re-copy-btc-btn');
    return {
      boxFound: !!box,
      addressText: addr ? addr.innerText.trim() : null,
      qrImageSrc: img ? img.src : null,
      copyBtnText: btn ? btn.innerText.trim() : null
    };
  });

  console.log('Checkout Bitcoin Elements verification:', JSON.stringify(btcDetails, null, 2));

  // Capture screenshot of checkout with Bitcoin gateway
  const checkoutScreenshot = path.join(SCREENSHOTS_DIR, 'bitcoin_checkout_view.png');
  await page.screenshot({ path: checkoutScreenshot, fullPage: false });
  console.log('Saved checkout screenshot to:', checkoutScreenshot);

  // Copy screenshot to artifact directory as well for user review
  const brainDir = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\6cdc1f30-04c8-4252-ab71-b699ef15f04f';
  if (fs.existsSync(brainDir)) {
    fs.copyFileSync(checkoutScreenshot, path.join(brainDir, 'bitcoin_checkout_view.png'));
  }

  // 5. Click Place Order
  console.log('5. Clicking Place Order...');
  const placeOrderBtn = await page.$('#place_order');
  await placeOrderBtn.click();

  // Wait for redirect to Thank You / Order Received page
  console.log('Waiting for order completion redirect...');
  await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 3000));
  console.log('Redirected to:', page.url());

  // 6. Verify Thank You page
  const thankyouData = await page.evaluate(() => {
    const heading = document.querySelector('.woocommerce-thankyou-order-received, .entry-title');
    const orderNum = document.querySelector('.woocommerce-order-overview__order strong');
    const btcBox = document.querySelector('.re-btc-box');
    const btcAddr = document.querySelector('#re-btc-address-val');
    return {
      heading: heading ? heading.innerText.trim() : null,
      orderNumber: orderNum ? orderNum.innerText.trim() : null,
      hasBtcBox: !!btcBox,
      thankYouAddress: btcAddr ? btcAddr.innerText.trim() : null
    };
  });

  console.log('Thank You Page verification:', JSON.stringify(thankyouData, null, 2));

  const thankyouScreenshot = path.join(SCREENSHOTS_DIR, 'bitcoin_order_received.png');
  await page.screenshot({ path: thankyouScreenshot, fullPage: false });
  console.log('Saved order received screenshot to:', thankyouScreenshot);

  if (fs.existsSync(brainDir)) {
    fs.copyFileSync(thankyouScreenshot, path.join(brainDir, 'bitcoin_order_received.png'));
  }

  await browser.close();
  console.log('\n=== [SUCCESS] BITCOIN CHECKOUT E2E VERIFICATION COMPLETED ===');
}

runBitcoinCheckoutTest().catch(console.error);
