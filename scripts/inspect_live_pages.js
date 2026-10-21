import { getFreshNonce, cookieHeader } from './staging_real_data_helper.js';

async function checkPages() {
  const nonce = await getFreshNonce();
  const pageIds = [52, 7, 8, 9, 674, 943, 1144, 1511, 1519, 1598, 1615];
  for (const id of pageIds) {
    const res = await fetch(`https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/${id}?context=edit`, {
      headers: {
        'Cookie': cookieHeader,
        'X-WP-Nonce': nonce
      }
    });
    if (!res.ok) {
      console.log(`Failed to fetch page ${id}: ${res.status}`);
      continue;
    }
    const data = await res.json();
    console.log(`=== Page ${id}: ${data.title?.raw || data.title?.rendered} (slug: ${data.slug}) ===`);
    console.log(`Template: ${data.template}`);
    console.log(`Content length: ${data.content?.raw?.length}`);
    console.log(`Content snippet: ${(data.content?.raw || '').slice(0, 150).replace(/\n/g, ' ')}...\n`);
  }
}

checkPages().catch(console.error);

