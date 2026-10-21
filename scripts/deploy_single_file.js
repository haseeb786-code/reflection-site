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

  const zipPath = path.resolve('re-gateway-discounts-single.zip');
  const zipBuffer = fs.readFileSync(zipPath);

  const formData = new FormData();
  formData.append('_wpnonce', uploadNonce);
  formData.append('_wp_http_referer', '/wp-admin/plugin-install.php?tab=upload');
  formData.append('pluginzip', new Blob([zipBuffer], { type: 'application/zip' }), 're-gateway-discounts-single.zip');
  formData.append('install-plugin-submit', 'Install Now');

  console.log('=== 2. UPLOADING re-gateway-discounts-single.zip ===');
  const uploadRes = await fetch(`${WP_URL}/wp-admin/update.php?action=upload-plugin`, {
    method: 'POST',
    headers: { 'Cookie': allCookies },
    body: formData
  });

  const uploadHtml = await uploadRes.text();
  fs.writeFileSync('single_upload_result.html', uploadHtml, 'utf8');
  console.log('Upload HTTP status:', uploadRes.status);

  // Check if overwrite link
  const repMatch = uploadHtml.match(/href="([^"]*overwrite=update-plugin[^"]*)"/i);
  if (repMatch) {
    const rawRep = repMatch[1].replace(/&amp;/g, '&');
    const repUrl = rawRep.startsWith('http') ? rawRep : `${WP_URL}/wp-admin/${rawRep}`;
    console.log('Clicking overwrite URL:', repUrl);
    const repRes = await fetch(repUrl, { headers: { 'Cookie': allCookies } });
    console.log('Overwrite status:', repRes.status);
    const repHtml = await repRes.text();
    fs.writeFileSync('single_overwrite_result.html', repHtml, 'utf8');

    const actMatch = repHtml.match(/href="([^"]*action=activate[^"]*)"/i);
    if (actMatch) {
      const rawAct = actMatch[1].replace(/&amp;/g, '&');
      const actUrl = rawAct.startsWith('http') ? rawAct : `${WP_URL}/wp-admin/${rawAct}`;
      console.log('Activating via overwrite link:', actUrl);
      const actRes = await fetch(actUrl, { headers: { 'Cookie': allCookies } });
      console.log('Activation HTTP status:', actRes.status);
    }
  } else {
    const actMatch = uploadHtml.match(/href="([^"]*action=activate[^"]*)"/i);
    if (actMatch) {
      const rawAct = actMatch[1].replace(/&amp;/g, '&');
      const actUrl = rawAct.startsWith('http') ? rawAct : `${WP_URL}/wp-admin/${rawAct}`;
      console.log('=== 3. ACTIVATING VIA LINK ===', actUrl);
      const actRes = await fetch(actUrl, { headers: { 'Cookie': allCookies } });
      console.log('Activation HTTP status:', actRes.status);
    }
  }

  // Activate via REST API if not active
  console.log('=== 4. CHECKING REST API STATUS ===');
  const WP_USER = 'admin';
  const WP_APP_PASS = 'oOei QLY7 j1mC Wb6U Gndx qYFg';
  const authHeader = { Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64')}` };
  const rRes = await fetch(`${WP_URL}/wp-json/wp/v2/plugins`, { headers: authHeader });
  const plugins = await rRes.json();
  const found = plugins.find(p => p.plugin.includes('re-gateway'));
  if (found) {
    console.log(`Found plugin: ${found.plugin} | Status: ${found.status}`);
    if (found.status !== 'active') {
      console.log('Attempting REST API activation...');
      const aRes = await fetch(`${WP_URL}/wp-json/wp/v2/plugins/${found.plugin}`, {
        method: 'POST',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' })
      });
      console.log('REST activation status:', aRes.status);
      const aText = await aRes.text();
      console.log('REST activation response:', aText);
    }
  } else {
    console.log('Plugin not found in REST API. Current plugins:', plugins.map(p => p.plugin));
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
