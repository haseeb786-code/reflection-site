import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const VIEWPORTS = [
  { width: 320, height: 640, name: '320px (iPhone SE 1st gen)' },
  { width: 360, height: 740, name: '360px (Android small)' },
  { width: 375, height: 812, name: '375px (iPhone mini/SE2)' },
  { width: 390, height: 844, name: '390px (iPhone 12/13/14)' },
  { width: 414, height: 896, name: '414px (iPhone Plus/XR)' },
  { width: 430, height: 932, name: '430px (iPhone Pro Max)' },
  { width: 1440, height: 900, name: '1440px (Desktop)' }
];

const PAGES = [
  { name: 'Home', url: 'https://reflectionelite.com/' },
  { name: 'Shop', url: 'https://reflectionelite.com/shop/' },
  { name: 'Bespoke', url: 'https://reflectionelite.com/custom-dimensions/' },
  { name: 'About Us / Story', url: 'https://reflectionelite.com/about-us/' },
  { name: 'Our Story (alt)', url: 'https://reflectionelite.com/our-story/' },
  { name: 'Contact', url: 'https://reflectionelite.com/contact/' }
];

async function diagnose() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1');

  for (const vp of VIEWPORTS.slice(0, 3)) { // 320, 360, 375
    console.log(`\n=================== VIEWPORT: ${vp.name} ===================`);
    await page.setViewport({ width: vp.width, height: vp.height });

    for (const p of PAGES) {
      try {
        const resp = await page.goto(p.url, { waitUntil: 'networkidle2', timeout: 25000 });
        if (resp.status() === 404) {
          console.log(`[404] ${p.name} (${p.url}) not found, skipping.`);
          continue;
        }

        await new Promise(r => setTimeout(r, 1500));

        const diagnostics = await page.evaluate((vpWidth) => {
          const docScroll = document.documentElement.scrollWidth;
          const docClient = document.documentElement.clientWidth;
          const bodyScroll = document.body.scrollWidth;

          // Find elements that exceed clientWidth
          const overflowingElements = [];
          const allEls = document.querySelectorAll('*');
          for (const el of allEls) {
            const rect = el.getBoundingClientRect();
            if (rect.right > vpWidth + 1.5 || rect.width > vpWidth + 1.5) {
              const tag = el.tagName.toLowerCase();
              const cls = el.className ? (typeof el.className === 'string' ? el.className.split(' ').slice(0, 3).join('.') : '') : '';
              const id = el.id ? `#${el.id}` : '';
              overflowingElements.push({
                element: `${tag}${id}${cls ? '.' + cls : ''}`,
                rectWidth: Math.round(rect.width),
                rectRight: Math.round(rect.right),
                textSnippet: el.innerText ? el.innerText.substring(0, 30).trim() : ''
              });
            }
          }

          // Specific element checks
          const scrollBtn = document.querySelector('#ast-scroll-top');
          const scrollBtnStyle = scrollBtn ? window.getComputedStyle(scrollBtn) : null;

          const studioCard = document.querySelector('.re-story-studio-card');
          const studioCardRect = studioCard ? studioCard.getBoundingClientRect() : null;
          const studioButtons = studioCard ? Array.from(studioCard.querySelectorAll('a, button')).map(b => {
            const bRect = b.getBoundingClientRect();
            return {
              text: b.innerText.substring(0, 25),
              top: Math.round(bRect.top),
              bottom: Math.round(bRect.bottom),
              cardBottom: studioCardRect ? Math.round(studioCardRect.bottom) : null,
              overflowsCard: studioCardRect ? bRect.bottom > studioCardRect.bottom : false
            };
          }) : [];

          return {
            docScroll,
            docClient,
            bodyScroll,
            hasOverflow: docScroll > docClient,
            overflowDelta: docScroll - docClient,
            overflowingElementsCount: overflowingElements.length,
            topOverflowing: overflowingElements.slice(0, 6),
            scrollBtnInfo: scrollBtn ? {
              display: scrollBtnStyle.display,
              bg: scrollBtnStyle.backgroundColor,
              color: scrollBtnStyle.color,
              bottom: scrollBtnStyle.bottom,
              right: scrollBtnStyle.right
            } : 'Not found',
            studioButtons
          };
        }, vp.width);

        console.log(`[${p.name}] ScrollWidth: ${diagnostics.docScroll}px vs ClientWidth: ${diagnostics.docClient}px (Overflow: ${diagnostics.hasOverflow ? `YES +${diagnostics.overflowDelta}px` : 'NO'})`);
        if (diagnostics.hasOverflow) {
          console.log(`  Top overflowing elements:`, diagnostics.topOverflowing);
        }
        if (diagnostics.studioButtons.length > 0) {
          console.log(`  Studio Card Buttons:`, diagnostics.studioButtons);
        }
        if (diagnostics.scrollBtnInfo) {
          console.log(`  Scroll-to-top button:`, diagnostics.scrollBtnInfo);
        }

      } catch (err) {
        console.error(`Error on ${p.name}:`, err.message);
      }
    }
  }

  await browser.close();
}

diagnose().catch(console.error);
