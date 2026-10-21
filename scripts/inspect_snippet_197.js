import { getProdAuth } from './prod_auth_helper.js';
import fs from 'fs';

async function main() {
  const auth = await getProdAuth();
  const sRes = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-snippet-manager&snippet_id=197`, {
    headers: { Cookie: auth.cookies }
  });
  const html = await sRes.text();
  fs.writeFileSync('snippet_197_full.html', html);
  console.log('Saved snippet_197_full.html, size:', html.length);

  const titleMatch = html.match(/<input[^>]*id="wpcode-snippet-title"[^>]*>/i) || html.match(/<input[^>]*name="wpcode_snippet_title"[^>]*>/i);
  console.log('Title input HTML:', titleMatch ? titleMatch[0] : 'not found');

  const activeMatch = html.match(/<input[^>]*wpcode[_-]active[^>]*>/gi);
  console.log('Active inputs:', activeMatch);

  const formMatch = html.match(/<form[^>]*id="wpcode-snippet-manager"[^>]*>([\s\S]*?)<\/form>/i);
  if (formMatch) {
    const inputs = [...formMatch[1].matchAll(/<input[^>]*name="([^"]+)"[^>]*value="([^"]*)"/gi)];
    console.log('Form inputs count:', inputs.length);
    console.log('Key inputs:', inputs.map(i => `${i[1]} = ${i[2]}`).filter(s => !s.includes('snippet_code')));
  }
}

main().catch(console.error);
