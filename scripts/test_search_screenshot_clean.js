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

  // Check if raw CSS is in body
  const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 300));
  console.log('Body start text:\n', bodyText);

  // Take screenshot of home
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'clean_home_after_fix.png'), fullPage: false });
  console.log('Saved clean_home_after_fix.png');

  // Click search button
  console.log('2. Clicking search toggle...');
  await page.click('#reSearchToggleBtn');
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'clean_search_open_with_pills.png'), fullPage: false });
  console.log('Saved clean_search_open_with_pills.png');

  // Type "ven"
  console.log('3. Typing "ven"...');
  await page.type('.re-search-field', 'ven');
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'clean_search_live_results.png'), fullPage: false });
  console.log('Saved clean_search_live_results.png');

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
