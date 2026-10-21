import puppeteer from 'puppeteer-core';

async function inspectCards() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  console.log('--- Inspecting HOME Product Card ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.com/?nocache=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForSelector('.luxury-card', { timeout: 10000 });
  
  const homeCardStylesDesktop = await page.evaluate(() => {
    const card = document.querySelector('.luxury-card');
    const media = document.querySelector('.luxury-card .card-media');
    const img = document.querySelector('.luxury-card .card-media img');
    const cCard = window.getComputedStyle(card);
    const cMedia = window.getComputedStyle(media);
    const cImg = window.getComputedStyle(img);
    return {
      card: { padding: cCard.padding, margin: cCard.margin, border: cCard.border, width: cCard.width },
      media: { padding: cMedia.padding, margin: cMedia.margin, width: cMedia.width, height: cMedia.height, aspectRatio: cMedia.aspectRatio },
      img: { width: cImg.width, height: cImg.height, objectFit: cImg.objectFit, padding: cImg.padding, margin: cImg.margin }
    };
  });
  console.log('Home card styles (Desktop):', JSON.stringify(homeCardStylesDesktop, null, 2));

  console.log('\n--- Inspecting SHOP Product Card ---');
  await page.goto('https://reflectionelite.com/shop/?nocache=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForSelector('.luxury-card', { timeout: 10000 });

  const shopCardStylesDesktop = await page.evaluate(() => {
    const card = document.querySelector('.luxury-card');
    const media = document.querySelector('.luxury-card .card-media');
    const img = document.querySelector('.luxury-card .card-media img');
    const cCard = window.getComputedStyle(card);
    const cMedia = window.getComputedStyle(media);
    const cImg = window.getComputedStyle(img);
    return {
      card: { padding: cCard.padding, margin: cCard.margin, border: cCard.border, width: cCard.width },
      media: { padding: cMedia.padding, margin: cMedia.margin, width: cMedia.width, height: cMedia.height, aspectRatio: cMedia.aspectRatio },
      img: { width: cImg.width, height: cImg.height, objectFit: cImg.objectFit, padding: cImg.padding, margin: cImg.margin }
    };
  });
  console.log('Shop card styles (Desktop):', JSON.stringify(shopCardStylesDesktop, null, 2));

  await browser.close();
}

inspectCards().catch(console.error);
