import { getProdAuth } from './prod_auth_helper.js';
import fs from 'fs';

async function readFunctionsPhp() {
  const auth = await getProdAuth();
  const editorRes = await fetch(`${auth.siteUrl}/wp-admin/theme-editor.php?file=functions.php&theme=astra`, {
    headers: { Cookie: auth.cookies }
  });
  const html = await editorRes.text();
  const contentMatch = html.match(/<textarea[^>]*id="newcontent"[^>]*>([\s\S]*?)<\/textarea>/i);
  if (!contentMatch) throw new Error('Could not find textarea');
  
  const content = contentMatch[1]
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');

  console.log('functions.php size:', content.length);
  fs.writeFileSync('scripts/live_functions.php', content);
  console.log('Saved to scripts/live_functions.php');
}

readFunctionsPhp().catch(console.error);
