const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.com', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // Get ALL matched CSS rules for .re-carousel-box
  const cssInfo = await page.evaluate(() => {
    const el = document.getElementById('reHeroCarousel') || document.querySelector('.re-carousel-box');
    if (!el) return { error: 'not found' };

    // Check inline style
    const inlineStyle = el.style.cssText;

    // Check computed vs specified
    const cs = window.getComputedStyle(el);

    // Get all CSS rules that match this element
    const matchedRules = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules || []) {
          if (rule.selectorText && el.matches(rule.selectorText)) {
            // Extract width/max-width related props
            const w = rule.style.width;
            const mw = rule.style.maxWidth;
            const ml = rule.style.marginLeft;
            const mr = rule.style.marginRight;
            const m = rule.style.margin;
            if (w || mw || ml || mr || m) {
              matchedRules.push({
                selector: rule.selectorText,
                source: sheet.href || 'inline',
                width: w, maxWidth: mw, margin: m,
                marginLeft: ml, marginRight: mr
              });
            }
          }
        }
      } catch(e) { /* cross-origin */ }
    }

    return {
      inlineStyle,
      computedWidth: cs.width,
      computedMaxWidth: cs.maxWidth,
      computedMarginL: cs.marginLeft,
      computedMarginR: cs.marginRight,
      matchedRules
    };
  });

  console.log('\n=== CSS RULES HITTING .re-carousel-box ===\n');
  console.log('Inline style:', cssInfo.inlineStyle || '(none)');
  console.log('Computed: width=' + cssInfo.computedWidth + ' max-width=' + cssInfo.computedMaxWidth);
  console.log('Computed: margin-left=' + cssInfo.computedMarginL + ' margin-right=' + cssInfo.computedMarginR);
  console.log('\nMatched rules:');
  cssInfo.matchedRules.forEach((r, i) => {
    console.log(`  [${i}] ${r.selector}`);
    console.log(`       source: ${r.source}`);
    if (r.width) console.log(`       width: ${r.width}`);
    if (r.maxWidth) console.log(`       max-width: ${r.maxWidth}`);
    if (r.margin) console.log(`       margin: ${r.margin}`);
    if (r.marginLeft) console.log(`       margin-left: ${r.marginLeft}`);
    if (r.marginRight) console.log(`       margin-right: ${r.marginRight}`);
  });

  await browser.close();
})();
