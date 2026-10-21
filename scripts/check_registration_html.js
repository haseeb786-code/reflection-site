import { getProdAuth } from './prod_auth_helper.js';

async function checkRegistrationHtml() {
  const auth = await getProdAuth();
  console.log('1. Purging Hostinger cache...');
  await fetch('https://reflectionelite.com/wp-json/hostinger-tools-plugin/v1/clear-cache', {
    method: 'DELETE',
    headers: {
      'Cookie': auth.cookies,
      'X-WP-Nonce': auth.nonce
    }
  });

  console.log('2. Fetching /my-account/ as a logged-out guest...');
  const res = await fetch('https://reflectionelite.com/my-account/?v=' + Date.now());
  const html = await res.text();

  console.log('HTTP Status:', res.status);
  console.log('Has Login Form (woocommerce-form-login):', html.includes('woocommerce-form-login'));
  console.log('Has Register Form (woocommerce-form-register):', html.includes('woocommerce-form-register'));
  console.log('Has Register email input (reg_email):', html.includes('name="email"') || html.includes('id="reg_email"'));
  console.log('Has Register password input (reg_password):', html.includes('name="password"') && html.includes('id="reg_password"'));
  console.log('Has Register button (name="register"):', html.includes('name="register"'));

  const col2Idx = html.indexOf('u-column2');
  if (col2Idx !== -1) {
    console.log('Register column HTML snippet:\n', html.substring(col2Idx - 50, col2Idx + 600));
  }
}

checkRegistrationHtml().catch(console.error);
