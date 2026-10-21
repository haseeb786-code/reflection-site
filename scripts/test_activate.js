import fs from 'fs';

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';

async function test() {
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
  const nonceMatch = listHtml.match(/name="_wpnonce"\s+value="([a-f0-9]+)"/i) || listHtml.match(/_wpnonce=([a-f0-9]+)/i);
  const nonce = nonceMatch ? nonceMatch[1] : '';
  console.log('Nonce:', nonce);

  // Try activating with single folder: reflection-elite-bitcoin/reflection-elite-bitcoin.php
  const url1 = `${WP_URL}/wp-admin/plugins.php?action=activate&plugin=reflection-elite-bitcoin%2Freflection-elite-bitcoin.php&_wpnonce=${nonce}`;
  console.log('Trying:', url1);
  const r1 = await fetch(url1, { headers: { Cookie: allCookies } });
  console.log('Status r1:', r1.status);
  const t1 = await r1.text();
  const clean1 = t1.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log('Text r1:', clean1.substring(0, 300));
}

test().catch(console.error);
