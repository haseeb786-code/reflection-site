import fs from 'fs';

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';

async function installTheme(themeSlug) {
  console.log(`=== INSTALLING THEME: ${themeSlug} ===\n`);

  // 1. Log in to get session cookies
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  let cookies = [];
  if (res1.headers.getSetCookie) {
    cookies = res1.headers.getSetCookie();
  } else if (res1.headers.get('set-cookie')) {
    cookies = [res1.headers.get('set-cookie')];
  }

  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/theme-install.php?search=${themeSlug}`);
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookieHeader
    },
    body: params.toString(),
    redirect: 'manual'
  });

  const postCookies = res2.headers.getSetCookie ? res2.headers.getSetCookie() : [res2.headers.get('set-cookie')];
  const allCookies = [...cookies, ...postCookies];
  const authCookieHeader = allCookies.map(c => (c ? c.split(';')[0] : '')).filter(Boolean).join('; ');
  console.log('Logged in successfully!');

  // 2. Fetch theme-install.php to find install nonce
  const res3 = await fetch(`${WP_URL}/wp-admin/theme-install.php?search=${themeSlug}`, {
    headers: { 'Cookie': authCookieHeader }
  });
  const installHtml = await res3.text();

  // Search for install-theme URL with nonce: update.php?action=install-theme&theme=astra&_wpnonce=...
  const nonceMatch = installHtml.match(/action=install-theme&amp;theme=([a-zA-Z0-9_-]+)&amp;_wpnonce=([a-f0-9]+)/i) ||
                     installHtml.match(/action=install-theme&theme=([a-zA-Z0-9_-]+)&_wpnonce=([a-f0-9]+)/i) ||
                     installHtml.match(/"install":"[^"]*action=install-theme[^"]*_wpnonce=([a-f0-9]+)/i);

  console.log('Nonce match:', nonceMatch ? nonceMatch[2] || nonceMatch[1] : 'none');

  let nonce = '';
  if (nonceMatch) {
    nonce = nonceMatch[2] || nonceMatch[1];
  } else {
    // Try to find generic _wpnonce in page
    const genMatch = installHtml.match(/name="_wpnonce"\s+value="([a-f0-9]+)"/i) || installHtml.match(/"_wpnonce":"([a-f0-9]+)"/i);
    if (genMatch) nonce = genMatch[1];
  }

  // Also check wp.updates.ajaxNonce or _wpnonce
  const ajaxNonceMatch = installHtml.match(/_ajax_nonce":"([a-f0-9]+)"/i) || installHtml.match(/"nonce":"([a-f0-9]+)"/i);
  const ajaxNonce = ajaxNonceMatch ? ajaxNonceMatch[1] : '';
  console.log('Ajax nonce:', ajaxNonce);

  // Try installing via wp-admin/admin-ajax.php action=install-theme
  if (ajaxNonce) {
    console.log(`Installing ${themeSlug} via admin-ajax...`);
    const ajaxParams = new URLSearchParams();
    ajaxParams.append('action', 'install-theme');
    ajaxParams.append('_ajax_nonce', ajaxNonce);
    ajaxParams.append('slug', themeSlug);

    const ajaxRes = await fetch(`${WP_URL}/wp-admin/admin-ajax.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': authCookieHeader
      },
      body: ajaxParams.toString()
    });

    const ajaxData = await ajaxRes.json();
    console.log('Ajax Install Result:', ajaxData);

    // If install success or already installed, activate it
    if (ajaxData.success || (ajaxData.data && ajaxData.data.errorMessage && ajaxData.data.errorMessage.includes('already exists'))) {
      console.log(`Activating ${themeSlug}...`);
      await activateTheme(themeSlug, authCookieHeader);
      return;
    }
  }

  // Fallback to update.php
  if (nonce) {
    const installUrl = `${WP_URL}/wp-admin/update.php?action=install-theme&theme=${themeSlug}&_wpnonce=${nonce}`;
    console.log('Installing via update.php:', installUrl);
    const instRes = await fetch(installUrl, {
      headers: { 'Cookie': authCookieHeader }
    });
    const instHtml = await instRes.text();
    console.log('Update page result length:', instHtml.length);
    await activateTheme(themeSlug, authCookieHeader);
  }
}

async function activateTheme(themeSlug, authCookieHeader) {
  // Get themes page to find activation nonce
  const res = await fetch(`${WP_URL}/wp-admin/themes.php`, {
    headers: { 'Cookie': authCookieHeader }
  });
  const html = await res.text();
  const activateMatch = html.match(new RegExp(`action=activate&amp;stylesheet=${themeSlug}&amp;_wpnonce=([a-f0-9]+)`, 'i')) ||
                        html.match(new RegExp(`action=activate&stylesheet=${themeSlug}&_wpnonce=([a-f0-9]+)`, 'i'));

  if (activateMatch) {
    const actNonce = activateMatch[1];
    console.log('Activating with nonce:', actNonce);
    const actUrl = `${WP_URL}/wp-admin/themes.php?action=activate&stylesheet=${themeSlug}&_wpnonce=${actNonce}`;
    const actRes = await fetch(actUrl, {
      headers: { 'Cookie': authCookieHeader }
    });
    console.log('Activation response status:', actRes.status);
    console.log(`[SUCCESS] ${themeSlug} is now ACTIVE!`);
  } else {
    console.log('Could not find activation link. Checking themes list...');
  }
}

installTheme('astra').catch(console.error);
