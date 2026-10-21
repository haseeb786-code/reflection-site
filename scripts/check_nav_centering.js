import puppeteer from 'puppeteer';

async function check() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.com/', { waitUntil: 'networkidle2' });
  
  const res = await page.evaluate(() => {
    const row = document.querySelector('.re-nav-row-desktop');
    const inner = document.querySelector('.re-nav-inner');
    const links = document.querySelector('.re-desktop-nav-links');
    
    return {
      rowFound: !!row,
      rowRect: row ? row.getBoundingClientRect() : null,
      innerFound: !!inner,
      innerRect: inner ? inner.getBoundingClientRect() : null,
      innerStyles: inner ? {
        display: getComputedStyle(inner).display,
        justifyContent: getComputedStyle(inner).justifyContent,
        alignItems: getComputedStyle(inner).alignItems,
        margin: getComputedStyle(inner).margin,
        width: getComputedStyle(inner).width,
        maxWidth: getComputedStyle(inner).maxWidth
      } : null,
      linksFound: !!links,
      linksRect: links ? links.getBoundingClientRect() : null,
      linksStyles: links ? {
        display: getComputedStyle(links).display,
        justifyContent: getComputedStyle(links).justifyContent,
        margin: getComputedStyle(links).margin,
        width: getComputedStyle(links).width
      } : null
    };
  });
  console.log(JSON.stringify(res, null, 2));
  await browser.close();
}
check().catch(console.error);
