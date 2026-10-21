import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function extractHeaderDetails(url) {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 2000));

  const data = await page.evaluate(() => {
    const announcementEl = document.querySelector('.announcement-bar, .top-bar, .top-banner, .shipping-bar');
    const headerEl = document.querySelector('header, .site-header, #masthead');
    const logoEl = document.querySelector('.header-logo, .site-logo, .custom-logo, img[alt*="Reflection"]');
    const navEl = document.querySelector('nav, .nav-desktop, .main-navigation');
    const actionEl = document.querySelector('.header-actions, .header-action, .btn-action');

    return {
      title: document.title,
      announcementBarText: announcementEl ? announcementEl.innerText.trim() : null,
      announcementBarHtml: announcementEl ? announcementEl.outerHTML : null,
      logoHtml: logoEl ? logoEl.outerHTML : null,
      logoSrc: logoEl?.tagName === 'IMG' ? logoEl.src : logoEl?.querySelector('img')?.src,
      headerHtml: headerEl ? headerEl.outerHTML.slice(0, 1500) : null,
      navLinks: Array.from(document.querySelectorAll('nav a, .nav-desktop a, .main-navigation a')).map(a => ({
        text: a.innerText.trim(),
        href: a.href
      })),
      actionBtn: actionEl ? { text: actionEl.innerText.trim(), href: actionEl.getAttribute('href') || actionEl.querySelector('a')?.getAttribute('href') } : null
    };
  });

  await browser.close();
  return data;
}

async function run() {
  console.log('--- Fetching LIVE details from reflectionelite.com ---');
  const live = await extractHeaderDetails('https://reflectionelite.com/');
  console.log('LIVE Announcement Bar Text:', live.announcementBarText);
  console.log('LIVE Announcement Bar HTML:', live.announcementBarHtml);
  console.log('LIVE Logo HTML:', live.logoHtml);
  console.log('LIVE Logo Src:', live.logoSrc);
  console.log('LIVE Nav Links:', JSON.stringify(live.navLinks, null, 2));
  console.log('LIVE Action Button:', JSON.stringify(live.actionBtn, null, 2));

  console.log('\n--- Fetching STAGING details from reflectionelite.ataanalytiq.com ---');
  const staging = await extractHeaderDetails('https://reflectionelite.ataanalytiq.com/');
  console.log('STAGING Announcement Bar Text:', staging.announcementBarText);
  console.log('STAGING Announcement Bar HTML:', staging.announcementBarHtml);
  console.log('STAGING Logo HTML:', staging.logoHtml);
  console.log('STAGING Logo Src:', staging.logoSrc);
  console.log('STAGING Nav Links:', JSON.stringify(staging.navLinks, null, 2));
  console.log('STAGING Action Button:', JSON.stringify(staging.actionBtn, null, 2));
}

run().catch(console.error);
