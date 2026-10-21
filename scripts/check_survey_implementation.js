import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkLiveSurvey() {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new' });
  const page = await browser.newPage();
  
  // 1. Check live home page for survey mentions / buttons
  await page.goto('https://reflectionelite.com/', { waitUntil: 'domcontentloaded' });
  const liveHomeSurvey = await page.evaluate(() => {
    const matches = [];
    document.querySelectorAll('a, button').forEach(el => {
      const text = el.innerText.trim();
      const href = el.getAttribute('href');
      if (/survey|book|bespoke|consult|dimension/i.test(text) || /survey|book|bespoke|consult|dimension/i.test(href || '')) {
        matches.push({ text, href, tag: el.tagName, className: el.className });
      }
    });
    return matches;
  });
  console.log('Live Home Survey links/buttons:', JSON.stringify(liveHomeSurvey, null, 2));

  // 2. Check live /custom-dimensions/
  await page.goto('https://reflectionelite.com/custom-dimensions/', { waitUntil: 'domcontentloaded' });
  const customDimTitle = await page.title();
  const customDimText = await page.evaluate(() => document.body.innerText.slice(0, 500));
  console.log('\nLive /custom-dimensions/ Title:', customDimTitle);
  console.log('Live /custom-dimensions/ text snippet:', customDimText);

  // 3. Check staging /contact/ and staging home for survey
  await page.goto('https://reflectionelite.ataanalytiq.com/', { waitUntil: 'domcontentloaded' });
  const stagingHomeSurvey = await page.evaluate(() => {
    const matches = [];
    document.querySelectorAll('a, button').forEach(el => {
      const text = el.innerText.trim();
      const href = el.getAttribute('href');
      if (/survey|book|bespoke|consult|dimension/i.test(text) || /survey|book|bespoke|consult|dimension/i.test(href || '')) {
        matches.push({ text, href, tag: el.tagName, className: el.className });
      }
    });
    return matches;
  });
  console.log('\nStaging Home Survey links/buttons:', JSON.stringify(stagingHomeSurvey, null, 2));

  await browser.close();
}

checkLiveSurvey().catch(console.error);
