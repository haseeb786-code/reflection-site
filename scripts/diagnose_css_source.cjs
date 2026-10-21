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

  // 1. Find who sets max-width on carousel by checking ALL stylesheets for re-carousel-box
  const cssData = await page.evaluate(() => {
    const results = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules || []) {
          const text = rule.cssText || '';
          if (text.includes('re-carousel-box') || text.includes('reHeroCarousel')) {
            results.push({
              source: sheet.href || 'inline-style',
              cssText: text.substring(0, 500)
            });
          }
          // Check inside media queries
          if (rule.cssRules) {
            for (const inner of rule.cssRules) {
              const innerText = inner.cssText || '';
              if (innerText.includes('re-carousel-box') || innerText.includes('reHeroCarousel')) {
                results.push({
                  source: sheet.href || 'inline-style',
                  media: rule.conditionText || rule.media?.mediaText || '',
                  cssText: innerText.substring(0, 500)
                });
              }
            }
          }
        }
      } catch(e) { /* cross-origin */ }
    }
    return results;
  });

  console.log('\n=== ALL CSS RULES MATCHING re-carousel-box / reHeroCarousel ===\n');
  cssData.forEach((r, i) => {
    console.log(`[${i}] source: ${r.source}`);
    if (r.media) console.log(`    media: ${r.media}`);
    console.log(`    ${r.cssText}`);
    console.log('');
  });

  // 2. Check the inline style tag content for the theme/page snippet
  const inlineStyles = await page.evaluate(() => {
    const styles = document.querySelectorAll('style');
    const results = [];
    styles.forEach(s => {
      const text = s.textContent || '';
      if (text.includes('re-carousel-box') || text.includes('1100')) {
        results.push({
          id: s.id || '(no id)',
          excerpt: text.substring(0, 2000)
        });
      }
    });
    return results;
  });

  console.log('\n=== INLINE <style> TAGS with re-carousel-box or 1100 ===\n');
  inlineStyles.forEach((s, i) => {
    console.log(`[${i}] id="${s.id}"`);
    console.log(s.excerpt);
    console.log('---');
  });

  // 3. Check the carousel element's full attribute list
  const elInfo = await page.evaluate(() => {
    const el = document.querySelector('.re-carousel-box') || document.getElementById('reHeroCarousel');
    if (!el) return null;
    return {
      tag: el.tagName,
      id: el.id,
      className: el.className,
      inlineStyle: el.style.cssText,
      outerHTMLStart: el.outerHTML.substring(0, 300)
    };
  });
  console.log('\n=== CAROUSEL ELEMENT ===');
  console.log(JSON.stringify(elInfo, null, 2));

  await browser.close();
})();
