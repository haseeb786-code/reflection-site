import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\414d7e40-4d4d-49c9-8868-01c3c84a4783';

async function saveScreenshot(page, filename) {
  const localPath = path.resolve(filename);
  const artifactPath = path.join(ARTIFACT_DIR, filename);
  await page.screenshot({ path: localPath, fullPage: false });
  try {
    fs.copyFileSync(localPath, artifactPath);
  } catch (e) {
    console.error('Error copying artifact:', e.message);
  }
  console.log(`✓ Screenshot saved: ${filename}`);
}

async function testLoggedOut() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  // Visit without cookies
  console.log('Testing Desktop 1440px (Logged Out)...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.ataanalytiq.com/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3500));
  await saveScreenshot(page, 'staging_desktop_header_logged_out.png');

  console.log('Testing Mobile 375px Collapsed (Logged Out)...');
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('https://reflectionelite.ataanalytiq.com/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2500));
  await saveScreenshot(page, 'staging_mobile_375_logged_out.png');

  console.log('Testing Mobile 375px Expanded (Logged Out)...');
  await page.click('#reHamburgerBtn');
  await new Promise(r => setTimeout(r, 800));
  await saveScreenshot(page, 'staging_mobile_375_expanded_logged_out.png');

  await browser.close();
}

testLoggedOut().catch(console.error);
