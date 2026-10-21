import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\414d7e40-4d4d-49c9-8868-01c3c84a4783';

async function saveScreenshot(page, filename) {
  const localPath = path.resolve(filename);
  const artifactPath = path.join(ARTIFACT_DIR, filename);
  await page.screenshot({ path: localPath, fullPage: false });
  try {
    fs.copyFileSync(localPath, artifactPath);
  } catch (e) {
    console.error('Error copying artifact:', e.message);
  }
  console.log(`✓ Screenshot saved: ${filename}`);
}

async function auditStaging() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

  const pagesToAudit = [
    { label: 'Home', url: 'https://reflectionelite.ataanalytiq.com/', file: 'staging_audit_01_home.png' },
    { label: 'Shop', url: 'https://reflectionelite.ataanalytiq.com/shop/', file: 'staging_audit_02_shop.png' },
    { label: 'Single Product (Murana)', url: 'https://reflectionelite.ataanalytiq.com/product/murana-mirror/', file: 'staging_audit_03_product.png' },
    { label: 'About Us', url: 'https://reflectionelite.ataanalytiq.com/about-us/', file: 'staging_audit_04_about.png' },
    { label: 'Contact', url: 'https://reflectionelite.ataanalytiq.com/contact/', file: 'staging_audit_05_contact.png' },
    { label: 'Privacy Policy', url: 'https://reflectionelite.ataanalytiq.com/privacy-policy-2/', file: 'staging_audit_06_privacy.png' },
    { label: 'Refund Policy', url: 'https://reflectionelite.ataanalytiq.com/refund-policy/', file: 'staging_audit_07_refund.png' },
    { label: 'Shipping Policy', url: 'https://reflectionelite.ataanalytiq.com/shipping-policy/', file: 'staging_audit_08_shipping.png' },
    { label: 'Terms of Service', url: 'https://reflectionelite.ataanalytiq.com/terms-of-service/', file: 'staging_audit_09_terms.png' },
    { label: 'Cart', url: 'https://reflectionelite.ataanalytiq.com/cart/', file: 'staging_audit_10_cart.png' },
    { label: 'Book Survey / Custom Dimensions', url: 'https://reflectionelite.ataanalytiq.com/custom-dimensions/', file: 'staging_audit_11_survey.png' }
  ];

  console.log('=== AUDITING STAGING PAGES (reflectionelite.ataanalytiq.com) ===\n');

  for (const item of pagesToAudit) {
    console.log(`\n--------------------------------------------------`);
    console.log(`Checking ${item.label}: ${item.url}`);
    try {
      const res = await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 2000));
      const status = res ? res.status() : 'NO_RES';
      const title = await page.title();
      
      const details = await page.evaluate(() => {
        const topBanner = document.querySelector('.announcement-bar, .top-bar, .top-banner')?.innerText?.trim() || 'NOT FOUND';
        const logo = document.querySelector('.header-logo, .site-logo, .custom-logo, img[alt*="Reflection"]')?.outerHTML || 'NOT FOUND';
        const nav = Array.from(document.querySelectorAll('nav a, .nav-desktop a, .main-nav a')).map(a => `${a.innerText.trim()} -> ${a.getAttribute('href')}`);
        const actionBtn = document.querySelector('.btn-action, .header-quote-btn, .header-actions a')?.outerHTML || 'NOT FOUND';
        return { topBanner, logo, nav, actionBtn };
      });

      console.log(`  HTTP Status: ${status}`);
      console.log(`  Title: "${title}"`);
      console.log(`  Top Banner: "${details.topBanner}"`);
      console.log(`  Logo: ${details.logo.slice(0, 100)}...`);
      console.log(`  Nav Links (${details.nav.length}):`, details.nav);
      console.log(`  Action Button: ${details.actionBtn.slice(0, 100)}`);

      await saveScreenshot(page, item.file);
    } catch (err) {
      console.error(`  ERROR on ${item.label}:`, err.message);
    }
  }

  await browser.close();
}

auditStaging().catch(console.error);
