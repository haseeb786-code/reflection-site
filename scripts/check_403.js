import { getProdAuth } from './prod_auth_helper.js';

async function check403() {
  const { siteUrl, cookies } = await getProdAuth();
  const editorRes = await fetch(`${siteUrl}/wp-admin/theme-editor.php?file=functions.php&theme=astra`, {
    headers: { Cookie: cookies }
  });
  const html = await editorRes.text();
  const nonceMatch = html.match(/name="nonce"\s+value="([a-f0-9]+)"/i);
  const nonce = nonceMatch[1];

  const bodyParams = new URLSearchParams();
  bodyParams.append('nonce', nonce);
  bodyParams.append('_wp_http_referer', '/wp-admin/theme-editor.php?file=functions.php&theme=astra');
  bodyParams.append('action', 'update');
  bodyParams.append('file', 'functions.php');
  bodyParams.append('theme', 'astra');
  bodyParams.append('newcontent', 'test');
  bodyParams.append('submit', 'Update File');

  const saveRes = await fetch(`${siteUrl}/wp-admin/theme-editor.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookies,
      'Referer': `${siteUrl}/wp-admin/theme-editor.php?file=functions.php&theme=astra`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    },
    body: bodyParams.toString()
  });

  console.log('Save status:', saveRes.status);
  console.log('Response headers:', Object.fromEntries(saveRes.headers.entries()));
  console.log('Response text:', await saveRes.text());
}

check403().catch(console.error);
