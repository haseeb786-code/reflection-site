import puppeteer from 'puppeteer-core';

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // Desktop 1440
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('https://reflectionelite.com/?nocache=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 35000 });
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: 'baseline_desktop_1440.png' });
    console.log('Saved baseline_desktop_1440.png');

    // Desktop Hero Element
    const heroEl = await page.$('.re-hero-section') || await page.$('#reHeroCarousel');
    if (heroEl) {
      await heroEl.screenshot({ path: 'baseline_desktop_hero.png' });
      console.log('Saved baseline_desktop_hero.png');
    }
    await page.close();

    // Mobile 375
    const mobilePage = await browser.newPage();
    await mobilePage.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1');
    await mobilePage.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await mobilePage.goto('https://reflectionelite.com/?nocache=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 35000 });
    await new Promise(r => setTimeout(r, 3000));
    await mobilePage.screenshot({ path: 'baseline_mobile_375.png' });
    console.log('Saved baseline_mobile_375.png');
    await mobilePage.close();
  } finally {
    await browser.close();
  }
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
