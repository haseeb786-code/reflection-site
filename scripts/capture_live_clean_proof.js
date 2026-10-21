import puppeteer from 'puppeteer-core';
import path from 'path';

const WP_URL = 'https://reflectionelite.com';

async function captureProof() {
  console.log('Capturing visual proof of clean header without raw CSS (waiting for Cloudflare challenge)...');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Home top view
  console.log('Navigating to Home...');
  await page.goto(`${WP_URL}/`, { waitUntil: 'domcontentloaded' });
  console.log('Waiting 8s for challenge to resolve...');
  await new Promise(r => setTimeout(r, 8000));

  await page.screenshot({ path: path.resolve('audit_evidence', 'screenshots', 'clean_header_verified.png') });
  console.log('Saved: audit_evidence/screenshots/clean_header_verified.png');

  // 2. Checkout view
  console.log('Navigating to Checkout...');
  await page.goto(`${WP_URL}/checkout/`, { waitUntil: 'domcontentloaded' });
  console.log('Waiting 5s...');
  await new Promise(r => setTimeout(r, 5000));
  await page.screenshot({ path: path.resolve('audit_evidence', 'screenshots', 'clean_checkout_verified.png') });
  console.log('Saved: audit_evidence/screenshots/clean_checkout_verified.png');

  await browser.close();
  console.log('Visual proof capture complete!');
}

captureProof().catch(console.error);
