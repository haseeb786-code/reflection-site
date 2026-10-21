import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function checkRazorpayOptions() {
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/admin.php?page=wc-settings&tab=checkout&section=razorpay`);
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');

  const res3 = await fetch(`${WP_URL}/wp-admin/admin.php?page=wc-settings&tab=checkout&section=razorpay`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await res3.text();
  
  // Extract text around webhook
  const webhookMatches = [...html.matchAll(/(?:webhook|wc-api)[^<>\n]*/gi)].map(m => m[0]);
  console.log('Webhook text mentions:');
  webhookMatches.forEach(m => console.log(' - ' + m));

  console.log('\nAll inputs on Razorpay settings:');
  const inputs = [...html.matchAll(/<(?:input|select|textarea)[^>]*name="([^"]+)"[^>]*>/gi)];
  for (const inp of inputs) {
    const valMatch = inp[0].match(/value="([^"]*)"/);
    const checked = inp[0].includes('checked');
    const isSecret = inp[1].includes('secret') || inp[1].includes('password');
    const val = isSecret ? '[REDACTED SECRET]' : (valMatch ? valMatch[1] : '');
    console.log(` - ${inp[1]} : ${checked ? '[CHECKED] ' : ''}${val}`);
  }
}

checkRazorpayOptions().catch(console.error);
