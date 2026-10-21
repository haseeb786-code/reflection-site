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

async function testHeader() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

  console.log('=== 1. TESTING DESKTOP VIEW (1440px) ===');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.ataanalytiq.com/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const desktopData = await page.evaluate(() => {
    return {
      marqueeText: document.querySelector('.re-marquee-track')?.innerText?.slice(0, 100),
      hasLogo: !!document.querySelector('.re-main-logo-img'),
      hasHamburger: !!document.querySelector('#reHamburgerBtn'),
      hasCart: !!document.querySelector('.re-cart-link'),
      announcement: document.querySelector('.re-announcement-strip')?.innerText?.trim(),
      hasDesktopNav: !!document.querySelector('.re-nav-row-desktop'),
      desktopNavDisplay: window.getComputedStyle(document.querySelector('.re-nav-row-desktop')).display,
      hasBookSurveyBtn: !!document.querySelector('.re-book-survey-btn'),
      bookSurveyHref: document.querySelector('.re-book-survey-btn')?.getAttribute('href')
    };
  });
  console.log('Desktop Evaluation:', JSON.stringify(desktopData, null, 2));
  await saveScreenshot(page, 'staging_desktop_header_verified.png');

  console.log('\n=== 2. TESTING MOBILE VIEW (375px) - COLLAPSED ===');
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('https://reflectionelite.ataanalytiq.com/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const mobileCollapsed = await page.evaluate(() => {
    const bodyWidth = document.body.clientWidth;
    const scrollWidth = document.body.scrollWidth;
    const desktopNavDisplay = window.getComputedStyle(document.querySelector('.re-nav-row-desktop')).display;
    const drawerOpen = document.querySelector('#reMobileDrawer')?.classList.contains('is-open');
    return {
      bodyWidth,
      scrollWidth,
      hasHorizontalOverflow: scrollWidth > bodyWidth,
      desktopNavDisplay,
      drawerOpen
    };
  });
  console.log('Mobile Collapsed Evaluation:', JSON.stringify(mobileCollapsed, null, 2));
  await saveScreenshot(page, 'staging_mobile_375_collapsed.png');

  console.log('\n=== 3. TESTING MOBILE VIEW (375px) - EXPANDED OPEN MENU ===');
  // Click the hamburger button
  await page.click('#reHamburgerBtn');
  await new Promise(r => setTimeout(r, 600));

  const mobileExpanded = await page.evaluate(() => {
    const drawer = document.querySelector('#reMobileDrawer');
    const isDrawerOpen = drawer?.classList.contains('is-open');
    const links = Array.from(drawer?.querySelectorAll('.re-mobile-link, .re-mobile-cta-btn') || []).map(a => {
      const rect = a.getBoundingClientRect();
      return {
        text: a.innerText.trim(),
        href: a.getAttribute('href'),
        height: Math.round(rect.height),
        width: Math.round(rect.width)
      };
    });
    const bodyWidth = document.body.clientWidth;
    const scrollWidth = document.body.scrollWidth;
    return {
      isDrawerOpen,
      linksCount: links.length,
      links,
      hasHorizontalOverflow: scrollWidth > bodyWidth
    };
  });
  console.log('Mobile Expanded Evaluation:', JSON.stringify(mobileExpanded, null, 2));
  await saveScreenshot(page, 'staging_mobile_375_expanded.png');

  console.log('\n=== 4. TESTING MOBILE VIEW (390px) ===');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('https://reflectionelite.ataanalytiq.com/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  await saveScreenshot(page, 'staging_mobile_390_collapsed.png');

  await page.click('#reHamburgerBtn');
  await new Promise(r => setTimeout(r, 600));
  await saveScreenshot(page, 'staging_mobile_390_expanded.png');

  await browser.close();
  console.log('\n✓ Staging Header Verification Complete!');
}

testHeader().catch(console.error);
