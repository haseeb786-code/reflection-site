import fs from 'fs';
import path from 'path';
import { getProdAuth } from './prod_auth_helper.js';

async function backupWpCode() {
  const { siteUrl, cookies } = await getProdAuth();
  const res = await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { Cookie: cookies }
  });
  const text = await res.text();
  const headerMatch = text.match(/name="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  const bodyMatch = text.match(/name="ihaf_insert_body"[^>]*>([\s\S]*?)<\/textarea>/i);
  const footerMatch = text.match(/name="ihaf_insert_footer"[^>]*>([\s\S]*?)<\/textarea>/i);

  const backupData = {
    ihaf_insert_header: headerMatch ? headerMatch[1] : '',
    ihaf_insert_body: bodyMatch ? bodyMatch[1] : '',
    ihaf_insert_footer: footerMatch ? footerMatch[1] : '',
    timestamp: new Date().toISOString()
  };

  const backupPath = path.resolve('backups/production_com_pre_swap_20261018/wpcode_headers_footers.json');
  fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf8');
  console.log(`✓ Backed up WPCode headers and footers (${backupData.ihaf_insert_header.length} header bytes, ${backupData.ihaf_insert_footer.length} footer bytes) to ${backupPath}`);
}

backupWpCode().catch(console.error);
