import puppeteer from 'puppeteer-core';
import { getProdAuth } from './prod_auth_helper.js';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const auth = await getProdAuth();
  console.log('1. Launching Chrome with cookies...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  // Set cookies
  const cookiePairs = auth.cookies.split('; ').map(c => {
    const [name, ...valParts] = c.split('=');
    return {
      name,
      value: valParts.join('='),
      domain: 'reflectionelite.com',
      path: '/'
    };
  });
  await page.setCookie(...cookiePairs);

  console.log('2. Navigating to WooCommerce Accounts & Privacy tab in wp-admin...');
  await page.goto('https://reflectionelite.com/wp-admin/admin.php?page=wc-settings&tab=account', { waitUntil: 'networkidle2', timeout: 45000 });

  console.log('Page Title:', await page.title());

  // Check state of #woocommerce_enable_myaccount_registration
  const isRegChecked = await page.$eval('#woocommerce_enable_myaccount_registration', el => el.checked);
  console.log('Current woocommerce_enable_myaccount_registration checked:', isRegChecked);

  if (!isRegChecked) {
    console.log('Checking #woocommerce_enable_myaccount_registration...');
    await page.click('#woocommerce_enable_myaccount_registration');
  }

  // Check state of generate password - we want customer to enter their own password
  const isGenPassChecked = await page.$eval('#woocommerce_registration_generate_password', el => el.checked);
  console.log('Current woocommerce_registration_generate_password checked:', isGenPassChecked);
  if (isGenPassChecked) {
    console.log('Unchecking #woocommerce_registration_generate_password so customer enters password...');
    await page.click('#woocommerce_registration_generate_password');
  }

  // Ensure generate username is checked
  const isGenUserChecked = await page.$eval('#woocommerce_registration_generate_username', el => el.checked);
  console.log('Current woocommerce_registration_generate_username checked:', isGenUserChecked);
  if (!isGenUserChecked) {
    console.log('Checking #woocommerce_registration_generate_username...');
    await page.click('#woocommerce_registration_generate_username');
  }

  console.log('3. Clicking Save changes button...');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 45000 }),
    page.click('.woocommerce-save-button')
  ]);

  console.log('4. Verification after save:');
  const finalReg = await page.$eval('#woocommerce_enable_myaccount_registration', el => el.checked);
  const finalGenPass = await page.$eval('#woocommerce_registration_generate_password', el => el.checked);
  const finalGenUser = await page.$eval('#woocommerce_registration_generate_username', el => el.checked);
  console.log('FINAL woocommerce_enable_myaccount_registration checked:', finalReg);
  console.log('FINAL woocommerce_registration_generate_password checked:', finalGenPass);
  console.log('FINAL woocommerce_registration_generate_username checked:', finalGenUser);

  const notice = await page.evaluate(() => {
    const el = document.querySelector('.woocommerce-message');
    return el ? el.innerText.trim() : 'No notice';
  });
  console.log('Save notice:', notice);

  // Clear Hostinger CDN cache
  console.log('5. Purging Hostinger CDN cache...');
  await page.goto('https://reflectionelite.com/wp-admin/admin.php?page=hostinger-tools', { waitUntil: 'networkidle2' }).catch(() => {});

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
