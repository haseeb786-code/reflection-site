import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  const auth = await getProdAuth();
  const res = await fetch(`${auth.siteUrl}/wp-json/wp/v2/pages/68?context=edit`, {
    headers: { Cookie: auth.cookies, 'X-WP-Nonce': auth.nonce }
  });
  const data = await res.json();
  const raw = data.content?.raw || '';
  
  const h1Matches = raw.match(/<h1[\s\S]*?<\/h1>/gi) || [];
  console.log('Count of <h1> in Page 68 raw:', h1Matches.length);
  h1Matches.forEach((h, i) => console.log(`  h1[${i}]:`, h));
}

main().catch(console.error);
