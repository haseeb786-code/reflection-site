import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('requestfailed', req => console.log('REQ FAILED:', req.url(), req.failure()?.errorText));
  page.on('response', res => {
    if (res.url().includes('20260221') || res.url().includes('20260222') || res.url().includes('arched-led')) {
      console.log('IMAGE RESP:', res.status(), res.url());
    }
  });

  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.com/?nocache=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });

  await page.evaluate(() => {
    document.querySelector('#teDuoShowcase')?.scrollIntoView();
  });

  await new Promise(r => setTimeout(r, 4000));

  const imgInfo = await page.evaluate(() => {
    const l = document.querySelector('.te-duo-panel-left img');
    const r = document.querySelector('.te-duo-panel-right img');
    return {
      left: { src: l?.src, naturalW: l?.naturalWidth, complete: l?.complete },
      right: { src: r?.src, naturalW: r?.naturalWidth, complete: r?.complete }
    };
  });
  console.log('DOM Image Info:', imgInfo);

  await browser.close();
}

main().catch(console.error);
