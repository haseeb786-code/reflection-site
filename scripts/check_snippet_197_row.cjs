const fs = require('fs');

async function checkRow() {
  const { getProdAuth } = await import('./prod_auth_helper.js');
  const auth = await getProdAuth();
  const res = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode`, {
    headers: { 'Cookie': auth.cookies }
  });
  const html = await res.text();
  fs.writeFileSync('wpcode_current_list.html', html);

  const rowMatch = html.match(/<tr[^>]*id="snippet-197"[^>]*>([\s\S]*?)<\/tr>/) || html.match(/<tr[^>]*data-id="197"[^>]*>([\s\S]*?)<\/tr>/) || html.match(/snippet_id=197[\s\S]*?<\/tr>/);
  console.log('Snippet 197 row found:', rowMatch ? rowMatch[0] : 'not found');
}

checkRow().catch(console.error);
