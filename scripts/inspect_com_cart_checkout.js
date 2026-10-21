import { getProdAuth } from './prod_auth_helper.js';

async function inspectCartCheckout() {
  const { siteUrl, cookies, nonce } = await getProdAuth();

  for (const id of [7, 8]) {
    const res = await fetch(`${siteUrl}/wp-json/wp/v2/pages/${id}?context=edit`, {
      headers: { 'Cookie': cookies, 'X-WP-Nonce': nonce }
    });
    if (res.ok) {
      const data = await res.json();
      console.log(`Page ${id} (${data.slug}):`);
      console.log('Content raw:', JSON.stringify(data.content?.raw));
    }
  }
}
inspectCartCheckout().catch(console.error);
