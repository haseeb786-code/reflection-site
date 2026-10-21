import puppeteer from 'puppeteer-core';

async function captureSlide2() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  // Desktop 1440 - slide 2
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.click('#reNextBtn');
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'baseline_desktop_1440_slide2.png' });
  console.log('Saved baseline_desktop_1440_slide2.png');

  // Mobile 375 - slide 2
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto('https://reflectionelite.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.click('#reNextBtn');
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'baseline_mobile_375_slide2.png' });
  console.log('Saved baseline_mobile_375_slide2.png');

  await browser.close();
}

captureSlide2().catch(console.error);
