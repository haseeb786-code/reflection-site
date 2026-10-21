import fs from 'fs';
import { getProdAuth } from './prod_auth_helper.js';

async function checkProdWpCode() {
  const { siteUrl, cookies } = await getProdAuth();
  const res = await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { Cookie: cookies }
  });
  const html = await res.text();
  const headerMatch = html.match(/<textarea[^>]*id="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  const bodyMatch = html.match(/<textarea[^>]*id="ihaf_insert_body"[^>]*>([\s\S]*?)<\/textarea>/i);
  const footerMatch = html.match(/<textarea[^>]*id="ihaf_insert_footer"[^>]*>([\s\S]*?)<\/textarea>/i);
  
  console.log('--- Current ihaf_insert_header (length:', headerMatch ? headerMatch[1].length : 'none', ') ---');
  if (headerMatch) {
    const unescaped = headerMatch[1]
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, '&');
    console.log('Includes shine-sweep:', unescaped.includes('shine-sweep'));
    console.log('Includes re-unified-header:', unescaped.includes('re-unified-header'));
    console.log('Includes mobile responsive grid:', unescaped.includes('@media (max-width: 768px)') || unescaped.includes('@media (max-width: 650px)'));
    fs.writeFileSync('./temp_prod_wpcode_head.txt', unescaped);
    console.log('Saved unescaped header to ./temp_prod_wpcode_head.txt');
  }
}

checkProdWpCode().catch(console.error);
