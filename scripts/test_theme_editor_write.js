import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function testThemeEditorWrite() {
  console.log('=== 1. LOGGING IN ===');
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

  console.log('=== 2. READING CURRENT FUNCTIONS.PHP ===');
  const editorRes = await fetch(`${WP_URL}/wp-admin/theme-editor.php?file=functions.php&theme=astra`, {
    headers: { Cookie: allCookies }
  });
  const html = await editorRes.text();

  const nonceMatch = html.match(/name="nonce"\s+value="([a-f0-9]+)"/i);
  if (!nonceMatch) throw new Error('No theme editor nonce found');
  const nonce = nonceMatch[1];
  console.log('Theme Editor Nonce:', nonce);

  const contentMatch = html.match(/<textarea[^>]*id="newcontent"[^>]*>([\s\S]*?)<\/textarea>/i);
  if (!contentMatch) throw new Error('No newcontent textarea found');
  let currentContent = contentMatch[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  console.log('Current functions.php length:', currentContent.length);

  // Test adding a harmless comment
  const testMarker = '// RE_PAYMENTS_ENGINE_MARKER';
  if (!currentContent.includes(testMarker)) {
    const updatedContent = currentContent + '\n\n' + testMarker + '\n';
    console.log('Submitting updated functions.php with marker...');

    const bodyParams = new URLSearchParams();
    bodyParams.append('nonce', nonce);
    bodyParams.append('_wp_http_referer', '/wp-admin/theme-editor.php?file=functions.php&theme=astra');
    bodyParams.append('action', 'update');
    bodyParams.append('file', 'functions.php');
    bodyParams.append('theme', 'astra');
    bodyParams.append('newcontent', updatedContent);
    bodyParams.append('submit', 'Update File');

    const saveRes = await fetch(`${WP_URL}/wp-admin/theme-editor.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': allCookies
      },
      body: bodyParams.toString()
    });

    console.log('Save HTTP Status:', saveRes.status);
    const saveHtml = await saveRes.text();
    console.log('File edited successfully notice?', saveHtml.includes('File edited successfully'));
  } else {
    console.log('Marker already exists in functions.php!');
  }
}

testThemeEditorWrite().catch(console.error);
