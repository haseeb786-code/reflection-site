import { getProdAuth } from './prod_auth_helper.js';

async function checkFooterSource() {
  const { siteUrl, cookies, nonce } = await getProdAuth();
  for (const id of [68, 6, 50]) {
    const res = await fetch(`${siteUrl}/wp-json/wp/v2/pages/${id}?context=edit`, {
      headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
    });
    const d = await res.json();
    const c = d.content?.raw || '';
    console.log(`Page ${id} (${d.slug}) contains 'HANDCRAFTED HERITAGE':`, c.includes('HANDCRAFTED HERITAGE'));
    console.log(`Page ${id} (${d.slug}) contains 'ATELIER INQUIRIES':`, c.includes('ATELIER INQUIRIES'));
    console.log(`Page ${id} (${d.slug}) contains '<footer':`, c.includes('<footer'));
  }
}

checkFooterSource().catch(console.error);
