import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  const auth = await getProdAuth();

  // 1. Check wpcode-headers-footers
  const hfRes = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { Cookie: auth.cookies }
  });
  const hfHtml = await hfRes.text();
  console.log('wpcode-headers-footers contains te-hero-ticker-slider-v2?', hfHtml.includes('te-hero-ticker-slider-v2'));

  // 2. Check snippets list
  const listRes = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode`, {
    headers: { Cookie: auth.cookies }
  });
  const listHtml = await listRes.text();
  console.log('wpcode snippets list contains te-hero-ticker-slider-v2?', listHtml.includes('te-hero-ticker-slider-v2'));

  // Extract all snippet links / IDs
  const snippetMatches = [...listHtml.matchAll(/snippet_id=(\d+)/g)];
  console.log('Snippet IDs found:', [...new Set(snippetMatches.map(m => m[1]))]);

  for (const id of new Set(snippetMatches.map(m => m[1]))) {
    const sRes = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-snippet-manager&snippet_id=${id}`, {
      headers: { Cookie: auth.cookies }
    });
    const sHtml = await sRes.text();
    const title = (sHtml.match(/name="wpcode_snippet_title"[^>]*value="([^"]+)"/) || [])[1];
    const active = sHtml.includes('name="wpcode_active" checked') || sHtml.includes('name="wpcode_active" value="1" checked');
    const hasV2 = sHtml.includes('te-hero-ticker-slider-v2');
    console.log(`Snippet #${id}: title="${title}", active=${active}, hasV2=${hasV2}`);
  }
}

main().catch(console.error);
