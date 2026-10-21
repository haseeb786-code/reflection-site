import puppeteer from 'puppeteer-core';
import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));

async function inspectLiveDom() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
  
  // Set cookies
  const puppeteerCookies = cookies.map(c => ({
    name: c.name,
    value: c.value,
    domain: 'reflectionelite.ataanalytiq.com',
    path: '/'
  }));
  await page.setCookie(...puppeteerCookies);

  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://reflectionelite.ataanalytiq.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000));

  const analysis = await page.evaluate(() => {
    const reMobileDrawer = document.querySelector('#reMobileDrawer');
    const drawerStyle = reMobileDrawer ? window.getComputedStyle(reMobileDrawer) : null;

    const allHeaders = Array.from(document.querySelectorAll('header, .re-unified-header-container, .site-header')).map(el => ({
      tagName: el.tagName,
      className: el.className,
      rect: el.getBoundingClientRect(),
      display: window.getComputedStyle(el).display,
      position: window.getComputedStyle(el).position
    }));

    const styleTags = Array.from(document.querySelectorAll('style')).map(s => ({
      id: s.id,
      textLength: s.innerText.length,
      hasPInside: s.innerHTML.includes('<p>')
    }));

    return {
      title: document.title,
      drawerDisplay: drawerStyle ? drawerStyle.display : 'NOT_FOUND',
      drawerVisibility: drawerStyle ? drawerStyle.visibility : 'NOT_FOUND',
      drawerClasses: reMobileDrawer ? reMobileDrawer.className : 'NOT_FOUND',
      allHeaders,
      styleTags
    };
  });

  console.log(JSON.stringify(analysis, null, 2));
  await browser.close();
}

inspectLiveDom().catch(console.error);
