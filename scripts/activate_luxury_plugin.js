import fs from 'fs';

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';

async function activatePlugin() {
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/plugins.php`);
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');

  const res3 = await fetch(`${WP_URL}/wp-admin/plugins.php`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await res3.text();

  const m = html.match(/plugins\.php\?action=activate&(?:amp;)?plugin=reflection-elite-luxury[^\s"']*/i);
  if (m) {
    const actUrl = `${WP_URL}/wp-admin/${m[0].replaceAll('&amp;', '&')}`;
    console.log('Activating via:', actUrl);
    const actRes = await fetch(actUrl, {
      headers: { 'Cookie': allCookies }
    });
    console.log('Activation status:', actRes.status);
    console.log('[SUCCESS] Plugin activated!');
  } else {
    console.log('No activation link found (might already be active)');
  }
}

activatePlugin().catch(console.error);
