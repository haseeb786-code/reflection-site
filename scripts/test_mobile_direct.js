import puppeteer from 'puppeteer-core';
import fs from 'fs';

// Load test script with snippet
const snippetCode = fs.readFileSync('scripts/test_local_injection.js', 'utf8');
const match = snippetCode.match(/const SNIPPET_CODE = `([\s\S]*?)`;/);
const SNIPPET_CODE = match ? match[1] : '';

async function testMobileDirectly() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1');
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });

    await page.goto('https://reflectionelite.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    // Inject snippet
    const res = await page.evaluate((snippet) => {
      const div = document.createElement('div');
      div.id = 'te-hero-ticker-slider-v2-container';
      div.innerHTML = snippet;
      document.body.appendChild(div);

      const scripts = div.querySelectorAll('script');
      scripts.forEach(s => {
        const newScript = document.createElement('script');
        newScript.text = s.text;
        document.body.appendChild(newScript);
      });

      return {
        tickerFound: !!document.querySelector('.te-ticker-track'),
        overlayFound: document.querySelectorAll('.te-hero-overlay-wrap').length,
        slidesCount: document.querySelectorAll('.re-carousel-slide').length
      };
    }, SNIPPET_CODE);

    console.log('Injection eval result on mobile:', res);
    await new Promise(r => setTimeout(r, 1500));

    await page.screenshot({ path: 'test_mobile_375_direct_slide1.png' });
    console.log('Saved test_mobile_375_direct_slide1.png');

    // Click next
    await page.click('#reNextBtn');
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: 'test_mobile_375_direct_slide2.png' });
    console.log('Saved test_mobile_375_direct_slide2.png');

  } finally {
    await browser.close();
  }
}

testMobileDirectly().catch(console.error);
