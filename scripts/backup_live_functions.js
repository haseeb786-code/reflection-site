import { getProdAuth } from './prod_auth_helper.js';
import fs from 'fs';

async function backupFunctionsPhp() {
  const { siteUrl, cookies } = await getProdAuth();
  const editorRes = await fetch(`${siteUrl}/wp-admin/theme-editor.php?file=functions.php&theme=astra`, {
    headers: { Cookie: cookies }
  });
  const html = await editorRes.text();
  const contentMatch = html.match(/<textarea[^>]*id="newcontent"[^>]*>([\s\S]*?)<\/textarea>/i);
  if (!contentMatch) throw new Error('No newcontent textarea found');
  let currentContent = contentMatch[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  fs.writeFileSync('functions_backup_live.php', currentContent);
  console.log('Saved functions_backup_live.php, length:', currentContent.length);
}

backupFunctionsPhp().catch(console.error);
