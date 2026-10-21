import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  const { siteUrl, cookies } = await getProdAuth();
  const res = await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { Cookie: cookies }
  });
  const html = await res.text();
  const headerMatch = html.match(/<textarea[^>]*name="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  
  if (headerMatch) {
    const headerCode = headerMatch[1]
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&#039;/g, "'")
      .replace(/&quot;/g, '"');
    console.log('--- FULL HEADER CODE ---');
    console.log(headerCode);
  }
}

main().catch(console.error);
