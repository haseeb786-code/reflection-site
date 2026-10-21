import fs from 'fs';
import path from 'path';

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';

async function testUpload() {
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });
  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');

  const listRes = await fetch(`${WP_URL}/wp-admin/plugins.php`, { headers: { Cookie: allCookies } });
  const listHtml = await listRes.text();
  const plugins = [...listHtml.matchAll(/data-plugin="([^"]+)"/g)].map(m => m[1]);
  console.log('Installed plugins right now:\n', plugins);
}

testUpload().catch(console.error);
