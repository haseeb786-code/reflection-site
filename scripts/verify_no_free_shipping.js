import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\de9ea39a-cece-46b8-8bfb-32a9c75ec2c5';

async function verify() {
  console.log('=== VERIFYING FREE SHIPPING BANNER REMOVAL ===');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

    // 1. DESKTOP MY ACCOUNT (1440 x 900)
    await page.setViewport({ width: 1440, height: 900 });
    console.log('Visiting https://reflectionelite.com/my-account/ ...');
    await page.goto('https://reflectionelite.com/my-account/', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));

    const accountCheck = await page.evaluate(() => {
      const marquee = document.querySelector('.re-marquee-wrapper, #reMarqueeBar');
      const header = document.querySelector('.re-unified-header-container');
      const mainRow = document.querySelector('.re-main-header-row');
      const card = document.querySelector('#customer_login');
      return {
        marqueeFound: !!marquee,
        marqueeDisplay: marquee ? window.getComputedStyle(marquee).display : 'NOT_FOUND',
        headerTop: header ? header.getBoundingClientRect().top : null,
        mainRowTop: mainRow ? mainRow.getBoundingClientRect().top : null,
        cardFound: !!card
      };
    });
    console.log('My Account header audit:', accountCheck);

    const desktopAccountImg = path.join(ARTIFACTS_DIR, 'desktop_my_account_no_marquee.png');
    await page.screenshot({ path: desktopAccountImg });
    console.log('✓ Desktop screenshot saved:', desktopAccountImg);

    // 2. MOBILE MY ACCOUNT (390 x 844)
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));

    const mobileAccountImg = path.join(ARTIFACTS_DIR, 'mobile_my_account_no_marquee.png');
    await page.screenshot({ path: mobileAccountImg });
    console.log('✓ Mobile screenshot saved:', mobileAccountImg);

    // 3. HOME PAGE CHECK (1440 x 900)
    await page.setViewport({ width: 1440, height: 900, isMobile: false, hasTouch: false });
    console.log('Visiting https://reflectionelite.com/ (Home) ...');
    await page.goto('https://reflectionelite.com/', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));

    const homeCheck = await page.evaluate(() => {
      const marquee = document.querySelector('.re-marquee-wrapper, #reMarqueeBar');
      const mainRow = document.querySelector('.re-main-header-row');
      return {
        marqueeFound: !!marquee,
        marqueeDisplay: marquee ? window.getComputedStyle(marquee).display : 'NOT_FOUND',
        mainRowTop: mainRow ? mainRow.getBoundingClientRect().top : null
      };
    });
    console.log('Home header audit:', homeCheck);

    const desktopHomeImg = path.join(ARTIFACTS_DIR, 'desktop_home_no_marquee.png');
    await page.screenshot({ path: desktopHomeImg });
    console.log('✓ Home screenshot saved:', desktopHomeImg);

  } finally {
    await browser.close();
  }
}

verify().catch(console.error);
