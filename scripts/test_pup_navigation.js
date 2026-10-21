import puppeteer from 'puppeteer-core';

async function testPup() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  console.log('Navigating to https://reflectionelite.com/');
  const res = await page.goto('https://reflectionelite.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log('Home Status:', res.status());

  const homeCards = await page.evaluate(() => {
    const card = document.querySelector('.luxury-card');
    const media = document.querySelector('.luxury-card .card-media');
    const img = document.querySelector('.luxury-card .card-media img');
    if (!card || !media || !img) return null;
    const cardRect = card.getBoundingClientRect();
    const mediaRect = media.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    const cCard = window.getComputedStyle(card);
    const cMedia = window.getComputedStyle(media);
    const cImg = window.getComputedStyle(img);
    return {
      cardRect,
      mediaRect,
      imgRect,
      cardPadding: cCard.padding,
      mediaPadding: cMedia.padding,
      mediaMargin: cMedia.margin,
      imgPadding: cImg.padding,
      imgMargin: cImg.margin,
      imgObjectFit: cImg.objectFit
    };
  });
  console.log('Home Card Computed:', JSON.stringify(homeCards, null, 2));

  console.log('\nNavigating to https://reflectionelite.com/shop/');
  const resShop = await page.goto('https://reflectionelite.com/shop/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log('Shop Status:', resShop.status());

  const shopCards = await page.evaluate(() => {
    const card = document.querySelector('.luxury-card');
    const media = document.querySelector('.luxury-card .card-media');
    const img = document.querySelector('.luxury-card .card-media img');
    if (!card || !media || !img) return null;
    const cardRect = card.getBoundingClientRect();
    const mediaRect = media.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    const cCard = window.getComputedStyle(card);
    const cMedia = window.getComputedStyle(media);
    const cImg = window.getComputedStyle(img);
    return {
      cardRect,
      mediaRect,
      imgRect,
      cardPadding: cCard.padding,
      mediaPadding: cMedia.padding,
      mediaMargin: cMedia.margin,
      imgPadding: cImg.padding,
      imgMargin: cImg.margin,
      imgObjectFit: cImg.objectFit
    };
  });
  console.log('Shop Card Computed:', JSON.stringify(shopCards, null, 2));

  await browser.close();
}

testPup().catch(console.error);
