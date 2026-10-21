import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectProductCards() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const checkUrl = async (url) => {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await new Promise(r => setTimeout(r, 2000));
    
    const result = await page.evaluate(() => {
      // Find cards
      const cards = Array.from(document.querySelectorAll('.luxury-card, .catalog-card, .product-card, .re-collection-card, li.product, .prod-card'));
      return cards.slice(0, 3).map(c => {
        const img = c.querySelector('img');
        const imgContainer = img ? img.parentElement : null;
        return {
          cardTag: c.tagName,
          cardClass: c.className,
          imgContainerTag: imgContainer ? imgContainer.tagName : null,
          imgContainerClass: imgContainer ? imgContainer.className : null,
          imgClass: img ? img.className : null,
          outerHtmlSnippet: c.outerHTML.slice(0, 350)
        };
      });
    });
    await page.close();
    return result;
  };

  console.log('--- 1. Staging Shop Page ---');
  console.log(JSON.stringify(await checkUrl('https://reflectionelite.ataanalytiq.com/shop/'), null, 2));

  console.log('--- 2. Staging Home Page ---');
  console.log(JSON.stringify(await checkUrl('https://reflectionelite.ataanalytiq.com/'), null, 2));

  console.log('--- 3. Live Production Shop Page ---');
  console.log(JSON.stringify(await checkUrl('https://reflectionelite.com/shop/'), null, 2));

  console.log('--- 4. Live Production Home Page ---');
  console.log(JSON.stringify(await checkUrl('https://reflectionelite.com/'), null, 2));

  await browser.close();
}

inspectProductCards().catch(console.error);
