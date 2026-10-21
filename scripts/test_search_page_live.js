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

  console.log('Navigating to search page for "venetian"...');
  await page.goto('https://reflectionelite.com/?s=venetian&post_type=product', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  const url = page.url();
  const title = await page.title();
  console.log('Current URL:', url);
  console.log('Current Title:', title);

  const screenshotPath = path.join(ARTIFACT_DIR, 'live_search_results_venetian.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Saved live_search_results_venetian.png');

  // Also test empty or different search term, e.g. "mirror"
  console.log('Navigating to search page for "mirror"...');
  await page.goto('https://reflectionelite.com/?s=mirror&post_type=product', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'live_search_results_mirror.png'), fullPage: true });
  console.log('Saved live_search_results_mirror.png');

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
