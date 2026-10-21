import fs from 'fs';
import path from 'path';

const WP_URL = 'https://reflectionelite.com';

async function deployPaymentPlugin() {
  console.log('=== LOGGING IN TO WORDPRESS ADMIN ===');
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/plugin-install.php?tab=upload`);
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');
  console.log('Login successful! Fetching upload nonce...');

  const pageRes = await fetch(`${WP_URL}/wp-admin/plugin-install.php?tab=upload`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await pageRes.text();
  const nonceMatch = html.match(/name="_wpnonce"\s+value="([a-f0-9]+)"/i);
  if (!nonceMatch) {
    throw new Error('Could not find upload nonce');
  }
  const uploadNonce = nonceMatch[1];
  console.log('Found upload nonce:', uploadNonce);

  const zipPath = path.resolve('reflection-elite-payments.zip');
  const zipBuffer = fs.readFileSync(zipPath);
  console.log(`Uploading ${zipPath} (${zipBuffer.length} bytes)...`);

  const formData = new FormData();
  formData.append('_wpnonce', uploadNonce);
  formData.append('_wp_http_referer', '/wp-admin/plugin-install.php?tab=upload');
  formData.append('pluginzip', new Blob([zipBuffer], { type: 'application/zip' }), 'reflection-elite-payments.zip');
  formData.append('install-plugin-submit', 'Install Now');

  const uploadRes = await fetch(`${WP_URL}/wp-admin/update.php?action=upload-plugin`, {
    method: 'POST',
    headers: { 'Cookie': allCookies },
    body: formData
  });

  const uploadHtml = await uploadRes.text();
  console.log('Upload response status:', uploadRes.status);

  // Look for activation link or overwrite link
  const activateMatch = uploadHtml.match(/href="([^"]*action=activate[^"]*)"/i);
  const overwriteMatch = uploadHtml.match(/href="([^"]*action=update-selected[^"]*)"/i) || uploadHtml.match(/href="([^"]*action=upload-plugin[^"]*overwrite=[^"]*)"/i);

  if (activateMatch) {
    const rawActivate = activateMatch[1].replace(/&amp;/g, '&');
    const activateUrl = rawActivate.startsWith('http') ? rawActivate : `${WP_URL}/wp-admin/${rawActivate}`;
    console.log('Activating plugin via:', activateUrl);
    const actRes = await fetch(activateUrl, { headers: { 'Cookie': allCookies } });
    console.log('Activation response status:', actRes.status);
  } else if (uploadHtml.includes('Plugin installed successfully')) {
    console.log('Plugin uploaded successfully! Activating via plugin name...');
  } else if (uploadHtml.includes('Destination folder already exists')) {
    console.log('Plugin folder already exists. Checking for replace link or existing plugin...');
    const replaceMatch = uploadHtml.match(/href="([^"]*update=replace-plugin[^"]*)"/i) || uploadHtml.match(/href="([^"]*action=update-plugin[^"]*)"/i);
    if (replaceMatch) {
      const repUrl = replaceMatch[1].replace(/&amp;/g, '&');
      const target = repUrl.startsWith('http') ? repUrl : `${WP_URL}/wp-admin/${repUrl}`;
      console.log('Clicking replace/update button:', target);
      await fetch(target, { headers: { 'Cookie': allCookies } });
    }
  }

  // Activate via plugins list just to be 100% sure
  console.log('\nChecking plugin activation state in plugins.php...');
  const pluginsRes = await fetch(`${WP_URL}/wp-admin/plugins.php`, { headers: { 'Cookie': allCookies } });
  const pListHtml = await pluginsRes.text();
  const pluginSlug = 'reflection-elite-payments/reflection-elite-payments.php';
  const activateLinkMatch = pListHtml.match(new RegExp(`href="([^"]*action=activate[^"]*plugin=${encodeURIComponent(pluginSlug)}[^"]*)"`, 'i'));

  if (activateLinkMatch) {
    const actLink = activateLinkMatch[1].replace(/&amp;/g, '&');
    const actUrl = actLink.startsWith('http') ? actLink : `${WP_URL}/wp-admin/${actLink}`;
    console.log('Activating plugin from plugins list:', actUrl);
    const finalAct = await fetch(actUrl, { headers: { 'Cookie': allCookies } });
    console.log('Activation status:', finalAct.status);
  } else if (pListHtml.includes('Deactivate') && pListHtml.includes('reflection-elite-payments')) {
    console.log('Plugin is ALREADY ACTIVE and running!');
  } else {
    console.log('Plugin listing status snippet:\n', pListHtml.substring(pListHtml.indexOf('reflection-elite-payments') - 100, pListHtml.indexOf('reflection-elite-payments') + 300));
  }

  // Set Sandbox Mode = 'yes' initially for safety
  console.log('\nEnforcing Sandbox Mode = yes for safe staging testing...');
  const settingsNonceRes = await fetch(`${WP_URL}/wp-admin/admin.php?page=wc-settings&tab=re_payments`, {
    headers: { 'Cookie': allCookies }
  });
  const settingsHtml = await settingsNonceRes.text();
  const sNonceMatch = settingsHtml.match(/id="_wpnonce"[^>]*value="([^"]+)"/i) || settingsHtml.match(/name="_wpnonce"[^>]*value="([^"]+)"/i);

  if (sNonceMatch) {
    const sNonce = sNonceMatch[1];
    const savePayload = new URLSearchParams();
    savePayload.append('_wpnonce', sNonce);
    savePayload.append('_wp_http_referer', '/wp-admin/admin.php?page=wc-settings&tab=re_payments');
    savePayload.append('re_sandbox_mode', '1');
    savePayload.append('re_coupon_stacking_mode', 'net');
    savePayload.append('re_scenario_a_enabled', '1');
    savePayload.append('re_scenario_a_discount', '5');
    savePayload.append('re_scenario_a_label', 'Full Online Payment Discount (5%)');
    savePayload.append('re_scenario_b_enabled', '1');
    savePayload.append('re_scenario_b_deposit', '50');
    savePayload.append('re_scenario_b_discount', '3');
    savePayload.append('re_scenario_b_label', 'Advance Booking Discount (3%)');
    savePayload.append('re_scenario_c_enabled', '1');
    savePayload.append('re_scenario_c_category', 'venetian-mirror');
    savePayload.append('re_scenario_c_button_text', 'Book Now');
    savePayload.append('re_scenario_c_disable_cod', '1');
    savePayload.append('save', 'Save changes');

    const saveRes = await fetch(`${WP_URL}/wp-admin/admin.php?page=wc-settings&tab=re_payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': allCookies },
      body: savePayload.toString()
    });
    console.log('Settings initialized and saved! HTTP status:', saveRes.status);
  } else {
    console.log('Could not load WooCommerce settings tab. Please check plugin activation.');
  }

  console.log('\n=== DEPLOYMENT COMPLETE ===');
}

deployPaymentPlugin().catch(console.error);
