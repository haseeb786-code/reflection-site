import { getProdAuth } from './prod_auth_helper.js';

async function check() {
  const auth = await getProdAuth();
  const res = await fetch('https://reflectionelite.com/wp-json/wp/v2/pages/9?context=edit', {
    headers: {
      'Cookie': auth.cookies,
      'X-WP-Nonce': auth.nonce
    }
  });
  const data = await res.json();
  const raw = data.content.raw;
  const startIdx = raw.indexOf('<div class="re-marquee-wrapper"');
  console.log('Start index:', startIdx);
  if (startIdx !== -1) {
    const nextTag = raw.indexOf('<div class="re-main-header-row"', startIdx);
    console.log('Next tag index:', nextTag);
    console.log('EXACT BLOCK TO REMOVE:\n', raw.substring(startIdx, nextTag));
  }
}

check().catch(console.error);
