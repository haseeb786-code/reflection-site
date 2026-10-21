import puppeteer from 'puppeteer-core';

async function captureHeaders() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
  await page.setViewport({ width: 390, height: 844 });

  // 1. Shop top
  await page.goto('https://reflectionelite.com/shop/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'shop_top_mobile_390.png' });
  console.log('Saved shop_top_mobile_390.png');

  // 2. Open hamburger on Shop
  const shopHamburger = await page.$('#reHamburgerBtn') || await page.$('.re-hamburger-btn');
  if (shopHamburger) {
    await shopHamburger.click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'shop_menu_open_mobile_390.png' });
    console.log('Saved shop_menu_open_mobile_390.png');
  }

  // 3. Home top
  await page.goto('https://reflectionelite.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'home_top_mobile_390.png' });
  console.log('Saved home_top_mobile_390.png');

  // 4. Open hamburger on Home
  const homeHamburger = await page.$('#reHamburgerBtn') || await page.$('.re-hamburger-btn');
  if (homeHamburger) {
    await homeHamburger.click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'home_menu_open_mobile_390.png' });
    console.log('Saved home_menu_open_mobile_390.png');
  }

  await browser.close();
}

captureHeaders().catch(console.error);
