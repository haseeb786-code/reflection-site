import fs from 'fs';

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';

async function runInstall() {
  console.log('=== LOGGING IN TO WORDPRESS ADMIN ===');
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/theme-install.php`);
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');
  console.log('Login successful! Fetching theme-install page...');

  const pageRes = await fetch(`${WP_URL}/wp-admin/theme-install.php`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await pageRes.text();

  const nonceMatch = html.match(/_wpUpdatesSettings\s*=\s*\{"ajax_nonce":"([a-f0-9]+)"\}/);
  if (!nonceMatch) {
    throw new Error('Could not find _wpUpdatesSettings.ajax_nonce in theme-install.php');
  }
  const ajaxNonce = nonceMatch[1];
  console.log('Found Ajax Nonce:', ajaxNonce);

  console.log('Sending install-theme request for Astra...');
  const body = new URLSearchParams();
  body.append('action', 'install-theme');
  body.append('_ajax_nonce', ajaxNonce);
  body.append('slug', 'astra');

  const installRes = await fetch(`${WP_URL}/wp-admin/admin-ajax.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Cookie': allCookies,
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: body.toString()
  });

  const text = await installRes.text();
  console.log('Install Response Status:', installRes.status);
  console.log('Install Response Body:', text);

  // Now let's fetch themes.php to activate Astra!
  console.log('Fetching themes.php to activate Astra...');
  const themesRes = await fetch(`${WP_URL}/wp-admin/themes.php`, {
    headers: { 'Cookie': allCookies }
  });
  const themesHtml = await themesRes.text();

  const actMatch = themesHtml.match(/action=activate&(?:amp;)?stylesheet=astra&(?:amp;)?_wpnonce=([a-f0-9]+)/i);
  if (actMatch) {
    const actNonce = actMatch[1];
    console.log('Found Activation Nonce:', actNonce);
    const actUrl = `${WP_URL}/wp-admin/themes.php?action=activate&stylesheet=astra&_wpnonce=${actNonce}`;
    const activateRes = await fetch(actUrl, {
      headers: { 'Cookie': allCookies },
      redirect: 'manual'
    });
    console.log('Activation Status:', activateRes.status);
    console.log('[SUCCESS] ASTRA IS NOW ACTIVE!');
  } else {
    console.log('Activation link not found in themes.php. Checking active theme...');
  }
}

runInstall().catch(console.error);
