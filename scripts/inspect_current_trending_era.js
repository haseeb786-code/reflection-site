import fs from 'fs';
import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  const auth = await getProdAuth();
  const res = await fetch(`${auth.siteUrl}/wp-json/wp/v2/pages/68?context=edit`, {
    headers: { Cookie: auth.cookies, 'X-WP-Nonce': auth.nonce }
  });
  const data = await res.json();
  const content = data.content?.raw || '';
  const idx = content.indexOf('catalog-grid-4');
  const end = content.indexOf('</section>', idx);
  console.log(content.substring(idx - 100, end));
}

main().catch(console.error);
