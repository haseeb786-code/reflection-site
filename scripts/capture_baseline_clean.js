import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  // Desktop 1440
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  // Wait for DDoS interstitial to clear (check if title is Reflection Elite or wait up to 8s)
  for (let i = 0; i < 8; i++) {
    const title = await page.title();
    console.log(`Second ${i}: Title = ${title}`);
    if (title.includes('Reflection Elite')) break;
    await new Promise(r => setTimeout(r, 1000));
  }
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: 'baseline_desktop_1440.png' });
  console.log('Saved baseline_desktop_1440.png');

  // Mobile 375
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto('https://reflectionelite.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: 'baseline_mobile_375.png' });
  console.log('Saved baseline_mobile_375.png');

  // Mobile 390
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('https://reflectionelite.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: 'baseline_mobile_390.png' });
  console.log('Saved baseline_mobile_390.png');

  await browser.close();
}

capture().catch(console.error);
