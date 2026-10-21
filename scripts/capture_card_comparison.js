import puppeteer from 'puppeteer-core';

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  // Desktop Home
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  const homeCard = await page.$('.luxury-card');
  if (homeCard) {
    await homeCard.screenshot({ path: 'home_card_desktop.png' });
    console.log('Saved home_card_desktop.png');
  }

  // Desktop Shop
  await page.goto('https://reflectionelite.com/shop/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  const shopCard = await page.$('.luxury-card');
  if (shopCard) {
    await shopCard.screenshot({ path: 'shop_card_desktop.png' });
    console.log('Saved shop_card_desktop.png');
  }

  // Mobile Home
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('https://reflectionelite.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  const homeCardMobile = await page.$('.luxury-card');
  if (homeCardMobile) {
    await homeCardMobile.screenshot({ path: 'home_card_mobile.png' });
    console.log('Saved home_card_mobile.png');
  }

  // Mobile Shop
  await page.goto('https://reflectionelite.com/shop/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  const shopCardMobile = await page.$('.luxury-card');
  if (shopCardMobile) {
    await shopCardMobile.screenshot({ path: 'shop_card_mobile.png' });
    console.log('Saved shop_card_mobile.png');
  }

  await browser.close();
}

capture().catch(console.error);
