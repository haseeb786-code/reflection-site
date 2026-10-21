import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = './audit_mobile_screenshots';

const PAGES = [
  { name: 'cart', url: 'https://reflectionelite.com/cart/' },
  { name: 'checkout', url: 'https://reflectionelite.com/checkout/' },
  { name: 'about_us', url: 'https://reflectionelite.com/about-us/' }
];

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1');
  await page.setViewport({ width: 375, height: 812 });

  for (const p of PAGES) {
    console.log(`Loading ${p.name}...`);
    await page.goto(p.url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(OUTPUT_DIR, `${p.name}_375px.png`), fullPage: true });
    console.log(`Saved ${p.name}_375px.png`);
  }

  await browser.close();
}

run().catch(console.error);
