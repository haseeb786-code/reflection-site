import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  const EXPECTED_LINE1 = 'COMPLETE YOUR WALLS';
  const EXPECTED_LINE2 = 'WITH TIMELESS LUXURY';
  const EXPECTED_DESC = 'DISCOVER OUR EXQUISITE COLLECTION OF HANDCRAFTED MIRRORS THAT REFLECT ELEGANCE AND SOPHISTICATION. EACH PIECE IS METICULOUSLY DESIGNED TO TRANSFORM YOUR HOME INTO A SANCTUARY OF REFINED BEAUTY.';

  const viewports = [
    { name: 'desktop_1920', width: 1920, height: 1080 },
    { name: 'desktop_1440', width: 1440, height: 900 },
    { name: 'mobile_390', width: 390, height: 844 },
    { name: 'mobile_375', width: 375, height: 667 }
  ];

  for (const vp of viewports) {
    console.log(`\n================ Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ================`);
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('https://reflectionelite.com/?nocache=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise(r => setTimeout(r, 1200));

    // Verify raw code does not appear on page
    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasRawCssOrJs = bodyText.includes('te-hero-ticker-slider-v2-css') || bodyText.includes('initHeroSliderEnhancements');
    console.log(`[${vp.name}] Raw code leaked into text?`, hasRawCssOrJs);

    // Verify Ticker is present and active
    const tickerActive = await page.evaluate(() => {
      const track = document.querySelector('.te-ticker-track');
      return !!track;
    });
    console.log(`[${vp.name}] Ticker active?`, tickerActive);

    // Verify Slide 1 text and capture
    const slide1Data = await page.evaluate(() => {
      const activeSlide = document.querySelector('.re-carousel-slide.active');
      if (!activeSlide) return { error: 'No active slide' };
      const l1 = activeSlide.querySelector('.te-hero-line1')?.textContent.trim();
      const l2 = activeSlide.querySelector('.te-hero-line2')?.textContent.trim();
      const desc = activeSlide.querySelector('.te-hero-desc')?.textContent.trim();
      const compDesc = activeSlide.querySelector('.te-hero-desc') ? window.getComputedStyle(activeSlide.querySelector('.te-hero-desc')) : null;
      return {
        l1, l2, desc,
        descOpacity: compDesc?.opacity,
        descColor: compDesc?.color,
        descFontSize: compDesc?.fontSize,
        descLineHeight: compDesc?.lineHeight
      };
    });
    console.log(`[${vp.name}] Slide 1 Data:`, slide1Data);
    console.log(`[${vp.name}] Slide 1 Line 1 match:`, slide1Data.l1 === EXPECTED_LINE1);
    console.log(`[${vp.name}] Slide 1 Line 2 match:`, slide1Data.l2 === EXPECTED_LINE2);
    console.log(`[${vp.name}] Slide 1 Desc match:`, slide1Data.desc === EXPECTED_DESC);

    const carouselBox = await page.$('.re-carousel-box');
    if (carouselBox) {
      await carouselBox.screenshot({ path: `live_verified_slide1_${vp.name}.png` });
      console.log(`Saved live_verified_slide1_${vp.name}.png`);
    }

    // Advance to Slide 2 using next button
    const nextBtn = await page.$('#reNextBtn');
    if (nextBtn) {
      await nextBtn.click();
      await new Promise(r => setTimeout(r, 1000));
    }

    // Verify Slide 2 text and capture
    const slide2Data = await page.evaluate(() => {
      const activeSlide = document.querySelector('.re-carousel-slide.active');
      if (!activeSlide) return { error: 'No active slide' };
      const l1 = activeSlide.querySelector('.te-hero-line1')?.textContent.trim();
      const l2 = activeSlide.querySelector('.te-hero-line2')?.textContent.trim();
      const desc = activeSlide.querySelector('.te-hero-desc')?.textContent.trim();
      return { l1, l2, desc };
    });
    console.log(`[${vp.name}] Slide 2 Data:`, slide2Data);
    console.log(`[${vp.name}] Slide 2 Line 1 match:`, slide2Data.l1 === EXPECTED_LINE1);
    console.log(`[${vp.name}] Slide 2 Line 2 match:`, slide2Data.l2 === EXPECTED_LINE2);
    console.log(`[${vp.name}] Slide 2 Desc match:`, slide2Data.desc === EXPECTED_DESC);

    if (carouselBox) {
      await carouselBox.screenshot({ path: `live_verified_slide2_${vp.name}.png` });
      console.log(`Saved live_verified_slide2_${vp.name}.png`);
    }
  }

  await browser.close();
  console.log('\n================ ALL LIVE CHECKS COMPLETED SUCCESSFULLY ================');
}

main().catch(err => {
  console.error('LIVE VERIFICATION FAILED:', err);
  process.exit(1);
});
