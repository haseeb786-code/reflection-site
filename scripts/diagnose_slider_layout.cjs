const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.com', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  await page.waitForSelector('#reHeroCarousel, .re-carousel-box, .re-hero-section', { timeout: 10000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 2000));

  const data = await page.evaluate(() => {
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
        rect: { left: Math.round(rect.left), width: Math.round(rect.width), right: Math.round(rect.right) },
        styles: {
          width: cs.width, maxWidth: cs.maxWidth,
          marginLeft: cs.marginLeft, marginRight: cs.marginRight,
          paddingLeft: cs.paddingLeft, paddingRight: cs.paddingRight,
          transform: cs.transform, overflow: cs.overflow,
          position: cs.position, display: cs.display, boxSizing: cs.boxSizing
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
      console.log(`[${i}] <${item.tag}> id="${item.id}" class="${item.className}"`);
      console.log(`    rect: left=${item.rect.left}, width=${item.rect.width}, right=${item.rect.right}`);
      const s = item.styles;
      console.log(`    width=${s.width} | max-width=${s.maxWidth} | box-sizing=${s.boxSizing}`);
      console.log(`    margin: L=${s.marginLeft} R=${s.marginRight}`);
      console.log(`    padding: L=${s.paddingLeft} R=${s.paddingRight}`);
      if (s.transform !== 'none') console.log(`    transform: ${s.transform}`);
      console.log(`    overflow=${s.overflow} | position=${s.position} | display=${s.display}`);
      if (item.rect.left > 0) console.log(`    *** LEFT OFFSET: ${item.rect.left}px ***`);
      if (item.rect.width < data.viewportWidth) console.log(`    *** WIDTH SHORT: ${item.rect.width}px < viewport ${data.viewportWidth}px ***`);
      console.log('');
    });
  }

  // Body classes (Astra page layout)
  const bodyClasses = await page.evaluate(() => document.body.className);
  console.log('=== BODY CLASSES ===');
  console.log(bodyClasses);

  // Check Astra containers
  const containerInfo = await page.evaluate(() => {
    const sels = '.ast-container, .site-content, #content, .ast-row, .entry-content, #primary, #main, .ast-builder-grid-row, article';
    const containers = document.querySelectorAll(sels);
    return Array.from(containers).slice(0, 20).map(c => {
      const r = c.getBoundingClientRect();
      const cs = window.getComputedStyle(c);
      return {
        tag: c.tagName, id: c.id || '',
        class: (c.className || '').toString().substring(0, 100),
        left: Math.round(r.left), width: Math.round(r.width),
        maxWidth: cs.maxWidth, paddingL: cs.paddingLeft, paddingR: cs.paddingRight,
        marginL: cs.marginLeft, marginR: cs.marginRight
      };
    });
  });
  console.log('\n=== ASTRA CONTAINERS ===');
  containerInfo.forEach(c => {
    console.log(`<${c.tag}> id="${c.id}" class="${c.class}"`);
    console.log(`  left=${c.left} width=${c.width} max-width=${c.maxWidth} pL=${c.paddingL} pR=${c.paddingR} mL=${c.marginL} mR=${c.marginR}`);
  });

  // Check if Astra page layout is set via body class
  const pageLayout = await page.evaluate(() => {
    const body = document.body;
    const classes = body.className;
    const layoutMatch = classes.match(/ast-page-builder-template|ast-full-width-layout|ast-no-sidebar/g);
    return { classes: classes.substring(0, 300), layoutClasses: layoutMatch };
  });
  console.log('\n=== PAGE LAYOUT DETECTION ===');
  console.log('Layout classes:', pageLayout.layoutClasses);

  await browser.close();
})();
