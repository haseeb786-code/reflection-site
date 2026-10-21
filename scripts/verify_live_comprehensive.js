import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function runComprehensiveVerification() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = {
    checks: [],
    viewports: {}
  };

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

    // 1. DESKTOP 1440px
    console.log('\n--- 1. Testing Desktop 1440px ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('https://reflectionelite.com/?nocache=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 35000 });
    await new Promise(r => setTimeout(r, 3000));

    // Metrics check on Desktop 1440
    const d1440Metrics = await page.evaluate(() => {
      const carouselBox = document.getElementById('reHeroCarousel');
      const boxRect = carouselBox ? carouselBox.getBoundingClientRect() : null;
      const track = document.getElementById('reCarouselTrack');
      const slides = document.querySelectorAll('.re-carousel-slide');
      const tickerTrack = document.querySelector('.te-ticker-track');
      const overlays = document.querySelectorAll('.te-hero-overlay-wrap');
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;

      return {
        hasHorizontalScroll: scrollWidth > clientWidth,
        carouselWidth: boxRect ? boxRect.width : 0,
        carouselHeight: boxRect ? boxRect.height : 0,
        carouselAspectRatio: boxRect ? (boxRect.width / boxRect.height).toFixed(3) : 0,
        slidesCount: slides.length,
        overlaysCount: overlays.length,
        hasTickerTrack: !!tickerTrack,
        tickerAnimation: tickerTrack ? window.getComputedStyle(tickerTrack).animationName : null
      };
    });
    console.log('Desktop 1440 metrics:', d1440Metrics);
    results.viewports['desktop_1440'] = d1440Metrics;

    await page.screenshot({ path: 'verify_desktop_1440_slide1.png' });
    console.log('✓ verify_desktop_1440_slide1.png');

    // Slide 2 on 1440
    await page.click('#reNextBtn');
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: 'verify_desktop_1440_slide2.png' });
    console.log('✓ verify_desktop_1440_slide2.png');

    // 2. DESKTOP 1920px
    console.log('\n--- 2. Testing Desktop 1920px ---');
    await page.setViewport({ width: 1920, height: 1080 });
    await page.click('#rePrevBtn');
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: 'verify_desktop_1920_slide1.png' });
    console.log('✓ verify_desktop_1920_slide1.png');

    await page.click('#reNextBtn');
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: 'verify_desktop_1920_slide2.png' });
    console.log('✓ verify_desktop_1920_slide2.png');

    // 3. MOBILE 375px
    console.log('\n--- 3. Testing Mobile 375px ---');
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await page.goto('https://reflectionelite.com/?nocache=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 35000 });
    await new Promise(r => setTimeout(r, 3000));

    const m375Metrics = await page.evaluate(() => {
      const carouselBox = document.getElementById('reHeroCarousel');
      const boxRect = carouselBox ? carouselBox.getBoundingClientRect() : null;
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      const overlays = document.querySelectorAll('.te-hero-overlay-wrap');

      return {
        hasHorizontalScroll: scrollWidth > clientWidth,
        carouselWidth: boxRect ? boxRect.width : 0,
        carouselHeight: boxRect ? boxRect.height : 0,
        overlaysCount: overlays.length
      };
    });
    console.log('Mobile 375 metrics:', m375Metrics);
    results.viewports['mobile_375'] = m375Metrics;

    await page.screenshot({ path: 'verify_mobile_375_slide1.png' });
    console.log('✓ verify_mobile_375_slide1.png');

    await page.click('#reNextBtn');
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: 'verify_mobile_375_slide2.png' });
    console.log('✓ verify_mobile_375_slide2.png');

    // 4. MOBILE 390px
    console.log('\n--- 4. Testing Mobile 390px ---');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.click('#rePrevBtn');
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: 'verify_mobile_390_slide1.png' });
    console.log('✓ verify_mobile_390_slide1.png');

    await page.click('#reNextBtn');
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: 'verify_mobile_390_slide2.png' });
    console.log('✓ verify_mobile_390_slide2.png');

    // 5. OTHER PAGES CHECK (Shop, About, Contact, Cart, Policies)
    console.log('\n--- 5. Checking other pages for raw CSS or distortion ---');
    const pagesToCheck = [
      { name: 'Shop', url: 'https://reflectionelite.com/shop/' },
      { name: 'About', url: 'https://reflectionelite.com/about-us/' },
      { name: 'Contact', url: 'https://reflectionelite.com/contact/' },
      { name: 'Cart', url: 'https://reflectionelite.com/cart/' },
      { name: 'Policies', url: 'https://reflectionelite.com/refund_returns-2/' }
    ];

    for (const p of pagesToCheck) {
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 1500));
      const pageCheck = await page.evaluate(() => {
        const bodyText = document.body.innerText;
        return {
          hasRawCssCode: bodyText.includes('@keyframes') || bodyText.includes('display: flex !important'),
          hasHeroSlider: !!document.getElementById('reHeroCarousel')
        };
      });
      console.log(`Page ${p.name}: raw CSS leaked? ${pageCheck.hasRawCssCode}, hero slider present? ${pageCheck.hasHeroSlider}`);
      results.checks.push({ page: p.name, ...pageCheck });
    }

    fs.writeFileSync('verification_summary.json', JSON.stringify(results, null, 2), 'utf8');
    console.log('Verification finished successfully!');

  } finally {
    await browser.close();
  }
}

runComprehensiveVerification().catch(console.error);
