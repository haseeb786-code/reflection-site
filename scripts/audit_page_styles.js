import { getProdAuth } from './prod_auth_helper.js';

const pages = [68, 6, 7, 8, 50, 52, 102, 103, 120];

async function checkAllPages() {
  const { siteUrl, cookies, nonce } = await getProdAuth();
  console.log(`Checking site: ${siteUrl}`);
  for (const id of pages) {
    const res = await fetch(`${siteUrl}/wp-json/wp/v2/pages/${id}?context=edit`, {
      headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
    });
    if (!res.ok) {
      console.log(`Page ${id}: HTTP ${res.status}`);
      continue;
    }
    const d = await res.json();
    const c = d.content?.raw || '';
    const styles = (c.match(/<style[^>]*>/gi) || []).length;
    const scripts = (c.match(/<script[^>]*>/gi) || []).length;
    console.log(`Page ${id} (${d.slug}): ${c.length} chars, styles: ${styles}, scripts: ${scripts}`);
  }
}

checkAllPages().catch(console.error);
