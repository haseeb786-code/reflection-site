import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  const auth = await getProdAuth();
  const res = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode`, {
    headers: { Cookie: auth.cookies }
  });
  const html = await res.text();
  const rows = [...html.matchAll(/<tr[^>]*id="wpcode-snippet-([0-9]+)"[\s\S]*?<a[^>]*class="row-title"[^>]*>([^<]+)<\/a>/gi)];
  console.log('WPCode Snippets on live site:');
  rows.forEach(r => console.log(`  ID: ${r[1]} - Title: ${r[2]}`));
}

main().catch(console.error);
