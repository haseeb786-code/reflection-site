import { getProdAuth } from './prod_auth_helper.js';

async function run() {
  const auth = await getProdAuth();
  const res = await fetch('https://reflectionelite.com/wp-admin/admin.php?page=wpcode-headers-footers', {
    headers: { 'Cookie': auth.cookies }
  });
  const html = await res.text();
  const footerMatch = html.match(/<textarea[^>]*id="ihaf_insert_footer"[^>]*>([\s\S]*?)<\/textarea>/i);
  if (footerMatch) {
    const lines = footerMatch[1].split('\n');
    console.log(lines.slice(90, 140).map((l, i) => `${i + 91}: ${l}`).join('\n'));
  }
}
run();
