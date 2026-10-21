import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\de9ea39a-cece-46b8-8bfb-32a9c75ec2c5';

async function verifyAuthCard() {
  console.log('=== VERIFYING SINGLE-CARD AUTHENTICATION (DESKTOP & MOBILE) ===');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
    
    // -------------------------------------------------------------
    // TEST 1: DESKTOP VIEWPORT (1440 x 900) - LOGGED OUT
    // -------------------------------------------------------------
    await page.setViewport({ width: 1440, height: 900 });
    console.log('Navigating to https://reflectionelite.com/my-account/ ...');
    await page.goto('https://reflectionelite.com/my-account/', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    // Verify presence of single-card elements
    const cardInfo = await page.evaluate(() => {
      const card = document.getElementById('customer_login');
      if (!card) return { found: false };

      const rect = card.getBoundingClientRect();
      const style = window.getComputedStyle(card);
      const switcher = card.querySelector('.re-auth-switcher');
      const tabs = card.querySelectorAll('.re-auth-tab');
      const title = card.querySelector('#reAuthCardTitle');
      const col1 = card.querySelector('.u-column1');
      const col2 = card.querySelector('.u-column2');
      const col1Display = col1 ? window.getComputedStyle(col1).display : 'none';
      const col2Display = col2 ? window.getComputedStyle(col2).display : 'none';

      return {
        found: true,
        width: rect.width,
        height: rect.height,
        maxWidth: style.maxWidth,
        hasSwitcher: !!switcher,
        tabCount: tabs.length,
        titleText: title ? title.textContent : null,
        col1Display,
        col2Display
      };
    });

    console.log('Card info on load:', cardInfo);

    const desktopLoginPath = path.join(ARTIFACTS_DIR, 'desktop_my_account_login_single_card.png');
    await page.screenshot({ path: desktopLoginPath, fullPage: false });
    console.log('✓ Desktop Login screenshot captured:', desktopLoginPath);

    // Click "Signup" tab
    console.log('Clicking Signup tab...');
    await page.click('.re-auth-tab[data-tab="register"]');
    await new Promise(r => setTimeout(r, 800));

    const cardInfoAfterSignup = await page.evaluate(() => {
      const card = document.getElementById('customer_login');
      const title = card.querySelector('#reAuthCardTitle');
      const col1 = card.querySelector('.u-column1');
      const col2 = card.querySelector('.u-column2');
      return {
        titleText: title ? title.textContent : null,
        isSignupMode: card.classList.contains('re-mode-signup'),
        col1Display: col1 ? window.getComputedStyle(col1).display : 'none',
        col2Display: col2 ? window.getComputedStyle(col2).display : 'none'
      };
    });

    console.log('Card info after Signup click:', cardInfoAfterSignup);

    const desktopSignupPath = path.join(ARTIFACTS_DIR, 'desktop_my_account_signup_single_card.png');
    await page.screenshot({ path: desktopSignupPath, fullPage: false });
    console.log('✓ Desktop Signup screenshot captured:', desktopSignupPath);

    // -------------------------------------------------------------
    // TEST 2: MOBILE VIEWPORT (375 x 812) - IPHONE SIZE
    // -------------------------------------------------------------
    console.log('\nTesting Mobile Viewport (375 x 812)...');
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await page.reload({ waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    const mobileLoginPath = path.join(ARTIFACTS_DIR, 'mobile_my_account_login_single_card.png');
    await page.screenshot({ path: mobileLoginPath, fullPage: false });
    console.log('✓ Mobile Login screenshot captured:', mobileLoginPath);

    // Click "Signup now" bottom link or tab
    console.log('Clicking Signup tab on Mobile...');
    await page.click('.re-auth-tab[data-tab="register"]');
    await new Promise(r => setTimeout(r, 800));

    const mobileSignupPath = path.join(ARTIFACTS_DIR, 'mobile_my_account_signup_single_card.png');
    await page.screenshot({ path: mobileSignupPath, fullPage: false });
    console.log('✓ Mobile Signup screenshot captured:', mobileSignupPath);

  } finally {
    await browser.close();
  }
}

verifyAuthCard().catch(console.error);
