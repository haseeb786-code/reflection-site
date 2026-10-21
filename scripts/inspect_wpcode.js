import { getProdAuth } from './prod_auth_helper.js';

async function check() {
  const { siteUrl, cookies } = await getProdAuth();
  const res = await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { Cookie: cookies }
  });
  const text = await res.text();
  const headerMatch = text.match(/name="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  const footerMatch = text.match(/name="ihaf_insert_footer"[^>]*>([\s\S]*?)<\/textarea>/i);
  console.log('Header snippet length:', headerMatch ? headerMatch[1].length : 'none');
  console.log('Footer snippet length:', footerMatch ? footerMatch[1].length : 'none');
  if (headerMatch) console.log('Header preview:', headerMatch[1].slice(0, 200));
  if (footerMatch) console.log('Footer preview:', footerMatch[1].slice(0, 200));
}

check().catch(console.error);
