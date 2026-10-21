import { getProdAuth } from './prod_auth_helper.js';

async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`Fetch retry ${i + 1}/${retries} for ${url}...`);
      await new Promise(r => setTimeout(r, 2000 * (i + 1)));
    }
  }
}

async function main() {
  const auth = await getProdAuth();
  console.log('1. Fetching revision 229 content...');
  const revRes = await fetchWithRetry(`${auth.siteUrl}/wp-json/wp/v2/pages/68/revisions/229?context=edit`, {
    headers: { Cookie: auth.cookies, 'X-WP-Nonce': auth.nonce }
  });
  const revData = await revRes.json();
  const raw = revData.content?.raw || '';
  console.log('Revision 229 raw length:', raw.length);

  if (!raw.includes('[te_category_showcase]') || !raw.includes('[te_duo_showcase]')) {
    throw new Error('Revision 229 missing shortcodes!');
  }

  console.log('2. Applying content to Page 68...');
  const updateRes = await fetchWithRetry(`${auth.siteUrl}/wp-json/wp/v2/pages/68`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: auth.cookies,
      'X-WP-Nonce': auth.nonce
    },
    body: JSON.stringify({
      content: raw
    })
  });
  console.log('Update status:', updateRes.status);
  if (updateRes.status !== 200) {
    const err = await updateRes.text();
    throw new Error('Update failed: ' + err);
  }

  console.log('3. Purging Hostinger cache...');
  const purgeRes = await fetchWithRetry(`${auth.siteUrl}/wp-json/hostinger-tools-plugin/v1/clear-cache`, {
    method: 'DELETE',
    headers: { Cookie: auth.cookies, 'X-WP-Nonce': auth.nonce }
  });
  console.log('Cache purge status:', purgeRes.status);

  // 4. Verify live response
  console.log('4. Verifying live HTML...');
  const frontRes = await fetchWithRetry(`${auth.siteUrl}/?nocache=${Date.now()}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await frontRes.text();
  console.log('Has te-cat-showcase-section in body:', html.includes('id="teCatShowcase"'));
  console.log('Has te-duo-showcase-section in body:', html.includes('id="teDuoShowcase"'));
  console.log('Has screen-reader H1:', html.includes('Reflection Elite &#8211; Handcrafted Luxury Mirrors'));
  console.log('Has old Elevate Your:', html.includes('ELEVATE YOUR'));
}

main().catch(console.error);
