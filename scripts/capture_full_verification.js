import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  // --- 1. MOBILE 390px ---
  await page.setViewport({ width: 390, height: 844 });

  // Home Top Mobile 390
  await page.goto('https://reflectionelite.com/?nocache=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'verify_home_header_mobile_390.png' });
  console.log('Saved verify_home_header_mobile_390.png');

  // Home Open Menu Mobile 390
  const homeBtn = await page.$('#reHamburgerBtn');
  if (homeBtn) {
    await homeBtn.click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'verify_home_menu_open_mobile_390.png' });
    console.log('Saved verify_home_menu_open_mobile_390.png');
  }

  // Home Card Mobile 390
  const homeCard = await page.$('.luxury-card');
  if (homeCard) {
    await homeCard.screenshot({ path: 'verify_home_card_mobile_390.png' });
    console.log('Saved verify_home_card_mobile_390.png');
  }

  // Shop Top Mobile 390
  await page.goto('https://reflectionelite.com/shop/?nocache=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'verify_shop_header_mobile_390.png' });
  console.log('Saved verify_shop_header_mobile_390.png');

  // Shop Open Menu Mobile 390
  const shopBtn = await page.$('#reHamburgerBtn');
  if (shopBtn) {
    await shopBtn.click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'verify_shop_menu_open_mobile_390.png' });
    console.log('Saved verify_shop_menu_open_mobile_390.png');
  }

  // Shop Card Mobile 390
  const shopCard = await page.$('.luxury-card');
  if (shopCard) {
    await shopCard.screenshot({ path: 'verify_shop_card_mobile_390.png' });
    console.log('Saved verify_shop_card_mobile_390.png');
  }

  // --- 2. DESKTOP 1440px ---
  await page.setViewport({ width: 1440, height: 900 });

  // Home Desktop Header
  await page.goto('https://reflectionelite.com/?nocache=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 600));
  const homeHeaderDesk = await page.$('#reUnifiedHeader');
  if (homeHeaderDesk) {
    await homeHeaderDesk.screenshot({ path: 'verify_home_header_desktop_1440.png' });
    console.log('Saved verify_home_header_desktop_1440.png');
  }

  // Shop Desktop Header
  await page.goto('https://reflectionelite.com/shop/?nocache=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 600));
  const shopHeaderDesk = await page.$('#reUnifiedHeader');
  if (shopHeaderDesk) {
    await shopHeaderDesk.screenshot({ path: 'verify_shop_header_desktop_1440.png' });
    console.log('Saved verify_shop_header_desktop_1440.png');
  }

  // --- 3. MOBILE 375px ---
  await page.setViewport({ width: 375, height: 667 });
  await page.goto('https://reflectionelite.com/shop/?nocache=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.screenshot({ path: 'verify_shop_mobile_375.png' });
  console.log('Saved verify_shop_mobile_375.png');

  await browser.close();
  console.log('All verification captures completed!');
}

main().catch(console.error);
