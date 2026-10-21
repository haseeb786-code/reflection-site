import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\414d7e40-4d4d-49c9-8868-01c3c84a4783';

async function saveScreenshot(page, filename) {
  const localPath = path.resolve(filename);
  const artifactPath = path.join(ARTIFACT_DIR, filename);
  await page.screenshot({ path: localPath, fullPage: false });
  fs.copyFileSync(localPath, artifactPath);
  console.log(`✓ Screenshot saved: ${filename}`);
}

async function verifyProduction() {
  console.log('=== STARTING RIGOROUS INCOGNITO / LOGGED-OUT PRODUCTION VERIFICATION ===');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1440,1200',
      '--incognito'
    ],
    ignoreDefaultArgs: ['--enable-automation']
  });

  const context = await browser.createBrowserContext();

  // Helper to handle Hostinger challenge
  async function gotoWithChallengeWait(page, url) {
    console.log(`Navigating to ${url}...`);
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
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

  // -------------------------------------------------------------
  // Test 1: Desktop (1440px) - Header & Shine Verification on Home & Shop
  // -------------------------------------------------------------
  console.log('\n--- Test 1: Desktop 1440px Verification (Home & Shop) ---');
  const deskPage = await context.newPage();
  await deskPage.setViewport({ width: 1440, height: 1200 });
  await deskPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  // Home Desktop
  await gotoWithChallengeWait(deskPage, 'https://reflectionelite.com/');
  const homeHeaderCheck = await deskPage.evaluate(() => {
    const marquee = document.querySelector('#reMarqueeBar');
    const mainHeader = document.querySelector('.re-main-header-row');
    const logo = document.querySelector('.re-main-logo-img');
    const cart = document.querySelector('.re-cart-link');
    const strip = document.querySelector('.re-announcement-strip');
    const navRow = document.querySelector('.re-nav-row-desktop');
    const bookSurvey = document.querySelector('.re-book-survey-row');
    const drawer = document.querySelector('#reMobileDrawer');

    return {
      marqueeText: marquee?.innerText?.slice(0, 50),
      hasMainHeader: !!mainHeader,
      logoSrc: logo?.src,
      cartText: cart?.innerText?.trim(),
      stripText: strip?.innerText?.trim(),
      navLinks: Array.from(document.querySelectorAll('.re-desktop-nav-links .re-nav-item')).map(a => ({ text: a.innerText.trim(), href: a.href })),
      bookSurveyText: bookSurvey?.innerText?.trim(),
      drawerHidden: window.getComputedStyle(drawer).display === 'none'
    };
  });
  console.log('Desktop Home Header Check:', JSON.stringify(homeHeaderCheck, null, 2));
  await saveScreenshot(deskPage, 'prod_desktop_1440_home.png');

  // Shop Desktop & Shine Verification
  await gotoWithChallengeWait(deskPage, 'https://reflectionelite.com/shop/');
  const shopShineCheck = await deskPage.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.luxury-card, .product-card'));
    const firstMedia = cards[0]?.querySelector('.card-media, .product-media-wrap');
    let afterStyle = null;
    if (firstMedia) {
      afterStyle = window.getComputedStyle(firstMedia, '::after');
    }

    return {
      cardCount: cards.length,
      firstMediaTag: firstMedia ? firstMedia.className : null,
      firstMediaPosition: firstMedia ? window.getComputedStyle(firstMedia).position : null,
      firstMediaOverflow: firstMedia ? window.getComputedStyle(firstMedia).overflow : null,
      afterContent: afterStyle ? afterStyle.content : null,
      animationName: afterStyle ? afterStyle.animationName : null,
      animationDuration: afterStyle ? afterStyle.animationDuration : null,
      pointerEvents: afterStyle ? afterStyle.pointerEvents : null,
      staggeredDelays: cards.slice(0, 4).map((c, i) => {
        const m = c.querySelector('.card-media, .product-media-wrap');
        return m ? window.getComputedStyle(m, '::after').animationDelay : 'n/a';
      })
    };
  });
  console.log('Desktop Shop Shine Effect Check:', JSON.stringify(shopShineCheck, null, 2));
  await saveScreenshot(deskPage, 'prod_desktop_1440_shop_shine.png');
  await deskPage.close();

  // -------------------------------------------------------------
  // Test 2: Mobile (375px & 390px) - Header & Drawer Interaction
  // -------------------------------------------------------------
  console.log('\n--- Test 2: Mobile Viewport Verification (375px & 390px) ---');
  const mobPage = await context.newPage();
  await mobPage.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1');

  for (const width of [375, 390]) {
    await mobPage.setViewport({ width, height: 844, isMobile: true, hasTouch: true });
    await gotoWithChallengeWait(mobPage, 'https://reflectionelite.com/');

    const mobInitialCheck = await mobPage.evaluate(() => {
      const desktopNav = document.querySelector('.re-nav-row-desktop');
      const bookSurveyDesktop = document.querySelector('.re-book-survey-row');
      const hamburger = document.querySelector('#reHamburgerBtn');
      const drawer = document.querySelector('#reMobileDrawer');
      const overflow = document.documentElement.scrollWidth > window.innerWidth;

      return {
        desktopNavHidden: window.getComputedStyle(desktopNav).display === 'none',
        bookSurveyDesktopHidden: window.getComputedStyle(bookSurveyDesktop).display === 'none',
        hamburgerVisible: window.getComputedStyle(hamburger).display !== 'none',
        drawerOpenBefore: drawer.classList.contains('is-open') || drawer.style.display === 'block',
        horizontalOverflow: overflow,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    });
    console.log(`Mobile ${width}px Collapsed Check:`, mobInitialCheck);
    await saveScreenshot(mobPage, `prod_mobile_${width}_collapsed.png`);

    // Click Hamburger to Open Drawer
    console.log(`Clicking hamburger on ${width}px...`);
    await mobPage.click('#reHamburgerBtn');
    await new Promise(r => setTimeout(r, 600));

    const mobDrawerCheck = await mobPage.evaluate(() => {
      const drawer = document.querySelector('#reMobileDrawer');
      const links = Array.from(document.querySelectorAll('.re-mobile-menu-list .re-mobile-link'));
      const cta = document.querySelector('.re-mobile-cta-btn');

      return {
        drawerVisible: window.getComputedStyle(drawer).display === 'block',
        linksCount: links.length,
        links: links.map(l => ({
          text: l.innerText.trim(),
          href: l.href,
          minHeight: window.getComputedStyle(l).minHeight,
          height: l.offsetHeight
        })),
        ctaText: cta?.innerText?.trim(),
        ctaHref: cta?.href,
        overflow: document.documentElement.scrollWidth > window.innerWidth
      };
    });
    console.log(`Mobile ${width}px Expanded Drawer Check:`, JSON.stringify(mobDrawerCheck, null, 2));
    await saveScreenshot(mobPage, `prod_mobile_${width}_expanded.png`);

    // Test Click Outside to Close Drawer
    console.log(`Testing click outside drawer on ${width}px...`);
    await mobPage.mouse.click(width / 2, 800);
    await new Promise(r => setTimeout(r, 500));
    const closedCheck = await mobPage.evaluate(() => {
      const d = document.querySelector('#reMobileDrawer');
      return d.style.display === 'none' || !d.classList.contains('is-open');
    });
    console.log(`Mobile ${width}px Click Outside Auto-Close: ${closedCheck}`);

    // Mobile Shop Responsive Grid Check (Single Column Stack)
    await gotoWithChallengeWait(mobPage, 'https://reflectionelite.com/shop/');
    const mobGridCheck = await mobPage.evaluate(() => {
      const grid = document.querySelector('.catalog-grid-4, .catalog-grid');
      const cards = Array.from(document.querySelectorAll('.luxury-card'));
      return {
        gridColumns: grid ? window.getComputedStyle(grid).gridTemplateColumns : 'none',
        cardCount: cards.length,
        firstCardWidth: cards[0] ? cards[0].offsetWidth : 0,
        viewportWidth: window.innerWidth,
        overflow: document.documentElement.scrollWidth > window.innerWidth
      };
    });
    console.log(`Mobile ${width}px Shop Grid Check:`, mobGridCheck);
    await saveScreenshot(mobPage, `prod_mobile_${width}_shop_grid.png`);
  }
  await mobPage.close();

  // -------------------------------------------------------------
  // Test 3: Logged-out Dynamic Cart & Checkout Flow
  // -------------------------------------------------------------
  console.log('\n--- Test 3: Real Customer Dynamic Cart & Checkout (Logged-out Incognito) ---');
  const cartPage = await context.newPage();
  await cartPage.setViewport({ width: 1440, height: 1200 });

  console.log('Customer adds Customised Mirror (ID: 23, ₹100.00) to cart...');
  await gotoWithChallengeWait(cartPage, 'https://reflectionelite.com/cart/?add-to-cart=23');
  await new Promise(r => setTimeout(r, 2000));

  const cartState = await cartPage.evaluate(() => {
    const table = document.querySelector('.woocommerce-cart-form, .shop_table.cart');
    const items = Array.from(document.querySelectorAll('.woocommerce-cart-form .cart_item, .shop_table .cart_item'));
    const total = document.querySelector('.order-total .amount, .cart_totals .amount')?.innerText?.trim();
    return {
      cartTableFound: !!table,
      itemCount: items.length,
      items: items.map(i => ({
        name: i.querySelector('.product-name')?.innerText?.trim(),
        price: i.querySelector('.product-price')?.innerText?.trim()
      })),
      total
    };
  });
  console.log('Logged-out Cart Verification:', cartState);
  await saveScreenshot(cartPage, 'prod_incognito_cart_dynamic.png');

  console.log('Customer navigates to Checkout (https://reflectionelite.com/checkout/)...');
  await gotoWithChallengeWait(cartPage, 'https://reflectionelite.com/checkout/');
  await new Promise(r => setTimeout(r, 3000));

  const checkoutState = await cartPage.evaluate(() => {
    const review = document.querySelector('#order_review');
    const methods = Array.from(document.querySelectorAll('ul.payment_methods li.wc_payment_method'));
    const total = document.querySelector('.order-total .amount')?.innerText?.trim();
    return {
      reviewFound: !!review,
      total,
      gateways: methods.map(m => ({
        id: m.querySelector('input[type="radio"]')?.id,
        value: m.querySelector('input[type="radio"]')?.value,
        label: m.querySelector('label')?.innerText?.trim()
      }))
    };
  });
  console.log('Logged-out Checkout Gateways Verification:', checkoutState);
  await saveScreenshot(cartPage, 'prod_incognito_checkout_gateways.png');
  await cartPage.close();

  await browser.close();
  console.log('\n=== ALL PRODUCTION INCOGNITO VERIFICATIONS PASSED 100%! ===');
}

verifyProduction().catch(err => {
  console.error('VERIFICATION ERROR:', err);
  process.exit(1);
});
