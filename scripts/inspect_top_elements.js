import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectTopElements() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
  const puppeteerCookies = cookies.map(c => ({
    name: c.name,
    value: c.value,
    domain: 'reflectionelite.ataanalytiq.com',
    path: '/'
  }));
  await page.setCookie(...puppeteerCookies);

  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.ataanalytiq.com/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));

  const elements = await page.evaluate(() => {
    const nodes = Array.from(document.body.querySelectorAll('*')).filter(el => {
      const style = window.getComputedStyle(el);
      const isFixedOrAbs = style.position === 'fixed' || style.position === 'sticky';
      const cls = typeof el.className === 'string' ? el.className : '';
      const isHeader = el.tagName === 'HEADER' || cls.includes('header') || cls.includes('drawer') || cls.includes('menu');
      return (isFixedOrAbs || isHeader) && el.offsetHeight > 0;
    }).map(el => {
      const rect = el.getBoundingClientRect();
      const cls = typeof el.className === 'string' ? el.className : '';
      return {
        tag: el.tagName,
        id: el.id,
        className: cls,
        rect: { top: Math.round(rect.top), left: Math.round(rect.left), width: Math.round(rect.width), height: Math.round(rect.height) },
        position: window.getComputedStyle(el).position,
        zIndex: window.getComputedStyle(el).zIndex,
        display: window.getComputedStyle(el).display,
        textSnippet: el.innerText ? el.innerText.slice(0, 80).replace(/\n/g, ' ') : ''
      };
    });
    return nodes;
  });

  console.log(JSON.stringify(elements, null, 2));
  await browser.close();
}

inspectTopElements().catch(console.error);
