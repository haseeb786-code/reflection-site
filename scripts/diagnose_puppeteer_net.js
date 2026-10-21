import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function diagnosePuppeteer() {
  console.log('=== DIAGNOSING PUPPETEER NETWORK REQUESTS ON WP-LOGIN.PHP ===');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1440,900',
      '--host-rules=MAP reflectionelite.ataanalytiq.com 191.101.228.14'
    ]
  });

  const page = await browser.newPage();
  
  const reqTimings = [];
  page.on('request', req => {
    reqTimings.push({ url: req.url(), start: Date.now(), status: 'pending' });
  });

  page.on('requestfailed', req => {
    const item = reqTimings.find(r => r.url === req.url());
    if (item) {
      item.status = 'FAILED: ' + (req.failure() ? req.failure().errorText : 'unknown');
      item.duration = Date.now() - item.start;
    }
  });

  page.on('requestfinished', req => {
    const item = reqTimings.find(r => r.url === req.url());
    if (item) {
      item.status = 'OK ' + (req.response() ? req.response().status() : '');
      item.duration = Date.now() - item.start;
    }
  });

  const t0 = Date.now();
  console.log('Navigating to https://reflectionelite.ataanalytiq.com/wp-login.php ...');
  
  try {
    await page.goto('https://reflectionelite.ataanalytiq.com/wp-login.php', { waitUntil: 'domcontentloaded', timeout: 70000 });
    console.log(`Page reached domcontentloaded in ${Date.now() - t0}ms!`);
  } catch(e) {
    console.error(`Page navigation error in ${Date.now() - t0}ms:`, e.message);
  }

  console.log('\n--- NETWORK REQUEST SUMMARY ---');
  reqTimings.forEach(r => {
    console.log(`[${r.duration || (Date.now() - r.start)}ms] ${r.status} -> ${r.url.slice(0, 100)}`);
  });

  await browser.close();
}

diagnosePuppeteer().catch(console.error);
