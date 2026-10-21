import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\414d7e40-4d4d-49c9-8868-01c3c84a4783';

async function saveScreenshot(page, filename) {
  const localPath = path.resolve(filename);
  const artifactPath = path.join(ARTIFACT_DIR, filename);
  await page.screenshot({ path: localPath, fullPage: false });
  try {
    fs.copyFileSync(localPath, artifactPath);
  } catch (e) {
    console.error('Error copying artifact:', e.message);
  }
  console.log(`✓ Screenshot saved: ${filename}`);
}

async function testViewport(page, url, width, height, label, prefix) {
  await page.setViewport({ width, height });
  console.log(`\n======================================================`);
  console.log(`Testing ${label} at ${width}x${height} (${url})`);
  console.log(`======================================================`);
  const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 3500));

  // Evaluate metrics on the page
  const metrics = await page.evaluate(() => {
    const bodyWidth = document.body.clientWidth;
    const bodyScrollWidth = document.body.scrollWidth;
    const htmlScrollWidth = document.documentElement.scrollWidth;
    const hasHorizontalOverflow = bodyScrollWidth > bodyWidth || htmlScrollWidth > bodyWidth;

    // Find grid containers
    const gridSelectors = [
      '.catalog-grid-4',
      '.catalog-grid',
      '.shop-catalog-grid',
      '.re-featured-products-grid',
      '.woocommerce ul.products',
      '.related.products ul.products'
    ];

    const grids = [];
    gridSelectors.forEach(sel => {
      const els = document.querySelectorAll(sel);
      els.forEach((el, idx) => {
        const computed = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        const children = el.children;
        const childRects = [];
        for (let i = 0; i < Math.min(children.length, 4); i++) {
          const cRect = children[i].getBoundingClientRect();
          childRects.push({
            tag: children[i].tagName,
            className: (children[i].className || '').slice(0, 30),
            top: Math.round(cRect.top),
            left: Math.round(cRect.left),
            width: Math.round(cRect.width),
            height: Math.round(cRect.height)
          });
        }
        grids.push({
          selector: sel,
          index: idx,
          display: computed.display,
          gridTemplateColumns: computed.gridTemplateColumns,
          width: Math.round(rect.width),
          childCount: children.length,
          firstFewChildren: childRects
        });
      });
    });

    return {
      bodyWidth,
      bodyScrollWidth,
      htmlScrollWidth,
      hasHorizontalOverflow,
      grids
    };
  });

  console.log(`Status: ${res.status()}`);
  console.log(`Body clientWidth: ${metrics.bodyWidth}px, scrollWidth: ${metrics.bodyScrollWidth}px, htmlScrollWidth: ${metrics.htmlScrollWidth}px`);
  console.log(`Horizontal overflow check: ${metrics.hasHorizontalOverflow ? 'FAIL - HAS HORIZONTAL OVERFLOW' : 'PASS - PERFECT FIT (ZERO OVERFLOW)'}`);
  console.log(`Found ${metrics.grids.length} grid instances:`);
  metrics.grids.forEach(g => {
    console.log(`  Selector: ${g.selector}[${g.index}]`);
    console.log(`    Computed gridTemplateColumns: "${g.gridTemplateColumns}"`);
    console.log(`    Total children: ${g.childCount}`);
    if (g.firstFewChildren.length >= 2) {
      const c1 = g.firstFewChildren[0];
      const c2 = g.firstFewChildren[1];
      const sameRow = Math.abs(c1.top - c2.top) < 20;
      console.log(`    Card 1 width: ${c1.width}px, Card 2 width: ${c2.width}px`);
      console.log(`    Cards side-by-side: ${sameRow ? 'YES (Multi-column)' : 'NO (Stacked vertically in single column)'}`);
    }
  });

  // Scroll down so product cards are prominently in view
  await page.evaluate(() => {
    const target = document.querySelector('.catalog-grid-4, .catalog-grid, .shop-catalog-grid, .luxury-card, .re-featured-products-grid, .related.products');
    if (target) {
      target.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  await saveScreenshot(page, `${prefix}_${width}.png`);
  return metrics;
}

async function run() {
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
  const page = await context.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  try {
    // 1. Shop Page at 375px (iPhone SE), 390px (iPhone 12/13/14), 820px (iPad), 1280px (Desktop)
    await testViewport(page, 'https://reflectionelite.com/shop/', 375, 812, 'Shop Page Mobile 375px', 'mobile_shop');
    await testViewport(page, 'https://reflectionelite.com/shop/', 390, 844, 'Shop Page Mobile 390px', 'mobile_shop');
    await testViewport(page, 'https://reflectionelite.com/shop/', 820, 1180, 'Shop Page Tablet 820px', 'tablet_shop');
    await testViewport(page, 'https://reflectionelite.com/shop/', 1280, 900, 'Shop Page Desktop 1280px', 'desktop_shop');

    // 2. Home Page at 375px and 390px
    await testViewport(page, 'https://reflectionelite.com/', 375, 812, 'Home Page Mobile 375px', 'mobile_home');
    await testViewport(page, 'https://reflectionelite.com/', 390, 844, 'Home Page Mobile 390px', 'mobile_home');

    // 3. Single Product Page
    await testViewport(page, 'https://reflectionelite.com/product/silver-crown-framed/', 375, 812, 'Single Product Mobile 375px', 'mobile_product');
    await testViewport(page, 'https://reflectionelite.com/product/silver-crown-framed/', 820, 1180, 'Single Product Tablet 820px', 'tablet_product');
  } catch (err) {
    console.error('Error during responsive verification:', err);
  } finally {
    await browser.close();
  }
}

run();
