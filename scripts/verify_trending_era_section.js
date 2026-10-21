import { getProdAuth } from './prod_auth_helper.js';

async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, { ...options, signal: AbortSignal.timeout(35000) });
    } catch (e) {
      console.log(`Fetch attempt ${i + 1} failed (${e.message}), retrying...`);
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

async function verify() {
  const { siteUrl, cookies, nonce } = await getProdAuth();
  const pageRes = await fetchWithRetry(`${siteUrl}/wp-json/wp/v2/pages/68?context=edit`, {
    headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
  });
  const pageData = await pageRes.json();
  const raw = pageData.content?.raw || '';

  console.log('--- VERIFICATION CHECKS ---');
  console.log('1. "CENTURIES-OLD" present?', raw.includes('CENTURIES-OLD'));
  console.log('2. "VENETIAN HERITAGE COLLECTION" present?', raw.includes('VENETIAN HERITAGE COLLECTION'));
  console.log('3. "Handcrafted Venetian mirror heritage" present?', raw.includes('Handcrafted Venetian mirror heritage'));
  console.log('4. "TRENDING ERA" present?', raw.includes('TRENDING ERA'));
  console.log('5. Pure black background (#000000) present on cycle-section?', raw.includes('background-color: #000000') || raw.includes('background: #000000'));
  
  console.log('\n--- VERIFYING 4 PRODUCT CARDS ---');
  console.log('ANTIQUE VENETIAN CUSHION:', raw.includes('ANTIQUE VENETIAN CUSHION'));
  console.log('MODERN VICTORIAN:', raw.includes('MODERN VICTORIAN'));
  console.log('SILVER CROWN FRAMED:', raw.includes('SILVER CROWN FRAMED'));
  console.log('ROCOCO FLORAL:', raw.includes('ROCOCO FLORAL'));
  console.log('VIEW PIECE buttons count:', (raw.match(/>VIEW PIECE</g) || []).length);

  const startIdx = raw.indexOf('<section class="cycle-section"');
  const endIdx = raw.indexOf('</section>', startIdx) + '</section>'.length;
  console.log('\n--- SECTION MARKUP IN WORDPRESS DATABASE ---');
  console.log(raw.slice(startIdx, endIdx));
}

verify().catch(console.error);
