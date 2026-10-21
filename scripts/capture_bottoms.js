import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\414d7e40-4d4d-49c9-8868-01c3c84a4783';

async function captureBottoms() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });

  const pages = [
    { name: 'home', url: 'https://reflectionelite.com/' },
    { name: 'shop', url: 'https://reflectionelite.com/shop/' },
    { name: 'about', url: 'https://reflectionelite.com/about-us/' }
  ];

  for (const p of pages) {
    console.log(`Loading ${p.name}...`);
    await page.goto(p.url, { waitUntil: 'domcontentloaded' });
    try {
      await page.waitForFunction(() => document.title && !document.title.includes('Checking your browser'), { timeout: 20000 });
    } catch(e) {}
    await new Promise(r => setTimeout(r, 2000));

    // Scroll down to the bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 1000));

    const shotPath = path.join(ARTIFACT_DIR, `prod_bottom_${p.name}.png`);
    await page.screenshot({ path: shotPath });
    console.log(`Saved ${p.name} bottom:`, shotPath);

    // Also get the HTML of the last 2000 characters of the page content
    const bottomHtml = await page.evaluate(() => {
      const live = document.querySelector('.te-live-page') || document.body;
      return live.innerHTML.slice(-1500);
    });
    console.log(`--- ${p.name} bottom HTML snippet ---`);
    console.log(bottomHtml);
  }

  await browser.close();
}

captureBottoms().catch(console.error);
