import { getProdAuth } from './prod_auth_helper.js';

async function enableRegistration() {
  const auth = await getProdAuth();
  console.log('1. Fetching WooCommerce Accounts & Privacy tab...');
  const res = await fetch('https://reflectionelite.com/wp-admin/admin.php?page=wc-settings&tab=account', {
    headers: { 'Cookie': auth.cookies }
  });
  const html = await res.text();
  const nonceMatch = html.match(/id="_wpnonce"\s+name="_wpnonce"\s+value="([^"]+)"/i)
                  || html.match(/name="_wpnonce"\s+value="([^"]+)"/i);
  if (!nonceMatch) throw new Error('Nonce not found');
  const nonce = nonceMatch[1];
  console.log('Found nonce:', nonce);

  console.log('2. Submitting WooCommerce settings to enable customer registration...');
  const formBody = new URLSearchParams();
  formBody.append('_wpnonce', nonce);
  formBody.append('_wp_http_referer', '/wp-admin/admin.php?page=wc-settings&tab=account');
  formBody.append('woocommerce_enable_guest_checkout', '1');
  formBody.append('woocommerce_enable_signup_and_login_from_checkout', '1');
  formBody.append('woocommerce_enable_myaccount_registration', '1');
  // We want customer to set their own password, so DO NOT send woocommerce_registration_generate_password
  // We want username generated from email automatically
  formBody.append('woocommerce_registration_generate_username', '1');
  formBody.append('save', 'Save changes');

  const saveRes = await fetch('https://reflectionelite.com/wp-admin/admin.php?page=wc-settings&tab=account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': auth.cookies
    },
    body: formBody.toString(),
    redirect: 'manual'
  });
  console.log('Save response status:', saveRes.status);

  // Clear Hostinger CDN cache
  console.log('3. Purging Hostinger CDN cache...');
  const cacheRes = await fetch('https://reflectionelite.com/wp-json/hostinger-tools-plugin/v1/clear-cache', {
    method: 'DELETE',
    headers: {
      'Cookie': auth.cookies,
      'X-WP-Nonce': auth.nonce
    }
  });
  console.log('Cache purge status:', cacheRes.status);
}

enableRegistration().catch(err => {
  console.error(err);
  process.exit(1);
});
