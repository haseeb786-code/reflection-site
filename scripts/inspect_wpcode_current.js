import { getProdAuth } from './prod_auth_helper.js';

async function checkWpCode() {
  const { siteUrl, cookies } = await getProdAuth();
  const res = await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { Cookie: cookies }
  });
  const html = await res.text();
  const headerMatch = html.match(/<textarea[^>]*id="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  const footerMatch = html.match(/<textarea[^>]*id="ihaf_insert_footer"[^>]*>([\s\S]*?)<\/textarea>/i);
  console.log('WPCode Header length:', headerMatch ? headerMatch[1].length : 0);
  console.log('WPCode Footer length:', footerMatch ? footerMatch[1].length : 0);
  if (headerMatch) {
    console.log('Header preview (first 500 chars):\n', headerMatch[1].slice(0, 500));
  }
}

checkWpCode().catch(console.error);
