import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function activateDirect() {
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
  
  // Extract nonce from any action link in plugins.php
  const nonceMatch = html.match(/_wpnonce=([a-f0-9]+)/i);
  if (!nonceMatch) throw new Error('No nonce found');
  const nonce = nonceMatch[1];

  const targetSlug = 'reflection-elite-payments/reflection-elite-payments.php';
  const activateUrl = `${WP_URL}/wp-admin/plugins.php?action=activate&plugin=${encodeURIComponent(targetSlug)}&_wpnonce=${nonce}`;
  console.log('Activating directly via:', activateUrl);

  const actRes = await fetch(activateUrl, { headers: { 'Cookie': allCookies } });
  console.log('Activation response status:', actRes.status);
  const actHtml = await actRes.text();
  if (actHtml.includes('Plugin file does not exist')) {
    console.log('Result: Plugin file does not exist at', targetSlug);
  } else if (actHtml.includes('Plugin activated') || actRes.status === 302 || actRes.status === 200) {
    console.log('Result: Plugin activated successfully or redirected!');
  }
}

activateDirect().catch(console.error);
