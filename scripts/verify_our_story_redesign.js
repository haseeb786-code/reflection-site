import puppeteer from 'puppeteer-core';
import path from 'path';

const outDir = 'audit_evidence';

async function verifyOurStory() {
  console.log('=== VERIFYING OUR STORY LUXURY REDESIGN ===\n');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  // 1. Desktop Audit (1440 x 900)
  console.log('1. Loading https://reflectionelite.com/about-us/ (Desktop)...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.com/about-us/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await new Promise(r => setTimeout(r, 6000));

  const audit = await page.evaluate(() => {
    const entryTitle = document.querySelector('.entry-header, .entry-title');
    const entryTitleVisible = entryTitle ? window.getComputedStyle(entryTitle).display !== 'none' : false;

    const hero = document.querySelector('.re-story-hero');
    const heroTitle = document.querySelector('.re-story-title');
    const origins = document.querySelector('.re-story-origins-section');
    const pillars = Array.from(document.querySelectorAll('.re-story-pillar-card'));
    const journeySteps = Array.from(document.querySelectorAll('.re-journey-step-card'));
    const studio = document.querySelector('.re-story-studio-card');
    const waLink = document.querySelector('.re-story-studio-card a[href*="wa.me"]');
    const shopLink = document.querySelector('.re-story-studio-card a[href*="/shop/"]');

    // Check if any old dark navy boxes remain
    const allDivs = Array.from(document.querySelectorAll('div'));
    const darkNavyBoxes = allDivs.filter(d => {
      const bg = window.getComputedStyle(d).backgroundColor;
      // Check for dark navy like rgb(26, 34, 51), rgb(18, 23, 34), rgb(20, 25, 36), rgb(16, 21, 32)
      return bg.includes('26, 34, 51') || bg.includes('18, 23, 34') || bg.includes('20, 25, 36') || bg.includes('16, 21, 32');
    }).length;

    return {
      title: document.title,
      entryTitleSuppressed: !entryTitleVisible,
      heroExists: !!hero,
      heroTitleText: heroTitle?.textContent.trim(),
      heroBg: hero ? window.getComputedStyle(hero).backgroundImage : '',
      originsExists: !!origins,
      pillarsCount: pillars.length,
      pillarTitles: pillars.map(p => p.querySelector('.re-pillar-title')?.textContent.trim()),
      journeyStepsCount: journeySteps.length,
      studioExists: !!studio,
      waHref: waLink?.getAttribute('href'),
      shopHref: shopLink?.getAttribute('href'),
      darkNavyBoxesRemaining: darkNavyBoxes,
      bodyBg: window.getComputedStyle(document.body).backgroundColor
    };
  });

  console.log('Audit Results:', JSON.stringify(audit, null, 2));

  await page.screenshot({ path: path.join(outDir, 'our_story_desktop_full.png'), fullPage: true });
  console.log('[SAVED] audit_evidence/our_story_desktop_full.png');

  // 2. Tablet View (768 x 1024)
  console.log('\n2. Auditing Tablet layout (768px)...');
  await page.setViewport({ width: 768, height: 1024 });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, 'our_story_tablet.png'), fullPage: true });
  console.log('[SAVED] audit_evidence/our_story_tablet.png');

  // 3. Mobile View (375 x 812)
  console.log('\n3. Auditing Mobile layout (375px)...');
  await page.setViewport({ width: 375, height: 812 });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, 'our_story_mobile.png'), fullPage: true });
  console.log('[SAVED] audit_evidence/our_story_mobile.png');

  // 4. Quick smoke check on homepage & shop to ensure they remain untouched
  console.log('\n4. Smoke checking Homepage & Shop to ensure zero regression...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.com/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));
  const homeHeroExists = await page.evaluate(() => !!document.querySelector('.re-hero-section'));
  console.log('Homepage hero intact:', homeHeroExists);

  await page.goto('https://reflectionelite.com/shop/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));
  const shopHeroExists = await page.evaluate(() => !!document.querySelector('.re-catalog-hero'));
  console.log('Shop hero intact:', shopHeroExists);

  await browser.close();
  console.log('\n=== VERIFICATION COMPLETE ===');
}

verifyOurStory().catch(console.error);
