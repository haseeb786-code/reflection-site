import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const dir = './before_after_evidence/before';
fs.mkdirSync(dir, { recursive: true });

async function run() {
  console.log('Launching Chrome to capture BEFORE screenshots...');
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
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  const pages = [
    { name: '01_homepage_live_before', url: 'https://reflectionelite.ataanalytiq.com/?cb=' + Date.now() },
    { name: '02_shop_live_before', url: 'https://reflectionelite.ataanalytiq.com/shop/?cb=' + Date.now() },
    { name: '03_single_product_live_before', url: 'https://reflectionelite.ataanalytiq.com/product/murana-mirror/?cb=' + Date.now() },
    { name: '04_cart_live_before', url: 'https://reflectionelite.ataanalytiq.com/cart/?cb=' + Date.now() },
    { name: '05_checkout_live_before', url: 'https://reflectionelite.ataanalytiq.com/checkout/?cb=' + Date.now() },
    { name: '06_about_live_before', url: 'https://reflectionelite.ataanalytiq.com/about-us/?cb=' + Date.now() },
    { name: '07_contact_live_before', url: 'https://reflectionelite.ataanalytiq.com/contact/?cb=' + Date.now() },
    { name: '08_terms_live_before', url: 'https://reflectionelite.ataanalytiq.com/terms-of-service/?cb=' + Date.now() }
  ];

  for (const item of pages) {
    console.log(`Capturing: ${item.name} (${item.url})`);
    try {
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 35000 });
      await new Promise(r => setTimeout(r, 2500));
      const outPath = `${dir}/${item.name}.png`;
      await page.screenshot({ path: outPath, fullPage: true });
      console.log(`Saved: ${outPath}`);
    } catch (e) {
      console.error(`Error capturing ${item.name}:`, e.message);
    }
  }

  await browser.close();
  console.log('--- ALL BEFORE SCREENSHOTS SUCCESSFULLY CAPTURED ---');
}

run().catch(console.error);
