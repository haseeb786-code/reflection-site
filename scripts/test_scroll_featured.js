import puppeteer from 'puppeteer-core';

async function testWithBypass() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('https://reflectionelite.com/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 6000));
  
  // Scroll down to featured products
  await page.evaluate(() => {
    window.scrollTo(0, 1000);
  });
  await new Promise(r => setTimeout(r, 4000));

  const dims = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.re-product-card-img img')).map(img => ({
      src: img.src,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    }));
  });
  console.log('Images after scroll:', dims);

  const el = await page.$('.re-featured-products-section');
  if (el) {
    await el.screenshot({ path: 'audit_evidence/featured_section_test.png' });
    console.log('Saved audit_evidence/featured_section_test.png');
  }

  await browser.close();
}
testWithBypass().catch(console.error);
