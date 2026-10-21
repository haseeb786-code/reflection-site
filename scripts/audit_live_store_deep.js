import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function auditStore() {
  console.log('Launching browser to audit live plugins, payments, and product settings...');

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

  // Load cookies
  const cookies = JSON.parse(fs.readFileSync('wp_session_cookies.json', 'utf8'));
  for (const c of cookies) {
    await page.setCookie(c);
  }

  // 1. Audit Active Plugins
  console.log('\n--- 1. AUDITING PLUGINS ---');
  await page.goto('https://reflectionelite.ataanalytiq.com/wp-admin/plugins.php', { waitUntil: 'domcontentloaded', timeout: 35000 });
  
  const plugins = await page.evaluate(() => {
    const rows = document.querySelectorAll('tr.active');
    return Array.from(rows).map(r => {
      const name = r.querySelector('.plugin-title strong') ? r.querySelector('.plugin-title strong').innerText : '';
      const desc = r.querySelector('.desc p') ? r.querySelector('.desc p').innerText : '';
      return { name, desc };
    });
  });
  console.log('Active Plugins Count:', plugins.length);
  plugins.forEach(p => console.log('  * ', p.name));

  // 2. Audit WooCommerce Payment Gateways
  console.log('\n--- 2. AUDITING WOOCOMMERCE PAYMENT GATEWAYS ---');
  await page.goto('https://reflectionelite.ataanalytiq.com/wp-admin/admin.php?page=wc-settings&tab=checkout', { waitUntil: 'domcontentloaded', timeout: 35000 });

  const paymentGateways = await page.evaluate(() => {
    const rows = document.querySelectorAll('.wc_gateways tbody tr');
    return Array.from(rows).map(r => {
      const title = r.querySelector('.wc-payment-gateway-method-name a') ? r.querySelector('.wc-payment-gateway-method-name a').innerText : (r.querySelector('.wc-payment-gateway-method-name') ? r.querySelector('.wc-payment-gateway-method-name').innerText : '');
      const isEnabled = r.querySelector('.woocommerce-input-toggle--enabled') !== null;
      const desc = r.querySelector('.wc-payment-gateway-method-description') ? r.querySelector('.wc-payment-gateway-method-description').innerText : '';
      const manageLink = r.querySelector('.wc-payment-gateway-method-name a') ? r.querySelector('.wc-payment-gateway-method-name a').href : '';
      return { title, isEnabled, desc, manageLink };
    });
  });
  console.log('Payment Gateways:');
  console.log(JSON.stringify(paymentGateways, null, 2));

  // 3. Audit Products in wp-admin
  console.log('\n--- 3. AUDITING PRODUCTS LIST IN WP-ADMIN ---');
  await page.goto('https://reflectionelite.ataanalytiq.com/wp-admin/edit.php?post_type=product', { waitUntil: 'domcontentloaded', timeout: 35000 });

  const adminProducts = await page.evaluate(() => {
    const rows = document.querySelectorAll('#the-list tr');
    return Array.from(rows).map(r => {
      const id = r.id.replace('post-', '');
      const title = r.querySelector('.row-title') ? r.querySelector('.row-title').innerText : '';
      const sku = r.querySelector('.sku') ? r.querySelector('.sku').innerText : '';
      const price = r.querySelector('.price') ? r.querySelector('.price').innerText : '';
      const cats = r.querySelector('.product_cat') ? r.querySelector('.product_cat').innerText : '';
      return { id, title, sku, price, cats };
    });
  });
  console.log('Admin Products:');
  console.log(JSON.stringify(adminProducts, null, 2));

  // 4. Inspect a single product edit page to see custom meta / partial payment / Book Now settings
  console.log('\n--- 4. INSPECTING PRODUCT EDIT PAGE (ID 1794) ---');
  await page.goto('https://reflectionelite.ataanalytiq.com/wp-admin/post.php?post=1794&action=edit', { waitUntil: 'domcontentloaded', timeout: 35000 });

  const productMetaInspect = await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.product_data_tabs li a')).map(a => a.innerText.trim());
    const panels = Array.from(document.querySelectorAll('.panel-wrap .woocommerce_options_panel')).map(p => p.id);
    const bodyHtml = document.body.innerText;
    return {
      tabs,
      panels,
      hasRazorpay: bodyHtml.includes('Razorpay') || bodyHtml.includes('razorpay'),
      hasCrypto: bodyHtml.includes('Crypto') || bodyHtml.includes('BTC') || bodyHtml.includes('Bitcoin'),
      hasDeposit: bodyHtml.includes('Deposit') || bodyHtml.includes('Partial Payment') || bodyHtml.includes('Down Payment'),
      hasBookNow: bodyHtml.includes('Book Now') || bodyHtml.includes('Booking')
    };
  });
  console.log('Product 1794 Inspect:', productMetaInspect);

  await browser.close();
}

auditStore().catch(console.error);
