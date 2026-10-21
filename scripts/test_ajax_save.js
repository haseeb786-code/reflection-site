import { getProdAuth } from './prod_auth_helper.js';

async function testAjaxSave() {
  const { siteUrl, cookies } = await getProdAuth();
  const editorRes = await fetch(`${siteUrl}/wp-admin/theme-editor.php?file=functions.php&theme=astra`, {
    headers: {
      Cookie: cookies,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      Referer: `${siteUrl}/wp-admin/theme-editor.php`
    }
  });
  const html = await editorRes.text();
  const nonceMatch = html.match(/id="nonce"\s+name="nonce"\s+value="([^"]+)"/i)
                  || html.match(/name="nonce"\s+value="([^"]+)"/i);
  const nonce = nonceMatch[1];
  console.log('Nonce:', nonce);

  // Let's test calling admin-ajax.php with action=edit-theme-plugin-file
  const contentMatch = html.match(/<textarea[^>]*id="newcontent"[^>]*>([\s\S]*?)<\/textarea>/i);
  let currentContent = contentMatch[1]
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');

  const params = new URLSearchParams();
  params.append('action', 'edit-theme-plugin-file');
  params.append('_ajax_nonce', nonce);
  params.append('nonce', nonce);
  params.append('file', 'functions.php');
  params.append('theme', 'astra');
  params.append('newcontent', currentContent);

  const ajaxRes = await fetch(`${siteUrl}/wp-admin/admin-ajax.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookies,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      Referer: `${siteUrl}/wp-admin/theme-editor.php?file=functions.php&theme=astra`
    },
    body: params.toString()
  });

  console.log('AJAX status:', ajaxRes.status);
  const json = await ajaxRes.text();
  console.log('AJAX response:', json);
}

testAjaxSave().catch(console.error);
