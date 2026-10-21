import puppeteer from 'puppeteer-core';
import { getProdAuth } from './prod_auth_helper.js';

async function testEditorMethods() {
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

    const editorInfo = await page.evaluate(() => {
      const cmEl = document.querySelector('.CodeMirror');
      const hasCodeMirror = !!(cmEl && cmEl.CodeMirror);
      const textarea = document.getElementById('wpcode_snippet_code');
      return {
        hasCodeMirror,
        hasTextarea: !!textarea,
        wpcodeObjKeys: typeof wpcode !== 'undefined' ? Object.keys(wpcode) : []
      };
    });

    console.log('CodeMirror check:', editorInfo);

  } finally {
    await browser.close();
  }
}

testEditorMethods().catch(console.error);
