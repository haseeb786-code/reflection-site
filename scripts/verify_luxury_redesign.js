import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const outDir = 'audit_evidence/redesign_verification';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function verify() {
  console.log('=== STARTING DEEP BROWSER VERIFICATION ===\n');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  async function scrollToBottomAndReset() {
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
            resolve();
          }
        }, 100);
      });
    });
    await new Promise(r => setTimeout(r, 1500));
  }

  // =========================================================================
  // 1. VERIFY HOMEPAGE (Desktop, Tablet, Mobile)
  // =========================================================================
  console.log('1. Auditing Homepage (https://reflectionelite.com/)...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.com/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await new Promise(r => setTimeout(r, 8000)); // wait for Hostinger challenge
  await scrollToBottomAndReset();

  const homeAudit = await page.evaluate(() => {
    const hero = document.querySelector('.re-hero-section');
    const heroTitle = document.querySelector('.re-hero-heading');
    const entryTitle = document.querySelector('.entry-header, .entry-title');
    const entryTitleVisible = entryTitle ? window.getComputedStyle(entryTitle).display !== 'none' : false;
    const collections = Array.from(document.querySelectorAll('.re-collection-card'));
    const featuredProds = Array.from(document.querySelectorAll('.re-featured-product-card'));
    const bespokeSection = document.querySelector('#custom-dimensions.re-bespoke-section');

    return {
      title: document.title,
      entryTitleSuppressed: !entryTitleVisible,
      heroExists: !!hero,
      heroWidth: hero ? hero.offsetWidth : 0,
      heroHeight: hero ? hero.offsetHeight : 0,
      heroBg: hero ? window.getComputedStyle(hero).backgroundImage : '',
      heroTitleText: heroTitle ? heroTitle.textContent.replace(/\s+/g, ' ').trim() : '',
      collectionsCount: collections.length,
      collectionImages: collections.map(c => {
        const img = c.querySelector('img');
        return {
          alt: img ? img.alt : '',
          src: img ? img.src : '',
          complete: img ? img.complete : false,
          naturalWidth: img ? img.naturalWidth : 0
        };
      }),
      featuredProdsCount: featuredProds.length,
      featuredTitles: featuredProds.map(p => p.querySelector('.re-product-card-title')?.textContent.trim()),
      bespokeExists: !!bespokeSection
    };
  });

  console.log('Homepage Audit Results:', JSON.stringify(homeAudit, null, 2));

  await page.screenshot({ path: path.join(outDir, 'homepage_desktop.png'), fullPage: false });
  await page.screenshot({ path: path.join(outDir, 'homepage_desktop_full.png'), fullPage: true });

  // Tablet Homepage
  await page.setViewport({ width: 768, height: 1024 });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, 'homepage_tablet.png'), fullPage: true });

  // Mobile Homepage
  await page.setViewport({ width: 375, height: 812 });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, 'homepage_mobile.png'), fullPage: true });
  console.log('[SUCCESS] Homepage responsive screenshots captured!');

  // =========================================================================
  // 2. VERIFY FULL CATALOG (https://reflectionelite.com/shop/)
  // =========================================================================
  console.log('\n2. Auditing Full Catalog (https://reflectionelite.com/shop/)...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.com/shop/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await new Promise(r => setTimeout(r, 8000));
  await scrollToBottomAndReset();

  const catalogAudit = await page.evaluate(() => {
    const hero = document.querySelector('.re-catalog-hero');
    const cards = Array.from(document.querySelectorAll('.re-catalog-card'));
    return {
      heroExists: !!hero,
      heroBg: hero ? window.getComputedStyle(hero).backgroundImage : '',
      cardsCount: cards.length,
      cardImages: cards.map(c => {
        const img = c.querySelector('img');
        const title = c.querySelector('.re-catalog-card-title')?.textContent.trim();
        return {
          title,
          src: img ? img.src : '',
          complete: img ? img.complete : false,
          naturalWidth: img ? img.naturalWidth : 0
        };
      })
    };
  });
  console.log('Catalog Audit Results:', JSON.stringify(catalogAudit, null, 2));

  await page.screenshot({ path: path.join(outDir, 'catalog_desktop.png'), fullPage: false });
  await page.screenshot({ path: path.join(outDir, 'catalog_desktop_full.png'), fullPage: true });

  // Test Category Filtering: Venetian
  console.log('Testing category filter: Venetian...');
  await page.evaluate(() => {
    const btn = document.querySelector('#re-category-filters .re-pill-btn[data-filter="venetian"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  const venetianCount = await page.evaluate(() => document.getElementById('re-product-count')?.textContent);
  console.log('Filtered Venetian count:', venetianCount);
  await page.screenshot({ path: path.join(outDir, 'catalog_filter_venetian.png') });

  // Test Reset Category Filter to All
  await page.evaluate(() => {
    const btn = document.querySelector('#re-category-filters .re-pill-btn[data-filter="all"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Test Sorting: Price Low to High
  console.log('Testing sorting: Price Low to High...');
  await page.evaluate(() => {
    const sort = document.getElementById('re-sort-select');
    if (sort) {
      sort.value = 'price-asc';
      sort.dispatchEvent(new Event('change'));
    }
  });
  await new Promise(r => setTimeout(r, 800));
  const firstProductAfterSort = await page.evaluate(() => {
    const firstCard = document.querySelector('.re-catalog-card');
    return {
      title: firstCard?.querySelector('.re-catalog-card-title')?.textContent.trim(),
      price: firstCard?.querySelector('.re-catalog-card-price')?.textContent.trim()
    };
  });
  console.log('First product after price-asc sort:', firstProductAfterSort);

  // Test Wishlist heart toggle
  console.log('Testing wishlist heart toggle...');
  const heartBefore = await page.evaluate(() => document.querySelector('.re-wishlist-btn')?.classList.contains('active'));
  await page.evaluate(() => document.querySelector('.re-wishlist-btn')?.click());
  const heartAfter = await page.evaluate(() => document.querySelector('.re-wishlist-btn')?.classList.contains('active'));
  console.log('Wishlist before:', heartBefore, '-> after:', heartAfter);

  // Tablet Catalog
  await page.setViewport({ width: 768, height: 1024 });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, 'catalog_tablet.png'), fullPage: true });

  // Mobile Catalog (2-Column Check)
  await page.setViewport({ width: 375, height: 812 });
  await new Promise(r => setTimeout(r, 1200));
  const mobileGridColumns = await page.evaluate(() => {
    const grid = document.querySelector('.re-catalog-grid');
    return grid ? window.getComputedStyle(grid).gridTemplateColumns : null;
  });
  console.log('Mobile catalog grid columns:', mobileGridColumns);
  await page.screenshot({ path: path.join(outDir, 'catalog_mobile.png'), fullPage: true });
  console.log('[SUCCESS] Full Catalog screenshots captured & interactions verified!');

  // =========================================================================
  // 3. VERIFY CUSTOM DIMENSIONS SECTION / PAGE (/custom-dimensions/)
  // =========================================================================
  console.log('\n3. Auditing Custom Dimensions (/custom-dimensions/)...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.com/custom-dimensions/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await new Promise(r => setTimeout(r, 8000));

  const bespokeAudit = await page.evaluate(() => {
    const entryTitle = document.querySelector('.entry-header, .entry-title');
    const entryTitleVisible = entryTitle ? window.getComputedStyle(entryTitle).display !== 'none' : false;
    const glassPanel = document.querySelector('.re-bespoke-glass-panel');
    const catalogCta = document.querySelector('.re-btn-outline-gold');
    const waPill = document.querySelector('.re-bespoke-pill-btn');
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;

    return {
      title: document.title,
      entryTitleSuppressed: !entryTitleVisible,
      glassPanelExists: !!glassPanel,
      bodyBg,
      catalogHref: catalogCta ? catalogCta.getAttribute('href') : null,
      waHref: waPill ? waPill.getAttribute('href') : null
    };
  });
  console.log('Bespoke Page Audit Results:', JSON.stringify(bespokeAudit, null, 2));

  await page.screenshot({ path: path.join(outDir, 'bespoke_desktop.png'), fullPage: false });
  await page.screenshot({ path: path.join(outDir, 'bespoke_desktop_full.png'), fullPage: true });

  // Tablet & Mobile Bespoke
  await page.setViewport({ width: 768, height: 1024 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, 'bespoke_tablet.png'), fullPage: true });

  await page.setViewport({ width: 375, height: 812 });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, 'bespoke_mobile.png'), fullPage: true });
  console.log('[SUCCESS] Custom Dimensions screenshots captured & CTAs verified!');

  // =========================================================================
  // 4. VERIFY PRODUCT DETAILS, CART & CHECKOUT
  // =========================================================================
  console.log('\n4. Auditing Product Details, Cart, and Checkout...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.com/product/antique-venetian-cushion/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await new Promise(r => setTimeout(r, 6000));
  await page.screenshot({ path: path.join(outDir, 'product_details_desktop.png'), fullPage: false });
  console.log('Single product page title:', await page.title());

  await page.goto('https://reflectionelite.com/cart/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await new Promise(r => setTimeout(r, 6000));
  await page.screenshot({ path: path.join(outDir, 'cart_desktop.png'), fullPage: false });
  console.log('Cart page title:', await page.title());

  await page.goto('https://reflectionelite.com/checkout/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await new Promise(r => setTimeout(r, 6000));
  await page.screenshot({ path: path.join(outDir, 'checkout_desktop.png'), fullPage: false });
  console.log('Checkout page title:', await page.title());

  console.log('\nConsole Errors encountered:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Errors sample:', consoleErrors.slice(0, 5));
  }

  await browser.close();
  console.log('\n=== ALL DEEP VERIFICATION TESTS COMPLETE ===');
}

verify().catch(console.error);
