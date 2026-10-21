import fs from 'fs';
import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  const auth = await getProdAuth();
  console.log('Fetching raw pages from WordPress REST API...');

  const pages = [
    { id: 68, slug: 'home' },
    { id: 6, slug: 'shop' },
    { id: 50, slug: 'about-us' },
    { id: 52, slug: 'contact' },
    { id: 120, slug: 'custom-dimensions' },
    { id: 103, slug: 'refund_returns-2' },
    { id: 102, slug: 'privacy-policy-2' },
    { id: 7, slug: 'cart' },
    { id: 8, slug: 'checkout' }
  ];

  for (const p of pages) {
    const res = await fetch(`${auth.siteUrl}/wp-json/wp/v2/pages/${p.id}?context=edit`, {
      headers: {
        'Cookie': auth.cookies,
        'X-WP-Nonce': auth.nonce
      }
    });
    const data = await res.json();
    fs.writeFileSync(`raw_page_${p.id}_${p.slug}.html`, data.content?.raw || '');
    console.log(`Saved raw_page_${p.id}_${p.slug}.html (${data.content?.raw?.length || 0} bytes)`);
  }
}

main().catch(console.error);
