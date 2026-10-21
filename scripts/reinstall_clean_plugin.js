import fs from 'fs';
import path from 'path';

const WP_URL = 'https://reflectionelite.com';

async function reinstall() {
  console.log('=== LOGGING IN ===');
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

  console.log('Submitting plugin zip upload...');
  const uploadRes = await fetch(`${WP_URL}/wp-admin/update.php?action=upload-plugin`, {
    method: 'POST',
    headers: { 'Cookie': allCookies },
    body: formData
  });

  const uploadHtml = await uploadRes.text();
  fs.writeFileSync('upload_result.html', uploadHtml, 'utf8');
  console.log('Upload HTTP status:', uploadRes.status);

  // Check if replacement button exists
  const replaceMatch = uploadHtml.match(/href="([^"]*action=update-plugin[^"]*)"/i) 
                    || uploadHtml.match(/href="([^"]*update=replace-plugin[^"]*)"/i)
                    || uploadHtml.match(/href="([^"]*overwrite=1[^"]*)"/i);

  if (replaceMatch) {
    const rawRep = replaceMatch[1].replace(/&amp;/g, '&');
    const repUrl = rawRep.startsWith('http') ? rawRep : `${WP_URL}/wp-admin/${rawRep}`;
    console.log('Clicking Replace Current with Uploaded:', repUrl);
    const repRes = await fetch(repUrl, { headers: { 'Cookie': allCookies } });
    const repHtml = await repRes.text();
    fs.writeFileSync('replace_result.html', repHtml, 'utf8');
    console.log('Replace status:', repRes.status);

    const actMatch = repHtml.match(/href="([^"]*action=activate[^"]*)"/i);
    if (actMatch) {
      const rawAct = actMatch[1].replace(/&amp;/g, '&');
      const actUrl = rawAct.startsWith('http') ? rawAct : `${WP_URL}/wp-admin/${rawAct}`;
      console.log('Clicking final activation link:', actUrl);
      const actRes = await fetch(actUrl, { headers: { 'Cookie': allCookies } });
      console.log('Final activation status:', actRes.status);
      const actHtml = await actRes.text();
      fs.writeFileSync('final_act_result.html', actHtml, 'utf8');
    }
  } else {
    const actMatch = uploadHtml.match(/href="([^"]*action=activate[^"]*)"/i);
    if (actMatch) {
      const rawAct = actMatch[1].replace(/&amp;/g, '&');
      const actUrl = rawAct.startsWith('http') ? rawAct : `${WP_URL}/wp-admin/${rawAct}`;
      console.log('Clicking activation link:', actUrl);
      const actRes = await fetch(actUrl, { headers: { 'Cookie': allCookies } });
      console.log('Activation status:', actRes.status);
    }
  }

  // Check plugins list
  const pListRes = await fetch(`${WP_URL}/wp-admin/plugins.php`, { headers: { 'Cookie': allCookies } });
  const pListHtml = await pListRes.text();
  console.log('\n--- Final Check in plugins.php ---');
  if (pListHtml.includes('deactivate') && pListHtml.includes('reflection-elite-payments')) {
    console.log('SUCCESS: Reflection Elite Payments is ACTIVE!');
  } else {
    console.log('Plugin status in plugins list. Searching reflection-elite-payments...');
    const idx = pListHtml.indexOf('reflection-elite-payments');
    if (idx !== -1) {
      console.log(pListHtml.substring(idx - 100, idx + 400));
    } else {
      console.log('Not found in plugins.php');
    }
  }
}

reinstall().catch(console.error);
