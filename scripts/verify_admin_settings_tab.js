import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function verifySettingsTab() {
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/admin.php?page=wc-settings&tab=re_payments`);
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');

  const sRes = await fetch(`${WP_URL}/wp-admin/admin.php?page=wc-settings&tab=re_payments`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await sRes.text();
  fs.writeFileSync('settings_tab.html', html, 'utf8');

  console.log('Settings Tab HTTP Status:', sRes.status);
  console.log('Contains "Payment Scenarios"?', html.includes('Payment Scenarios'));
  console.log('Contains Scenario A?', html.includes('Scenario A'));
  console.log('Contains Scenario B?', html.includes('Scenario B'));
  console.log('Contains Scenario C?', html.includes('Scenario C'));
  console.log('Contains Sandbox Mode?', html.includes('re_sandbox_mode'));
}

verifySettingsTab().catch(console.error);
