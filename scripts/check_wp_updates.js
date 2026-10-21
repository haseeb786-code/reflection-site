import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function checkUpdates() {
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/update-core.php`);
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');

  const res3 = await fetch(`${WP_URL}/wp-admin/update-core.php`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await res3.text();
  
  if (html.includes('You have the latest version of WordPress')) {
    console.log('WordPress Core: UP TO DATE');
  } else {
    console.log('WordPress Core: UPDATE AVAILABLE');
  }

  const pluginMatches = [...html.matchAll(/name="checked\[\]"[^>]*value="([^"]+)"/gi)].map(m => m[1]);
  console.log('Pending Plugin Updates count:', pluginMatches.length);
  if (pluginMatches.length > 0) {
    console.log('Plugins needing update:', pluginMatches);
  }

  const themeMatches = [...html.matchAll(/name="checked_themes\[\]"[^>]*value="([^"]+)"/gi)].map(m => m[1]);
  console.log('Pending Theme Updates count:', themeMatches.length);
  if (themeMatches.length > 0) {
    console.log('Themes needing update:', themeMatches);
  }
}

checkUpdates().catch(console.error);
