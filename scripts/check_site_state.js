import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function check() {
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`);
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');

  const res3 = await fetch(`${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await res3.text();
  const hMatch = html.match(/<textarea[^>]*id="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  const fMatch = html.match(/<textarea[^>]*id="ihaf_insert_footer"[^>]*>([\s\S]*?)<\/textarea>/i);
  console.log('=== HEADER LENGTH ===', hMatch ? hMatch[1].length : 'none');
  console.log('=== HEADER PREVIEW ===\n', hMatch ? hMatch[1].substring(0, 300) : 'none');
  console.log('=== FOOTER CONTENT ===\n', fMatch ? fMatch[1] : 'none');
}
check().catch(console.error);
