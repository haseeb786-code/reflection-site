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

  console.log('2. Clicking search toggle button...');
  await page.click('#reSearchToggleBtn');
  await new Promise(r => setTimeout(r, 1000));

  // Capture open search bar with suggestion pills
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'live_search_with_pills.png'), fullPage: false });
  console.log('Saved live_search_with_pills.png');

  console.log('3. Typing "ven"...');
  await page.type('.re-search-field', 'ven');
  await new Promise(r => setTimeout(r, 1000));

  // Capture live instant autocomplete results
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'live_search_autocomplete_ven.png'), fullPage: false });
  console.log('Saved live_search_autocomplete_ven.png');

  // Mobile test
  console.log('4. Testing Mobile (375px)...');
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto('https://reflectionelite.com/?v=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  await page.click('#reSearchToggleBtn');
  await new Promise(r => setTimeout(r, 1000));
  await page.type('.re-search-field', 'crown');
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'live_search_mobile_crown.png'), fullPage: false });
  console.log('Saved live_search_mobile_crown.png');

  await browser.close();
  console.log('ALL TESTS COMPLETED!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
