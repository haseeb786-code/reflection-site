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
  await new Promise(r => setTimeout(r, 3000));

  // 1. What's the first big element after header?
  const heroHTML = await page.evaluate(() => {
    // Find main content
    const main = document.querySelector('#main, .site-main, .entry-content, #content');
    if (!main) return { error: 'No main found', bodyHTML: document.body.innerHTML.substring(0, 3000) };
    return {
      mainHTML: main.innerHTML.substring(0, 5000)
    };
  });
  console.log('\n=== MAIN CONTENT HTML (first 5000 chars) ===\n');
  console.log(heroHTML.mainHTML || heroHTML.bodyHTML || heroHTML.error);

  // 2. Screenshot
  await page.screenshot({ path: 'diag_1440_current.png', fullPage: false });
  console.log('\nScreenshot saved: diag_1440_current.png');

  await browser.close();
})();
