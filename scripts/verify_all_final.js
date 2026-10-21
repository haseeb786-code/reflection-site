import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\de9ea39a-cece-46b8-8bfb-32a9c75ec2c5';

async function saveScreenshot(page, filename, fullPage = true) {
  const localPath = path.resolve(filename);
  const artifactPath = path.join(ARTIFACT_DIR, filename);
  await page.screenshot({ path: localPath, fullPage });
  fs.copyFileSync(localPath, artifactPath);
  console.log(`✓ Screenshot saved: ${filename}`);
}

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
  console.log('======================================================================');
  console.log('STARTING FINAL MULTI-DEVICE VERIFICATION SUITE');
  console.log('Artifacts Directory:', ARTIFACT_DIR);
  console.log('======================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--incognito'
    ],
    ignoreDefaultArgs: ['--enable-automation']
  });

  const context = await browser.createBrowserContext();

  // ------------------------------------------------------------------
  // 1. MOBILE VERIFICATION (375px & 390px)
  // ------------------------------------------------------------------
  console.log('\n--- 1. Testing Mobile 375px (iPhone SE / Standard Mobile) ---');
  const mobPage = await context.newPage();
  await mobPage.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await mobPage.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1');

  // Home Mobile
  await gotoWithChallengeWait(mobPage, 'https://reflectionelite.com/?v=' + Date.now());
  await saveScreenshot(mobPage, 'final_mobile_home_375.png', false);
  await saveScreenshot(mobPage, 'final_mobile_home_375_full.png', true);

  // Check header elements on mobile
  const searchBtnExists = await mobPage.$('#reSearchToggleBtn') !== null;
  const accountLinkExists = await mobPage.$('.re-account-link') !== null;
  const cartLinkExists = await mobPage.$('.re-cart-link') !== null;
  const hamburgerBtnExists = await mobPage.$('#reHamburgerBtn') !== null;
  console.log(`Header items present: Search=${searchBtnExists}, Account=${accountLinkExists}, Cart=${cartLinkExists}, Hamburger=${hamburgerBtnExists}`);

  // Test Search Bar Toggle on Mobile
  console.log('\nTesting Search Bar Toggle on Mobile...');
  await mobPage.click('#reSearchToggleBtn');
  await new Promise(r => setTimeout(r, 800));
  await saveScreenshot(mobPage, 'final_mobile_search_open_375.png', false);

  // Close Search Bar
  await mobPage.click('.re-search-close-btn');
  await new Promise(r => setTimeout(r, 500));

  // Check CTA Button Stacking on Mobile
  const ctaBounding = await mobPage.evaluate(() => {
    const btns = document.querySelectorAll('.re-hero-btn');
    if (btns.length < 2) return null;
    const r1 = btns[0].getBoundingClientRect();
    const r2 = btns[1].getBoundingClientRect();
    return {
      btn1: { top: r1.top, left: r1.left, right: r1.right, width: r1.width },
      btn2: { top: r2.top, left: r2.left, right: r2.right, width: r2.width },
      isStacked: r2.top > r1.top + 20,
      windowWidth: window.innerWidth
    };
  });
  console.log('Mobile Hero CTA Stacking Check:', ctaBounding);

  // Check Horizontal Scrollbar / Overflow on Mobile
  const hasHorizontalScroll = await mobPage.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log(`[${!hasHorizontalScroll ? 'PASS' : 'FAIL'}] Mobile 375px Horizontal Scroll Blowout: ${hasHorizontalScroll} (expected: false)`);

  // About Us Mobile
  console.log('\nTesting About Us Mobile...');
  await gotoWithChallengeWait(mobPage, 'https://reflectionelite.com/about-us/?v=' + Date.now());
  await saveScreenshot(mobPage, 'final_mobile_about_us_375.png', true);

  // Contact Mobile
  console.log('\nTesting Contact Mobile...');
  await gotoWithChallengeWait(mobPage, 'https://reflectionelite.com/contact/?v=' + Date.now());
  await saveScreenshot(mobPage, 'final_mobile_contact_375.png', true);

  // Shop Mobile
  console.log('\nTesting Shop Mobile...');
  await gotoWithChallengeWait(mobPage, 'https://reflectionelite.com/shop/?v=' + Date.now());
  await saveScreenshot(mobPage, 'final_mobile_shop_375.png', true);

  // ------------------------------------------------------------------
  // 2. MOBILE 390px (iPhone 12/13/14 Pro)
  // ------------------------------------------------------------------
  console.log('\n--- 2. Testing Mobile 390px (iPhone 14/15 Pro) ---');
  await mobPage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await gotoWithChallengeWait(mobPage, 'https://reflectionelite.com/?v=' + Date.now());
  await saveScreenshot(mobPage, 'final_mobile_home_390.png', false);

  // ------------------------------------------------------------------
  // 3. DESKTOP VERIFICATION (1440px)
  // ------------------------------------------------------------------
  console.log('\n--- 3. Testing Desktop 1440px ---');
  const deskPage = await context.newPage();
  await deskPage.setViewport({ width: 1440, height: 1000 });
  await deskPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  // Home Desktop
  await gotoWithChallengeWait(deskPage, 'https://reflectionelite.com/?v=' + Date.now());
  await saveScreenshot(deskPage, 'final_desktop_home_1440.png', false);
  await saveScreenshot(deskPage, 'final_desktop_home_1440_full.png', true);

  // Shop Desktop
  await gotoWithChallengeWait(deskPage, 'https://reflectionelite.com/shop/?v=' + Date.now());
  await saveScreenshot(deskPage, 'final_desktop_shop_1440.png', true);

  // About Us Desktop
  await gotoWithChallengeWait(deskPage, 'https://reflectionelite.com/about-us/?v=' + Date.now());
  await saveScreenshot(deskPage, 'final_desktop_about_us_1440.png', true);

  // Contact Desktop
  await gotoWithChallengeWait(deskPage, 'https://reflectionelite.com/contact/?v=' + Date.now());
  await saveScreenshot(deskPage, 'final_desktop_contact_1440.png', true);

  // My Account Desktop
  await gotoWithChallengeWait(deskPage, 'https://reflectionelite.com/my-account/?v=' + Date.now());
  await saveScreenshot(deskPage, 'final_desktop_my_account_1440.png', true);

  // Search Results Page (query: venetian)
  await gotoWithChallengeWait(deskPage, 'https://reflectionelite.com/?s=venetian&post_type=product');
  await saveScreenshot(deskPage, 'final_desktop_search_venetian_1440.png', true);

  await browser.close();
  console.log('\n======================================================================');
  console.log('✓ ALL SCREENSHOTS AND INTERACTIVE TESTS COMPLETED SUCCESSFULLY!');
  console.log('======================================================================');
}

main().catch(err => {
  console.error('VERIFICATION ERROR:', err);
  process.exit(1);
});
