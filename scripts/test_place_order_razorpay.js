import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const WP_URL = 'https://reflectionelite.com';
const SCREENSHOTS_DIR = path.resolve('audit_evidence', 'screenshots');

async function testPlaceOrder() {
  console.log('=== TESTING PLACE ORDER & RAZORPAY MODAL ===\n');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.text().includes('Razorpay') || msg.text().includes('checkout')) {
      console.log(`[Browser Console ${msg.type()}]`, msg.text());
    }
  });

  page.on('response', async res => {
    if (res.url().includes('wc-ajax=checkout')) {
      console.log('[WooCommerce AJAX Checkout Response Status]', res.status());
      try {
        const json = await res.json();
        console.log('[WooCommerce AJAX Checkout Response Body]', JSON.stringify(json));
      } catch (e) {
        console.log('[WooCommerce AJAX Checkout Response Text]', (await res.text()).substring(0, 300));
      }
    }
  });

  // 1. Add Customised Mirror (₹100) to cart
  console.log('1. Adding ₹100 product to cart...');
  await page.goto(`${WP_URL}/product/customised-mirror/`, { waitUntil: 'networkidle2' });
  await page.click('.single_add_to_cart_button');
  await new Promise(r => setTimeout(r, 2000));

  // 2. Go to checkout
  console.log('2. Navigating to /checkout/...');
  await page.goto(`${WP_URL}/checkout/`, { waitUntil: 'networkidle2' });

  // 3. Fill Billing info
  console.log('3. Filling billing information...');
  await page.type('#billing_first_name', 'Audit');
  await page.type('#billing_last_name', 'Test');
  await page.type('#billing_address_1', 'Flat 402, Elite Residency, MG Road');
  await page.type('#billing_city', 'Mumbai');
  await page.type('#billing_postcode', '400050');
  await page.type('#billing_phone', '9876543210');
  await page.type('#billing_email', 'reflectionelite.com@gmail.com');

  // Ensure Razorpay payment method is selected
  const rzpRadio = await page.$('#payment_method_razorpay');
  if (rzpRadio) {
    await rzpRadio.click();
  }

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'place_order_1_before_click.png') });

  // 4. Click Place Order
  console.log('4. Clicking Place Order button...');
  const placeOrderBtn = await page.$('#place_order');
  if (!placeOrderBtn) {
    console.error('Place Order button not found!');
    await browser.close();
    return;
  }

  await placeOrderBtn.click();
  console.log('Place order clicked, waiting for modal / response...');

  // Wait 6 seconds to observe Razorpay modal or redirect
  await new Promise(r => setTimeout(r, 6000));
  console.log('Current URL after 6s:', page.url());

  // Check if Razorpay iframe / modal exists
  const rzpModalExists = await page.evaluate(() => {
    const iframe = document.querySelector('iframe.razorpay-checkout-frame');
    const container = document.querySelector('.razorpay-container');
    const script = document.querySelector('script[src*="checkout.razorpay.com"]');
    return {
      iframe: !!iframe,
      container: !!container,
      script: !!script,
      bodyTextSnippet: document.body.innerText.substring(0, 400)
    };
  });

  console.log('Razorpay Modal Evaluation:', JSON.stringify(rzpModalExists, null, 2));

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'place_order_2_after_click.png') });
  console.log('Saved screenshot place_order_2_after_click.png');

  await browser.close();
}

testPlaceOrder().catch(console.error);
