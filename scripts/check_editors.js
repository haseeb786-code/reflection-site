import fs from 'fs';

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';

async function testThemeEditor() {
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

  const editorRes = await fetch(`${WP_URL}/wp-admin/theme-editor.php`, { headers: { Cookie: allCookies } });
  console.log('theme-editor.php status:', editorRes.status);
  const html = await editorRes.text();
  console.log('theme-editor has nonce?', html.includes('_wpnonce'));
  console.log('theme-editor file parameter:', html.includes('functions.php') ? 'functions.php found' : 'none');
  
  const pEditorRes = await fetch(`${WP_URL}/wp-admin/plugin-editor.php`, { headers: { Cookie: allCookies } });
  console.log('plugin-editor.php status:', pEditorRes.status);
}

testThemeEditor().catch(console.error);
