import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const STAGING_URL = 'https://reflectionelite.ataanalytiq.com/staging-home/?demo=1';
const LIVE_URL = 'https://reflectionelite.ataanalytiq.com/';

async function verify() {
  console.log('Launching browser for verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1440,900',
      '--host-rules=MAP reflectionelite.ataanalytiq.com 191.101.228.14'
    ]
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  fs.mkdirSync('demo_evidence', { recursive: true });

  // 1. Verify Live Homepage Untouched
  console.log('--- 1. Verifying Live Site Untouched ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(LIVE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  const liveTitle = await page.title();
  const liveBodyText = await page.evaluate(() => document.body.innerText.slice(0, 200));
  console.log('Live Title:', liveTitle);
  console.log('Live Snippet:', liveBodyText.replace(/\s+/g, ' '));
  await page.screenshot({ path: 'demo_evidence/live_site_verified_untouched.png' });

  // 2. Load Staging Homepage on Desktop
  console.log('\n--- 2. Auditing Staging Homepage (Desktop 1440px) ---');
  await page.goto(STAGING_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  // Verify Font on Staging
  const fontAudit = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const h2 = document.querySelector('h2');
    const navLink = document.querySelector('.nav-link');
    const bannerHeading = document.querySelector('.banner-heading');
    const sectionHeading = document.querySelector('.section-heading');
    const bodyP = document.querySelector('p');

    const getComp = (el) => el ? window.getComputedStyle(el).fontFamily : 'not found';

    return {
      h1Font: getComp(h1),
      h2Font: getComp(h2),
      navFont: getComp(navLink),
      bannerFont: getComp(bannerHeading),
      sectionTitleFont: getComp(sectionHeading),
      bodyFont: getComp(bodyP)
    };
  });
  console.log('Computed Font Families on Staging:', fontAudit);

  // Desktop Full Page Screenshot
  console.log('Capturing Desktop Fullpage Screenshot...');
  await page.screenshot({ path: 'demo_evidence/staging_desktop_fullpage.png', fullPage: true });

  // Section-by-section Screenshots (Desktop)
  const sections = [
    { id: '#cycle-1', name: '01_hero_banner' },
    { id: '#grid-1', name: '02_grid_signature_collections' },
    { id: '#cycle-2', name: '03_banner_shower_systems' },
    { id: '#grid-2', name: '04_grid_structural_glazing' },
    { id: '#cycle-3', name: '05_banner_artisan_textures' },
    { id: '#grid-3', name: '06_grid_artisan_finishes' },
    { id: '#cycle-4', name: '07_banner_custom_dimensions' },
    { id: '.trust-bar', name: '08_trust_pillars' },
    { id: '.site-footer', name: '09_footer' }
  ];

  for (const sec of sections) {
    const el = await page.$(sec.id);
    if (el) {
      await el.screenshot({ path: `demo_evidence/staging_section_${sec.name}.png` });
      console.log(`Saved screenshot: demo_evidence/staging_section_${sec.name}.png`);
    } else {
      console.warn(`Could not find section ${sec.id}`);
    }
  }

  // 3. Tablet Responsive Check (768px)
  console.log('\n--- 3. Tablet Responsive Check (768px) ---');
  await page.setViewport({ width: 768, height: 1024 });
  await page.goto(STAGING_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  
  const tabletGridCols = await page.evaluate(() => {
    const grid = document.querySelector('.tiles-grid');
    if (!grid) return 'no grid';
    return window.getComputedStyle(grid).gridTemplateColumns;
  });
  console.log('Tablet Grid Template Columns:', tabletGridCols);
  await page.screenshot({ path: 'demo_evidence/staging_tablet_768px.png', fullPage: true });

  // 4. Mobile Responsive Check (390px - iPhone 14)
  console.log('\n--- 4. Mobile Responsive Check (390px) ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(STAGING_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const mobileMetrics = await page.evaluate(() => {
    const grid = document.querySelector('.tiles-grid');
    const cols = grid ? window.getComputedStyle(grid).gridTemplateColumns : 'none';
    const bodyWidth = document.body.scrollWidth;
    const windowWidth = window.innerWidth;
    const hasHorizontalScroll = bodyWidth > windowWidth;
    return { cols, bodyWidth, windowWidth, hasHorizontalScroll };
  });
  console.log('Mobile Metrics:', mobileMetrics);
  await page.screenshot({ path: 'demo_evidence/staging_mobile_390px.png', fullPage: true });

  await browser.close();
  console.log('\nVerification complete! All evidence saved to demo_evidence/');
}

verify().catch(console.error);
