import puppeteer from 'puppeteer-core';

async function measure() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
  await page.setViewport({ width: 390, height: 844 });

  console.log('--- Measuring HOME at 390px ---');
  await page.goto('https://reflectionelite.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  const homeMetrics = await page.evaluate(() => {
    const section = document.querySelector('.cycle-section');
    const grid = document.querySelector('.cycle-section .catalog-grid-4') || document.querySelector('.catalog-grid-4');
    const card = document.querySelector('.luxury-card');
    const media = document.querySelector('.luxury-card .card-media');
    const img = document.querySelector('.luxury-card .card-media img');
    return {
      section: section ? { width: section.getBoundingClientRect().width, paddingLeft: window.getComputedStyle(section).paddingLeft, paddingRight: window.getComputedStyle(section).paddingRight } : null,
      grid: grid ? { width: grid.getBoundingClientRect().width, paddingLeft: window.getComputedStyle(grid).paddingLeft, paddingRight: window.getComputedStyle(grid).paddingRight } : null,
      card: card ? { width: card.getBoundingClientRect().width, left: card.getBoundingClientRect().left, right: card.getBoundingClientRect().right, padding: window.getComputedStyle(card).padding } : null,
      media: media ? { width: media.getBoundingClientRect().width, height: media.getBoundingClientRect().height, padding: window.getComputedStyle(media).padding, margin: window.getComputedStyle(media).margin } : null,
      img: img ? { width: img.getBoundingClientRect().width, height: img.getBoundingClientRect().height, padding: window.getComputedStyle(img).padding, margin: window.getComputedStyle(img).margin } : null
    };
  });
  console.log('HOME:', JSON.stringify(homeMetrics, null, 2));

  console.log('\n--- Measuring SHOP at 390px ---');
  await page.goto('https://reflectionelite.com/shop/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  const shopMetrics = await page.evaluate(() => {
    const section = document.querySelector('.catalog-section');
    const grid = document.querySelector('.catalog-section .catalog-grid-4') || document.querySelector('.catalog-grid-4');
    const card = document.querySelector('.luxury-card');
    const media = document.querySelector('.luxury-card .card-media');
    const img = document.querySelector('.luxury-card .card-media img');
    return {
      section: section ? { width: section.getBoundingClientRect().width, paddingLeft: window.getComputedStyle(section).paddingLeft, paddingRight: window.getComputedStyle(section).paddingRight } : null,
      grid: grid ? { width: grid.getBoundingClientRect().width, paddingLeft: window.getComputedStyle(grid).paddingLeft, paddingRight: window.getComputedStyle(grid).paddingRight } : null,
      card: card ? { width: card.getBoundingClientRect().width, left: card.getBoundingClientRect().left, right: card.getBoundingClientRect().right, padding: window.getComputedStyle(card).padding } : null,
      media: media ? { width: media.getBoundingClientRect().width, height: media.getBoundingClientRect().height, padding: window.getComputedStyle(media).padding, margin: window.getComputedStyle(media).margin } : null,
      img: img ? { width: img.getBoundingClientRect().width, height: img.getBoundingClientRect().height, padding: window.getComputedStyle(img).padding, margin: window.getComputedStyle(img).margin } : null
    };
  });
  console.log('SHOP:', JSON.stringify(shopMetrics, null, 2));

  console.log('\n--- Measuring DESKTOP 1440px ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  const homeDesk = await page.evaluate(() => {
    const card = document.querySelector('.luxury-card');
    const media = document.querySelector('.luxury-card .card-media');
    const img = document.querySelector('.luxury-card .card-media img');
    return {
      card: card ? card.getBoundingClientRect().width : null,
      media: media ? { width: media.getBoundingClientRect().width, height: media.getBoundingClientRect().height } : null,
      img: img ? { width: img.getBoundingClientRect().width, height: img.getBoundingClientRect().height } : null
    };
  });
  console.log('HOME Desk:', JSON.stringify(homeDesk, null, 2));

  await page.goto('https://reflectionelite.com/shop/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  const shopDesk = await page.evaluate(() => {
    const card = document.querySelector('.luxury-card');
    const media = document.querySelector('.luxury-card .card-media');
    const img = document.querySelector('.luxury-card .card-media img');
    return {
      card: card ? card.getBoundingClientRect().width : null,
      media: media ? { width: media.getBoundingClientRect().width, height: media.getBoundingClientRect().height } : null,
      img: img ? { width: img.getBoundingClientRect().width, height: img.getBoundingClientRect().height } : null
    };
  });
  console.log('SHOP Desk:', JSON.stringify(shopDesk, null, 2));

  await browser.close();
}

measure().catch(console.error);
