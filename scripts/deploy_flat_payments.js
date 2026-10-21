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

  const zipPath = path.resolve('reflection-elite-payments.zip');
  const zipBuffer = fs.readFileSync(zipPath);

  const formData = new FormData();
  formData.append('_wpnonce', uploadNonce);
  formData.append('_wp_http_referer', '/wp-admin/plugin-install.php?tab=upload');
  formData.append('pluginzip', new Blob([zipBuffer], { type: 'application/zip' }), 'reflection-elite-payments.zip');
  formData.append('install-plugin-submit', 'Install Now');

  console.log('=== 2. UPLOADING FLAT reflection-elite-payments.zip ===');
  const uploadRes = await fetch(`${WP_URL}/wp-admin/update.php?action=upload-plugin`, {
    method: 'POST',
    headers: { 'Cookie': allCookies },
    body: formData
  });

  const uploadHtml = await uploadRes.text();
  fs.writeFileSync('flat_upload_result.html', uploadHtml, 'utf8');
  console.log('Upload HTTP status:', uploadRes.status);

  // Check if replacement button or direct activate
  const replaceMatch = uploadHtml.match(/href="([^"]*action=update-plugin[^"]*)"/i) 
                    || uploadHtml.match(/href="([^"]*update=replace-plugin[^"]*)"/i)
                    || uploadHtml.match(/href="([^"]*overwrite=1[^"]*)"/i);

  if (replaceMatch) {
    const rawRep = replaceMatch[1].replace(/&amp;/g, '&');
    const repUrl = rawRep.startsWith('http') ? rawRep : `${WP_URL}/wp-admin/${rawRep}`;
    console.log('Clicking Replace Current with Uploaded:', repUrl);
    const repRes = await fetch(repUrl, { headers: { 'Cookie': allCookies } });
    const repHtml = await repRes.text();
    fs.writeFileSync('flat_replace_result.html', repHtml, 'utf8');
    
    const actMatch = repHtml.match(/href="([^"]*action=activate[^"]*)"/i);
    if (actMatch) {
      const rawAct = actMatch[1].replace(/&amp;/g, '&');
      const actUrl = rawAct.startsWith('http') ? rawAct : `${WP_URL}/wp-admin/${rawAct}`;
      console.log('=== 3. ACTIVATING VIA LINK ===', actUrl);
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

  console.log('=== 4. CHECKING PLUGINS STATUS IN plugins.php ===');
  const pListRes = await fetch(`${WP_URL}/wp-admin/plugins.php`, { headers: { 'Cookie': allCookies } });
  const pListHtml = await pListRes.text();
  fs.writeFileSync('plugins_after_flat.html', pListHtml, 'utf8');

  const actMatch = pListHtml.match(/href="([^"]*action=activate[^"]*plugin=reflection-elite-payments[^\s"']*)"/i);
  if (actMatch) {
    const actUrl = `${WP_URL}/wp-admin/${actMatch[1].replace(/&amp;/g, '&')}`;
    console.log('Plugin is installed but inactive. Activating via fallback:', actUrl);
    const aRes = await fetch(actUrl, { headers: { 'Cookie': allCookies } });
    console.log('Fallback activation status:', aRes.status);
  } else if (pListHtml.includes('deactivate') && pListHtml.includes('reflection-elite-payments')) {
    console.log('[SUCCESS] reflection-elite-payments is ACTIVE!');
  } else {
    console.log('Searching plugins for reflection-elite-payments...');
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
