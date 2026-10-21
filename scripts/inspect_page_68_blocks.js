import { getProdAuth } from './prod_auth_helper.js';
import fs from 'fs';

async function main() {
  const auth = await getProdAuth();
  const res = await fetch(`${auth.siteUrl}/wp-json/wp/v2/pages/68?context=edit`, {
    headers: { Cookie: auth.cookies, 'X-WP-Nonce': auth.nonce }
  });
  const data = await res.json();
  const raw = data.content?.raw || '';
  fs.writeFileSync('backups/page_68_before_restructure.html', raw);
  console.log('✓ Saved backups/page_68_before_restructure.html, size:', raw.length);

  // Search for Block 1
  const b1Start = raw.indexOf('re-hero-title-section');
  console.log('Block 1 (re-hero-title-section) index:', b1Start);
  if (b1Start !== -1) {
    console.log('--- Block 1 preview: ---');
    console.log(raw.slice(b1Start - 20, b1Start + 500));
  }

  // Search for Block 2
  const b2Start = raw.indexOf('cycle-header');
  console.log('\nBlock 2 (cycle-header) index:', b2Start);
  if (b2Start !== -1) {
    console.log('--- Block 2 preview: ---');
    console.log(raw.slice(b2Start - 20, b2Start + 500));
  }

  // Search for the 4 product cards
  const cardsStart = raw.indexOf('cycle-grid');
  console.log('\nProduct Cards (cycle-grid) index:', cardsStart);
}

main().catch(console.error);
