import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('https://reflectionelite.com/shop/?nocache=' + Date.now(), { waitUntil: 'domcontentloaded' });

  const ham = await page.$('.re-hamburger-btn');
  console.log('Found .re-hamburger-btn?', !!ham);
  if (ham) {
    await ham.click();
    await new Promise(r => setTimeout(r, 600));
    const drawerDisplay = await page.evaluate(() => {
      const d = document.querySelector('#reMobileDrawer') || document.querySelector('.re-mobile-drawer');
      return d ? { display: window.getComputedStyle(d).display, class: d.className } : null;
    });
    console.log('Drawer after click:', drawerDisplay);
    await page.screenshot({ path: 'verify_shop_menu_open_mobile_390.png' });
    console.log('Saved verify_shop_menu_open_mobile_390.png');
  }
  await browser.close();
}

main().catch(console.error);
