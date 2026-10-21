import puppeteer from 'puppeteer-core';

async function captureGrids() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  // Mobile Home Grid
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('https://reflectionelite.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  const homeGrid = await page.$('.catalog-grid-4') || await page.$('.cycle-section');
  if (homeGrid) {
    await homeGrid.screenshot({ path: 'home_grid_mobile_390.png' });
    console.log('Saved home_grid_mobile_390.png');
  }

  // Mobile Shop Grid
  await page.goto('https://reflectionelite.com/shop/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  const shopGrid = await page.$('.catalog-grid-4') || await page.$('.catalog-section');
  if (shopGrid) {
    await shopGrid.screenshot({ path: 'shop_grid_mobile_390.png' });
    console.log('Saved shop_grid_mobile_390.png');
  }

  // Also full page top of Shop to see broken header
  await page.screenshot({ path: 'shop_header_mobile_390.png' });
  console.log('Saved shop_header_mobile_390.png');

  // Also full page top of Home to see good header
  await page.goto('https://reflectionelite.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.screenshot({ path: 'home_header_mobile_390.png' });
  console.log('Saved home_header_mobile_390.png');

  await browser.close();
}

captureGrids().catch(console.error);
