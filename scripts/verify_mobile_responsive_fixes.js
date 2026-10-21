import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = './audit_mobile_screenshots/verified';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: '320px', width: 320, height: 640 },
  { name: '360px', width: 360, height: 740 },
  { name: '375px', width: 375, height: 812 },
  { name: '390px', width: 390, height: 844 },
  { name: '414px', width: 414, height: 896 },
  { name: '430px', width: 430, height: 932 },
  { name: '1280px_desktop', width: 1280, height: 800 }
];

const PAGES = [
  { name: 'home', url: 'https://reflectionelite.com/' },
  { name: 'shop', url: 'https://reflectionelite.com/shop/' },
  { name: 'bespoke', url: 'https://reflectionelite.com/custom-dimensions/' },
  { name: 'story', url: 'https://reflectionelite.com/about-us/' },
  { name: 'contact', url: 'https://reflectionelite.com/contact/' }
];

async function loadPageWithRetry(browser, url, vp) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height });
  if (vp.width <= 768) {
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1');
  }

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 6500)); // allow cloudflare challenge & dynamic JS injection to complete
  return page;
}

async function runComprehensiveVerification() {
  console.log('================================================================');
  console.log('  STARTING DEEP MULTI-VIEWPORT RESPONSIVE VERIFICATION SUITE    ');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const verificationResults = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n=================== TESTING VIEWPORT: ${vp.name} (${vp.width}x${vp.height}) ===================`);

    for (const p of PAGES) {
      console.log(`\nNavigating to ${p.name.toUpperCase()} (${p.url})...`);
      let page;
      try {
        page = await loadPageWithRetry(browser, p.url, vp);

        // 1. Check Horizontal Overflow
        const overflow = await page.evaluate(() => {
          return {
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
            bodyScrollWidth: document.body.scrollWidth
          };
        });

        console.log(` - [OVERFLOW CHECK] scrollWidth: ${overflow.scrollWidth}px, clientWidth: ${overflow.clientWidth}px, overflow: ${overflow.hasOverflow ? 'FAILED' : 'PASSED (0px overflow)'}`);

        // Page specific deep verifications
        let pageDetails = {};

        if (p.name === 'home') {
          pageDetails = await page.evaluate(() => {
            const heroContent = document.querySelector('.re-hero-content');
            const heroCs = heroContent ? window.getComputedStyle(heroContent) : null;
            const ctaLink = document.querySelector('.re-btn-link');
            const ctaCs = ctaLink ? window.getComputedStyle(ctaLink) : null;
            const announcement = document.querySelector('.re-top-announcement');
            const annCs = announcement ? window.getComputedStyle(announcement) : null;
            const scrollTopBtn = document.querySelector('#ast-scroll-top');
            const stCs = scrollTopBtn ? window.getComputedStyle(scrollTopBtn) : null;
            const siteTitle = document.querySelector('.site-title a, .ast-site-title a');
            const stitleCs = siteTitle ? window.getComputedStyle(siteTitle) : null;

            return {
              heroContentBg: heroCs ? heroCs.backgroundColor : null,
              heroContentBackdrop: heroCs ? (heroCs.backdropFilter || heroCs.webkitBackdropFilter) : null,
              ctaLinkBg: ctaCs ? ctaCs.backgroundColor : null,
              ctaLinkBorder: ctaCs ? ctaCs.borderColor : null,
              ctaLinkColor: ctaCs ? ctaCs.color : null,
              announcementDisplay: annCs ? annCs.display : null,
              announcementText: announcement ? announcement.innerText.replace(/\s+/g, ' ') : null,
              scrollTopDisplay: stCs ? stCs.display : null,
              scrollTopBg: stCs ? stCs.backgroundColor : null,
              siteTitleFontSize: stitleCs ? stitleCs.fontSize : null,
              siteTitleWhiteSpace: stitleCs ? stitleCs.whiteSpace : null
            };
          });
          console.log(' - [HOME HERO CHECK]', JSON.stringify(pageDetails));
        }

        if (p.name === 'shop') {
          pageDetails = await page.evaluate(() => {
            const pillsWrap = document.querySelector('#re-category-filters');
            const pillsCs = pillsWrap ? window.getComputedStyle(pillsWrap) : null;
            const cards = Array.from(document.querySelectorAll('.re-catalog-card'));
            const cardInfo = cards.map(c => {
              const btn = c.querySelector('.re-btn-action');
              const title = c.querySelector('.re-catalog-card-title');
              const r = c.getBoundingClientRect();
              const br = btn ? btn.getBoundingClientRect() : null;
              return {
                title: title ? title.innerText : null,
                btnText: btn ? btn.innerText : null,
                btnClass: btn ? btn.className : null,
                cardHeight: r.height,
                btnBottom: br ? br.bottom : null,
                cardBottom: r.bottom,
                btnMarginFromBottom: br ? Math.round(r.bottom - br.bottom) : null
              };
            });

            return {
              pillsOverflowX: pillsCs ? pillsCs.overflowX : null,
              pillsFlexWrap: pillsCs ? pillsCs.flexWrap : null,
              cardCount: cards.length,
              sampleCards: cardInfo.slice(0, 4)
            };
          });
          console.log(' - [SHOP CATALOG CHECK]', JSON.stringify(pageDetails));
        }

        if (p.name === 'story') {
          pageDetails = await page.evaluate(() => {
            const card = document.querySelector('.re-story-studio-card');
            if (!card) return { found: false };
            const cardRect = card.getBoundingClientRect();
            const btns = Array.from(card.querySelectorAll('.re-studio-btn-group a')).map(a => {
              const r = a.getBoundingClientRect();
              return {
                text: a.innerText,
                top: Math.round(r.top),
                bottom: Math.round(r.bottom),
                left: Math.round(r.left),
                right: Math.round(r.right),
                height: Math.round(r.height),
                width: Math.round(r.width),
                overflowsBottom: r.bottom > cardRect.bottom + 1,
                overflowsRight: r.right > cardRect.right + 1,
                overflowsLeft: r.left < cardRect.left - 1
              };
            });

            return {
              found: true,
              cardRect: {
                top: Math.round(cardRect.top),
                bottom: Math.round(cardRect.bottom),
                left: Math.round(cardRect.left),
                right: Math.round(cardRect.right),
                width: Math.round(cardRect.width),
                height: Math.round(cardRect.height)
              },
              btns,
              anyOverflow: btns.some(b => b.overflowsBottom || b.overflowsRight || b.overflowsLeft)
            };
          });
          console.log(' - [GOA ATELIER CARD CHECK]', JSON.stringify(pageDetails));
        }

        if (p.name === 'bespoke') {
          pageDetails = await page.evaluate(() => {
            const wrap = document.querySelector('.re-bespoke-catalog-link-wrap');
            const panel = document.querySelector('.re-bespoke-glass-panel');
            const pill = document.querySelector('.re-bespoke-pill-btn');
            const docW = document.documentElement.clientWidth;

            const checkEl = (el, name) => {
              if (!el) return null;
              const r = el.getBoundingClientRect();
              return {
                name,
                width: Math.round(r.width),
                right: Math.round(r.right),
                overflows: r.right > docW + 1
              };
            };

            return {
              catalogLinkWrap: checkEl(wrap, 'catalogLinkWrap'),
              glassPanel: checkEl(panel, 'glassPanel'),
              pillBtn: checkEl(pill, 'pillBtn')
            };
          });
          console.log(' - [BESPOKE ELEMENTS CHECK]', JSON.stringify(pageDetails));
        }

        // Save high-resolution screenshot
        const screenshotPath = path.join(SCREENSHOTS_DIR, `${p.name}_${vp.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(` - Saved verified screenshot: ${screenshotPath}`);

        verificationResults.push({
          page: p.name,
          viewport: vp.name,
          width: vp.width,
          overflowPassed: !overflow.hasOverflow,
          scrollWidth: overflow.scrollWidth,
          clientWidth: overflow.clientWidth,
          details: pageDetails,
          screenshot: screenshotPath
        });

      } catch (err) {
        console.error(`Error verifying ${p.name} on ${vp.name}:`, err.message);
        verificationResults.push({
          page: p.name,
          viewport: vp.name,
          error: err.message
        });
      } finally {
        if (page) {
          await page.close().catch(() => {});
        }
      }
    }
  }

  await browser.close();

  fs.writeFileSync('./data/mobile_verification_results.json', JSON.stringify(verificationResults, null, 2));
  console.log('\n================================================================');
  console.log('  ALL VIEWPORT VERIFICATIONS COMPLETE! DATA SAVED TO JSON.       ');
  console.log('================================================================\n');
}

runComprehensiveVerification().catch(console.error);
