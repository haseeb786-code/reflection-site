import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function deleteBrokenPlugins() {
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

  // Find delete links for reflection-elite-payments
  const delMatches = [...html.matchAll(/href="([^"]*action=delete-selected[^"]*checked%5B0%5D=reflection-elite-payments[^"]*)"/g)];
  console.log('Found delete links:', delMatches.length);

  for (const m of delMatches) {
    const rawDel = m[1].replace(/&amp;/g, '&');
    const delUrl = rawDel.startsWith('http') ? rawDel : `${WP_URL}/wp-admin/${rawDel}`;
    console.log('Fetching delete confirmation page:', delUrl);

    const confRes = await fetch(delUrl, { headers: { 'Cookie': allCookies } });
    const confHtml = await confRes.text();

    // Look for form or confirm button
    const formMatch = confHtml.match(/<form[^>]*action="([^"]*delete-selected[^"]*)"[^>]*>([\s\S]*?)<\/form>/i);
    if (formMatch) {
      const actionUrl = formMatch[1].replace(/&amp;/g, '&').replace(/&#038;/g, '&');
      const postUrl = actionUrl.startsWith('http') ? actionUrl : `${WP_URL}${actionUrl.startsWith('/') ? '' : '/'}${actionUrl}`;
      const formBody = new URLSearchParams();
      const inputs = [...formMatch[2].matchAll(/<input[^>]+name="([^"]+)"[^>]+value="([^"]*)"/gi)];
      for (const inp of inputs) {
        formBody.append(inp[1], inp[2]);
      }
      formBody.append('verify-delete', 'Yes, delete these files');

      console.log('Submitting deletion form to:', postUrl);
      const doDelRes = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': allCookies },
        body: formBody.toString()
      });
      console.log('Deletion result status:', doDelRes.status);
    } else {
      console.log('No delete form found on confirmation page');
      fs.writeFileSync('del_conf.html', confHtml, 'utf8');
    }
  }
}

deleteBrokenPlugins().catch(console.error);
