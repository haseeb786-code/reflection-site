import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\de9ea39a-cece-46b8-8bfb-32a9c75ec2c5';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  console.log('1. Loading home page...');
  await page.goto('https://reflectionelite.com/?v=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  
  let title = await page.title();
  console.log('Page title:', title);

  const btnExists = await page.$('#reSearchToggleBtn');
  console.log('reSearchToggleBtn exists in DOM:', !!btnExists);

  if (btnExists) {
    console.log('2. Clicking search toggle button...');
    await page.click('#reSearchToggleBtn');
    await new Promise(r => setTimeout(r, 800));

    const overlayDisplay = await page.evaluate(() => {
      const el = document.getElementById('reSearchOverlayBar');
      return el ? window.getComputedStyle(el).display : 'null';
    });
    console.log('Overlay display after click:', overlayDisplay);

    console.log('3. Typing "venetian"...');
    await page.type('.re-search-field', 'venetian');
    await new Promise(r => setTimeout(r, 500));

    console.log('4. Clicking SEARCH button...');
    const [response] = await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }),
      page.click('.re-search-submit-btn')
    ]);

    console.log('5. Navigated to:', page.url());
    console.log('6. New Title:', await page.title());
    
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'simulated_user_search_success.png'), fullPage: false });
    console.log('Saved simulated_user_search_success.png');
  }

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
