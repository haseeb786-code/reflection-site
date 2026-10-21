import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function purgeLSCache() {
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/admin.php?page=litespeed-toolbox`);
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');

  const res3 = await fetch(`${WP_URL}/wp-admin/admin.php?page=litespeed-toolbox`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await res3.text();
  
  // Find all purge links
  const matches = [...html.matchAll(/href="([^"]*(?:purge|clean|LITESPEED)[^"]*)"/gi)];
  console.log('Found purge candidate links:', matches.length);
  for (const m of matches) {
    if (m[1].includes('purge_all') || m[1].includes('PURGE_ALL') || m[1].includes('purge-all')) {
      const target = m[1].replace(/&amp;/g, '&');
      const pUrl = target.startsWith('http') ? target : `${WP_URL}/wp-admin/${target}`;
      console.log('Executing Purge URL:', pUrl);
      const res = await fetch(pUrl, { headers: { 'Cookie': allCookies } });
      console.log('Purge Response Status:', res.status);
    }
  }
}

purgeLSCache().catch(console.error);
