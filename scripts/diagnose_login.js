import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ADMIN_URL = 'https://reflectionelite.ataanalytiq.com/wp-admin';
const USERNAME = 'reflectionelite';
const PASSWORD = 'process.env.PROD_WP_PASS || ""';

async function diagnose() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1440,900'
    ],
    ignoreDefaultArgs: ['--enable-automation']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  // Remove webdriver flag
  await page.evaluateOnNewDocument(() => {
    delete Object.getPrototypeOf(navigator).webdriver;
  });

  console.log('Going to:', ADMIN_URL);
  await page.goto(ADMIN_URL, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  console.log('Current URL after initial load:', page.url());
  console.log('Page Title:', await page.title());

  // Wait if there's any challenge
  if ((await page.title()).includes('Checking your browser') || (await page.title()).includes('Just a moment')) {
    console.log('Detected challenge, waiting 8 seconds for auto-redirect...');
    await new Promise(r => setTimeout(r, 8000));
    console.log('URL after wait:', page.url());
    console.log('Title after wait:', await page.title());
  }

  await page.screenshot({ path: 'login_screen_1.png' });

  // Check form inputs
  const formInfo = await page.evaluate(() => {
    const form = document.querySelector('form');
    if (!form) return { error: 'No form found', bodySnippet: document.body.innerHTML.slice(0, 500) };
    const inputs = Array.from(form.querySelectorAll('input, select, textarea, button')).map(el => ({
      tag: el.tagName,
      type: el.type,
      name: el.name,
      id: el.id,
      value: el.value
    }));
    return {
      action: form.action,
      method: form.method,
      inputs
    };
  });
  console.log('Form Info:', JSON.stringify(formInfo, null, 2));

  if (!await page.$('#user_login')) {
    console.error('Could not find #user_login!');
    await browser.close();
    return;
  }

  // Type credentials
  console.log('Typing username & password...');
  await page.type('#user_login', USERNAME, { delay: 30 });
  await page.type('#user_pass', PASSWORD, { delay: 30 });

  await page.screenshot({ path: 'login_screen_2_filled.png' });

  console.log('Submitting form via form.submit() directly in browser context...');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(e => console.log('Navigation warning:', e.message)),
    page.evaluate(() => {
      document.querySelector('form#loginform').submit();
    })
  ]);

  console.log('Waiting 5 seconds for page load / redirect...');
  await new Promise(r => setTimeout(r, 5000));

  console.log('Post-submit URL:', page.url());
  console.log('Post-submit Title:', await page.title());
  await page.screenshot({ path: 'login_screen_3_post_submit.png' });

  // Check cookies
  const cookies = await page.cookies();
  console.log('Cookies count:', cookies.length);
  cookies.forEach(c => console.log('Cookie:', c.name, c.domain));

  await browser.close();
}

diagnose().catch(console.error);
