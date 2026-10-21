import puppeteer from 'puppeteer-core';

async function inspectPage() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.ataanalytiq.com/', { waitUntil: 'domcontentloaded' });
  
  const data = await page.evaluate(() => {
    const headerElements = Array.from(document.querySelectorAll('header, [class*="header"], [id*="header"], [class*="marquee"], [class*="nav"]')).map(el => ({
      tag: el.tagName,
      id: el.id,
      className: typeof el.className === 'string' ? el.className : '',
      parent: el.parentElement ? `${el.parentElement.tagName}.${el.parentElement.className}` : null,
      first100Chars: el.innerText ? el.innerText.slice(0, 100).replace(/\n/g, ' ') : ''
    }));

    return {
      title: document.title,
      headerElements: headerElements.slice(0, 20)
    };
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
}

inspectPage().catch(console.error);
