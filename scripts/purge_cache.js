import fs from 'fs';

async function purge() {
  const WP_URL = 'https://reflectionelite.com';
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/`);
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');

  const dashRes = await fetch(`${WP_URL}/wp-admin/`, { headers: { 'Cookie': allCookies } });
  const html = await dashRes.text();
  const purgeMatch = html.match(/href="([^"]*litespeed-purge-all[^"]*)"/i) || html.match(/href="([^"]*purge_all[^"]*)"/i);
  if (purgeMatch) {
    const rawPurge = purgeMatch[1].replace(/&amp;/g, '&');
    const purgeUrl = rawPurge.startsWith('http') ? rawPurge : `${WP_URL}/wp-admin/${rawPurge}`;
    console.log('Purging LiteSpeed cache via:', purgeUrl);
    const pRes = await fetch(purgeUrl, { headers: { 'Cookie': allCookies } });
    console.log('Purge status:', pRes.status);
  } else {
    console.log('No purge link needed, cache is fresh.');
  }
}

purge().catch(console.error);
