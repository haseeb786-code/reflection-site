import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'https://reflectionelite.com/checkout/order-pay/92/?key=wc_order_UdlpQ4AwpBhWL';

async function testWithPuppeteer() {
  console.log('Launching Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE ${msg.type()}]:`, msg.text());
  });

  page.on('pageerror', err => {
    console.log('[BROWSER UNCAUGHT ERROR]:', err.message);
  });

  page.on('requestfailed', req => {
    console.log('[REQUEST FAILED]:', req.url(), req.failure()?.errorText);
  });

  console.log(`Navigating to ${URL}...`);
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });

  // Check state of #btn-razorpay
  const btnInfo = await page.evaluate(() => {
    const btn = document.getElementById('btn-razorpay');
    if (!btn) return { exists: false };
    return {
      exists: true,
      text: btn.innerText,
      disabled: btn.disabled,
      hasDisabledAttr: btn.hasAttribute('disabled'),
      style: btn.getAttribute('style'),
      rect: btn.getBoundingClientRect()
    };
  });
  console.log('Button state on page load:', btnInfo);

  // Check if Razorpay iframe or modal container exists in DOM
  const rzpElements = await page.evaluate(() => {
    const iframes = Array.from(document.querySelectorAll('iframe')).map(i => i.src);
    const modal = document.querySelector('.razorpay-container');
    return {
      iframes,
      hasContainer: !!modal,
      razorpayType: typeof window.Razorpay,
      hasVars: typeof window.razorpay_wc_checkout_vars !== 'undefined',
      vars: window.razorpay_wc_checkout_vars
    };
  });
  console.log('Razorpay DOM state before click:', rzpElements);

  // Now click the button!
  console.log('Clicking #btn-razorpay...');
  try {
    await page.click('#btn-razorpay');
  } catch (err) {
    console.log('Click error:', err.message);
  }

  // Wait 4 seconds to observe
  await new Promise(r => setTimeout(r, 4000));

  const afterClickState = await page.evaluate(() => {
    const iframes = Array.from(document.querySelectorAll('iframe')).map(i => ({ src: i.src, display: window.getComputedStyle(i).display }));
    const modal = document.querySelector('.razorpay-container');
    return {
      iframes,
      hasContainer: !!modal,
      containerHtml: modal ? modal.outerHTML.slice(0, 300) : null
    };
  });
  console.log('Razorpay DOM state after click:', afterClickState);

  await browser.close();
}

testWithPuppeteer().catch(console.error);
