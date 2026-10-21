import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\414d7e40-4d4d-49c9-8868-01c3c84a4783';

async function waitForRealPage(page, url) {
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  try {
    await page.waitForFunction(() => {
      return document.title && !document.title.includes('Checking your browser');
    }, { timeout: 20000 });
  } catch (e) {
    await new Promise(r => setTimeout(r, 5000));
  }
  await page.waitForSelector('#reUnifiedHeader', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1500));
}

async function verifyCartAndCheckout() {
  console.log('=== VERIFYING CART & CHECKOUT INCOGNITO ===');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--incognito']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1200 });

    // Step 1: Add product ID 17 directly to cart
    console.log('Adding product 17 to cart...');
    await waitForRealPage(page, 'https://reflectionelite.com/cart/?add-to-cart=17');

    const cartData = await page.evaluate(() => {
      const text = document.body.innerText;
      const cartItems = document.querySelectorAll('.woocommerce-cart-form .cart_item');
      const itemTitle = cartItems[0] ? cartItems[0].querySelector('.product-name')?.innerText?.trim() : null;
      const itemPrice = cartItems[0] ? cartItems[0].querySelector('.product-price')?.innerText?.trim() : null;
      return {
        rawCssFound: text.includes('@font-face'),
        headerFound: !!document.querySelector('#reUnifiedHeader'),
        cartItemCount: cartItems.length,
        itemTitle,
        itemPrice,
        checkoutBtnFound: !!document.querySelector('.checkout-button')
      };
    });
    console.log('Cart Validation:', cartData);
    const cartScreenshot = path.join(ARTIFACT_DIR, 'prod_verified_cart_incognito.png');
    await page.screenshot({ path: cartScreenshot });
    console.log('✓ Captured:', cartScreenshot);

    // Step 2: Navigate to Checkout
    await waitForRealPage(page, 'https://reflectionelite.com/checkout/');
    const checkoutData = await page.evaluate(() => {
      const text = document.body.innerText;
      const gateways = Array.from(document.querySelectorAll('.wc_payment_method label, .woocommerce-checkout-payment label')).map(l => l.innerText.trim());
      const depositOption = text.includes('50%') || text.includes('Deposit');
      const discountOption = text.includes('3%') || text.includes('Full Payment');
      return {
        rawCssFound: text.includes('@font-face'),
        headerFound: !!document.querySelector('#reUnifiedHeader'),
        placeOrderBtnFound: !!document.querySelector('#place_order'),
        gateways,
        depositOption,
        discountOption
      };
    });
    console.log('Checkout Validation:', checkoutData);
    const checkoutScreenshot = path.join(ARTIFACT_DIR, 'prod_verified_checkout_incognito.png');
    await page.screenshot({ path: checkoutScreenshot });
    console.log('✓ Captured:', checkoutScreenshot);

  } finally {
    await browser.close();
  }

  console.log('=== CART & CHECKOUT VERIFICATION COMPLETE ===');
}

verifyCartAndCheckout().catch(console.error);
