import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function checkPages() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const urls = [
    { name: 'home', url: 'https://reflectionelite.com/' },
    { name: 'shop', url: 'https://reflectionelite.com/shop/' },
    { name: 'about', url: 'https://reflectionelite.com/about-us/' },
    { name: 'contact', url: 'https://reflectionelite.com/contact/' },
    { name: 'privacy', url: 'https://reflectionelite.com/privacy-policy-2/' },
    { name: 'custom', url: 'https://reflectionelite.com/custom-dimensions/' }
  ];

  for (const item of urls) {
    const page = await browser.newPage();
    try {
      await page.goto(item.url + '?nocache=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForFunction(() => !document.body.innerText.includes('Checking your browser'), { timeout: 15000 }).catch(() => {});
      await new Promise(r => setTimeout(r, 2000));

      const evaluation = await page.evaluate(() => {
        const luxuryStyle = document.querySelector('#te-global-luxury-system');
        const anyStyle = Array.from(document.querySelectorAll('style')).map(s => s.id || s.className || 'unnamed');
        const bodyBg = window.getComputedStyle(document.body).backgroundColor;
        const bodyColor = window.getComputedStyle(document.body).color;
        const h1 = document.querySelector('h1');
        const h1Font = h1 ? window.getComputedStyle(h1).fontFamily : 'no-h1';
        const h1Color = h1 ? window.getComputedStyle(h1).color : 'no-h1';
        const htmlSnippet = document.body.innerHTML.slice(0, 1000);
        const teLivePage = !!document.querySelector('.te-live-page');
        const reStory = !!document.querySelector('.re-story-page-wrapper');
        const reContact = !!document.querySelector('.re-contact-page-wrapper');

        return {
          hasLuxuryStyle: !!luxuryStyle,
          luxuryStyleLength: luxuryStyle ? luxuryStyle.innerHTML.length : 0,
          totalStyles: anyStyle.length,
          styleIds: anyStyle.slice(0, 10),
          bodyBg,
          bodyColor,
          h1Font,
          h1Color,
          teLivePage,
          reStory,
          reContact,
          htmlLength: document.documentElement.outerHTML.length
        };
      });

      console.log(`\n=== PAGE: ${item.name} (${item.url}) ===`);
      console.log(JSON.stringify(evaluation, null, 2));

      // Also save screenshot to see what it actually looks like
      await page.screenshot({ path: `debug_${item.name}.png`, fullPage: false });
    } catch (e) {
      console.error(`Error loading ${item.name}:`, e.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
}

checkPages().catch(console.error);
