import puppeteer from 'puppeteer-core';

async function testFullWidth() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  // Full-width CSS breakout for desktop
  const FULLWIDTH_CSS = `
    @media (min-width: 769px) {
      .re-carousel-box {
        width: 100vw !important;
        max-width: 100vw !important;
        position: relative !important;
        left: 50% !important;
        right: 50% !important;
        margin-left: -50vw !important;
        margin-right: -50vw !important;
        height: clamp(560px, 80vh, 900px) !important;
        aspect-ratio: auto !important;
        border-radius: 0 !important;
        overflow: hidden !important;
        background: #08090b !important;
      }
      .re-carousel-track {
        width: 100% !important;
        height: 100% !important;
      }
      .re-carousel-slide {
        width: 100% !important;
        height: 100% !important;
      }
      .re-carousel-img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
      }
      /* Slide-specific object-position to keep mirror subject visible */
      .re-carousel-slide:nth-child(1) .re-carousel-img {
        object-position: center 35% !important;
      }
      .re-carousel-slide:nth-child(2) .re-carousel-img {
        object-position: center 30% !important;
      }

      /* Desktop Arrows & Dots positioning */
      .re-carousel-arrow.prev {
        left: 32px !important;
      }
      .re-carousel-arrow.next {
        right: 32px !important;
      }
      .re-carousel-dots {
        bottom: 24px !important;
      }

      /* PART B: LARGER, BOLDER, ALIGNED OVERLAY TEXT */
      .te-hero-overlay-wrap {
        position: absolute !important;
        left: 0 !important;
        bottom: 0 !important;
        width: 100% !important;
        height: 68% !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: flex-end !important;
        align-items: center !important;
        padding-bottom: 72px !important; /* at least 48px from dots which sit at 24px */
        box-sizing: border-box !important;
        pointer-events: none !important;
        z-index: 5 !important;
      }
      .te-hero-overlay-gradient {
        position: absolute !important;
        left: 0 !important;
        bottom: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: linear-gradient(to top, rgba(8, 9, 11, 0.95) 0%, rgba(8, 9, 11, 0.76) 45%, rgba(8, 9, 11, 0.35) 75%, rgba(8, 9, 11, 0) 100%) !important;
        pointer-events: none !important;
        z-index: 1 !important;
      }
      .te-hero-overlay-content {
        position: relative !important;
        z-index: 2 !important;
        text-align: center !important;
        width: 100% !important;
        max-width: 900px !important;
        margin: 0 auto !important;
        padding: 0 24px !important;
        box-sizing: border-box !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
      }
      .te-hero-line1 {
        font-family: var(--font-trajan), 'Cinzel', serif !important;
        font-size: clamp(18px, 1.35vw, 22px) !important;
        font-weight: 700 !important;
        letter-spacing: 0.3em !important;
        color: var(--color-gold, #c5a880) !important;
        text-transform: uppercase !important;
        margin: 0 0 16px 0 !important;
        line-height: 1.2 !important;
        text-shadow: 0 2px 12px rgba(0, 0, 0, 0.9) !important;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.8s ease 0s, transform 0.8s ease 0s;
      }
      .te-hero-gold-line {
        width: 90px !important;
        height: 1.5px !important;
        background: var(--color-gold, #c5a880) !important;
        margin: 0 auto 18px auto !important;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s;
      }
      .te-hero-line2 {
        font-family: var(--font-trajan), 'Cinzel', serif !important;
        font-size: clamp(48px, 4.4vw, 78px) !important;
        font-weight: 700 !important;
        letter-spacing: 0.07em !important;
        color: #ffffff !important;
        text-transform: uppercase !important;
        line-height: 1.1 !important;
        margin: 0 0 20px 0 !important;
        text-shadow: 0 3px 18px rgba(0, 0, 0, 0.95) !important;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
      }
      .te-hero-desc {
        font-family: var(--font-trajan), 'Cinzel', serif !important;
        font-size: clamp(17px, 1.25vw, 21px) !important;
        font-weight: 500 !important;
        letter-spacing: 0.08em !important;
        color: #f2ece4 !important;
        line-height: 1.5 !important;
        text-transform: uppercase !important;
        text-wrap: balance !important;
        margin: 0 auto !important;
        max-width: 860px !important;
        text-shadow: 0 2px 12px rgba(0, 0, 0, 0.95) !important;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s;
      }
    }
  `;

  const viewports = [
    { name: '1920', width: 1920, height: 1080 },
    { name: '1440', width: 1440, height: 900 },
    { name: '1280_720', width: 1280, height: 720 },
    { name: '390', width: 390, height: 844 },
    { name: '375', width: 375, height: 667 }
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('https://reflectionelite.com/?nocache=' + Date.now(), { waitUntil: 'domcontentloaded' });
    await page.evaluate((css) => {
      let st = document.getElementById('te-test-fullwidth-css');
      if (!st) {
        st = document.createElement('style');
        st.id = 'te-test-fullwidth-css';
        document.head.appendChild(st);
      }
      st.innerHTML = css;
    }, FULLWIDTH_CSS);

    await new Promise(r => setTimeout(r, 600));

    // Check horizontal scrollbar
    const scrollInfo = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasHScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth
    }));
    console.log(`[${vp.name}] Horizontal scrollbar check:`, scrollInfo);

    // Slide 1 screenshot
    const hero = await page.$('.re-carousel-box');
    if (hero) {
      await hero.screenshot({ path: `test_fullwidth_slide1_${vp.name}.png` });
      console.log(`Saved test_fullwidth_slide1_${vp.name}.png`);
    }

    // Slide 2
    const nextBtn = await page.$('#reNextBtn');
    if (nextBtn) {
      await nextBtn.click();
      await new Promise(r => setTimeout(r, 900));
      if (hero) {
        await hero.screenshot({ path: `test_fullwidth_slide2_${vp.name}.png` });
        console.log(`Saved test_fullwidth_slide2_${vp.name}.png`);
      }
    }
  }

  await browser.close();
}

testFullWidth().catch(console.error);
