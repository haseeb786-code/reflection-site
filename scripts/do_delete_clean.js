import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function doDelete() {
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

  const delMatches = [...html.matchAll(/href="([^"]*action=delete-selected&amp;checked%5B0%5D=([^"&]+)[^"]*)"/g)];
  console.log('Found matches to delete:', delMatches.length);

  for (const m of delMatches) {
    const pluginSlug = decodeURIComponent(m[2]);
    if (!pluginSlug.includes('reflection-elite-payments')) continue;

    console.log('\n--- Processing deletion for:', pluginSlug);
    const delUrl = `${WP_URL}/wp-admin/${m[1].replace(/&amp;/g, '&')}`;
    const cRes = await fetch(delUrl, { headers: { 'Cookie': allCookies } });
    const cHtml = await cRes.text();

    const formMatch = cHtml.match(/<form[^>]*action="([^"]*)"[^>]*>([\s\S]*?)<\/form>/i);
    if (!formMatch) {
      console.log('No form found for', pluginSlug);
      continue;
    }

    const actionUrl = formMatch[1].replace(/&amp;/g, '&').replace(/&#038;/g, '&');
    const postUrl = actionUrl.startsWith('http') ? actionUrl : `${WP_URL}${actionUrl.startsWith('/') ? '' : '/'}${actionUrl}`;

    const formBody = new URLSearchParams();
    const inputs = [...formMatch[2].matchAll(/<input[^>]+name="([^"]+)"[^>]+value="([^"]*)"/gi)];
    for (const inp of inputs) {
      formBody.append(inp[1], inp[2]);
    }
    // Ensure submit button is included
    formBody.append('submit', 'Yes, delete these files');

    console.log('Posting deletion form to:', postUrl);
    const delRes = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': allCookies },
      body: formBody.toString()
    });
    console.log('Delete response status:', delRes.status);
    const delResHtml = await delRes.text();
    fs.writeFileSync(`del_res_${pluginSlug.replace(/[\/\\]/g, '_')}.html`, delResHtml, 'utf8');
    if (delResHtml.includes('deleted') || delRes.status === 302 || delRes.status === 200) {
      console.log('Deletion submitted successfully!');
    }
  }
}

doDelete().catch(console.error);
