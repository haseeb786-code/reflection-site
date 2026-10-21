import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  const { siteUrl, cookies } = await getProdAuth();
  const res = await fetch(`${siteUrl}/wp-admin/theme-editor.php?file=functions.php&theme=astra`, {
    headers: { Cookie: cookies }
  });
  const html = await res.text();
  const match = html.match(/<textarea[^>]*id="newcontent"[^>]*>([\s\S]*?)<\/textarea>/i);
  if (match) {
    console.log('=== functions.php tail: ===');
    console.log(match[1].slice(-1500));
  } else {
    console.log('No textarea match');
  }
}

main().catch(console.error);
