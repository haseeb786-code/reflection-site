import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';

async function testDirect() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to /cart/?add-to-cart=45...');
  await page.goto(`${WP_URL}/cart/?add-to-cart=45`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));
  console.log('Page URL after cart:', page.url());

  console.log('Navigating to /checkout/...');
  await page.goto(`${WP_URL}/checkout/`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));
  console.log('Page URL after checkout:', page.url());

  const info = await page.evaluate(() => {
    return {
      title: document.title,
      textSnippet: document.body.innerText.substring(0, 300),
      hasBilling: !!document.querySelector('#billing_first_name'),
      paymentMethods: [...document.querySelectorAll('input[name="payment_method"]')].map(i => ({ id: i.id, val: i.value }))
    };
  });
  console.log('Direct Checkout info:\n', JSON.stringify(info, null, 2));

  await page.screenshot({ path: 'audit_evidence/screenshots/direct_checkout_debug.png' });
  console.log('Saved direct_checkout_debug.png');

  await browser.close();
}

testDirect().catch(console.error);
