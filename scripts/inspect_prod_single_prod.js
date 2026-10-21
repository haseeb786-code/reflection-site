import puppeteer from 'puppeteer-core';
import { getProdAuth } from './prod_auth_helper.js';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkSingleProduct() {
  const { siteUrl, cookies } = await getProdAuth();
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
  
  const rawCookies = cookies.split('; ').map(c => {
    const [name, ...val] = c.split('=');
    return { name, value: val.join('='), domain: 'reflectionelite.com', path: '/' };
  });
  await page.setCookie(...rawCookies);

  await page.goto(`${siteUrl}/product/murana-mirror/`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const data = await page.evaluate(() => {
    const headers = Array.from(document.querySelectorAll('header, [class*="header"], [class*="nav"]')).map(el => ({
      tag: el.tagName,
      className: typeof el.className === 'string' ? el.className : '',
      id: el.id,
      text: el.innerText ? el.innerText.slice(0, 80).replace(/\n/g, ' ') : ''
    }));
    return {
      title: document.title,
      headers
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
}

checkSingleProduct().catch(console.error);
