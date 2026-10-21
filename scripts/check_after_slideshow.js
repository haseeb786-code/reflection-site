import fs from 'fs';
import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  const auth = await getProdAuth();
  const res = await fetch(`${auth.siteUrl}/wp-json/wp/v2/pages/68?context=edit`, {
    headers: { Cookie: auth.cookies, 'X-WP-Nonce': auth.nonce }
  });
  const data = await res.json();
  const content = data.content?.raw || '';

  const idx = content.indexOf('id="re-slideshow-new-arrivals"');
  if (idx !== -1) {
    const end = content.indexOf('</section>', idx) + '</section>'.length;
    console.log('After re-slideshow-new-arrivals (next 800 chars):');
    console.log(content.substring(end, end + 800));
  }
}

main().catch(console.error);
