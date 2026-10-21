import puppeteer from 'puppeteer';

async function checkElements() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.com/', { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 4000));

  const data = await page.evaluate(() => {
    // Search for any anchor containing "HOME"
    const allLinks = Array.from(document.querySelectorAll('a'));
    const homeLinks = allLinks.filter(a => a.textContent.trim().toUpperCase() === 'HOME');
    return homeLinks.map(a => ({
      text: a.textContent.trim(),
      href: a.href,
      className: a.className,
      rect: a.getBoundingClientRect(),
      parentTag: a.parentElement ? a.parentElement.tagName : null,
      parentClass: a.parentElement ? a.parentElement.className : null,
      grandParentTag: a.parentElement?.parentElement ? a.parentElement.parentElement.tagName : null,
      grandParentClass: a.parentElement?.parentElement ? a.parentElement.parentElement.className : null,
      greatGrandParentTag: a.parentElement?.parentElement?.parentElement ? a.parentElement.parentElement.parentElement.tagName : null,
      greatGrandParentClass: a.parentElement?.parentElement?.parentElement ? a.parentElement.parentElement.parentElement.className : null
    }));
  });

  console.log('Home links found:', JSON.stringify(data, null, 2));
  await browser.close();
}
checkElements().catch(console.error);
