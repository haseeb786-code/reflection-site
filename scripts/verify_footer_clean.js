import puppeteer from 'puppeteer-core';

async function checkFooter() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Opening page...');
  await page.goto('https://reflectionelite.com/?nocache=' + Date.now(), { waitUntil: 'networkidle2', timeout: 40000 });
  
  // Wait for Cloudflare/Hostinger challenge
  console.log('Waiting for verification challenge to pass...');
  await new Promise(r => setTimeout(r, 7000));

  console.log('Current page title:', await page.title());
  console.log('Current URL:', page.url());

  // Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: 'footer_verified_clean.png' });
  console.log('Saved footer_verified_clean.png');
  await browser.close();
}

checkFooter().catch(console.error);
