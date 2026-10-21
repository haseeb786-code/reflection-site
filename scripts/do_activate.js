import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function activate() {
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

  const pRes = await fetch(`${WP_URL}/wp-admin/plugins.php`, { headers: { 'Cookie': allCookies } });
  const html = await pRes.text();
  const actMatch = html.match(/href="([^"]*action=activate[^"]*plugin=reflection-elite-payments[^"]*)"/i);
  if (actMatch) {
    const raw = actMatch[1].replace(/&amp;/g, '&');
    const url = raw.startsWith('http') ? raw : `${WP_URL}/wp-admin/${raw}`;
    const res = await fetch(url, { headers: { 'Cookie': allCookies } });
    const body = await res.text();
    fs.writeFileSync('activation_error.html', body, 'utf8');
    console.log('Saved activation_error.html (Status:', res.status, ')');
    const errMatch = body.match(/<div id="error-page"[^>]*>([\s\S]*?)<\/div>/i) || body.match(/<p>([\s\S]*?)<\/p>/i);
    if (errMatch) {
      console.log('Error content:\n', errMatch[1].trim());
    } else {
      console.log('Snippet:\n', body.substring(0, 1000));
    }
  }
}

activate().catch(console.error);
