import puppeteer from 'puppeteer';

async function checkAncestors() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.com/', { waitUntil: 'networkidle2', timeout: 60000 });
  await page.waitForSelector('.re-desktop-nav-links', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  const data = await page.evaluate(() => {
    const nav = document.querySelector('.re-desktop-nav-links');
    if (!nav) return { error: 'nav not found' };

    const chain = [];
    let el = nav;
    for (let i = 0; i < 6 && el; i++) {
      const r = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      chain.push({
        tag: el.tagName,
        className: el.className,
        rect: { left: Math.round(r.left), width: Math.round(r.width), right: Math.round(r.right) },
        display: cs.display,
        justifyContent: cs.justifyContent,
        alignItems: cs.alignItems,
        margin: cs.margin,
        padding: cs.padding,
        width: cs.width,
        maxWidth: cs.maxWidth
      });
      el = el.parentElement;
    }
    return chain;
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
}
checkAncestors().catch(console.error);
