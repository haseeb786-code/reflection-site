import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push(msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('https://reflectionelite.com/?v=' + Date.now(), { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const evaluation = await page.evaluate(() => {
    const overlay = document.getElementById('reSearchOverlayBar');
    const extra = document.querySelector('.re-search-extra-container');
    const script = document.getElementById('re-live-instant-search-engine');
    return {
      hasOverlay: !!overlay,
      hasExtra: !!extra,
      hasScript: !!script,
      scriptSnippet: script ? script.innerHTML.substring(0, 150) : null
    };
  });

  console.log('Evaluation:', evaluation);
  console.log('Console messages:', consoleMessages.slice(0, 10));

  await browser.close();
}

main().catch(console.error);
