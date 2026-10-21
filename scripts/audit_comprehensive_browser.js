import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const WP_URL = 'https://reflectionelite.com';
const EVIDENCE_DIR = path.resolve('audit_evidence');
const SCREENSHOTS_DIR = path.join(EVIDENCE_DIR, 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const auditResults = {
  timestamp: new Date().toISOString(),
  pages: {},
  brokenLinks: [],
  shopifyReferences: [],
  consoleLogs: {},
  failedRequests: {},
  imageIntegrity: {},
  timings: {},
  checkoutType: 'unknown',
  forms: {}
};

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 }
];

const targetPages = [
  { slug: 'home', url: `${WP_URL}/` },
  { slug: 'shop', url: `${WP_URL}/shop/` },
  { slug: 'product-antique', url: `${WP_URL}/product/antique-venetian-cushion/` },
  { slug: 'product-variable', url: `${WP_URL}/product/modern-victorian/` },
  { slug: 'cart', url: `${WP_URL}/cart/` },
  { slug: 'checkout', url: `${WP_URL}/checkout/` },
  { slug: 'about-us', url: `${WP_URL}/about-us/` },
  { slug: 'contact', url: `${WP_URL}/contact/` },
  { slug: 'privacy-policy', url: `${WP_URL}/privacy-policy/` },
  { slug: 'refund-returns', url: `${WP_URL}/refund_returns/` }
];

async function runAudit() {
  console.log('=== LAUNCHING CHROME PUPPETEER AUDIT ===');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  for (const target of targetPages) {
    console.log(`\n--- Auditing Page: ${target.slug} (${target.url}) ---`);
    auditResults.consoleLogs[target.slug] = [];
    auditResults.failedRequests[target.slug] = [];

    // Listen to console
    const onConsole = msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error' || type === 'warning') {
        auditResults.consoleLogs[target.slug].push({ type, text, location: msg.location() });
        console.log(`  [Console ${type.toUpperCase()}] ${text.substring(0, 120)}`);
      }
    };

    const onRequestFailed = req => {
      auditResults.failedRequests[target.slug].push({
        url: req.url(),
        failure: req.failure() ? req.failure().errorText : 'failed'
      });
      console.log(`  [Request Failed] ${req.url()} - ${req.failure()?.errorText}`);
    };

    page.on('console', onConsole);
    page.on('requestfailed', onRequestFailed);

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      try {
        const startTime = Date.now();
        const response = await page.goto(target.url, { waitUntil: 'networkidle2', timeout: 35000 });
        const loadDuration = Date.now() - startTime;
        const status = response ? response.status() : 'no-response';

        if (vp.name === 'desktop') {
          auditResults.pages[target.slug] = {
            url: target.url,
            status,
            loadDuration,
            title: await page.title()
          };
          console.log(`  Status: ${status} | Load Duration: ${loadDuration}ms | Title: ${await page.title()}`);
        }

        // Wait a little for lazy scripts / animations
        await new Promise(r => setTimeout(r, 1500));

        // Take Screenshot
        const screenshotPath = path.join(SCREENSHOTS_DIR, `${target.slug}_${vp.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log(`  Saved screenshot: ${target.slug}_${vp.name}.png`);

        // Check DOM integrity only on desktop viewport once
        if (vp.name === 'desktop') {
          const domCheck = await page.evaluate(() => {
            // Check images
            const imgs = Array.from(document.querySelectorAll('img'));
            const brokenImgs = imgs.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src);
            const shopifyUrls = Array.from(document.querySelectorAll('a, img, script, link'))
              .map(el => el.src || el.href || '')
              .filter(u => u.includes('shopify.com') || u.includes('myshopify.com'));

            // Check checkout block vs classic
            const isBlockCheckout = !!document.querySelector('.wc-block-checkout, .wp-block-woocommerce-checkout');
            const isClassicCheckout = !!document.querySelector('form.woocommerce-checkout');
            const isBlockCart = !!document.querySelector('.wc-block-cart, .wp-block-woocommerce-cart');
            const isClassicCart = !!document.querySelector('table.woocommerce-cart-form__contents');

            // Check form presence
            const forms = Array.from(document.querySelectorAll('form')).map(f => ({
              id: f.id,
              action: f.action,
              method: f.method,
              className: f.className
            }));

            return {
              brokenImgs,
              shopifyUrls,
              isBlockCheckout,
              isClassicCheckout,
              isBlockCart,
              isClassicCart,
              forms
            };
          });

          auditResults.imageIntegrity[target.slug] = domCheck.brokenImgs;
          if (domCheck.shopifyUrls.length > 0) {
            auditResults.shopifyReferences.push({ page: target.slug, urls: domCheck.shopifyUrls });
          }

          if (target.slug === 'checkout') {
            auditResults.checkoutType = domCheck.isBlockCheckout ? 'Blocks Checkout' : (domCheck.isClassicCheckout ? 'Classic Checkout' : 'Neither / Custom');
          }
          if (target.slug === 'cart') {
            auditResults.cartType = domCheck.isBlockCart ? 'Blocks Cart' : (domCheck.isClassicCart ? 'Classic Cart' : 'Neither / Custom');
          }
          auditResults.forms[target.slug] = domCheck.forms;
        }

      } catch (err) {
        console.error(`  Error auditing ${target.slug} at ${vp.name}:`, err.message);
        auditResults.pages[`${target.slug}_${vp.name}_error`] = err.message;
      }
    }

    page.off('console', onConsole);
    page.off('requestfailed', onRequestFailed);
  }

  await browser.close();

  fs.writeFileSync(path.join(EVIDENCE_DIR, 'audit_summary.json'), JSON.stringify(auditResults, null, 2), 'utf8');
  console.log('\n=== AUDIT SUMMARY SAVED TO audit_evidence/audit_summary.json ===');
}

runAudit().catch(console.error);
