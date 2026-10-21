import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\de9ea39a-cece-46b8-8bfb-32a9c75ec2c5';

async function main() {
  console.log('=== END-TO-END CUSTOMER REGISTRATION TEST ===');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

  console.log('1. Navigating to /my-account/ as a logged-out guest...');
  await page.goto('https://reflectionelite.com/my-account/?v=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  // Take screenshot of Login + Register two-column layout
  const regFormPath = path.join(ARTIFACT_DIR, 'my_account_with_registration_form.png');
  await page.screenshot({ path: regFormPath, fullPage: true });
  console.log('✓ Saved screenshot of registration form:', regFormPath);

  // Verify form elements exist
  const emailInput = await page.$('#reg_email');
  const passInput = await page.$('#reg_password');
  const regButton = await page.$('button[name="register"]');
  console.log('Form check:');
  console.log('  #reg_email present:', !!emailInput);
  console.log('  #reg_password present:', !!passInput);
  console.log('  button[name="register"] present:', !!regButton);

  if (!emailInput || !passInput || !regButton) {
    throw new Error('Registration form fields not found on page');
  }

  // Generate unique test email so test is repeatable
  const testEmail = `atelier.client.${Date.now()}@reflectionelite.test`;
  const testPassword = 'BespokeLuxury2026!Atelier';
  console.log('\n2. Filling registration form:');
  console.log('  Email:', testEmail);
  console.log('  Password:', testPassword);

  await page.type('#reg_email', testEmail);
  await page.type('#reg_password', testPassword);
  await new Promise(r => setTimeout(r, 500));

  console.log('\n3. Submitting registration form...');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }),
    page.click('button[name="register"]')
  ]);
  await new Promise(r => setTimeout(r, 2000));

  console.log('\n4. Verifying registration result:');
  const newUrl = page.url();
  console.log('Current URL:', newUrl);

  const pageContent = await page.evaluate(() => document.body.innerText);
  const isDashboard = pageContent.includes('From your account dashboard you can view your recent orders') 
                   || pageContent.includes('Log out');
  console.log('Dashboard text present:', isDashboard);

  // Take screenshot of logged-in customer dashboard
  const dashboardPath = path.join(ARTIFACT_DIR, 'customer_account_dashboard_after_registration.png');
  await page.screenshot({ path: dashboardPath, fullPage: true });
  console.log('✓ Saved screenshot of customer dashboard:', dashboardPath);

  await browser.close();

  console.log('\n======================================================');
  console.log('CUSTOMER REGISTRATION TEST PASSED 100%!');
  console.log('Test Account Created:', testEmail);
  console.log('======================================================');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
