import { getProdAuth } from './prod_auth_helper.js';
import fs from 'fs';

async function main() {
  const auth = await getProdAuth();
  
  for (const id of [77, 78]) {
    const res = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-snippet-manager&snippet_id=${id}`, {
      headers: { 'Cookie': auth.cookies }
    });
    const html = await res.text();
    fs.writeFileSync(`snippet_${id}.html`, html);
    const titleMatch = html.match(/name="wpcode_snippet_title"[^>]*value="([^"]*)"/);
    const codeMatch = html.match(/<textarea[^>]*name="wpcode_snippet_code"[^>]*>([\s\S]*?)<\/textarea>/);
    console.log(`Snippet ${id}:`, {
      title: titleMatch ? titleMatch[1] : 'Unknown',
      codeLength: codeMatch ? codeMatch[1].length : 0
    });
  }
}

main().catch(console.error);
