import puppeteer from 'puppeteer-core';
import path from 'path';
import { getProdAuth } from './prod_auth_helper.js';

const ARTIFACTS_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\de9ea39a-cece-46b8-8bfb-32a9c75ec2c5';

async function captureCard() {
  console.log('=== CAPTURING COMPREHENSIVE CARD & DASHBOARD SCREENSHOTS ===');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

    // 1. DESKTOP VIEWPORT (1440 x 1000) - LOGGED OUT
    await page.setViewport({ width: 1440, height: 1000 });
    await page.goto('https://reflectionelite.com/my-account/', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));

    // Ensure Login tab active
    await page.click('.re-auth-tab[data-tab="login"]');
    await new Promise(r => setTimeout(r, 600));

    await page.evaluate(() => {
      document.getElementById('customer_login').scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 400));

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'desktop_login_centered.png') });
    const cardEl = await page.$('#customer_login');
    if (cardEl) {
      await cardEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'desktop_login_card_element.png') });
    }

    // Switch to Signup tab
    await page.click('.re-auth-tab[data-tab="register"]');
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'desktop_signup_centered.png') });
    if (cardEl) {
      await cardEl.screenshot({ path: path.join(ARTIFACTS_DIR, 'desktop_signup_card_element.png') });
    }

    // 2. MOBILE VIEWPORT (390 x 844) - IPHONE 14
    console.log('\nCapturing Mobile Views...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    
    // Test Login on Mobile
    await page.click('.re-auth-tab[data-tab="login"]');
    await new Promise(r => setTimeout(r, 600));
    await page.evaluate(() => {
      document.getElementById('customer_login').scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 400));

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile_login_view.png') });
    const mobCard = await page.$('#customer_login');
    if (mobCard) {
      await mobCard.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile_login_card_element.png') });
    }

    // Test Signup on Mobile
    await page.click('.re-auth-tab[data-tab="register"]');
    await new Promise(r => setTimeout(r, 600));
    await page.evaluate(() => {
      document.getElementById('customer_login').scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 400));

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile_signup_view.png') });
    if (mobCard) {
      await mobCard.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile_signup_card_element.png') });
    }

    // 3. LOGGED-IN DASHBOARD VIEWPORT (DESKTOP & MOBILE)
    console.log('\nCapturing Logged-In Customer Dashboard...');
    const auth = await getProdAuth();
    // Parse cookies from auth.cookies header string
    const cookiePairs = auth.cookies.split(';').map(c => c.trim()).filter(Boolean);
    const cookiesForPup = cookiePairs.map(cp => {
      const idx = cp.indexOf('=');
      return {
        name: cp.substring(0, idx).trim(),
        value: cp.substring(idx + 1).trim(),
        domain: 'reflectionelite.com',
        path: '/'
      };
    });

    await page.setCookie(...cookiesForPup);

    // Desktop Dashboard (1440 x 900)
    await page.setViewport({ width: 1440, height: 900, isMobile: false, hasTouch: false });
    await page.goto('https://reflectionelite.com/my-account/', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'desktop_logged_in_dashboard.png'), fullPage: false });
    console.log('✓ Desktop Logged-in Dashboard captured');

    // Mobile Dashboard (390 x 844)
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile_logged_in_dashboard.png'), fullPage: false });
    console.log('✓ Mobile Logged-in Dashboard captured');

  } finally {
    await browser.close();
  }
}

captureCard().catch(console.error);
