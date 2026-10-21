import { getProdAuth } from './prod_auth_helper.js';

async function purgeCache() {
  console.log('=== PURGING HOSTINGER EDGE & SERVER CACHE FOR REFLECTIONELITE.COM ===');
  const { siteUrl, cookies, nonce } = await getProdAuth();

  const res = await fetch(`${siteUrl}/wp-json/hostinger-tools-plugin/v1/clear-cache`, {
    method: 'DELETE',
    headers: {
      'Cookie': cookies,
      'X-WP-Nonce': nonce
    }
  });

  if (res.ok) {
    const data = await res.json();
    console.log('✓ Cache successfully cleared:', data);
  } else {
    const text = await res.text();
    console.error(`✗ Cache clear failed with HTTP ${res.status}:`, text);
    process.exit(1);
  }
}

purgeCache().catch(err => {
  console.error('Purge script failed:', err);
  process.exit(1);
});
