import puppeteer from 'puppeteer-core';
import { getProdAuth } from './prod_auth_helper.js';

async function testAdminNavigation() {
  const { siteUrl, cookies } = await getProdAuth();
  console.log('Got auth cookies from getProdAuth()');

  const cookiePairs = cookies.split('; ').map(pair => {
    const [name, ...valParts] = pair.split('=');
    return {
      name: name.trim(),
      value: valParts.join('=').trim(),
      domain: 'reflectionelite.com',
      path: '/'
    };
  });

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  await page.setCookie(...cookiePairs);

  console.log('Navigating to theme-editor.php directly with cookies...');
  await page.goto(`${siteUrl}/wp-admin/theme-editor.php?file=functions.php&theme=astra`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  await page.waitForFunction(() => !document.body.innerText.includes('Checking your browser'), { timeout: 15000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 2000));

  const pageTitle = await page.title();
  console.log('Page Title:', pageTitle);
  const isThemeEditor = await page.evaluate(() => {
    return !!document.getElementById('newcontent') || !!document.querySelector('.CodeMirror');
  });
  console.log('Theme Editor found on page?', isThemeEditor);

  await page.screenshot({ path: 'theme_editor_nav_test.png' });
  await browser.close();
}

testAdminNavigation().catch(console.error);
