import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  const auth = await getProdAuth();
  for (const id of [46, 42]) {
    const res = await fetch(`${auth.siteUrl}/wp-json/wp/v2/media/${id}`, {
      headers: { Cookie: auth.cookies, 'X-WP-Nonce': auth.nonce }
    });
    const data = await res.json();
    console.log(`Media #${id}: ${data.title?.rendered || data.slug}`);
    console.log(`  Width: ${data.media_details?.width}px, Height: ${data.media_details?.height}px`);
    console.log(`  Source URL: ${data.source_url}`);
  }
}

main().catch(console.error);
