import fs from 'fs';

async function activatePaymentsPlugin() {
  const WP_URL = "https://reflectionelite.com";
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

  // Find exact activation link for reflection-elite-payments
  const actMatch = html.match(/href="([^"]*plugins\.php\?action=activate&amp;plugin=reflection-elite-payments%2Freflection-elite-payments%2Freflection-elite-payments\.php[^"]*)"/i);
  if (!actMatch) {
    console.error('Activation link not found in HTML');
    return;
  }

  const actUrl = actMatch[1].replace(/&amp;/g, '&');
  const fullActUrl = actUrl.startsWith('http') ? actUrl : `${WP_URL}/wp-admin/${actUrl}`;
  console.log('Activating URL:', fullActUrl);

  const actRes = await fetch(fullActUrl, {
    headers: { 'Cookie': allCookies },
    redirect: 'manual'
  });

  console.log('Activation Response Status:', actRes.status);
  console.log('Location:', actRes.headers.get('location'));
  const actHtml = await actRes.text();
  fs.writeFileSync('act_response.html', actHtml, 'utf8');
  console.log('Response body snippet:', actHtml.substring(0, 500));
}

activatePaymentsPlugin().catch(console.error);
