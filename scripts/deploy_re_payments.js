import fs from 'fs';
import path from 'path';

const WP_URL = 'https://reflectionelite.com';

async function deploy() {
  console.log('=== 1. LOGGING IN ===');
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

  const pageRes = await fetch(`${WP_URL}/wp-admin/plugin-install.php?tab=upload`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await pageRes.text();
  const nonceMatch = html.match(/name="_wpnonce"\s+value="([a-f0-9]+)"/i);
  if (!nonceMatch) throw new Error('No upload nonce found');
  const uploadNonce = nonceMatch[1];
  console.log('Found upload nonce:', uploadNonce);

  const zipPath = path.resolve('re-payments.zip');
  const zipBuffer = fs.readFileSync(zipPath);

  const formData = new FormData();
  formData.append('_wpnonce', uploadNonce);
  formData.append('_wp_http_referer', '/wp-admin/plugin-install.php?tab=upload');
  formData.append('pluginzip', new Blob([zipBuffer], { type: 'application/zip' }), 're-payments.zip');
  formData.append('install-plugin-submit', 'Install Now');

  console.log('=== 2. UPLOADING re-payments.zip ===');
  const uploadRes = await fetch(`${WP_URL}/wp-admin/update.php?action=upload-plugin`, {
    method: 'POST',
    headers: { 'Cookie': allCookies },
    body: formData
  });

  const uploadHtml = await uploadRes.text();
  fs.writeFileSync('re_payments_upload_result.html', uploadHtml, 'utf8');
  console.log('Upload HTTP status:', uploadRes.status);

  // Look for direct activation link
  const actMatch = uploadHtml.match(/href="([^"]*action=activate[^"]*)"/i);
  if (actMatch) {
    const rawAct = actMatch[1].replace(/&amp;/g, '&');
    const actUrl = rawAct.startsWith('http') ? rawAct : `${WP_URL}/wp-admin/${rawAct}`;
    console.log('=== 3. ACTIVATING PLUGIN VIA LINK ===', actUrl);
    const actRes = await fetch(actUrl, { headers: { 'Cookie': allCookies } });
    console.log('Activation HTTP status:', actRes.status);
    const actHtml = await actRes.text();
    fs.writeFileSync('re_payments_act_result.html', actHtml, 'utf8');
  } else {
    console.log('No direct activation link found. Checking if overwrite required or check plugins.php...');
  }

  console.log('=== 4. CHECKING PLUGINS STATUS IN plugins.php ===');
  const pListRes = await fetch(`${WP_URL}/wp-admin/plugins.php`, { headers: { 'Cookie': allCookies } });
  const pListHtml = await pListRes.text();
  if (pListHtml.includes('deactivate') && pListHtml.includes('re-payments.php')) {
    console.log('[SUCCESS] re-payments.php is ACTIVE!');
  } else {
    console.log('Searching for re-payments in plugins list...');
    const actLink = pListHtml.match(/href="([^"]*action=activate[^"]*plugin=re-payments[^"]*)"/i);
    if (actLink) {
      const actUrl = `${WP_URL}/wp-admin/${actLink[1].replace(/&amp;/g, '&')}`;
      console.log('Found inactive, activating now:', actUrl);
      const res = await fetch(actUrl, { headers: { 'Cookie': allCookies } });
      console.log('Activation status:', res.status);
    }
  }

  console.log('=== 5. CHECKING WOOCOMMERCE SETTINGS TAB ===');
  const sRes = await fetch(`${WP_URL}/wp-admin/admin.php?page=wc-settings&tab=re_payments`, {
    headers: { 'Cookie': allCookies }
  });
  const sHtml = await sRes.text();
  console.log('Settings Tab Status:', sRes.status);
  console.log('Has "Payment Scenarios"?', sHtml.includes('Payment Scenarios'));
  console.log('Has "re_sandbox_mode"?', sHtml.includes('re_sandbox_mode'));
  console.log('Has "Scenario A"?', sHtml.includes('Scenario A'));
  console.log('Has "Scenario B"?', sHtml.includes('Scenario B'));
  console.log('Has "Scenario C"?', sHtml.includes('Scenario C'));
}

deploy().catch(console.error);
