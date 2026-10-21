import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testSave() {
  const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
  console.log('Launching browser to load Elementor Editor for Page 1984...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setCookie(...cookies);
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  console.log('Navigating to Elementor Editor...');
  await page.goto('https://reflectionelite.ataanalytiq.com/wp-admin/post.php?post=1984&action=elementor', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  console.log('Waiting for Elementor to load in window...');
  await page.waitForFunction(() => typeof window.elementor !== 'undefined' && window.elementor.loaded, { timeout: 60000 });
  console.log('Elementor loaded successfully!');

  const info = await page.evaluate(() => {
    return {
      title: window.elementor.settings.page?.model.get('post_title'),
      elementsCount: window.elementor.elements.length,
      hasSaver: !!window.elementor.saver,
      hasCommonAjax: !!(window.elementorCommon && window.elementorCommon.ajax)
    };
  });
  console.log('Elementor Editor Info:', info);

  await browser.close();
}

testSave().catch(console.error);
