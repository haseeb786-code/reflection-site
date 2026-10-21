const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  // Navigate and wait for all redirects to settle
  await page.goto('https://reflectionelite.com', { waitUntil: 'load', timeout: 60000 });
  // Wait extra for scripts/redirects
  await new Promise(r => setTimeout(r, 5000));
  
  // Current URL after redirects
  const currentUrl = page.url();
  console.log('Current URL:', currentUrl);

  // Take screenshot first
  await page.screenshot({ path: 'diag_1440_current.png', fullPage: false });
  console.log('Screenshot saved: diag_1440_current.png');

  // Get hero/slider area HTML
  try {
    const heroHTML = await page.evaluate(() => {
      const main = document.querySelector('.site-main') 
        || document.querySelector('#main') 
        || document.querySelector('.entry-content')
        || document.querySelector('#content');
      if (main) return main.innerHTML.substring(0, 6000);
      return document.body.innerHTML.substring(0, 6000);
    });
    console.log('\n=== MAIN CONTENT (first 6000 chars) ===\n');
    console.log(heroHTML);
  } catch(e) {
    console.log('Error getting HTML:', e.message);
  }

  // Also check for the carousel box using broader selector
  try {
    const sliderInfo = await page.evaluate(() => {
      const selectors = [
        '.re-carousel-box', '#reHeroCarousel', '.re-hero-section',
        '.slider', '.hero-slider', '.swiper', '.carousel',
        '[class*="carousel"]', '[class*="slider"]', '[class*="hero"]'
      ];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) {
          const rect = el.getBoundingClientRect();
          return {
            found: sel,
            tag: el.tagName,
            id: el.id,
            className: (el.className || '').toString().substring(0, 200),
            rect: { left: Math.round(rect.left), width: Math.round(rect.width), right: Math.round(rect.right), height: Math.round(rect.height) },
            outerHTMLStart: el.outerHTML.substring(0, 400)
          };
        }
      }
      return { found: 'NONE' };
    });
    console.log('\n=== SLIDER ELEMENT SEARCH ===');
    console.log(JSON.stringify(sliderInfo, null, 2));
  } catch(e) {
    console.log('Error:', e.message);
  }

  await browser.close();
})();
