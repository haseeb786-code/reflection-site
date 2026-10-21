import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\414d7e40-4d4d-49c9-8868-01c3c84a4783';

async function waitForRealPage(page, targetUrl) {
  console.log(`Navigating to ${targetUrl}...`);
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
  
  // Wait for Hostinger Cloudflare JS challenge to clear
  try {
    await page.waitForFunction(() => {
      return document.title && !document.title.includes('Checking your browser');
    }, { timeout: 20000 });
  } catch (e) {
    console.log('Timeout waiting for title change, waiting 5s extra...');
    await new Promise(r => setTimeout(r, 5000));
  }

  // Wait for #reUnifiedHeader to be in DOM
  await page.waitForSelector('#reUnifiedHeader', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1500));
}

async function runVerification() {
  console.log('=== RUNNING INCOGNITO VALIDATION ON PRODUCTION ===');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--incognito']
  });

  const report = {};

  try {
    const page = await browser.newPage();

    // ----------------------------------------------------
    // 1. SHOP PAGE - DESKTOP (1440x1200)
    // ----------------------------------------------------
    await page.setViewport({ width: 1440, height: 1200 });
    await waitForRealPage(page, 'https://reflectionelite.com/shop/');

    const shopDesktopData = await page.evaluate(() => {
      const text = document.body.innerText;
      const rawCssFound = text.includes('@font-face') || text.includes('trajanpro-bold.otf') || text.includes('format(\'truetype\')');
      const rawJsFound = text.includes('addEventListener') || text.includes('reMobileDrawer');
      const cards = document.querySelectorAll('.catalog-grid-4 .luxury-card');
      const nativeUl = document.querySelector('ul.products');
      const nativeUlDisplay = nativeUl ? window.getComputedStyle(nativeUl).display : 'null';
      const grid = document.querySelector('.catalog-grid-4');
      const gridCols = grid ? window.getComputedStyle(grid).gridTemplateColumns.split(' ').length : 0;
      const navLinks = Array.from(document.querySelectorAll('.re-desktop-nav-links .re-nav-item')).map(a => a.innerText.trim());

      return {
        rawCssFound,
        rawJsFound,
        curatedCardCount: cards.length,
        nativeUlDisplay,
        gridColumns: gridCols,
        desktopNavLinks: navLinks,
        productTitles: Array.from(cards).map(c => c.querySelector('.card-title')?.innerText?.trim())
      };
    });

    report.shopDesktop = shopDesktopData;
    console.log('Shop Desktop Validation:', shopDesktopData);

    const shopDesktopPath = path.join(ARTIFACT_DIR, 'prod_verified_shop_desktop.png');
    await page.screenshot({ path: shopDesktopPath, fullPage: false });
    console.log('✓ Captured:', shopDesktopPath);

    // ----------------------------------------------------
    // 2. SHOP PAGE - MOBILE (390x844)
    // ----------------------------------------------------
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await new Promise(r => setTimeout(r, 1000));

    const shopMobileData = await page.evaluate(() => {
      const grid = document.querySelector('.catalog-grid-4');
      const gridCols = grid ? window.getComputedStyle(grid).gridTemplateColumns.split(' ').length : 0;
      const card = document.querySelector('.luxury-card');
      return {
        mobileGridColumns: gridCols,
        cardWidth: card ? card.offsetWidth : 0,
        screenWidth: window.innerWidth
      };
    });

    report.shopMobile = shopMobileData;
    console.log('Shop Mobile Validation:', shopMobileData);

    const shopMobilePath = path.join(ARTIFACT_DIR, 'prod_verified_shop_mobile.png');
    await page.screenshot({ path: shopMobilePath, fullPage: false });
    console.log('✓ Captured:', shopMobilePath);

    // ----------------------------------------------------
    // 3. ABOUT US PAGE - DESKTOP (1440x1200)
    // ----------------------------------------------------
    await page.setViewport({ width: 1440, height: 1200 });
    await waitForRealPage(page, 'https://reflectionelite.com/about-us/');

    const aboutDesktopData = await page.evaluate(() => {
      const text = document.body.innerText;
      const rawCssFound = text.includes('@font-face') || text.includes('trajanpro-bold.otf');
      const heading = document.querySelector('.re-story-section-heading');
      const headingColor = heading ? window.getComputedStyle(heading).color : null;
      const cardTitle = document.querySelector('.re-highlights-card-title');
      const cardTitleColor = cardTitle ? window.getComputedStyle(cardTitle).color : null;
      const card = document.querySelector('.re-story-highlights-card');
      const cardBg = card ? window.getComputedStyle(card).backgroundColor : null;
      const cardBorder = card ? window.getComputedStyle(card).border : null;
      const btn = document.querySelector('.re-btn-primary');
      const btnBg = btn ? window.getComputedStyle(btn).backgroundColor : null;
      const btnColor = btn ? window.getComputedStyle(btn).color : null;

      return {
        rawCssFound,
        headingColor,
        cardTitleColor,
        cardBg,
        cardBorder,
        btnBg,
        btnColor
      };
    });

    report.aboutDesktop = aboutDesktopData;
    console.log('About Us Desktop Validation:', aboutDesktopData);

    const aboutDesktopPath = path.join(ARTIFACT_DIR, 'prod_verified_about_desktop.png');
    await page.screenshot({ path: aboutDesktopPath, fullPage: false });
    console.log('✓ Captured:', aboutDesktopPath);

    // ----------------------------------------------------
    // 4. ABOUT US PAGE - MOBILE (390x844)
    // ----------------------------------------------------
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await new Promise(r => setTimeout(r, 1000));

    const aboutMobilePath = path.join(ARTIFACT_DIR, 'prod_verified_about_mobile.png');
    await page.screenshot({ path: aboutMobilePath, fullPage: false });
    console.log('✓ Captured:', aboutMobilePath);

  } finally {
    await browser.close();
  }

  console.log('\n=== FINAL VERIFICATION REPORT ===');
  console.log(JSON.stringify(report, null, 2));
}

runVerification().catch(console.error);
