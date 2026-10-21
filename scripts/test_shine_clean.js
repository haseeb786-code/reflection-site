import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\414d7e40-4d4d-49c9-8868-01c3c84a4783';

async function testShineClean() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  // Block heavy analytics / external chat
  await page.setRequestInterception(true);
  page.on('request', req => {
    const url = req.url();
    if (url.includes('google-analytics') || url.includes('facebook') || url.includes('whatsapp') || url.includes('doubleclick')) {
      req.abort();
    } else {
      req.continue();
    }
  });

  console.log('Navigating to Shop...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.ataanalytiq.com/shop/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const evaluation = await page.evaluate(() => {
    // Find media elements
    const medias = Array.from(document.querySelectorAll('.product-media-wrap, .card-media'));
    return medias.map((m, idx) => {
      const computed = window.getComputedStyle(m);
      const after = window.getComputedStyle(m, '::after');
      return {
        card: idx + 1,
        className: m.className,
        parentClass: m.parentElement.className,
        position: computed.position,
        overflow: computed.overflow,
        afterContent: after.content,
        afterAnimationName: after.animationName,
        afterAnimationDuration: after.animationDuration,
        afterAnimationDelay: after.animationDelay,
        afterPointerEvents: after.pointerEvents
      };
    });
  });

  console.log('Shine CSS evaluation:', JSON.stringify(evaluation, null, 2));

  // Take screenshot
  const screenshotPath = path.join(ARTIFACT_DIR, 'staging_shop_shine_sweep.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`✓ Screenshot saved to ${screenshotPath}`);

  await browser.close();
}

testShineClean().catch(console.error);
