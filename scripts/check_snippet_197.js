import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  const auth = await getProdAuth();
  const res = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-snippet-manager&snippet_id=197`, {
    headers: { Cookie: auth.cookies }
  });
  const html = await res.text();
  const match = html.match(/<textarea[^>]*id="wpcode_snippet_code"[^>]*>([\s\S]*?)<\/textarea>/i);
  if (!match) {
    console.log('Snippet 197 textarea not found');
    return;
  }
  const code = match[1];
  console.log('Snippet 197 length:', code.length);
  const heroSectionRules = code.match(/\.re-hero-section[^{]*\{[^}]*\}/g) || [];
  console.log('re-hero-section rules:', heroSectionRules);
}

main().catch(console.error);
