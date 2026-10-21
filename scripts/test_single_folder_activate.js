import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function testSingleFolderActivate() {
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

  // Get a fresh nonce for activate-plugin_re-flexible-payments/re-flexible-payments.php
  const pRes = await fetch(`${WP_URL}/wp-admin/plugins.php`, { headers: { 'Cookie': allCookies } });
  const pHtml = await pRes.text();

  // Try activating via REST API with application password or admin cookie
  const WP_USER = 'admin';
  const WP_APP_PASS = 'oOei QLY7 j1mC Wb6U Gndx qYFg';
  const authHeader = { Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64')}` };

  console.log('Querying REST API for plugins...');
  const rRes = await fetch(`${WP_URL}/wp-json/wp/v2/plugins`, { headers: authHeader });
  const plugins = await rRes.json();
  console.log('REST Plugins:', plugins.map(p => ({ plugin: p.plugin, status: p.status })));

  const flexPlugin = plugins.find(p => p.plugin.includes('re-flexible'));
  if (flexPlugin) {
    console.log('Found re-flexible plugin in REST API:', flexPlugin);
    const actRes = await fetch(`${WP_URL}/wp-json/wp/v2/plugins/${encodeURIComponent(flexPlugin.plugin)}`, {
      method: 'POST',
      headers: { ...authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'active' })
    });
    console.log('REST Activation Status:', actRes.status);
    const actData = await actRes.json();
    console.log('REST Activation Result:', actData);
  } else {
    console.log('Plugin not in REST API list yet.');
  }
}

testSingleFolderActivate().catch(console.error);
