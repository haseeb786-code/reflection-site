import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function check() {
  const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setCookie(...cookies);
  await page.goto('https://reflectionelite.ataanalytiq.com/wp-admin/post.php?post=1984&action=edit', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  console.log('Edit page URL:', page.url());
  console.log('Edit page Title:', await page.title());
  
  const htmlContent = await page.evaluate(() => {
    return {
      bodyClass: document.body.className,
      editorText: document.querySelector('#content')?.value || document.querySelector('.editor-post-title__input')?.innerText,
      hasElementorButton: !!document.querySelector('a[href*="action=elementor"]')
    };
  });
  console.log('Page 1984 editor state:', htmlContent);
  await page.screenshot({ path: 'demo_evidence/page_1984_edit_screen.png' });
  await browser.close();
}

check().catch(console.error);
