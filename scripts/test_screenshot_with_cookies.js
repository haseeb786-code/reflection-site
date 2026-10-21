import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\414d7e40-4d4d-49c9-8868-01c3c84a4783';

async function testScreenshots() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
  const puppeteerCookies = cookies.map(c => ({
    name: c.name,
    value: c.value,
    domain: 'reflectionelite.ataanalytiq.com',
    path: '/'
  }));
  await page.setCookie(...puppeteerCookies);

  console.log('Testing Desktop 1440px...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.ataanalytiq.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'current_p52_desktop.png') });
  console.log('Saved current_p52_desktop.png');

  await browser.close();
}

testScreenshots().catch(console.error);
