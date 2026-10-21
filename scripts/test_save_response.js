import { getProdAuth } from './prod_auth_helper.js';

async function testSave() {
  const { siteUrl, cookies } = await getProdAuth();
  const editorRes = await fetch(`${siteUrl}/wp-admin/theme-editor.php?file=functions.php&theme=astra`, {
    headers: { Cookie: cookies }
  });
  const html = await editorRes.text();
  const nonceMatch = html.match(/name="nonce"\s+value="([a-f0-9]+)"/i);
  const nonce = nonceMatch[1];
  const contentMatch = html.match(/<textarea[^>]*id="newcontent"[^>]*>([\s\S]*?)<\/textarea>/i);
  let currentContent = contentMatch[1]
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');

  const bodyParams = new URLSearchParams();
  bodyParams.append('nonce', nonce);
  bodyParams.append('_wp_http_referer', '/wp-admin/theme-editor.php?file=functions.php&theme=astra');
  bodyParams.append('action', 'update');
  bodyParams.append('file', 'functions.php');
  bodyParams.append('theme', 'astra');
  bodyParams.append('newcontent', currentContent); // Just save unchanged content first
  bodyParams.append('submit', 'Update File');

  const saveRes = await fetch(`${siteUrl}/wp-admin/theme-editor.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookies
    },
    body: bodyParams.toString(),
    redirect: 'manual'
  });

  console.log('Status:', saveRes.status);
  console.log('Location header:', saveRes.headers.get('location'));
  const text = await saveRes.text();
  console.log('Body length:', text.length);
  if (text.includes('error') || text.includes('notice')) {
    console.log('Body snippet:', text.slice(0, 500));
  }
}

testSave().catch(console.error);
