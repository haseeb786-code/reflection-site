import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  const { siteUrl, cookies } = await getProdAuth();
  const res = await fetch(`${siteUrl}/wp-admin/theme-editor.php?file=functions.php&theme=astra`, {
    headers: { Cookie: cookies, 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  const m = html.match(/<textarea[^>]*id="newcontent"[^>]*>([\s\S]*?)<\/textarea>/i);
  if (m) {
    const lines = m[1].split('\n');
    console.log('Total lines:', lines.length);
    console.log('Last 35 lines of functions.php:');
    console.log(lines.slice(-35).join('\n'));
  }
}

main().catch(console.error);
