import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectProdLive() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
  await page.goto('https://reflectionelite.com/', { waitUntil: 'domcontentloaded' });

  const data = await page.evaluate(() => {
    const headers = Array.from(document.querySelectorAll('header, [class*="header"], [class*="marquee"], [class*="nav"]')).map(el => ({
      tagName: el.tagName,
      className: typeof el.className === 'string' ? el.className : '',
      id: el.id,
      textSnippet: el.innerText ? el.innerText.slice(0, 100).replace(/\n/g, ' ') : ''
    }));

    return {
      title: document.title,
      headers: headers.slice(0, 10)
    };
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
}

inspectProdLive().catch(console.error);
