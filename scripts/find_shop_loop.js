import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function inspectShopHtml() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://reflectionelite.com/shop/?t=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => !document.body.innerText.includes('Checking your browser'), { timeout: 15000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 4000));

  const html = await page.content();
  fs.writeFileSync('full_shop_source.html', html);
  console.log('Saved full_shop_source.html (length:', html.length, ')');

  // Find occurrences of "Showing all" or "HIGH STRENGTH"
  const idxShowing = html.indexOf('woocommerce-result-count');
  console.log('woocommerce-result-count index:', idxShowing);
  if (idxShowing !== -1) {
    console.log('--- Context around woocommerce-result-count ---');
    console.log(html.slice(Math.max(0, idxShowing - 500), idxShowing + 1000));
  }

  const idxJunk = html.indexOf('HIGH STRENGTH');
  console.log('HIGH STRENGTH index:', idxJunk);
  if (idxJunk !== -1) {
    console.log('--- Context around HIGH STRENGTH ---');
    console.log(html.slice(Math.max(0, idxJunk - 400), idxJunk + 400));
  }

  const idxFooter = html.indexOf('<footer');
  console.log('<footer index:', idxFooter);

  await browser.close();
}

inspectShopHtml().catch(console.error);
