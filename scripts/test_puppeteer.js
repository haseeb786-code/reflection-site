import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function test() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false, // let's test with headless: 'new' or false, or args
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1440, height: 900 });
  
  console.log('Navigating to reflectionelite.com...');
  await page.goto('https://reflectionelite.com', { waitUntil: 'networkidle2', timeout: 30000 });
  
  console.log('Initial Title:', await page.title());
  // Wait 6 seconds for any verification redirect
  await new Promise(r => setTimeout(r, 6000));
  
  console.log('After wait Title:', await page.title());
  console.log('URL:', page.url());
  
  await page.screenshot({ path: 'audit_test_home.png' });
  console.log('Screenshot saved: audit_test_home.png');
  
  await browser.close();
}

test().catch(console.error);
