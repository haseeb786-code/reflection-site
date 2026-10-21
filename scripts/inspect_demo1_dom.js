import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectDemo() {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

  await page.goto('https://reflectionelite.ataanalytiq.com/staging-home/?demo=1', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const data = await page.evaluate(() => {
    // Collect all elements from the top of the body down to the first hero banner
    const topElements = [];
    const children = Array.from(document.body.children);
    for (const child of children) {
      if (child.tagName === 'SCRIPT' || child.tagName === 'STYLE') continue;
      topElements.push({
        tag: child.tagName,
        id: child.id,
        className: child.className,
        outerHTML: child.outerHTML.slice(0, 800)
      });
      // If we hit the hero or cycle section, stop
      if (child.className?.includes('shop-hero') || child.className?.includes('banner-section') || child.innerHTML?.includes('AUTHENTIC ARCHITECTURAL GLASS')) {
        break;
      }
    }
    return topElements;
  });

  console.log('Top body elements count:', data.length);
  data.forEach((el, idx) => {
    console.log(`\n=== ELEMENT ${idx + 1}: <${el.tag} id="${el.id}" class="${el.className}"> ===`);
    console.log(el.outerHTML);
  });

  await browser.close();
}

inspectDemo().catch(console.error);
