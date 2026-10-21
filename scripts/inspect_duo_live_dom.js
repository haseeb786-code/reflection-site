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

  const info = await page.evaluate(() => {
    const leftImg = document.querySelector('.te-duo-panel-left img');
    const rightImg = document.querySelector('.te-duo-panel-right img');
    const leftWrap = document.querySelector('.te-duo-panel-left .te-duo-img-wrap');
    const rightWrap = document.querySelector('.te-duo-panel-right .te-duo-img-wrap');
    const catImg = document.querySelector('.te-cat-showcase-img');

    function getDetails(el) {
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        overflow: style.overflow,
        maxHeight: style.maxHeight,
        height: style.height,
        width: style.width,
        src: el.src || null,
        naturalWidth: el.naturalWidth || 0,
        naturalHeight: el.naturalHeight || 0
      };
    }

    return {
      leftWrap: getDetails(leftWrap),
      leftImg: getDetails(leftImg),
      rightWrap: getDetails(rightWrap),
      rightImg: getDetails(rightImg),
      catImg: getDetails(catImg)
    };
  });

  console.dir(info, { depth: null });
  await browser.close();
}

main().catch(console.error);
