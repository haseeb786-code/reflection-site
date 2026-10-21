import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function goLive() {
  console.log('=== 1. LOGGING IN ===');
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies1 = res1.headers.getSetCookie();
  const cookieHeader = cookies1.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/admin.php?page=wc-settings&tab=re_payments`);
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies1, ...postCookies].map(c => c.split(';')[0]).join('; ');

  console.log('=== 2. READING SETTINGS PAGE NONCE ===');
  const pageRes = await fetch(`${WP_URL}/wp-admin/admin.php?page=wc-settings&tab=re_payments`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await pageRes.text();
  const nonceMatch = html.match(/name="_wpnonce"\s+value="([a-f0-9]+)"/i);
  if (!nonceMatch) throw new Error('No nonce found');
  const saveNonce = nonceMatch[1];
  console.log('Found nonce:', saveNonce);

  console.log('=== 3. SAVING OPTIONS WITH SANDBOX MODE OFF (LIVE ACTIVATION) ===');
  const formBody = new URLSearchParams();
  formBody.append('_wpnonce', saveNonce);
  formBody.append('_wp_http_referer', '/wp-admin/admin.php?page=wc-settings&tab=re_payments');
  formBody.append('save', 'Save changes');

  // Notice: re_sandbox_mode is OMITTED so it is UNCHECKED (set to 'no')
  formBody.append('re_coupon_stacking_mode', 'net');

  formBody.append('re_scenario_a_enabled', '1');
  formBody.append('re_scenario_a_discount', '5');
  formBody.append('re_scenario_a_label', 'Full Online Payment Discount (5%)');

  formBody.append('re_scenario_b_enabled', '1');
  formBody.append('re_scenario_b_deposit', '50');
  formBody.append('re_scenario_b_discount', '3');
  formBody.append('re_scenario_b_label', 'Advance Booking Discount (3%)');

  formBody.append('re_scenario_c_enabled', '1');
  formBody.append('re_scenario_c_category', 'venetian-mirror');
  formBody.append('re_scenario_c_button_text', 'Book Now');
  formBody.append('re_scenario_c_disable_cod', '1');

  const saveRes = await fetch(`${WP_URL}/wp-admin/admin.php?page=wc-settings&tab=re_payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': allCookies },
    body: formBody.toString()
  });
  console.log('Save response status:', saveRes.status);

  // 4. Verify in settings page
  const verRes = await fetch(`${WP_URL}/wp-admin/admin.php?page=wc-settings&tab=re_payments`, {
    headers: { 'Cookie': allCookies }
  });
  const verHtml = await verRes.text();
  fs.writeFileSync('settings_page_live_activated.html', verHtml, 'utf8');

  const sandboxChecked = verHtml.includes('name="re_sandbox_mode"') && verHtml.includes('id="re_sandbox_mode"') && verHtml.includes("checked='checked'");
  console.log('Is Sandbox still checked?', sandboxChecked);
  console.log('Live Activation Successful:', !sandboxChecked);
}

goLive().catch(console.error);
