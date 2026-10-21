import puppeteer from 'puppeteer-core';

async function checkBody() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('https://reflectionelite.com/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 6000));

  const text = await page.evaluate(() => {
    return {
      title: document.title,
      headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText),
      sections: Array.from(document.querySelectorAll('section')).map(s => s.className),
      bodySnippet: document.body.innerHTML.substring(0, 1000)
    };
  });
  console.log('Page info:', JSON.stringify(text, null, 2));
  await browser.close();
}
checkBody().catch(console.error);
