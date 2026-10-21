import { getProdAuth } from './prod_auth_helper.js';

async function listPages() {
  const { siteUrl, cookies, nonce } = await getProdAuth();
  const res = await fetch(siteUrl + '/wp-json/wp/v2/pages?per_page=100&context=edit', {
    headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
  });
  const data = await res.json();
  if (!Array.isArray(data)) {
    console.log('Response status:', res.status, 'Data:', data);
    return;
  }
  console.log('Pages on reflectionelite.com:');
  for (const p of data) {
    console.log(`ID: ${p.id} | Slug: ${p.slug} | Status: ${p.status} | Title: "${p.title?.rendered}" | Link: ${p.link}`);
  }
}

listPages().catch(console.error);
