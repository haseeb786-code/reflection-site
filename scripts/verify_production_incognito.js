import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\414d7e40-4d4d-49c9-8868-01c3c84a4783';

async function saveScreenshot(page, filename) {
  const localPath = path.resolve(filename);
  const artifactPath = path.join(ARTIFACT_DIR, filename);
  await page.screenshot({ path: localPath, fullPage: false });
  fs.copyFileSync(localPath, artifactPath);
  console.log(`✓ Screenshot saved: ${filename}`);
}

async function verifyIncognito() {
  console.log('=== STARTING 100% UN-AUTHENTICATED / INCOGNITO PUBLIC VISITOR VERIFICATION ===');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1440,1400',
      '--incognito'
    ],
    ignoreDefaultArgs: ['--enable-automation']
  });

  // Use an Incognito Browser Context to ensure 100% clean, non-logged-in visitor state
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setViewport({ width: 1440, height: 1400 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  await page.evaluateOnNewDocument(() => {
    delete Object.getPrototypeOf(navigator).webdriver;
  });

  // Verify cookies are empty
  const initialCookies = await page.cookies();
  console.log('Initial cookies in incognito session:', initialCookies.length, '(Must be 0)');

  const pagesToTest = [
    { name: 'incognito_01_home.png', url: 'https://reflectionelite.com/', label: 'Home' },
    { name: 'incognito_02_shop.png', url: 'https://reflectionelite.com/shop/', label: 'Shop' },
    { name: 'incognito_03_cart.png', url: 'https://reflectionelite.com/cart/', label: 'Cart' },
    { name: 'incognito_04_checkout.png', url: 'https://reflectionelite.com/checkout/', label: 'Checkout' },
    { name: 'incognito_05_about.png', url: 'https://reflectionelite.com/about-us/', label: 'Our Story' },
    { name: 'incognito_06_contact.png', url: 'https://reflectionelite.com/contact/', label: 'Contact' },
    { name: 'incognito_07_custom_dimensions.png', url: 'https://reflectionelite.com/custom-dimensions/', label: 'Custom Dimensions' },
    { name: 'incognito_08_privacy_policy.png', url: 'https://reflectionelite.com/privacy-policy-2/', label: 'Privacy Policy' },
    { name: 'incognito_09_refund_policy.png', url: 'https://reflectionelite.com/refund_returns-2/', label: 'Refund Policy' }
  ];

  console.log('\n--- Part 1: Public HTTP & Visual Inspection of All 9 Pages ---');
  for (const item of pagesToTest) {
    console.log(`\nVisiting ${item.label} (${item.url})...`);
    const res = await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    
    // Allow challenge or scripts to settle
    if ((await page.title()).includes('Just a moment') || (await page.title()).includes('Checking your browser')) {
      console.log('Challenge encountered, waiting 5 seconds...');
      await new Promise(r => setTimeout(r, 5000));
    }
    await new Promise(r => setTimeout(r, 3000));

    const check = await page.evaluate(() => {
      return {
        title: document.title,
        hasTrajan: document.body.innerHTML.includes('Trajan Pro'),
        hasThemeLayout: !!document.querySelector('.te-live-page'),
        isLoggedIn: !!document.querySelector('#wpadminbar'),
        bodyBg: window.getComputedStyle(document.body).backgroundColor
      };
    });

    console.log(`[${item.label}] Status: ${res.status()}`);
    console.log(`[${item.label}] Title: "${check.title}"`);
    console.log(`[${item.label}] Trajan Pro Applied: ${check.hasTrajan}`);
    console.log(`[${item.label}] Theme Layout Found: ${check.hasThemeLayout}`);
    console.log(`[${item.label}] Logged In Admin Bar Present: ${check.isLoggedIn} (Expected false)`);

    await saveScreenshot(page, item.name);
  }

  // Part 2: Real Customer E-Commerce Flow in Incognito
  console.log('\n--- Part 2: Real Customer Dynamic Cart & Checkout Flow (Incognito) ---');
  console.log('Customer adds Customised Mirror (ID: 23, ₹100.00) to cart...');
  await page.goto('https://reflectionelite.com/cart/?add-to-cart=23', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 4000));

  const cartCheck = await page.evaluate(() => {
    const table = document.querySelector('.woocommerce-cart-form, .shop_table.cart');
    const items = Array.from(document.querySelectorAll('.woocommerce-cart-form .cart_item, .shop_table .cart_item'));
    const total = document.querySelector('.order-total .amount, .cart_totals .amount')?.innerText?.trim();
    return {
      tablePresent: !!table,
      itemCount: items.length,
      items: items.map(i => ({
        name: i.querySelector('.product-name')?.innerText?.trim(),
        price: i.querySelector('.product-price')?.innerText?.trim()
      })),
      total
    };
  });

  console.log('Incognito Cart Verification:', cartCheck);
  await saveScreenshot(page, 'incognito_cart_with_item.png');

  // Customer navigates to checkout
  console.log('\nCustomer proceeds to Checkout (https://reflectionelite.com/checkout/)...');
  await page.goto('https://reflectionelite.com/checkout/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 5000));

  const checkoutCheck = await page.evaluate(() => {
    const methods = Array.from(document.querySelectorAll('ul.payment_methods li.wc_payment_method'));
    const orderTotal = document.querySelector('.order-total .amount')?.innerText?.trim();
    return {
      hasOrderReview: !!document.querySelector('#order_review'),
      orderTotal,
      gateways: methods.map(m => ({
        id: m.querySelector('input[type="radio"]')?.id,
        value: m.querySelector('input[type="radio"]')?.value,
        checked: m.querySelector('input[type="radio"]')?.checked,
        label: m.querySelector('label')?.innerText?.trim()
      }))
    };
  });

  console.log('Incognito Checkout Gateways Verification:', checkoutCheck);
  await saveScreenshot(page, 'incognito_checkout_gateways.png');

  // Interact with Razorpay
  const razorpayRadio = checkoutCheck.gateways.find(g => g.value === 'razorpay');
  if (razorpayRadio && razorpayRadio.id) {
    console.log('Selecting Razorpay gateway in incognito session...');
    await page.click(`#${razorpayRadio.id}`);
    await new Promise(r => setTimeout(r, 2000));
    await saveScreenshot(page, 'incognito_checkout_razorpay_selected.png');
  }

  // Interact with Bitcoin
  const bitcoinRadio = checkoutCheck.gateways.find(g => g.value === 're_bitcoin');
  if (bitcoinRadio && bitcoinRadio.id) {
    console.log('Selecting Bitcoin gateway in incognito session...');
    await page.click(`#${bitcoinRadio.id}`);
    await new Promise(r => setTimeout(r, 2000));
    const btcCheck = await page.evaluate(() => {
      const btcBox = document.querySelector('.payment_box.payment_method_re_bitcoin');
      return {
        boxVisible: btcBox ? window.getComputedStyle(btcBox).display !== 'none' : false,
        hasAddress: btcBox?.innerText?.includes('bc1q'),
        hasQr: !!btcBox?.querySelector('img')
      };
    });
    console.log('Bitcoin Gateway Verification in Incognito:', btcCheck);
    await saveScreenshot(page, 'incognito_checkout_bitcoin_selected.png');
  }

  await browser.close();
  console.log('\n=== ALL INCOGNITO VERIFICATIONS AND SCREENSHOTS COMPLETED! ===');
}

verifyIncognito().catch(err => {
  console.error('INCOGNITO VERIFICATION FAILED:', err);
  process.exit(1);
});
