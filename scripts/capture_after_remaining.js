import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const afterDir = './before_after_evidence/after';

async function captureRemaining() {
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

  const items = [
    { name: '01_homepage_staging_after', url: 'https://reflectionelite.ataanalytiq.com/staging-home/?demo=1' },
    { name: '02_shop_staging_after', url: 'https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1' }
  ];

  for (const item of items) {
    console.log('Capturing:', item.name);
    try {
      await page.goto(item.url, { waitUntil: 'load', timeout: 70000 });
      await new Promise(r => setTimeout(r, 2000));
      const p = `${afterDir}/${item.name}.png`;
      await page.screenshot({ path: p, fullPage: true });
      console.log('Saved:', p);
    } catch(e) {
      console.error('Error on', item.name, e.message);
    }
  }

  await browser.close();
}

captureRemaining();
