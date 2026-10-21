import puppeteer from 'puppeteer';

async function capture() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 1. Capture at 1440px
  console.log('Capturing at 1440px...');
  const page1440 = await browser.newPage();
  await page1440.setViewport({ width: 1440, height: 900 });
  await page1440.goto('https://reflectionelite.com/', { waitUntil: 'load', timeout: 45000 });
  await new Promise(r => setTimeout(r, 4000));
  
  // Measure carousel at 1440
  const metrics1440 = await page1440.evaluate(() => {
    const el = document.getElementById('reHeroCarousel') || document.querySelector('.re-carousel-box');
    if (!el) return { found: false };
    const rect = el.getBoundingClientRect();
    return {
      found: true,
      left: Math.round(rect.left),
      width: Math.round(rect.width),
      right: Math.round(rect.right),
      viewportWidth: window.innerWidth
    };
  });
  console.log('1440px carousel metrics:', metrics1440);
  await page1440.screenshot({ path: 'live_fixed_1440px.png', fullPage: false });
  console.log('✓ Saved live_fixed_1440px.png');
  await page1440.close();

  // 2. Capture at 1920px
  console.log('Capturing at 1920px...');
  const page1920 = await browser.newPage();
  await page1920.setViewport({ width: 1920, height: 1080 });
  await page1920.goto('https://reflectionelite.com/', { waitUntil: 'load', timeout: 45000 });
  await new Promise(r => setTimeout(r, 4000));
  
  // Measure carousel at 1920
  const metrics1920 = await page1920.evaluate(() => {
    const el = document.getElementById('reHeroCarousel') || document.querySelector('.re-carousel-box');
    if (!el) return { found: false };
    const rect = el.getBoundingClientRect();
    return {
      found: true,
      left: Math.round(rect.left),
      width: Math.round(rect.width),
      right: Math.round(rect.right),
      viewportWidth: window.innerWidth
    };
  });
  console.log('1920px carousel metrics:', metrics1920);
  await page1920.screenshot({ path: 'live_fixed_1920px.png', fullPage: false });
  console.log('✓ Saved live_fixed_1920px.png');
  await page1920.close();

  await browser.close();
}

capture().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
