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

  // Use CDP to get matched styles
  const client = await page.createCDPSession();
  await client.send('DOM.enable');
  await client.send('CSS.enable');

  const { root } = await client.send('DOM.getDocument');
  const { nodeId } = await client.send('DOM.querySelector', {
    nodeId: root.nodeId,
    selector: '#reHeroCarousel'
  });

  if (!nodeId) {
    // Try .re-carousel-box
    const res = await client.send('DOM.querySelector', {
      nodeId: root.nodeId,
      selector: '.re-carousel-box'
    });
    if (!res.nodeId) {
      console.log('Element not found');
      await browser.close();
      return;
    }
  }

  const matched = await client.send('CSS.getMatchedStylesForNode', { nodeId });

  console.log('\n=== MATCHED RULES for #reHeroCarousel ===\n');

  // Check inline styles
  if (matched.inlineStyle) {
    const relevant = matched.inlineStyle.cssProperties.filter(p =>
      ['width', 'max-width', 'margin', 'margin-left', 'margin-right'].includes(p.name)
    );
    if (relevant.length) {
      console.log('INLINE STYLES:');
      relevant.forEach(p => console.log(`  ${p.name}: ${p.value}`));
    }
  }

  // Check all matched rules
  if (matched.matchedCSSRules) {
    matched.matchedCSSRules.forEach(match => {
      const rule = match.rule;
      const selector = rule.selectorList ? rule.selectorList.text : '(unknown)';
      const relevant = rule.style.cssProperties.filter(p =>
        ['width', 'max-width', 'margin', 'margin-left', 'margin-right'].includes(p.name) && !p.disabled
      );
      if (relevant.length) {
        const source = rule.origin + (rule.styleSheetId ? ` (sheet)` : '');
        console.log(`RULE: ${selector}`);
        console.log(`  origin: ${source}`);
        relevant.forEach(p => console.log(`  ${p.name}: ${p.value}${p.important ? ' !important' : ''}`));
        console.log('');
      }
    });
  }

  await browser.close();
})();
