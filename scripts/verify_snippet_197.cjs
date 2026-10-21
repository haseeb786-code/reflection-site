const fs = require('fs');

async function main() {
  const { getProdAuth } = await import('./prod_auth_helper.js');
  const auth = await getProdAuth();
  const res = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-snippet-manager&snippet_id=197`, {
    headers: { 'Cookie': auth.cookies }
  });
  const html = await res.text();
  fs.writeFileSync('snippet_197_saved.html', html);
  
  const titleMatch = html.match(/name="wpcode_snippet_title"[^>]*value="([^"]+)"/);
  const activeMatch = html.match(/name="wpcode_active"[^>]*checked/);
  const locMatch = html.match(/<input[^>]*value="([^"]+)"[^>]*name="wpcode_auto_insert_location"[^>]*checked/i) || html.match(/<input[^>]*name="wpcode_auto_insert_location"[^>]*value="([^"]+)"[^>]*checked/i);
  const codeMatch = html.match(/<textarea[^>]*id="wpcode_snippet_code"[^>]*>([\s\S]*?)<\/textarea>/);

  console.log('Snippet 197 Title:', titleMatch ? titleMatch[1] : 'none');
  console.log('Snippet 197 Active:', !!activeMatch);
  console.log('Snippet 197 Location:', locMatch ? locMatch[1] : 'none');
  console.log('Snippet 197 Code length:', codeMatch ? codeMatch[1].length : 0);
}

main().catch(console.error);
