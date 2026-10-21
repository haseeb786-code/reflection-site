import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options);
    } catch (e) {
      if (i === retries - 1) throw e;
      console.log(`Fetch retry ${i + 1} for ${url}...`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

async function configureSettings() {
  console.log('=== 1. LOGGING IN ===');
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetchWithRetry(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/admin.php?page=wc-settings&tab=re_payments`);
  params.append('testcookie', '1');

  const res2 = await fetchWithRetry(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');

  console.log('=== 2. READING SETTINGS PAGE ===');
  const pageRes = await fetchWithRetry(`${WP_URL}/wp-admin/admin.php?page=wc-settings&tab=re_payments`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await pageRes.text();
  fs.writeFileSync('settings_page_live.html', html, 'utf8');

  // Extract wpnonce for saving settings
  const nonceMatch = html.match(/name="_wpnonce"\s+value="([a-f0-9]+)"/i);
  if (!nonceMatch) throw new Error('No settings save nonce found');
  const saveNonce = nonceMatch[1];
  console.log('Found Settings Nonce:', saveNonce);

  const formBody = new URLSearchParams();
  formBody.append('_wpnonce', saveNonce);
  formBody.append('_wp_http_referer', '/wp-admin/admin.php?page=wc-settings&tab=re_payments');
  formBody.append('save', 'Save changes');

  formBody.append('re_sandbox_mode', '1'); // Checkbox checked
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

  console.log('=== 3. SAVING OPTIONS (SANDBOX MODE ACTIVE) ===');
  const saveRes = await fetchWithRetry(`${WP_URL}/wp-admin/admin.php?page=wc-settings&tab=re_payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': allCookies },
    body: formBody.toString()
  });
  console.log('Save response status:', saveRes.status);

  // Verify options saved
  const verRes = await fetchWithRetry(`${WP_URL}/wp-admin/admin.php?page=wc-settings&tab=re_payments`, {
    headers: { 'Cookie': allCookies }
  });
  const verHtml = await verRes.text();
  fs.writeFileSync('settings_page_verified.html', verHtml, 'utf8');

  console.log('Sandbox Checked?', verHtml.includes('name="re_sandbox_mode" id="re_sandbox_mode" type="checkbox" value="1" checked=\'checked\'') || verHtml.includes('name="re_sandbox_mode" value="1" checked'));
  console.log('Scenario A Checked?', verHtml.includes('re_scenario_a_enabled') && verHtml.includes('value="5"'));
  console.log('Scenario B Checked?', verHtml.includes('re_scenario_b_enabled') && verHtml.includes('value="50"') && verHtml.includes('value="3"'));
  console.log('Scenario C Checked?', verHtml.includes('re_scenario_c_enabled') && verHtml.includes('value="Book Now"'));
}

configureSettings().catch(console.error);
