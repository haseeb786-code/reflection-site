import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\de9ea39a-cece-46b8-8bfb-32a9c75ec2c5';
const BASE_URL = 'https://reflectionelite.com';

const pagesToCapture = [
  { name: '01_shop_scrolled_desktop', url: '/shop/', viewport: { width: 1440, height: 900 } },
  { name: '01_shop_scrolled_mobile', url: '/shop/', viewport: { width: 390, height: 844, isMobile: true } },
  { name: '02_about_us_scrolled_desktop', url: '/about-us/', viewport: { width: 1440, height: 900 } },
  { name: '02_about_us_scrolled_mobile', url: '/about-us/', viewport: { width: 390, height: 844, isMobile: true } },
  { name: '03_contact_scrolled_desktop', url: '/contact/', viewport: { width: 1440, height: 900 } },
  { name: '03_contact_scrolled_mobile', url: '/contact/', viewport: { width: 390, height: 844, isMobile: true } },
  { name: '04_home_desktop', url: '/', viewport: { width: 1440, height: 900 } },
  { name: '05_custom_dimensions_desktop', url: '/custom-dimensions/', viewport: { width: 1440, height: 900 } },
  { name: '06_privacy_policy_desktop', url: '/privacy-policy-2/', viewport: { width: 1440, height: 900 } },
  { name: '07_cart_desktop', url: '/cart/', viewport: { width: 1440, height: 900 } },
  { name: '08_checkout_desktop', url: '/checkout/', viewport: { width: 1440, height: 900 } }
];

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          setTimeout(resolve, 500);
        }
      }, 100);
    });
  });
}

async function main() {
  if (!fs.existsSync(ARTIFACT_DIR)) {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
    console.log(`Created artifact directory: ${ARTIFACT_DIR}`);
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ],
    ignoreDefaultArgs: ['--enable-automation']
  });

  for (const item of pagesToCapture) {
    const page = await browser.newPage();
    await page.setViewport(item.viewport);
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

    const targetUrl = `${BASE_URL}${item.url}?v=${Date.now()}`;
    console.log(`Loading ${item.name} (${targetUrl})...`);

    try {
      await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 35000 });
      await autoScroll(page);
      await new Promise(r => setTimeout(r, 1000));

      const screenshotPath = path.join(ARTIFACT_DIR, `${item.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`✓ Saved screenshot: ${screenshotPath}`);
    } catch (err) {
      console.error(`Failed to capture ${item.name}:`, err.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('\nAll screenshots captured successfully into:', ARTIFACT_DIR);
}

main().catch(console.error);
