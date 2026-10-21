import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function checkDelConf() {
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

  const pRes = await fetch(`${WP_URL}/wp-admin/plugins.php`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await pRes.text();

  const delMatch = html.match(/href="([^"]*action=delete-selected&amp;checked%5B0%5D=reflection-elite-payments[^"]*)"/i);
  if (!delMatch) {
    console.log('No delete match found');
    return;
  }
  const delUrl = `${WP_URL}/wp-admin/${delMatch[1].replace(/&amp;/g, '&')}`;
  console.log('Fetching:', delUrl);
  const cRes = await fetch(delUrl, { headers: { 'Cookie': allCookies } });
  const cHtml = await cRes.text();
  fs.writeFileSync('del_conf_actual.html', cHtml, 'utf8');
  console.log('Saved del_conf_actual.html, length:', cHtml.length);
}

checkDelConf().catch(console.error);
