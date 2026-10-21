import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function clickOverwrite() {
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

  // Fetch flat_upload_result.html to get fresh overwrite link or upload again
  const uploadHtml = fs.readFileSync('flat_upload_result.html', 'utf8');
  const overwriteMatch = uploadHtml.match(/href="([^"]*overwrite=update-plugin[^"]*)"/i);
  if (!overwriteMatch) {
    console.error('No overwrite link found');
    return;
  }

  const rawUrl = overwriteMatch[1].replace(/&amp;/g, '&');
  const fullUrl = rawUrl.startsWith('http') ? rawUrl : `${WP_URL}/wp-admin/${rawUrl}`;
  console.log('Clicking overwrite URL:', fullUrl);

  const owRes = await fetch(fullUrl, { headers: { 'Cookie': allCookies } });
  console.log('Overwrite HTTP status:', owRes.status);
  const owHtml = await owRes.text();
  fs.writeFileSync('overwrite_result.html', owHtml, 'utf8');

  // Look for activation link
  const actMatch = owHtml.match(/href="([^"]*action=activate[^"]*)"/i);
  if (actMatch) {
    const rawAct = actMatch[1].replace(/&amp;/g, '&');
    const actUrl = rawAct.startsWith('http') ? rawAct : `${WP_URL}/wp-admin/${rawAct}`;
    console.log('Activating plugin via:', actUrl);
    const actRes = await fetch(actUrl, { headers: { 'Cookie': allCookies } });
    console.log('Activation HTTP status:', actRes.status);
    const actHtml = await actRes.text();
    fs.writeFileSync('act_after_overwrite.html', actHtml, 'utf8');
  } else {
    console.log('No activation link in overwrite response. Checking plugins.php...');
  }

  // Check plugins.php
  const pRes = await fetch(`${WP_URL}/wp-admin/plugins.php`, { headers: { 'Cookie': allCookies } });
  const pHtml = await pRes.text();
  console.log('Contains active reflection-elite-payments?', pHtml.includes('deactivate') && pHtml.includes('reflection-elite-payments'));

  // Check Settings Tab
  const sRes = await fetch(`${WP_URL}/wp-admin/admin.php?page=wc-settings&tab=re_payments`, {
    headers: { 'Cookie': allCookies }
  });
  const sHtml = await sRes.text();
  console.log('Settings Tab HTTP status:', sRes.status);
  console.log('Contains Payment Scenarios?', sHtml.includes('Payment Scenarios'));
  console.log('Contains Scenario A?', sHtml.includes('Scenario A'));
  console.log('Contains Scenario B?', sHtml.includes('Scenario B'));
  console.log('Contains Scenario C?', sHtml.includes('Scenario C'));
  console.log('Contains Sandbox Mode?', sHtml.includes('re_sandbox_mode'));
}

clickOverwrite().catch(console.error);
