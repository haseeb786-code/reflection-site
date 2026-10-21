import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\de9ea39a-cece-46b8-8bfb-32a9c75ec2c5';

async function verifyMobileAndHome() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

    // 1. MOBILE MY ACCOUNT (390 x 844)
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    console.log('Visiting Mobile My Account...');
    await page.goto('https://reflectionelite.com/my-account/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await new Promise(r => setTimeout(r, 2000));

    const mobAccountImg = path.join(ARTIFACTS_DIR, 'mobile_my_account_no_marquee.png');
    await page.screenshot({ path: mobAccountImg });
    console.log('✓ Mobile screenshot saved:', mobAccountImg);

    // 2. DESKTOP HOME (1440 x 900)
    await page.setViewport({ width: 1440, height: 900, isMobile: false, hasTouch: false });
    console.log('Visiting Desktop Home...');
    await page.goto('https://reflectionelite.com/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await new Promise(r => setTimeout(r, 2000));

    const homeImg = path.join(ARTIFACTS_DIR, 'desktop_home_no_marquee.png');
    await page.screenshot({ path: homeImg });
    console.log('✓ Home screenshot saved:', homeImg);

  } finally {
    await browser.close();
  }
}

verifyMobileAndHome().catch(console.error);
