import fs from 'fs';

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';

async function inspectForm() {
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

  const editorRes = await fetch(`${WP_URL}/wp-admin/theme-editor.php?file=functions.php&theme=astra`, {
    headers: { Cookie: allCookies }
  });
  const html = await editorRes.text();
  
  const formMatch = html.match(/<form[^>]*id="template"[^>]*>([\s\S]*?)<\/form>/i);
  if (formMatch) {
    console.log('Form inputs:');
    const inputs = [...formMatch[1].matchAll(/<input[^>]+>/gi)];
    for (const inp of inputs) {
      console.log(' -', inp[0]);
    }
  } else {
    console.log('No form with id="template"');
  }
}

inspectForm().catch(console.error);
