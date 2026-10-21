import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\641f7758-bd1c-45d5-8dcf-d4bf4b9f2c63';

async function verify() {
  console.log('Launching Chrome to verify Category Showcase at 1440px and 1920px...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const VIEWPORTS = [
    { name: '1440', width: 1440, height: 1000 },
    { name: '1920', width: 1920, height: 1080 }
  ];

  if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots', { recursive: true });
  if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    const targetUrl = `https://reflectionelite.com/?nocache=${Date.now()}`;
    console.log(`\nNavigating at ${vp.name}px to:`, targetUrl);
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 1500));

    const audit = await page.evaluate(() => {
      const section = document.querySelector('#teCatShowcase, .te-cat-showcase-section');
      if (!section) return { found: false };

      const rect = section.getBoundingClientRect();
      const items = Array.from(section.querySelectorAll('.te-cat-item')).map((el, idx) => {
        const link = el.querySelector('a') || (el.tagName === 'A' ? el : null);
        const num = el.querySelector('.te-cat-num, sup');
        const bRect = el.getBoundingClientRect();
        const numStyle = num ? window.getComputedStyle(num) : null;

        return {
          index: idx + 1,
          fullText: el.innerText.replace(/\s+/g, ' ').trim(),
          hasLink: !!link,
          href: link ? link.getAttribute('href') : null,
          numberText: num ? num.innerText.trim() : null,
          numberFontSize: numStyle ? numStyle.fontSize : null,
          left: Math.round(bRect.left),
          top: Math.round(bRect.top),
          height: Math.round(bRect.height)
        };
      });

      return {
        found: true,
        sectionWidth: Math.round(rect.width),
        items
      };
    });

    console.log(`--- Category Showcase Audit (${vp.name}px) ---`);
    if (audit.found) {
      console.log(`Section width: ${audit.sectionWidth}px`);
      audit.items.forEach(it => {
        console.log(`  [${it.index}] "${it.fullText}" -> link: ${it.hasLink}, href: ${it.href}, left: ${it.left}px, top: ${it.top}px`);
      });

      const sectionEl = await page.$('#teCatShowcase, .te-cat-showcase-section');
      if (sectionEl) {
        await sectionEl.scrollIntoView();
        await new Promise(r => setTimeout(r, 1000));

        const localPath = path.resolve('screenshots', `category_showcase_${vp.name}.png`);
        const artifactPath = path.resolve(ARTIFACT_DIR, `category_showcase_${vp.name}.png`);
        await sectionEl.screenshot({ path: localPath });
        fs.copyFileSync(localPath, artifactPath);
        console.log(`Saved ${vp.name}px screenshot to:`, artifactPath);
      }
    } else {
      console.log('Category showcase section NOT found!');
    }
    await page.close();
  }

  await browser.close();
  console.log('\nVerification complete!');
}

verify().catch(console.error);
