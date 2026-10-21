import puppeteer from 'puppeteer-core';

async function testShop() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.com/shop/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 8000));

  const info = await page.evaluate(() => {
    const hero = document.querySelector('.re-catalog-hero');
    if (!hero) return { error: 'No .re-catalog-hero found' };
    const style = window.getComputedStyle(hero);
    return {
      bgImage: style.backgroundImage,
      bgColor: style.backgroundColor,
      width: style.width,
      height: style.height,
      parentTag: hero.parentElement.tagName,
      parentClass: hero.parentElement.className,
      parentWidth: hero.parentElement.offsetWidth,
      cardsCount: document.querySelectorAll('.re-catalog-card').length,
      cardImages: Array.from(document.querySelectorAll('.re-catalog-card img')).map(img => ({
        src: img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        complete: img.complete
      }))
    };
  });

  console.log('Shop info:', JSON.stringify(info, null, 2));
  await browser.close();
}

testShop().catch(console.error);
