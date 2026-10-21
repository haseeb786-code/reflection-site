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

  const res3 = await fetch(`${WP_URL}/wp-admin/plugins.php`, { headers: { Cookie: allCookies } });
  const html = await res3.text();
  
  // Check notices
  const notices = [...html.matchAll(/<div class="notice notice-error[^>]*>([\s\S]*?)<\/div>/gi)];
  for (const n of notices) {
    console.log('Error Notice:', n[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  }

  // Check rows matching bitcoin
  const btcRows = [...html.matchAll(/data-plugin="([^"]*bitcoin[^"]*)"/gi)].map(m => m[1]);
  console.log('Bitcoin plugins found:', btcRows);

  // If there's an activate link for bitcoin, print it
  const actLink = html.match(/plugins\.php\?action=activate&(?:amp;)?plugin=[^"'\s]*bitcoin[^"'\s]*/i);
  console.log('Activation link found:', actLink ? actLink[0] : 'None');

  if (actLink) {
    const actUrl = `${WP_URL}/wp-admin/${actLink[0].replaceAll('&amp;', '&')}`;
    console.log('Attempting activation to inspect response body:');
    const actRes = await fetch(actUrl, { headers: { Cookie: allCookies } });
    console.log('Status:', actRes.status);
    const actBody = await actRes.text();
    const clean = actBody.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log('Activation Error Message:', clean);
  }
}

test().catch(console.error);
