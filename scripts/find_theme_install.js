import fs from 'fs';

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';

async function checkThemeInstall() {
  const loginUrl = WP_URL + '/wp-login.php';
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', WP_URL + '/wp-admin/theme-install.php?search=astra');
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');

  const res3 = await fetch(WP_URL + '/wp-admin/theme-install.php?search=astra', {
    headers: { 'Cookie': allCookies }
  });
  const html = await res3.text();
  console.log('HTML length:', html.length);
  
  // Look for any links with action=install-theme or themes.php or update.php
  const matches = [...html.matchAll(/href=["']([^"']*(?:install-theme|update\.php|themes\.php)[^"']*)["']/gi)];
  console.log('Found matches:', matches.length);
  matches.forEach(m => console.log('Link:', m[1]));

  // Also check if there is an iframe or JSON data for wp.themes
  const jsonMatch = html.match(/_wpThemeSettings\s*=\s*({.*?});/s);
  if (jsonMatch) {
    console.log('Found _wpThemeSettings!');
    const settings = JSON.parse(jsonMatch[1]);
    const nonces = [...html.matchAll(/(.{0,40})(?:ajax_nonce|nonce)(.{0,40})/gi)];
    console.log('Found nonces matches:');
    nonces.forEach(n => console.log('Match:', n[0]));
  }
}

checkThemeInstall().catch(console.error);
