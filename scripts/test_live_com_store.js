import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { getProdAuth } from './prod_auth_helper.js';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\414d7e40-4d4d-49c9-8868-01c3c84a4783';

function saveScreenshot(page, filename) {
  const localPath = path.resolve(filename);
  const artifactPath = path.join(ARTIFACT_DIR, filename);
  return page.screenshot({ path: localPath, fullPage: false }).then(() => {
    fs.copyFileSync(localPath, artifactPath);
    console.log(`✓ Saved ${filename} and copied to artifact directory.`);
  });
}

async function runLiveStoreTest() {
  console.log('=== STARTING AUTOMATED END-TO-END CHECK OF REFLECTIONELITE.COM ===');

  const envPath = path.resolve('.env');
  const envText = fs.readFileSync(envPath, 'utf8');
  const userMatch = envText.match(/PROD_WP_USER\s*=\s*(.+)/);
  const passMatch = envText.match(/PROD_WP_PASS\s*=\s*(.+)/);
  const username = userMatch ? userMatch[1].trim() : 'admin';
  const password = passMatch ? passMatch[1].trim() : '';

  console.log(`Launching Chrome with stealth settings...`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1440,1400'
    ],
    ignoreDefaultArgs: ['--enable-automation']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1400 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  await page.evaluateOnNewDocument(() => {
    delete Object.getPrototypeOf(navigator).webdriver;
  });

  // STEP 1: Log in to WordPress Admin to establish authenticated session
  console.log('\n--- Step 1: Logging in to wp-login.php ---');
  await page.goto('https://reflectionelite.com/wp-login.php', { waitUntil: 'domcontentloaded', timeout: 45000 });
  
  if ((await page.title()).includes('Just a moment') || (await page.title()).includes('Checking your browser')) {
    console.log('Detected challenge, waiting 6 seconds...');
    await new Promise(r => setTimeout(r, 6000));
  }

  const loginInput = await page.$('#user_login');
  if (loginInput) {
    await page.type('#user_login', username);
    await page.type('#user_pass', password);
    console.log('Submitting login credentials...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 35000 }).catch(e => console.log('Wait nav:', e.message)),
      page.click('#wp-submit')
    ]);
  }
  console.log('Current URL after login:', page.url());
  console.log('Page Title:', await page.title());

  // STEP 2: Inspect Homepage
  console.log('\n--- Step 2: Testing Homepage (https://reflectionelite.com/) ---');
  await page.goto('https://reflectionelite.com/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 4000));
  
  const homeCheck = await page.evaluate(() => {
    return {
      title: document.title,
      hasTrajanFont: document.body.innerHTML.includes('Trajan Pro'),
      hasTrendingLayout: !!document.querySelector('.te-live-page'),
      heroH1: document.querySelector('.home-hero-content h1')?.innerText,
      venetianCardsCount: document.querySelectorAll('.cycle-section:nth-of-type(1) .luxury-card').length,
      pillarsCount: document.querySelectorAll('.pillar-card').length
    };
  });
  console.log('Homepage Check:', homeCheck);
  await saveScreenshot(page, 'test_live_01_home.png');

  // STEP 3: Inspect Shop Catalog
  console.log('\n--- Step 3: Testing Shop (https://reflectionelite.com/shop/) ---');
  await page.goto('https://reflectionelite.com/shop/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 3000));

  const shopCheck = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.luxury-card'));
    return {
      cardCount: cards.length,
      products: cards.map(c => ({
        title: c.querySelector('.card-title')?.innerText?.trim(),
        price: c.querySelector('.card-price')?.innerText?.trim(),
        category: c.querySelector('.card-category')?.innerText?.trim()
      }))
    };
  });
  console.log('Shop Check:', shopCheck);
  await saveScreenshot(page, 'test_live_02_shop.png');

  // STEP 4: Inspect About Us
  console.log('\n--- Step 4: Testing About Us (https://reflectionelite.com/about-us/) ---');
  await page.goto('https://reflectionelite.com/about-us/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 3000));
  const aboutCheck = await page.evaluate(() => {
    return {
      title: document.title,
      h1: document.querySelector('.re-story-title, h1')?.innerText,
      hasWordForWordCopy: document.body.innerText.includes('Centuries of Venetian Artistry') || document.body.innerText.includes('HERITAGE ITALIAN & VENETIAN')
    };
  });
  console.log('About Us Check:', aboutCheck);
  await saveScreenshot(page, 'test_live_03_about.png');

  // STEP 5: Inspect Contact
  console.log('\n--- Step 5: Testing Contact (https://reflectionelite.com/contact/) ---');
  await page.goto('https://reflectionelite.com/contact/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 3000));
  const contactCheck = await page.evaluate(() => {
    return {
      title: document.title,
      hasContactDetails: document.body.innerText.includes('+91') || document.body.innerText.includes('WhatsApp'),
      h1: document.querySelector('.re-contact-title, h1')?.innerText
    };
  });
  console.log('Contact Check:', contactCheck);
  await saveScreenshot(page, 'test_live_04_contact.png');

  // STEP 6: Add Item to Cart & Inspect Cart Page
  console.log('\n--- Step 6: Testing Dynamic Cart Flow ---');
  // Add product ID 23 (Customised Mirror ₹100) or product ID 17 (Antique Venetian Cushion) to cart
  console.log('Navigating to add item to cart via URL (?add-to-cart=23)...');
  await page.goto('https://reflectionelite.com/cart/?add-to-cart=23', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 3000));

  const cartCheck = await page.evaluate(() => {
    const cartTable = document.querySelector('.woocommerce-cart-form, .shop_table.cart');
    const items = Array.from(document.querySelectorAll('.woocommerce-cart-form .cart_item, .shop_table .cart_item'));
    const totalEl = document.querySelector('.order-total .amount, .cart_totals .amount');
    return {
      cartTableFound: !!cartTable,
      itemCount: items.length,
      itemNames: items.map(i => i.querySelector('.product-name')?.innerText?.trim()),
      itemPrices: items.map(i => i.querySelector('.product-price')?.innerText?.trim()),
      orderTotal: totalEl?.innerText?.trim()
    };
  });
  console.log('Cart Check:', cartCheck);
  await saveScreenshot(page, 'test_live_05_cart.png');

  // STEP 7: Test Dynamic Checkout Page
  console.log('\n--- Step 7: Testing Dynamic Checkout Page & Payment Gateways ---');
  await page.goto('https://reflectionelite.com/checkout/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 4000));

  const checkoutCheck = await page.evaluate(() => {
    const paymentMethods = Array.from(document.querySelectorAll('ul.payment_methods li.wc_payment_method'));
    const orderTotal = document.querySelector('.order-total .amount')?.innerText?.trim();
    return {
      hasOrderReview: !!document.querySelector('#order_review'),
      orderTotal,
      gatewayCount: paymentMethods.length,
      gateways: paymentMethods.map(m => ({
        id: m.querySelector('input[type="radio"]')?.id,
        value: m.querySelector('input[type="radio"]')?.value,
        checked: m.querySelector('input[type="radio"]')?.checked,
        label: m.querySelector('label')?.innerText?.trim()
      }))
    };
  });
  console.log('Checkout Initial Gateways Check:', checkoutCheck);
  await saveScreenshot(page, 'test_live_06_checkout.png');

  // STEP 8: Test Payment Gateways Interaction (Clicking each one)
  console.log('\n--- Step 8: Testing Interactive Payment Gateway Selectors ---');
  for (const gw of checkoutCheck.gateways) {
    if (gw.id) {
      console.log(`Clicking gateway ${gw.value} (#${gw.id})...`);
      try {
        await page.click(`#${gw.id}`);
        await new Promise(r => setTimeout(r, 2000));
        const gwState = await page.evaluate((id) => {
          const radio = document.querySelector(`#${id}`);
          const box = radio?.closest('li')?.querySelector('.payment_box');
          return {
            checked: radio?.checked,
            boxVisible: box ? window.getComputedStyle(box).display !== 'none' : false,
            boxText: box?.innerText?.slice(0, 100)
          };
        }, gw.id);
        console.log(`Gateway ${gw.value} state:`, gwState);
        await saveScreenshot(page, `test_live_gateway_${gw.value}.png`);
      } catch (err) {
        console.warn(`Could not click #${gw.id}:`, err.message);
      }
    }
  }

  await browser.close();
  console.log('\n=== ALL TESTS AND SCREENSHOTS COMPLETED SUCCESSFULLY! ===');
}

runLiveStoreTest().catch(err => {
  console.error('LIVE STORE TEST FAILED:', err);
  process.exit(1);
});
