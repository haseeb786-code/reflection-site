import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function dumpHeader() {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

  await page.goto('https://reflectionelite.ataanalytiq.com/staging-home/?demo=1', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const result = await page.evaluate(() => {
    const el1 = document.querySelector('.elementor-20');
    const el2Header = document.querySelector('.te-staging-page > .site-header');
    const el2Announce = document.querySelector('.te-staging-page > .announcement-bar');
    return {
      el1Html: el1 ? el1.outerHTML : null,
      el2AnnounceHtml: el2Announce ? el2Announce.outerHTML : null,
      el2HeaderHtml: el2Header ? el2Header.outerHTML : null
    };
  });

  fs.writeFileSync('header_reference_el1.html', result.el1Html || '');
  fs.writeFileSync('header_reference_el2.html', (result.el2AnnounceHtml || '') + '\n' + (result.el2HeaderHtml || ''));
  console.log('Saved header_reference_el1.html (length: ' + (result.el1Html?.length || 0) + ')');
  console.log('Saved header_reference_el2.html (length: ' + ((result.el2AnnounceHtml || '') + '\n' + (result.el2HeaderHtml || '')).length + ')');

  await browser.close();
}

dumpHeader().catch(console.error);
