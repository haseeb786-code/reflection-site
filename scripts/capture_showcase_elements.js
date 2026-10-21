import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.com/?nocache=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));
  
  // Scroll to Category showcase and ensure images loaded
  await page.evaluate(async () => {
    const el = document.querySelector('#teCatShowcase');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1500));

  const cat = await page.$('#teCatShowcase');
  if (cat) {
    await cat.screenshot({ path: 'screenshots/cat_showcase_element_1440.png' });
    console.log('✓ Captured cat_showcase_element_1440.png');
  }

  // Scroll to Duo showcase and ensure images loaded
  await page.evaluate(async () => {
    const el = document.querySelector('#teDuoShowcase');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 2000));

  const duo = await page.$('#teDuoShowcase');
  if (duo) {
    await duo.screenshot({ path: 'screenshots/duo_showcase_element_1440.png' });
    console.log('✓ Captured duo_showcase_element_1440.png');
  }

  // Also capture mobile screenshot of both at 390
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(async () => {
    const el = document.querySelector('#teCatShowcase');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1000));
  const catMobile = await page.$('#teCatShowcase');
  if (catMobile) {
    await catMobile.screenshot({ path: 'screenshots/cat_showcase_element_390.png' });
    console.log('✓ Captured cat_showcase_element_390.png');
  }

  await page.evaluate(async () => {
    const el = document.querySelector('#teDuoShowcase');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1000));
  const duoMobile = await page.$('#teDuoShowcase');
  if (duoMobile) {
    await duoMobile.screenshot({ path: 'screenshots/duo_showcase_element_390.png' });
    console.log('✓ Captured duo_showcase_element_390.png');
  }

  await browser.close();
}

main().catch(console.error);
