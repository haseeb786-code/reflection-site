import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const dir = './before_after_evidence/before';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1440,900'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  const targets = [
    { name: '02_shop_live_before', url: 'https://reflectionelite.ataanalytiq.com/shop/' },
    { name: '03_single_product_live_before', url: 'https://reflectionelite.ataanalytiq.com/product/murana-mirror/' }
  ];

  for (const t of targets) {
    console.log('Capturing:', t.name);
    try {
      await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: `${dir}/${t.name}.png`, fullPage: true });
      console.log('Success:', t.name);
    } catch (e) {
      console.error('Error:', t.name, e.message);
    }
  }

  await browser.close();
}
run();
