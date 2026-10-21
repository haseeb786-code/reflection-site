import { getFreshNonce, cookieHeader } from './staging_real_data_helper.js';

async function checkPost1398() {
  const nonce = await getFreshNonce();
  const types = ['posts', 'pages', 'elementor_library', 'product'];
  // Let's also fetch post types
  const ptRes = await fetch('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/types', {
    headers: { 'Cookie': cookieHeader, 'X-WP-Nonce': nonce }
  });
  if (ptRes.ok) {
    const pts = await ptRes.json();
    console.log('Available post types:', Object.keys(pts));
    for (const typeKey of Object.keys(pts)) {
      const restBase = pts[typeKey].rest_base || typeKey;
      const res = await fetch(`https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/${restBase}/1398`, {
        headers: { 'Cookie': cookieHeader, 'X-WP-Nonce': nonce }
      });
      if (res.ok) {
        const d = await res.json();
        console.log(`FOUND 1398 under post type '${typeKey}' (${restBase}):`, d.title?.rendered || d.title?.raw);
      }
    }
  }
}

checkPost1398().catch(console.error);
