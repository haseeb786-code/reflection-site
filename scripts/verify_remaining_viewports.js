import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = './audit_mobile_screenshots/verified';

const VIEWPORTS = [
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

async function runRemaining() {
  for (const vp of VIEWPORTS) {
    console.log(`\n=================== TESTING VIEWPORT: ${vp.name} (${vp.width}x${vp.height}) ===================`);
    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    for (const p of PAGES) {
      console.log(`\nNavigating to ${p.name.toUpperCase()} (${p.url})...`);
      const page = await browser.newPage();
      await page.setViewport({ width: vp.width, height: vp.height });
      if (vp.width <= 768) {
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1');
      }

      try {
        await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await new Promise(r => setTimeout(r, 6500));

        const overflow = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
        }));

        console.log(` - [OVERFLOW CHECK] scrollWidth: ${overflow.scrollWidth}px, clientWidth: ${overflow.clientWidth}px, overflow: ${overflow.hasOverflow ? 'FAILED' : 'PASSED (0px overflow)'}`);

        if (vp.name === '1280px_desktop' && p.name === 'home') {
          const desktopStyles = await page.evaluate(() => {
            const scrollTop = document.querySelector('#ast-scroll-top');
            const stCs = scrollTop ? window.getComputedStyle(scrollTop) : null;
            const heroContent = document.querySelector('.re-hero-content');
            const hCs = heroContent ? window.getComputedStyle(heroContent) : null;
            return {
              scrollTopBg: stCs ? stCs.backgroundColor : null,
              scrollTopColor: stCs ? stCs.color : null,
              heroContentBg: hCs ? hCs.backgroundColor : null
            };
          });
          console.log(' - [DESKTOP PRESERVATION CHECK]', JSON.stringify(desktopStyles));
        }

        const screenshotPath = path.join(SCREENSHOTS_DIR, `${p.name}_${vp.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(` - Saved verified screenshot: ${screenshotPath}`);
      } catch (err) {
        console.error(`Error on ${p.name} ${vp.name}:`, err.message);
      } finally {
        await page.close().catch(() => {});
      }
    }

    await browser.close().catch(() => {});
  }

  console.log('\n================================================================');
  console.log('  REMAINING VIEWPORTS COMPLETED!                                ');
  console.log('================================================================\n');
}

runRemaining().catch(console.error);
