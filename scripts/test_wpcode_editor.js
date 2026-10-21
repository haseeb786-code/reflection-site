import puppeteer from 'puppeteer-core';
import { getProdAuth } from './prod_auth_helper.js';

async function testWpcodeCreate() {
  const auth = await getProdAuth();
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

    // Set auth cookies
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

    console.log('Navigating to WPCode Add Snippet...');
    await page.goto(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-snippet-manager&custom=1`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('Page Title:', await page.title());
    await page.screenshot({ path: 'wpcode_editor_screen.png' });
    console.log('Saved wpcode_editor_screen.png');

  } finally {
    await browser.close();
  }
}

testWpcodeCreate().catch(console.error);
