/**
 * diagnose_slider_layout.js
 * Measures getBoundingClientRect + computed styles of the slider and every
 * ancestor up to <body> at 1440px viewport.  Prints which element causes
 * the offset / gap.
 */
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.com', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  // Wait for slider to be present
  await page.waitForSelector('#reHeroCarousel, .re-carousel-box, .re-hero-section', { timeout: 10000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 2000));

  const data = await page.evaluate(() => {
    // Find the carousel / slider element
    const carousel = document.getElementById('reHeroCarousel')
      || document.querySelector('.re-carousel-box')
      || document.querySelector('.re-hero-section');
    if (!carousel) return { error: 'Slider element not found' };

    const results = [];
    let el = carousel;
    while (el && el !== document.documentElement.parentNode) {
      const rect = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      results.push({
        tag: el.tagName,
        id: el.id || '',
        className: (el.className || '').toString().substring(0, 120),
        rect: {
          left: Math.round(rect.left),
          top: Math.round(rect.top),
          width: Math.round(rect.width),
          right: Math.round(rect.right),
          height: Math.round(rect.height)
        },
        styles: {
          width: cs.width,
          maxWidth: cs.maxWidth,
          marginLeft: cs.marginLeft,
          marginRight: cs.marginRight,
          paddingLeft: cs.paddingLeft,
          paddingRight: cs.paddingRight,
          transform: cs.transform,
          overflow: cs.overflow,
          position: cs.position,
          display: cs.display,
          boxSizing: cs.boxSizing
        }
      });
      el = el.parentElement;
    }
    return { viewportWidth: window.innerWidth, chain: results };
  });

  console.log('\n=== SLIDER LAYOUT DIAGNOSTIC (1440px viewport) ===\n');
  if (data.error) {
    console.log('ERROR:', data.error);
  } else {
    console.log('Viewport width:', data.viewportWidth);
    console.log('\nElement chain from slider to <HTML>:\n');
    data.chain.forEach((item, i) => {
      const indent = '  '.repeat(i);
      console.log(`${indent}[${i}] <${item.tag}> id="${item.id}" class="${item.className}"`);
      console.log(`${indent}    rect: left=${item.rect.left}, width=${item.rect.width}, right=${item.rect.right}`);
      const s = item.styles;
      console.log(`${indent}    width=${s.width} | max-width=${s.maxWidth}`);
      console.log(`${indent}    margin: L=${s.marginLeft} R=${s.marginRight}`);
      console.log(`${indent}    padding: L=${s.paddingLeft} R=${s.paddingRight}`);
      if (s.transform !== 'none') console.log(`${indent}    transform: ${s.transform}`);
      console.log(`${indent}    overflow=${s.overflow} | position=${s.position} | display=${s.display}`);
      // Flag the problem
      if (item.rect.left > 0) {
        console.log(`${indent}    *** LEFT OFFSET: ${item.rect.left}px — this element starts off-screen-left ***`);
      }
      if (item.rect.width < data.viewportWidth) {
        console.log(`${indent}    *** WIDTH SHORT: ${item.rect.width}px < viewport ${data.viewportWidth}px ***`);
      }
      console.log('');
    });
  }

  // Also check the Astra theme page layout setting via body classes
  const bodyClasses = await page.evaluate(() => document.body.className);
  console.log('\n=== BODY CLASSES ===');
  console.log(bodyClasses);

  // Check if there's a site-content or ast-container wrapper
  const containerInfo = await page.evaluate(() => {
    const containers = document.querySelectorAll('.ast-container, .site-content, #content, .ast-row, .ast-col-md-12, [class*="ast-"]');
    return Array.from(containers).slice(0, 15).map(c => {
      const r = c.getBoundingClientRect();
      const cs = window.getComputedStyle(c);
      return {
        tag: c.tagName,
        class: (c.className || '').toString().substring(0, 100),
        left: Math.round(r.left),
        width: Math.round(r.width),
        maxWidth: cs.maxWidth,
        paddingLeft: cs.paddingLeft,
        paddingRight: cs.paddingRight,
        marginLeft: cs.marginLeft,
        marginRight: cs.marginRight
      };
    });
  });
  console.log('\n=== ASTRA CONTAINERS ===');
  containerInfo.forEach(c => {
    console.log(`<${c.tag}> .${c.class}`);
    console.log(`  left=${c.left} width=${c.width} max-width=${c.maxWidth} pL=${c.paddingLeft} pR=${c.paddingRight} mL=${c.marginLeft} mR=${c.marginRight}`);
  });

  await browser.close();
})();
