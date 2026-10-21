import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function listPluginsHtml() {
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
  
  const reMatches = [...html.matchAll(/data-slug="([^"]+)"/g)].map(m => m[1]);
  console.log('Installed plugin slugs:', reMatches);

  const dataPlugins = [...html.matchAll(/data-plugin="([^"]+)"/g)].map(m => m[1]);
  console.log('Installed data-plugin values:', dataPlugins);

  const rawMatches = html.match(/reflection-elite[^\s"'<>]*/g);
  console.log('Matches for reflection-elite:', rawMatches);
}

listPluginsHtml().catch(console.error);
