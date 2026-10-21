import puppeteer from 'puppeteer-core';

async function testHero() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.com/', { waitUntil: 'domcontentloaded' });
  console.log('Waiting 8s for challenge...');
  await new Promise(r => setTimeout(r, 8000));
  console.log('Title after wait:', await page.title(), 'URL:', page.url());

  const info = await page.evaluate(() => {
    const hero = document.querySelector('.re-hero-section');
    if (!hero) return { error: 'No .re-hero-section found' };
    const style = window.getComputedStyle(hero);
    return {
      bgImage: style.backgroundImage,
      bgColor: style.backgroundColor,
      width: style.width,
      height: style.height,
      offsetWidth: hero.offsetWidth,
      offsetHeight: hero.offsetHeight,
      parentTag: hero.parentElement ? hero.parentElement.tagName : null,
      parentClass: hero.parentElement ? hero.parentElement.className : null,
      parentWidth: hero.parentElement ? hero.parentElement.offsetWidth : null,
    };
  });

  console.log('Hero section info:', info);
  await browser.close();
}

testHero().catch(console.error);
