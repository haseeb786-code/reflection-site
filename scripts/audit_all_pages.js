import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\de9ea39a-cece-46b8-8bfb-32a9c75ec2c5';

const URLS = [
  { name: 'home', url: 'https://reflectionelite.com/' },
  { name: 'shop', url: 'https://reflectionelite.com/shop/' },
  { name: 'about', url: 'https://reflectionelite.com/about-us/' },
  { name: 'contact', url: 'https://reflectionelite.com/contact/' },
  { name: 'privacy', url: 'https://reflectionelite.com/privacy-policy-2/' },
  { name: 'refund', url: 'https://reflectionelite.com/refund_returns-2/' },
  { name: 'dimensions', url: 'https://reflectionelite.com/custom-dimensions/' },
  { name: 'cart', url: 'https://reflectionelite.com/cart/' },
  { name: 'checkout', url: 'https://reflectionelite.com/checkout/' },
  { name: 'product', url: 'https://reflectionelite.com/product/antique-venetian-cushion/' }
];

async function auditAllPages() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const results = [];

  for (const item of URLS) {
    console.log(`Auditing ${item.name} (${item.url})...`);
    await page.goto(item.url + '?audit=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForFunction(() => !document.body.innerText.includes('Checking your browser'), { timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));

    const audit = await page.evaluate(() => {
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      const bodyColor = window.getComputedStyle(document.body).color;
      const hasTeGlobal = !!document.getElementById('te-global-luxury-system');
      const hasHeader = !!document.querySelector('.re-unified-header-container');
      const hasFooter = !!document.querySelector('.re-unified-footer-container');
      const textPreview = document.body.innerText.slice(0, 300);

      // Check for shop duplicates
      const hasWcResultCount = !!document.querySelector('.woocommerce-result-count');
      const hasWcOrdering = !!document.querySelector('.woocommerce-ordering');
      const productsLists = document.querySelectorAll('ul.products');
      const hasJunkProduct = document.body.innerText.includes('HIGH STRENGTH METAL MATERIALS');

      return {
        bodyBg,
        bodyColor,
        hasTeGlobal,
        hasHeader,
        hasFooter,
        hasWcResultCount,
        hasWcOrdering,
        productsListsCount: productsLists.length,
        hasJunkProduct,
        textPreview: textPreview.replace(/\n+/g, ' ')
      };
    });

    const screenshotPath = path.join(brainDir, `audit_pre_${item.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    results.push({ ...item, ...audit, screenshotPath });
  }

  console.log('\n=== AUDIT RESULTS SUMMARY ===');
  console.table(results.map(r => ({
    name: r.name,
    bodyBg: r.bodyBg,
    hasTeGlobal: r.hasTeGlobal,
    hasHeader: r.hasHeader,
    hasFooter: r.hasFooter,
    hasWcResultCount: r.hasWcResultCount,
    hasJunkProduct: r.hasJunkProduct
  })));

  fs.writeFileSync('scripts/audit_results_summary.json', JSON.stringify(results, null, 2));
  await browser.close();
}

auditAllPages().catch(console.error);
