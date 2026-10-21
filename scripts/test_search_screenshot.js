import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\de9ea39a-cece-46b8-8bfb-32a9c75ec2c5';

async function gotoWithChallengeWait(page, url) {
  console.log(`Navigating to ${url}...`);
  const res = await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
  let title = await page.title();
  if (title.includes('Just a moment') || title.includes('Checking your browser')) {
    console.log('Hostinger CDN challenge detected, waiting for challenge to solve...');
    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 1500));
      title = await page.title();
      if (!title.includes('Just a moment') && !title.includes('Checking your browser')) break;
    }
  }
  await new Promise(r => setTimeout(r, 2000));
  return res;
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--incognito']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  
  await gotoWithChallengeWait(page, 'https://reflectionelite.com/?s=venetian');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_search_plain_venetian.png'), fullPage: true });
  console.log('Saved test_search_plain_venetian.png');
  
  await browser.close();
}

main().catch(console.error);
