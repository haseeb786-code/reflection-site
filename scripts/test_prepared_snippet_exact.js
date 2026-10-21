import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  const fullSnippet = fs.readFileSync('snippet_te_hero_ticker_slider_v2.html', 'utf8');
  // Separate style and script
  const styleMatch = fullSnippet.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const snippetCss = styleMatch ? styleMatch[1] : '';

  const viewports = [
    { name: 'desktop_1920', width: 1920, height: 1080 },
    { name: 'desktop_1440', width: 1440, height: 900 },
    { name: 'laptop_1280_720', width: 1280, height: 720 },
    { name: 'mobile_390', width: 390, height: 844 },
    { name: 'mobile_375', width: 375, height: 667 }
  ];

  for (const vp of viewports) {
    console.log(`\nTesting Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('https://reflectionelite.com/?nocache=' + Date.now(), { waitUntil: 'domcontentloaded' });

    // Inject snippet CSS and ensure overlay HTML is present
    await page.evaluate((css) => {
      let st = document.getElementById('te-hero-ticker-slider-v2-css');
      if (!st) {
        st = document.createElement('style');
        st.id = 'te-hero-ticker-slider-v2-css';
        document.head.appendChild(st);
      }
      st.innerHTML = css;
    }, snippetCss);

    await new Promise(r => setTimeout(r, 600));

    // Verify box model and scrollbar
    const metrics = await page.evaluate(() => {
      const box = document.querySelector('.re-carousel-box');
      const boxRect = box ? box.getBoundingClientRect() : null;
      const content = document.querySelector('.re-carousel-slide.active .te-hero-overlay-content');
      const contentRect = content ? content.getBoundingClientRect() : null;
      const l1 = document.querySelector('.re-carousel-slide.active .te-hero-line1');
      const l2 = document.querySelector('.re-carousel-slide.active .te-hero-line2');
      const desc = document.querySelector('.re-carousel-slide.active .te-hero-desc');
      const dots = document.querySelector('.re-carousel-dots');
      const dotsRect = dots ? dots.getBoundingClientRect() : null;

      return {
        viewportWidth: window.innerWidth,
        boxWidth: boxRect?.width,
        boxLeft: boxRect?.left,
        boxHeight: boxRect?.height,
        hasHScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        contentWidth: contentRect?.width,
        contentHeight: contentRect?.height,
        gapAboveDots: dotsRect && contentRect ? dotsRect.top - contentRect.bottom : null,
        l1Size: l1 ? window.getComputedStyle(l1).fontSize : null,
        l2Size: l2 ? window.getComputedStyle(l2).fontSize : null,
        descSize: desc ? window.getComputedStyle(desc).fontSize : null,
        descLines: desc ? Math.round(desc.getBoundingClientRect().height / parseFloat(window.getComputedStyle(desc).lineHeight)) : null
      };
    });
    console.log(`Metrics [${vp.name}]:`, metrics);

    // Capture Slide 1
    const heroBox = await page.$('.re-carousel-box');
    if (heroBox) {
      await heroBox.screenshot({ path: `test_prepared_slide1_${vp.name}.png` });
      console.log(`Saved test_prepared_slide1_${vp.name}.png`);
    }

    // Advance to Slide 2
    const nextBtn = await page.$('#reNextBtn');
    if (nextBtn) {
      await nextBtn.click();
      await new Promise(r => setTimeout(r, 900));
      if (heroBox) {
        await heroBox.screenshot({ path: `test_prepared_slide2_${vp.name}.png` });
        console.log(`Saved test_prepared_slide2_${vp.name}.png`);
      }
    }
  }

  await browser.close();
}

main().catch(console.error);
