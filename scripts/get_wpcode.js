import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  const { siteUrl, cookies } = await getProdAuth();
  const res = await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { Cookie: cookies }
  });
  const html = await res.text();
  const headerMatch = html.match(/<textarea[^>]*name="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  const footerMatch = html.match(/<textarea[^>]*name="ihaf_insert_footer"[^>]*>([\s\S]*?)<\/textarea>/i);

  console.log('--- HEADER CONTENT ---');
  console.log(headerMatch ? headerMatch[1] : 'NONE');
  console.log('--- FOOTER CONTENT ---');
  console.log(footerMatch ? footerMatch[1] : 'NONE');
}

main().catch(console.error);
