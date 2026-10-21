import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.com/?nocache=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));

  const res = await page.evaluate(() => {
    const duo = document.querySelector('#teDuoShowcase');
    if (!duo) return { foundDuo: false };

    const rPanel = duo.querySelector('.te-duo-panel-right');
    const rInner = duo.querySelector('.te-duo-panel-right .te-duo-panel-inner');
    const rWrap = duo.querySelector('.te-duo-panel-right .te-duo-img-wrap');
    const rImg = duo.querySelector('.te-duo-panel-right img');
    const lImg = duo.querySelector('.te-duo-panel-left img');

    function box(el) {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      const s = window.getComputedStyle(el);
      return {
        w: b.width, h: b.height,
        cssW: s.width, cssH: s.height, maxH: s.maxHeight,
        overflow: s.overflow, objFit: s.objectFit,
        naturalWidth: el.naturalWidth, naturalHeight: el.naturalHeight
      };
    }

    return {
      foundDuo: true,
      rPanel: box(rPanel),
      rInner: box(rInner),
      rWrap: box(rWrap),
      rImg: box(rImg),
      lImg: box(lImg)
    };
  });

  console.dir(res, { depth: null });
  await browser.close();
}

main().catch(console.error);
