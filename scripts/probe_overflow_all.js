import puppeteer from 'puppeteer-core';

const VIEWPORTS = [320, 360, 375, 390, 414, 430];
const PAGES = [
  { name: 'home', url: 'https://reflectionelite.com/' },
  { name: 'shop', url: 'https://reflectionelite.com/shop/' },
  { name: 'bespoke', url: 'https://reflectionelite.com/custom-dimensions/' },
  { name: 'story', url: 'https://reflectionelite.com/about-us/' },
  { name: 'contact', url: 'https://reflectionelite.com/contact/' }
];

async function probe() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1');

  for (const vpW of [320, 375]) {
    console.log(`\n================ VP: ${vpW}px ================`);
    await page.setViewport({ width: vpW, height: 750 });
    for (const p of PAGES) {
      await page.goto(p.url, { waitUntil: 'domcontentloaded' });
      await new Promise(r => setTimeout(r, 4500));
      const report = await page.evaluate((vpW) => {
        const issues = [];
        const all = document.querySelectorAll('*');
        for (const el of all) {
          if (['HTML', 'BODY', 'SCRIPT', 'STYLE', 'HEAD', 'META', 'LINK'].includes(el.tagName)) continue;
          const r = el.getBoundingClientRect();
          // Exclude horizontal scroll containers themselves like .re-filter-pills
          if (el.classList.contains('re-filter-pills')) continue;
          if (r.right > vpW + 2) {
            const snippet = (el.innerText || el.className || el.tagName).trim().substring(0, 35);
            issues.push({
              tag: el.tagName,
              cls: typeof el.className === 'string' ? el.className.split(' ').slice(0, 2).join('.') : '',
              id: el.id,
              width: Math.round(r.width),
              left: Math.round(r.left),
              right: Math.round(r.right),
              overflowPx: Math.round(r.right - vpW),
              snippet
            });
          }
        }
        return {
          pageWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          issueCount: issues.length,
          topIssues: issues.slice(0, 8)
        };
      }, vpW);
      console.log(`Page: ${p.name.toUpperCase()} (VP ${vpW}) -> Overflowing Element Count: ${report.issueCount}`);
      if (report.topIssues.length > 0) {
        console.log(' Top Issues:', JSON.stringify(report.topIssues, null, 2));
      }
    }
  }
  await browser.close();
}
probe().catch(console.error);
