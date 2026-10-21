import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\414d7e40-4d4d-49c9-8868-01c3c84a4783';

async function testShineEffect() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  // Set cookies
  const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
  const puppeteerCookies = cookies.map(c => ({
    name: c.name,
    value: c.value,
    domain: 'reflectionelite.ataanalytiq.com',
    path: '/'
  }));
  await page.setCookie(...puppeteerCookies);

  console.log('Testing Shine Effect on Staging Shop (with cookies)...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.ataanalytiq.com/shop/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));

  const pageTitle = await page.title();
  console.log('Page Title:', pageTitle);

  const shineData = await page.evaluate(() => {
    const cardMedia = document.querySelector('.product-media-wrap, .card-media');
    if (!cardMedia) return { error: 'No media container found' };

    const style = window.getComputedStyle(cardMedia);
    const afterStyle = window.getComputedStyle(cardMedia, '::after');

    // Check all cards
    const allMedia = Array.from(document.querySelectorAll('.product-media-wrap, .card-media')).map((el, i) => {
      const aStyle = window.getComputedStyle(el, '::after');
      return {
        cardIndex: i + 1,
        animationName: aStyle.animationName,
        animationDuration: aStyle.animationDuration,
        animationDelay: aStyle.animationDelay,
        pointerEvents: aStyle.pointerEvents
      };
    });

    // Check clickability of buttons/links
    const btn = document.querySelector('.btn-action, .view-details, .product-card a, .luxury-card a, button');
    let isClickable = false;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const elAtPoint = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      isClickable = btn.contains(elAtPoint) || elAtPoint === btn;
    }

    return {
      containerPosition: style.position,
      containerOverflow: style.overflow,
      afterContent: afterStyle.content,
      afterPosition: afterStyle.position,
      afterAnimationName: afterStyle.animationName,
      afterAnimationDuration: afterStyle.animationDuration,
      afterPointerEvents: afterStyle.pointerEvents,
      cardsCount: allMedia.length,
      sampleCards: allMedia.slice(0, 4),
      isClickable
    };
  });

  console.log('Shine Evaluation on Shop:', JSON.stringify(shineData, null, 2));

  // Take screenshot of product grid on shop
  const localShopPath = path.resolve('staging_shop_shine_desktop.png');
  const artifactShopPath = path.join(ARTIFACT_DIR, 'staging_shop_shine_desktop.png');
  await page.screenshot({ path: localShopPath });
  fs.copyFileSync(localShopPath, artifactShopPath);
  console.log('✓ Saved staging_shop_shine_desktop.png');

  // Check mobile 375px
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('https://reflectionelite.ataanalytiq.com/shop/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2500));
  const localMobilePath = path.resolve('staging_shop_shine_mobile.png');
  const artifactMobilePath = path.join(ARTIFACT_DIR, 'staging_shop_shine_mobile.png');
  await page.screenshot({ path: localMobilePath });
  fs.copyFileSync(localMobilePath, artifactMobilePath);
  console.log('✓ Saved staging_shop_shine_mobile.png');

  await browser.close();
  console.log('✓ Shine Effect verification complete!');
}

testShineEffect().catch(console.error);
