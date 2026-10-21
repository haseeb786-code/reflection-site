import fs from 'fs';

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';

async function readFunctionsPhp() {
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
  
  const contentMatch = html.match(/<textarea[^>]*id="newcontent"[^>]*>([\s\S]*?)<\/textarea>/i);
  if (contentMatch) {
    const rawContent = contentMatch[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    console.log('=== ASTRA FUNCTIONS.PHP LENGTH ===', rawContent.length);
    console.log('=== ASTRA FUNCTIONS.PHP PREVIEW ===\n', rawContent.substring(0, 500));
    fs.writeFileSync('scripts/astra_functions_backup.php', rawContent);
    console.log('Saved backup to scripts/astra_functions_backup.php');
  } else {
    console.log('Could not find textarea id="newcontent" in theme editor');
  }

  const nonceMatch = html.match(/name="_wpnonce"\s+value="([a-f0-9]+)"/i);
  console.log('Found nonce:', nonceMatch ? nonceMatch[1] : 'none');
}

readFunctionsPhp().catch(console.error);
