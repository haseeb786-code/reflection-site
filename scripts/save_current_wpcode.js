import { getProdAuth } from './prod_auth_helper.js';
import fs from 'fs';

async function main() {
  const { siteUrl, cookies } = await getProdAuth();
  const res = await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { Cookie: cookies }
  });
  const html = await res.text();
  const headerMatch = html.match(/<textarea[^>]*name="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  const footerMatch = html.match(/<textarea[^>]*name="ihaf_insert_footer"[^>]*>([\s\S]*?)<\/textarea>/i);
  
  if (headerMatch) {
    const headerCode = headerMatch[1]
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&#039;/g, "'")
      .replace(/&quot;/g, '"');
    fs.writeFileSync('scripts/wpcode_header_current.html', headerCode, 'utf8');
    console.log('Saved scripts/wpcode_header_current.html (chars:', headerCode.length, ')');
  }
  
  if (footerMatch) {
    const footerCode = footerMatch[1]
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&#039;/g, "'")
      .replace(/&quot;/g, '"');
    fs.writeFileSync('scripts/wpcode_footer_current.html', footerCode, 'utf8');
    console.log('Saved scripts/wpcode_footer_current.html (chars:', footerCode.length, ')');
  }
}

main().catch(console.error);
