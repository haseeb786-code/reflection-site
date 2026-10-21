import puppeteer from 'puppeteer-core';
import { getProdAuth } from './prod_auth_helper.js';

async function findSaveButton() {
  const auth = await getProdAuth();
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    const cookiePairs = auth.cookies.split('; ').map(c => {
      const idx = c.indexOf('=');
      return {
        name: c.slice(0, idx),
        value: c.slice(idx + 1),
        domain: 'reflectionelite.com',
        path: '/'
      };
    });
    await page.setCookie(...cookiePairs);

    await page.goto(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-snippet-manager&custom=1`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    const buttons = await page.evaluate(() => {
      const allBtns = Array.from(document.querySelectorAll('button, input[type="submit"]'));
      return allBtns.map(b => ({
        tag: b.tagName,
        id: b.id,
        className: b.className,
        text: (b.innerText || b.value || '').trim()
      })).filter(b => b.text.toLowerCase().includes('save') || b.id.includes('save') || b.className.includes('save'));
    });

    console.log('Save buttons found:', buttons);

  } finally {
    await browser.close();
  }
}

findSaveButton().catch(console.error);
