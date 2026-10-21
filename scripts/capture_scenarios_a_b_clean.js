import puppeteer from 'puppeteer-core';
import path from 'path';

const WP_URL = 'https://reflectionelite.com';
const EVIDENCE_DIR = path.resolve('audit_evidence/screenshots');

async function run() {
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies1 = res1.headers.getSetCookie();
  const cookieHeader = cookies1.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/`);
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const cookies2 = res2.headers.getSetCookie();
  const all = [...cookies1, ...cookies2].map(c => {
    const [nv] = c.split(';');
    const [n, ...v] = nv.split('=');
    return { name: n.trim(), value: v.join('=').trim(), domain: 'reflectionelite.com', path: '/' };
  });
  all.push({ name: 're_test_mode', value: '1', domain: 'reflectionelite.com', path: '/' });

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 950 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled', '--window-size=1440,950']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
  await page.setCookie(...all);

  // 1. Clear cart
  await page.goto(`${WP_URL}/cart/`, { waitUntil: 'networkidle2' });
  while (true) {
    const rem = await page.$('.woocommerce-cart-form a.remove');
    if (!rem) break;
    await rem.click();
    await new Promise(r => setTimeout(r, 2500));
  }

  // 2. Add product 115 (Modern Minimalist Wall Mirror - non-venetian)
  console.log('Navigating to product 115...');
  await page.goto(`${WP_URL}/product/modern-minimalist-wall-mirror/`, { waitUntil: 'networkidle2' });
  const btn = await page.$('.single_add_to_cart_button');
  if (btn) {
    console.log('Clicking Add to Cart button on product 115...');
    await btn.click();
    await new Promise(r => setTimeout(r, 4000));
  }

  // 3. Go to checkout
  console.log('Navigating to checkout...');
  await page.goto(`${WP_URL}/checkout/`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 3000));

  // Scenario A: Full payment with Razorpay
  console.log('Applying Scenario A: 100% Full Payment with Razorpay...');
  await page.evaluate(() => {
    const fullRadio = document.querySelector('input[name="re_payment_plan_choice"][value="full"]');
    if (fullRadio) {
      fullRadio.checked = true;
      jQuery(fullRadio).trigger('change');
    }
    const rzp = document.querySelector('#payment_method_razorpay');
    if (rzp) {
      rzp.checked = true;
      jQuery(rzp).trigger('change');
    }
  });
  await new Promise(r => setTimeout(r, 5000));

  const shotA = path.join(EVIDENCE_DIR, '3_scenario_a_checkout_full_payment.png');
  await page.screenshot({ path: shotA, fullPage: true });
  console.log('✅ Captured Scenario A:', shotA);

  // Scenario B: Switch to Deposit
  console.log('Applying Scenario B: 50% Advance Deposit with Razorpay...');
  await page.evaluate(() => {
    const depRadio = document.querySelector('input[name="re_payment_plan_choice"][value="deposit"]');
    if (depRadio) {
      depRadio.checked = true;
      jQuery(depRadio).trigger('change');
    }
  });
  await new Promise(r => setTimeout(r, 5000));

  const shotB = path.join(EVIDENCE_DIR, '4_scenario_b_checkout_deposit.png');
  await page.screenshot({ path: shotB, fullPage: true });
  console.log('✅ Captured Scenario B:', shotB);

  await browser.close();
  console.log('ALL COMPLETE!');
}

run().catch(console.error);
