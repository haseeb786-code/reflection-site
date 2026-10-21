import { getProdAuth } from './prod_auth_helper.js';

async function readAstraWoo() {
  const { siteUrl, cookies } = await getProdAuth();
  const editorRes = await fetch(`${siteUrl}/wp-admin/theme-editor.php?file=inc%2Fcompatibility%2Fwoocommerce%2Fclass-astra-woocommerce.php&theme=astra`, {
    headers: { Cookie: cookies }
  });
  const html = await editorRes.text();
  const contentMatch = html.match(/<textarea[^>]*id="newcontent"[^>]*>([\s\S]*?)<\/textarea>/i);
  if (contentMatch) {
    let content = contentMatch[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    console.log('class-astra-woocommerce.php length:', content.length);
    // Find shop loop hooks
    const lines = content.split('\n');
    lines.forEach((l, i) => {
      if (l.includes('shop') || l.includes('loop') || l.includes('archive')) {
        console.log(`L${i+1}: ${l}`);
      }
    });
  } else {
    console.log('File not found in editor');
  }
}

readAstraWoo().catch(console.error);
