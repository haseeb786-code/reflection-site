import { getProdAuth } from './prod_auth_helper.js';

async function run() {
  const auth = await getProdAuth();
  console.log('Fetching WooCommerce Accounts & Privacy settings...');
  const res = await fetch('https://reflectionelite.com/wp-admin/admin.php?page=wc-settings&tab=account', {
    headers: { 'Cookie': auth.cookies }
  });
  const html = await res.text();
  console.log('HTTP Status:', res.status, 'HTML length:', html.length);

  // Check registration checkboxes
  const regMyAccount = html.match(/name="woocommerce_enable_myaccount_registration"[^>]*?(checked)?/i);
  console.log('woocommerce_enable_myaccount_registration checked:', !!(regMyAccount && regMyAccount[1]));

  const genPass = html.match(/name="woocommerce_registration_generate_password"[^>]*?(checked)?/i);
  console.log('woocommerce_registration_generate_password checked:', !!(genPass && genPass[1]));

  const genUser = html.match(/name="woocommerce_registration_generate_username"[^>]*?(checked)?/i);
  console.log('woocommerce_registration_generate_username checked:', !!(genUser && genUser[1]));

  // Find the form action and nonce for saving settings
  const nonceMatch = html.match(/id="_wpnonce"\s+name="_wpnonce"\s+value="([^"]+)"/i)
                  || html.match(/name="_wpnonce"\s+value="([^"]+)"/i);
  console.log('Settings nonce found:', !!nonceMatch);
  if (nonceMatch) {
    console.log('Nonce:', nonceMatch[1]);
  }
}
run();
