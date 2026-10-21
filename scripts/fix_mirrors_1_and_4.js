import fs from 'fs';
import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  const auth = await getProdAuth();
  console.log('1. Fetching Page 68 from:', auth.siteUrl);

  const res = await fetch(`${auth.siteUrl}/wp-json/wp/v2/pages/68?context=edit`, {
    headers: { Cookie: auth.cookies, 'X-WP-Nonce': auth.nonce }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch Page 68: HTTP ${res.status}`);
  }

  const pageData = await res.json();
  let content = pageData.content?.raw || '';

  // 1. Save Backup
  fs.writeFileSync('backups/page_68_before_mirrors_1_and_4_fix.html', content);
  console.log('✅ Backup saved to backups/page_68_before_mirrors_1_and_4_fix.html');

  // 2. Locate catalog-grid-4
  const gridStart = content.indexOf('<div class="catalog-grid-4">');
  if (gridStart === -1) {
    throw new Error('catalog-grid-4 not found in Page 68!');
  }

  // Target card 1
  const card1Target = `<div class="luxury-card">
      <div class="card-media" style="position:relative;">
        <img src="https://reflectionelite.com/wp-content/uploads/2026/10/1771694577552.jpg" alt="ANTIQUE VENETIAN CUSHION" loading="lazy">
      </div>`;

  const card1Replacement = `<div class="luxury-card">
      <div class="card-media" style="position:relative; background:#ffffff !important;">
        <img src="https://reflectionelite.com/wp-content/uploads/2026/10/1771694577552.jpg" alt="ANTIQUE VENETIAN CUSHION" loading="lazy" style="object-fit:contain !important; width:100% !important; height:100% !important; background:#ffffff !important; padding:6px !important;">
      </div>`;

  // Target card 4
  const card4Target = `<div class="luxury-card">
      <div class="card-media" style="position:relative;">
        <span style="position:absolute; top:12px; left:12px; background:rgba(18,18,18,0.9); color:#ffffff; font-size:11px; font-weight:700; letter-spacing:0.08em; padding:4px 10px; border-radius:3px; z-index:2; text-transform:uppercase; border:1px solid rgba(255,255,255,0.15);">SALE</span>
        <img src="https://reflectionelite.com/wp-content/uploads/2026/10/20260222_002716-scaled.jpg" alt="MODERN VICTORIAN" loading="lazy">
      </div>`;

  const card4Replacement = `<div class="luxury-card">
      <div class="card-media" style="position:relative; background:#ffffff !important;">
        <span style="position:absolute; top:12px; left:12px; background:rgba(18,18,18,0.9); color:#ffffff; font-size:11px; font-weight:700; letter-spacing:0.08em; padding:4px 10px; border-radius:3px; z-index:2; text-transform:uppercase; border:1px solid rgba(255,255,255,0.15);">SALE</span>
        <img src="https://reflectionelite.com/wp-content/uploads/2026/10/20260222_002716-scaled.jpg" alt="MODERN VICTORIAN" loading="lazy" style="object-fit:contain !important; width:100% !important; height:100% !important; background:#ffffff !important; padding:6px !important;">
      </div>`;

  if (!content.includes(card1Target)) {
    throw new Error('Card 1 target string not matched in content!');
  }
  if (!content.includes(card4Target)) {
    throw new Error('Card 4 target string not matched in content!');
  }

  let updatedContent = content.replace(card1Target, card1Replacement);
  updatedContent = updatedContent.replace(card4Target, card4Replacement);

  console.log('2. Updating Page 68 via WordPress REST API with full-view mirrors 1 & 4...');
  const updateRes = await fetch(`${auth.siteUrl}/wp-json/wp/v2/pages/68`, {
    method: 'POST',
    headers: {
      'Cookie': auth.cookies,
      'X-WP-Nonce': auth.nonce,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content: updatedContent })
  });

  if (!updateRes.ok) {
    const errText = await updateRes.text();
    throw new Error(`Failed to update Page 68: HTTP ${updateRes.status} - ${errText}`);
  }

  console.log('✅ Page 68 successfully updated!');

  // Verify
  const verifyRes = await fetch(`${auth.siteUrl}/?nocache=${Date.now()}`);
  const verifyHtml = await verifyRes.text();
  const hasContain = verifyHtml.includes('object-fit:contain !important');
  console.log('Verification: object-fit:contain present:', hasContain);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
