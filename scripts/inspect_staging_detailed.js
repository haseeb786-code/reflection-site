import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\414d7e40-4d4d-49c9-8868-01c3c84a4783';

async function check() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  console.log('Navigating to https://reflectionelite.ataanalytiq.com/ ...');
  await page.goto('https://reflectionelite.ataanalytiq.com/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 3000));

  await page.screenshot({ path: 'staging_home_initial.png' });
  fs.copyFileSync('staging_home_initial.png', path.join(ARTIFACT_DIR, 'staging_home_initial.png'));

  const data = await page.evaluate(() => {
    return {
      title: document.title,
      announcementBar: document.querySelector('.announcement-bar, .top-bar, .top-banner, .shipping-bar')?.innerText || 'NOT FOUND',
      announcementBarHtml: document.querySelector('.announcement-bar, .top-bar, .top-banner, .shipping-bar')?.outerHTML || null,
      logoElement: document.querySelector('.header-logo, .site-logo, .custom-logo, img[alt*="Reflection"]')?.outerHTML || 'NOT FOUND',
      headerHtml: (document.querySelector('header, .site-header, #masthead')?.outerHTML || '').slice(0, 800),
      navLinks: Array.from(document.querySelectorAll('nav a, header a, .nav-desktop a, .main-navigation a')).map(a => ({
        text: a.innerText.trim(),
        href: a.href
      })),
      footerLinks: Array.from(document.querySelectorAll('footer a, .site-footer a')).map(a => ({
        text: a.innerText.trim(),
        href: a.href
      }))
    };
  });

  console.log('--- Staging Home Inspection Results ---');
  console.log('Title:', data.title);
  console.log('Announcement Bar Text:', data.announcementBar);
  console.log('Logo Element:', data.logoElement);
  console.log('Nav Links Count:', data.navLinks.length);
  console.log('Nav Links:', JSON.stringify(data.navLinks, null, 2));
  console.log('Footer Links Count:', data.footerLinks.length);
  console.log('Footer Links:', JSON.stringify(data.footerLinks, null, 2));

  await browser.close();
}

check().catch(console.error);
