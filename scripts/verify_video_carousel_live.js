import puppeteer from 'puppeteer';
import dns from 'dns';
try { dns.setDefaultResultOrder('ipv4first'); } catch (e) {}
import { getProdAuth } from './prod_auth_helper.js';

async function verify() {
  const auth = await getProdAuth();
  const browser = await puppeteer.launch({
    executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  // Test on standard laptop resolution (1366x768) where the previous bug occurred
  await page.setViewport({ width: 1366, height: 768 });

  const cookiePairs = auth.cookies.split('; ').map(c => {
    const [name, ...val] = c.split('=');
    return { name, value: val.join('='), domain: 'reflectionelite.com' };
  });
  await page.setCookie(...cookiePairs);

  console.log('Navigating to reflectionelite.com...');
  await page.goto('https://reflectionelite.com/?nocache=' + Date.now(), { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));

  // Scroll to video slider
  await page.evaluate(() => {
    const el = document.getElementById('re-craftsmanship-video-slider');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1000));

  // Measure slide dimensions and counts
  const metrics = await page.evaluate(() => {
    const section = document.getElementById('re-craftsmanship-video-slider');
    const viewport = section?.querySelector('.re-carousel-viewport');
    const track = section?.querySelector('.re-carousel-track');
    const slides = Array.from(section?.querySelectorAll('.re-carousel-slide') || []);
    
    return {
      viewportWidth: viewport?.offsetWidth,
      viewportHeight: viewport?.offsetHeight,
      slideCount: slides.length,
      slideWidths: slides.map(s => s.offsetWidth),
      slideHeights: slides.map(s => s.offsetHeight),
      titles: slides.map(s => s.querySelector('.re-slide-title')?.innerText?.trim()),
      transformInitial: track?.style?.transform || 'none'
    };
  });

  console.log('Metrics in 1366x768 resolution:', JSON.stringify(metrics, null, 2));

  // Capture State 1 (Initial: 3 videos)
  await page.screenshot({ path: 'verify_state_1_initial.png' });
  console.log('Saved verify_state_1_initial.png');

  // Wait 4.2s for auto-slideover to slide
  await new Promise(r => setTimeout(r, 4200));

  const transformAfter = await page.evaluate(() => {
    const track = document.querySelector('#re-craftsmanship-video-slider .re-carousel-track');
    return track?.style?.transform;
  });
  console.log('Transform after auto-slide:', transformAfter);

  // Capture State 2 (Slid: showing 4th video)
  await page.screenshot({ path: 'verify_state_2_slid.png' });
  console.log('Saved verify_state_2_slid.png');

  await browser.close();
}

verify().catch(e => {
  console.error('Verification error:', e);
  process.exit(1);
});
