import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = './audit_mobile_screenshots';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const PAGES = [
  { name: 'home', url: 'https://reflectionelite.com/' },
  { name: 'shop', url: 'https://reflectionelite.com/shop/' },
  { name: 'product', url: 'https://reflectionelite.com/product/antique-venetian-cushion/' },
  { name: 'bespoke', url: 'https://reflectionelite.com/custom-dimensions/' },
  { name: 'story', url: 'https://reflectionelite.com/our-story/' },
  { name: 'contact', url: 'https://reflectionelite.com/contact/' }
];

const VIEWPORTS = [
  { width: 375, height: 812, name: '375px' },
  { width: 320, height: 640, name: '320px' }
];

async function runAudit() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1');

  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height });
    console.log(`\n=== Testing Viewport: ${vp.name} ===`);

    for (const p of PAGES) {
      try {
        console.log(`Loading ${p.name} (${p.url})...`);
        await page.goto(p.url, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(r => setTimeout(r, 2000));

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          return {
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
            bodyScrollWidth: document.body.scrollWidth
          };
        });

        console.log(`Page: ${p.name} [${vp.name}] - ScrollWidth: ${overflow.scrollWidth}, ClientWidth: ${overflow.clientWidth}, Overflow: ${overflow.hasOverflow}`);

        const screenshotPath = path.join(OUTPUT_DIR, `${p.name}_${vp.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Saved screenshot: ${screenshotPath}`);
      } catch (err) {
        console.error(`Error auditing ${p.name}:`, err.message);
      }
    }
  }

  await browser.close();
}

runAudit().catch(console.error);
