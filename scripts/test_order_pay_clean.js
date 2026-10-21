import puppeteer from 'puppeteer-core';
import path from 'path';

const ORDER_PAY_URL = 'https://reflectionelite.com/checkout/order-pay/92/?key=wc_order_UdlpQ4AwpBhWL';

async function testOrderPayClean() {
  console.log('=== CLEAN INCOGNITO BROWSER TEST (NO EXTENSIONS) ===');
  console.log('Target URL:', ORDER_PAY_URL);

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-extensions',
      '--disable-component-extensions-with-background-pages',
      '--incognito',
      '--disable-default-apps',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const networkRequests = [];
  const consoleLogs = [];

  page.on('console', msg => {
    const entry = { type: msg.type(), text: msg.text(), location: msg.location() };
    consoleLogs.push(entry);
    console.log(`[Browser ${msg.type().toUpperCase()}]`, msg.text());
  });

  page.on('pageerror', err => {
    console.log('[Page Uncaught Error]', err.message);
  });

  page.on('request', req => {
    const url = req.url();
    if (url.includes('razorpay') || url.includes('checkout')) {
      networkRequests.push({ type: 'REQ', url, method: req.method(), resourceType: req.resourceType() });
      console.log(`[Network -> REQ] [${req.resourceType()}] ${url}`);
    }
  });

  page.on('response', res => {
    const url = res.url();
    if (url.includes('razorpay') || url.includes('checkout')) {
      networkRequests.push({ type: 'RES', url, status: res.status(), fromCache: res.fromCache(), fromServiceWorker: res.fromServiceWorker() });
      console.log(`[Network <- RES ${res.status()}] ${url} (fromCache: ${res.fromCache()})`);
    }
  });

  page.on('requestfailed', req => {
    const url = req.url();
    console.log(`[Network !! FAILED] ${url} - Error: ${req.failure()?.errorText}`);
    networkRequests.push({ type: 'FAIL', url, error: req.failure()?.errorText });
  });

  console.log('\nNavigating to page...');
  const response = await page.goto(ORDER_PAY_URL, { waitUntil: 'networkidle2', timeout: 30000 });
  console.log('Page Navigation Status:', response.status());

  // Wait 4 seconds for scripts to execute and any modals/beacons
  await new Promise(r => setTimeout(r, 4000));

  // Evaluate DOM and Razorpay state
  const evalState = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script')).map(s => ({
      src: s.src,
      id: s.id,
      defer: s.defer,
      async: s.async
    })).filter(s => s.src.includes('razorpay') || s.id.includes('razorpay'));

    const rzpObj = typeof window.Razorpay !== 'undefined';
    const iframe = document.querySelector('iframe.razorpay-checkout-frame');
    const container = document.querySelector('.razorpay-container');
    const payBtn = document.getElementById('btn-razorpay');
    const cancelBtn = document.getElementById('btn-razorpay-cancel');

    return {
      windowRazorpayDefined: rzpObj,
      windowRazorpayType: typeof window.Razorpay,
      scriptsOnPage: scripts,
      payBtnExists: !!payBtn,
      payBtnDisabled: payBtn ? payBtn.disabled : null,
      payBtnText: payBtn ? payBtn.innerText : null,
      cancelBtnExists: !!cancelBtn,
      iframeExists: !!iframe,
      containerExists: !!container
    };
  });

  console.log('\n=== DOM & RAZORPAY EVALUATION ===');
  console.log(JSON.stringify(evalState, null, 2));

  // If iframe or container is not open yet, let's try clicking #btn-razorpay
  if (!evalState.iframeExists) {
    console.log('\nTesting click on #btn-razorpay...');
    try {
      await page.click('#btn-razorpay');
      console.log('Clicked #btn-razorpay, waiting 4s...');
      await new Promise(r => setTimeout(r, 4000));

      const afterClickState = await page.evaluate(() => {
        const iframe = document.querySelector('iframe.razorpay-checkout-frame');
        const container = document.querySelector('.razorpay-container');
        return {
          iframeExists: !!iframe,
          iframeSrc: iframe ? iframe.src : null,
          containerExists: !!container
        };
      });
      console.log('After Click Evaluation:', JSON.stringify(afterClickState, null, 2));
    } catch (e) {
      console.error('Error clicking #btn-razorpay:', e.message);
    }
  }

  const screenshotPath = path.resolve('audit_evidence', 'screenshots', 'order_pay_incognito_clean.png');
  await page.screenshot({ path: screenshotPath });
  console.log('\nSaved screenshot:', screenshotPath);

  await browser.close();
  console.log('\n=== TEST COMPLETE ===');
}

testOrderPayClean().catch(console.error);
