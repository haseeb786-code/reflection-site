import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function testThemeEditor() {
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/theme-editor.php?file=functions.php&theme=astra`);
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

  const nonceMatch = html.match(/name="_wpnonce"\s+value="([a-f0-9]+)"/i);
  console.log('Nonce:', nonceMatch?.[1]);

  const formMatch = html.match(/<form[^>]*id="template"[^>]*>([\s\S]*?)<\/form>/i);
  if (formMatch) {
    console.log('Form action:', formMatch[0].match(/action="([^"]*)"/)?.[1]);
    const inputs = [...formMatch[1].matchAll(/<input[^>]+name="([^"]+)"[^>]+value="([^"]*)"/gi)];
    for (const inp of inputs) {
      console.log(` - input ${inp[1]} = ${inp[2]}`);
    }
  } else {
    console.log('No form#template found');
  }
}

testThemeEditor().catch(console.error);
