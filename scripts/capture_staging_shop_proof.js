import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function capture() {
  console.log('Launching browser to capture staging shop with challenge bypass...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1440,1400'
    ],
    ignoreDefaultArgs: ['--enable-automation']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1400 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  await page.evaluateOnNewDocument(() => {
    delete Object.getPrototypeOf(navigator).webdriver;
  });

  await page.goto('https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1', { waitUntil: 'domcontentloaded', timeout: 30000 });

  console.log('Initial title:', await page.title());
  if ((await page.title()).includes('Checking your browser') || (await page.title()).includes('Just a moment')) {
    console.log('Detected challenge, waiting 8 seconds...');
    await new Promise(r => setTimeout(r, 8000));
    console.log('Title after wait:', await page.title());
  }

  // Wait 3 seconds for images to load
  await new Promise(r => setTimeout(r, 3000));

  await page.screenshot({ path: 'staging_shop_exact_frozen.png', fullPage: false });
  console.log('Saved staging_shop_exact_frozen.png successfully!');
  await browser.close();
}

capture().catch(console.error);
