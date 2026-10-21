import { getProdAuth } from './prod_auth_helper.js';

async function readPagePhp() {
  const { siteUrl, cookies } = await getProdAuth();
  const editorRes = await fetch(`${siteUrl}/wp-admin/theme-editor.php?file=page.php&theme=astra`, {
    headers: { Cookie: cookies }
  });
  const html = await editorRes.text();
  const contentMatch = html.match(/<textarea[^>]*id="newcontent"[^>]*>([\s\S]*?)<\/textarea>/i);
  if (contentMatch) {
    let content = contentMatch[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    console.log('page.php content:\n', content);
  } else {
    console.log('page.php not found');
  }
}

readPagePhp().catch(console.error);
