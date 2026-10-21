import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\414d7e40-4d4d-49c9-8868-01c3c84a4783';

const pagesToCapture = [
  { name: '01_live_homepage', url: 'https://reflectionelite.ataanalytiq.com/', scroll: null },
  { name: '02_live_shop_catalog', url: 'https://reflectionelite.ataanalytiq.com/shop/', scroll: '.catalog-section' },
  { name: '03_live_single_product', url: 'https://reflectionelite.ataanalytiq.com/product/', scroll: null },
  { name: '04_live_cart', url: 'https://reflectionelite.ataanalytiq.com/cart/', scroll: null },
  { name: '05_live_checkout', url: 'https://reflectionelite.ataanalytiq.com/checkout/', scroll: null },
  { name: '06_live_about_us', url: 'https://reflectionelite.ataanalytiq.com/about-us/', scroll: null },
  { name: '07_live_contact', url: 'https://reflectionelite.ataanalytiq.com/contact/', scroll: null }
];

async function captureAll() {
  console.log('Launching Chrome to capture live production screenshots...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1440,1600'
    ],
    ignoreDefaultArgs: ['--enable-automation']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1600 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  await page.evaluateOnNewDocument(() => {
    delete Object.getPrototypeOf(navigator).webdriver;
  });

  for (const item of pagesToCapture) {
    try {
      console.log(`Navigating to ${item.name} (${item.url})...`);
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 35000 });
      await new Promise(r => setTimeout(r, 4000));

      if (item.scroll) {
        await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (el) el.scrollIntoView();
        }, item.scroll);
        await new Promise(r => setTimeout(r, 1000));
      }

      const localFilename = `${item.name}.png`;
      const artifactPath = path.join(ARTIFACT_DIR, localFilename);

      await page.screenshot({ path: localFilename, fullPage: false });
      fs.copyFileSync(localFilename, artifactPath);
      console.log(`✓ Saved ${localFilename} and copied to artifact directory!`);
    } catch (err) {
      console.error(`Failed to capture ${item.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('=== ALL SCREENSHOTS CAPTURED SUCCESSFULLY! ===');
}

captureAll().catch(console.error);
