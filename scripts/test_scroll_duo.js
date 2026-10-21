import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1440, height: 1080 });
  await page.goto('https://reflectionelite.com/?nocache=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });

  // Scroll down smoothly so Chrome paints
  await page.evaluate(async () => {
    const duo = document.querySelector('#teDuoShowcase');
    if (duo) {
      duo.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  });

  await new Promise(r => setTimeout(r, 2000));

  // Check if image is drawn on screen
  const imgState = await page.evaluate(() => {
    const l = document.querySelector('.te-duo-panel-left img');
    const r = document.querySelector('.te-duo-panel-right img');
    return {
      left: { complete: l?.complete, naturalW: l?.naturalWidth, naturalH: l?.naturalHeight, rect: l?.getBoundingClientRect() },
      right: { complete: r?.complete, naturalW: r?.naturalWidth, naturalH: r?.naturalHeight, rect: r?.getBoundingClientRect() }
    };
  });
  console.log('Image state:', imgState);

  // Take a viewport screenshot of the visible screen (where duo is centered)
  await page.screenshot({ path: 'screenshots/duo_showcase_viewport_1440.png' });
  console.log('✓ Saved screenshots/duo_showcase_viewport_1440.png');

  // And also element screenshot
  const duo = await page.$('#teDuoShowcase');
  if (duo) {
    await duo.screenshot({ path: 'screenshots/duo_showcase_element_1440.png' });
    console.log('✓ Saved screenshots/duo_showcase_element_1440.png');
  }

  await browser.close();
}

main().catch(console.error);
