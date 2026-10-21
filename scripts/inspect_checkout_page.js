import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const WP_URL = 'https://reflectionelite.com';

async function inspect() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to /cart/?add-to-cart=58...');
  await page.goto(`${WP_URL}/cart/?add-to-cart=58`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('Cart URL after load:', page.url());
  const cartText = await page.evaluate(() => document.body.innerText.substring(0, 300));
  console.log('Cart text snippet:\n', cartText);

  console.log('Navigating to /checkout/...');
  await page.goto(`${WP_URL}/checkout/`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));
  
  console.log('Checkout URL after load:', page.url());
  const chkInfo = await page.evaluate(() => {
    return {
      title: document.title,
      inputs: [...document.querySelectorAll('input')].map(i => ({ id: i.id, name: i.name, type: i.type })),
      textSnippet: document.body.innerText.substring(0, 400)
    };
  });
  console.log('Checkout inputs:\n', JSON.stringify(chkInfo, null, 2));

  await page.screenshot({ path: 'audit_evidence/screenshots/checkout_debug.png' });
  console.log('Saved checkout_debug.png');

  await browser.close();
}

inspect().catch(console.error);
