import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function verifyPolish() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1');

  // Verify shop
  console.log('Testing /shop/...');
  await page.goto('https://reflectionelite.com/shop/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 6500));

  // Test filter click on contemporary (single result)
  const filterResults = await page.evaluate(() => {
    const contemporaryBtn = document.querySelector('.re-pill-btn[data-filter="contemporary"]');
    if (contemporaryBtn) contemporaryBtn.click();
    const countText = document.querySelector('.re-toolbar-count')?.innerText;
    const singleCard = document.querySelector('.re-catalog-card[data-category="contemporary"]');
    const priceText = singleCard?.querySelector('.re-catalog-card-price')?.innerText;
    const gridHasSingle = document.getElementById('re-catalog-products-grid')?.classList.contains('re-single-result');
    return { countText, priceText, gridHasSingle };
  });
  console.log('Filter Contemporary Test:', JSON.stringify(filterResults));

  await page.screenshot({ path: './audit_mobile_screenshots/verified/shop_contemporary_single_verified.png' });

  // Reset to all
  await page.evaluate(() => {
    document.querySelector('.re-pill-btn[data-filter="all"]')?.click();
  });
  await page.screenshot({ path: './audit_mobile_screenshots/verified/shop_all_polished.png', fullPage: true });

  // Verify story studio card WhatsApp button
  console.log('Testing /about-us/...');
  await page.goto('https://reflectionelite.com/about-us/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 6500));

  const waStyles = await page.evaluate(() => {
    const waBtn = document.querySelector('.re-studio-btn-group a.re-btn-outline-gold');
    const cs = waBtn ? window.getComputedStyle(waBtn) : null;
    return {
      bg: cs ? cs.backgroundColor : null,
      color: cs ? cs.color : null,
      borderColor: cs ? cs.borderColor : null
    };
  });
  console.log('WhatsApp Button Styles on Mobile:', JSON.stringify(waStyles));
  await page.screenshot({ path: './audit_mobile_screenshots/verified/story_studio_card_polished.png', fullPage: true });

  await browser.close();
  console.log('Verification completed successfully!');
}

verifyPolish().catch(console.error);
