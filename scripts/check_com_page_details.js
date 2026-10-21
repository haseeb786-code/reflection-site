import { getProdAuth } from './prod_auth_helper.js';

async function checkComPageDetails() {
  const { siteUrl, cookies, nonce } = await getProdAuth();

  for (const id of [68, 6, 7, 8, 50, 52]) {
    const res = await fetch(`${siteUrl}/wp-json/wp/v2/pages/${id}?context=edit`, {
      headers: { 'Cookie': cookies, 'X-WP-Nonce': nonce }
    });
    if (res.ok) {
      const data = await res.json();
      console.log(`Page ${id} (${data.slug}): template="${data.template}", length=${data.content?.raw?.length}`);
    }
  }
}

checkComPageDetails().catch(console.error);
