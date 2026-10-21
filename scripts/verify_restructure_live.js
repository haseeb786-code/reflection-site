import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { name: 'desktop_1920', width: 1920, height: 1080 },
  { name: 'desktop_1440', width: 1440, height: 900 },
  { name: 'laptop_1280', width: 1280, height: 800 },
  { name: 'mobile_390', width: 390, height: 844 },
  { name: 'mobile_375', width: 375, height: 667 }
];

async function main() {
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots', { recursive: true });
  }

  console.log('Starting Puppeteer live verification...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const url = `https://reflectionelite.com/?nocache=${Date.now()}`;
  console.log('Navigating to:', url);

  // Set 1920 first to inspect elements
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2500));

  // Evaluate page structure
  const pageAudit = await page.evaluate(() => {
    // 1. H1 audit
    const h1s = Array.from(document.querySelectorAll('h1')).map(h => ({
      text: h.textContent.trim(),
      className: h.className,
      style: h.getAttribute('style') || ''
    }));

    // 2. Old deleted elements check
    const hasOldTagline = document.body.innerHTML.includes('THE ART OF REFLECTION');
    const hasOldH1 = document.body.innerHTML.includes('ELEVATE YOUR');
    const hasExploreBtn = document.body.innerHTML.includes('EXPLORE THE COLLECTION');
    const hasCommissionBtn = document.body.innerHTML.includes('COMMISSION BESPOKE');

    // 3. Category Showcase audit
    const catSection = document.querySelector('#teCatShowcase, .te-cat-showcase-section');
    let catAudit = null;
    if (catSection) {
      const items = Array.from(catSection.querySelectorAll('.te-cat-item')).map(el => {
        const link = el.querySelector('a');
        return {
          text: el.textContent.replace(/\s+/g, ' ').trim(),
          isLinked: !!link,
          href: link ? link.getAttribute('href') : null
        };
      });
      const img = catSection.querySelector('.te-cat-showcase-img');
      catAudit = {
        present: true,
        items,
        imgSrc: img ? img.src : null,
        imgNaturalWidth: img ? img.naturalWidth : 0,
        imgNaturalHeight: img ? img.naturalHeight : 0,
        bgColor: window.getComputedStyle(catSection).backgroundColor
      };
    }

    // 4. Duo Showcase audit
    const duoSection = document.querySelector('#teDuoShowcase, .te-duo-showcase-section');
    let duoAudit = null;
    if (duoSection) {
      const leftPanel = duoSection.querySelector('.te-duo-panel-left');
      const rightPanel = duoSection.querySelector('.te-duo-panel-right');
      const leftLink = leftPanel ? leftPanel.querySelector('a') : null;
      const leftImg = leftPanel ? leftPanel.querySelector('img') : null;
      const leftCursor = leftPanel ? window.getComputedStyle(leftPanel).cursor : '';

      const rightLink = rightPanel ? rightPanel.querySelector('a') : null;
      const rightImg = rightPanel ? rightPanel.querySelector('img') : null;
      const titleEl = rightPanel ? rightPanel.querySelector('.te-duo-prod-title') : null;
      const priceEl = rightPanel ? rightPanel.querySelector('.te-duo-prod-price') : null;

      duoAudit = {
        present: true,
        bgColor: window.getComputedStyle(duoSection).backgroundColor,
        leftPanel: {
          hasLink: !!leftLink,
          cursor: leftCursor,
          imgSrc: leftImg ? leftImg.src : null,
          imgNaturalWidth: leftImg ? leftImg.naturalWidth : 0
        },
        rightPanel: {
          hasLink: !!rightLink,
          linkHref: rightLink ? rightLink.getAttribute('href') : null,
          title: titleEl ? titleEl.textContent.trim() : null,
          price: priceEl ? priceEl.textContent.trim() : null,
          imgSrc: rightImg ? rightImg.src : null,
          imgNaturalWidth: rightImg ? rightImg.naturalWidth : 0
        }
      };
    }

    // 5. Subsequent sections check
    const cycleSection = document.querySelector('.cycle-section');
    const cards = cycleSection ? cycleSection.querySelectorAll('.luxury-card') : [];

    return {
      h1s,
      deletedBlocksGone: !hasOldTagline && !hasOldH1 && !hasExploreBtn && !hasCommissionBtn,
      catAudit,
      duoAudit,
      cardsCount: cards.length
    };
  });

  console.log('\n=== AUDIT RESULTS ===');
  console.log('H1 elements:', pageAudit.h1s);
  console.log('Deleted blocks completely gone?', pageAudit.deletedBlocksGone);
  console.log('Product cards below duo showcase count:', pageAudit.cardsCount);
  console.log('\nCategory Showcase:');
  console.dir(pageAudit.catAudit, { depth: null });
  console.log('\nDuo Showcase:');
  console.dir(pageAudit.duoAudit, { depth: null });

  // Now capture screenshots across viewports and check scrollWidth
  for (const vp of VIEWPORTS) {
    console.log(`\nTesting viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    await page.setViewport({ width: vp.width, height: vp.height });
    await new Promise(r => setTimeout(r, 800));

    // Scroll down to trigger any lazy painting and wait for showcase images
    await page.evaluate(() => {
      const duo = document.querySelector('#teDuoShowcase');
      if (duo) duo.scrollIntoView({ behavior: 'instant', block: 'center' });
    });

    await page.waitForFunction(() => {
      const imgs = Array.from(document.querySelectorAll('#teCatShowcase img, #teDuoShowcase img'));
      return imgs.length >= 3 && imgs.every(img => img.complete && img.naturalWidth > 0);
    }, { timeout: 15000 }).catch(() => console.log('Image wait warning on ' + vp.name));

    await new Promise(r => setTimeout(r, 600));

    const metrics = await page.evaluate(() => {
      const hero = document.querySelector('.re-carousel-box');
      const cat = document.querySelector('.te-cat-showcase-section');
      const duo = document.querySelector('.te-duo-showcase-section');
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        heroRect: hero ? { width: hero.offsetWidth, height: hero.offsetHeight } : null,
        catRect: cat ? { width: cat.offsetWidth, height: cat.offsetHeight } : null,
        duoRect: duo ? { width: duo.offsetWidth, height: duo.offsetHeight } : null
      };
    });

    console.log(`  scrollWidth: ${metrics.scrollWidth}, innerWidth: ${metrics.innerWidth}, hasHScroll: ${metrics.scrollWidth > metrics.innerWidth}`);
    console.log(`  Hero dimensions:`, metrics.heroRect);
    console.log(`  Category showcase dimensions:`, metrics.catRect);
    console.log(`  Duo showcase dimensions:`, metrics.duoRect);

    // 1. Scroll to Category showcase
    await page.evaluate(() => {
      const cat = document.querySelector('.te-cat-showcase-section');
      if (cat) cat.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 600));
    const shotPath = path.resolve(`screenshots/showcase_cat_${vp.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`  ✓ Saved screenshot: ${shotPath}`);

    // 2. Scroll to Duo showcase
    await page.evaluate(() => {
      const duo = document.querySelector('.te-duo-showcase-section');
      if (duo) duo.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 600));
    const shotShowcasePath = path.resolve(`screenshots/showcase_duo_${vp.name}.png`);
    await page.screenshot({ path: shotShowcasePath, fullPage: false });
    console.log(`  ✓ Saved detail screenshot: ${shotShowcasePath}`);
  }

  await browser.close();
  console.log('\n✓ Live verification complete!');
}

main().catch(err => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});
