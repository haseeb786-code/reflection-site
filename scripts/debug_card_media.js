import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function debugCardMedia() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
  const puppeteerCookies = cookies.map(c => ({
    name: c.name,
    value: c.value,
    domain: 'reflectionelite.ataanalytiq.com',
    path: '/'
  }));
  await page.setCookie(...puppeteerCookies);

  console.log('Navigating to Shop page...');
  await page.goto('https://reflectionelite.ataanalytiq.com/shop/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000));

  const info = await page.evaluate(() => {
    const cardMedia = document.querySelector('.product-media-wrap');
    if (!cardMedia) return { notFound: true };

    const style = window.getComputedStyle(cardMedia);
    const after = window.getComputedStyle(cardMedia, '::after');

    const styleTag = document.querySelector('#re-unified-header-system');

    return {
      hasStyleTag: !!styleTag,
      styleTagLength: styleTag ? styleTag.innerText.length : 0,
      hasShineRule: styleTag ? styleTag.innerText.includes('shine-sweep') : false,
      position: style.position,
      overflow: style.overflow,
      afterContent: after.content,
      afterAnimation: after.animation,
      afterAnimationName: after.animationName
    };
  });

  console.log('Card Media Debug Info:', JSON.stringify(info, null, 2));
  await browser.close();
}

debugCardMedia().catch(console.error);
