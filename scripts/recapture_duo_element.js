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

  // Wait for all images on page to fully load
  await page.waitForFunction(() => {
    const imgs = Array.from(document.querySelectorAll('#teCatShowcase img, #teDuoShowcase img'));
    return imgs.length > 0 && imgs.every(img => img.complete && img.naturalHeight > 0);
  }, { timeout: 30000 });

  await new Promise(r => setTimeout(r, 1000));

  const duo = await page.$('#teDuoShowcase');
  if (duo) {
    await duo.screenshot({ path: 'screenshots/duo_showcase_element_1440.png' });
    console.log('✓ Recaptured duo_showcase_element_1440.png with 100% loaded image');
  }

  await browser.close();
}

main().catch(console.error);
