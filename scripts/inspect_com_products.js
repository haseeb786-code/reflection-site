import { getProdAuth } from './prod_auth_helper.js';

async function listProducts() {
  const { siteUrl, cookies, nonce } = await getProdAuth();
  const res = await fetch(siteUrl + '/wp-json/wc/store/v1/products?per_page=20', {
    headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
  });
  const data = await res.json();
  console.log('Products count:', data.length);
  for (const p of data) {
    console.log(`ID: ${p.id} | Slug: ${p.slug} | Name: "${p.name}" | Permalink: ${p.permalink}`);
  }
}

listProducts().catch(console.error);
