import fs from 'fs';
import { getProdAuth } from './prod_auth_helper.js';

async function updateMirrors() {
  const { siteUrl, cookies, nonce } = await getProdAuth();
  console.log('1. Fetching current Page 68 from:', siteUrl);

  const res = await fetch(`${siteUrl}/wp-json/wp/v2/pages/68?context=edit`, {
    headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch Page 68: HTTP ${res.status}`);
  }
  const pageData = await res.json();
  let content = pageData.content?.raw || '';

  // Backup current live content
  fs.writeFileSync('backups/page_68_before_mirror_swap.html', content);
  console.log('✓ Backup saved to backups/page_68_before_mirror_swap.html');

  // Verify cycle-section and catalog-grid-4
  const gridStartRegex = /<div class="catalog-grid-4">/;
  const gridMatch = content.match(gridStartRegex);
  if (!gridMatch) {
    throw new Error('catalog-grid-4 not found in Page 68!');
  }

  const gridStartIndex = gridMatch.index;
  const gridEndIndex = content.indexOf('</div>', content.indexOf('<!-- 4 VALUE PILLARS -->', gridStartIndex) !== -1 
    ? content.lastIndexOf('</div>', content.indexOf('<!-- 4 VALUE PILLARS -->')) 
    : content.indexOf('</section>', gridStartIndex));

  // The 4 exact cards matching user screenshot
  const updatedGridHtml = `<div class="catalog-grid-4">
      
    <div class="luxury-card">
      <div class="card-media" style="position:relative;">
        <img src="https://reflectionelite.com/wp-content/uploads/2026/10/1771694577552.jpg" alt="ANTIQUE VENETIAN CUSHION" loading="lazy">
      </div>
      <div class="card-info">
        <div class="card-category">Venetian Mirror</div>
        <div class="card-title">ANTIQUE VENETIAN CUSHION</div>
        <div class="card-price-row">
          <div class="card-price">₹81,500</div>
          <a href="/product/antique-venetian-cushion/" class="btn-view">VIEW PIECE</a>
        </div>
      </div>
    </div>
  
    <div class="luxury-card">
      <div class="card-media" style="position:relative;">
        <img src="https://reflectionelite.com/wp-content/uploads/2026/10/WhatsAppImage2026-07-13at5.15.04PM.jpg" alt="CUSTOMISED MIRROR" loading="lazy">
      </div>
      <div class="card-info">
        <div class="card-category">Bespoke Mirror</div>
        <div class="card-title">CUSTOMISED MIRROR</div>
        <div class="card-price-row">
          <div class="card-price">₹100</div>
          <a href="/product/customised-mirror/" class="btn-view">VIEW PIECE</a>
        </div>
      </div>
    </div>
  
    <div class="luxury-card">
      <div class="card-media" style="position:relative;">
        <span style="position:absolute; top:12px; left:12px; background:rgba(18,18,18,0.9); color:#ffffff; font-size:11px; font-weight:700; letter-spacing:0.08em; padding:4px 10px; border-radius:3px; z-index:2; text-transform:uppercase; border:1px solid rgba(255,255,255,0.15);">SOLD OUT</span>
        <img src="https://reflectionelite.com/wp-content/uploads/2026/10/WhatsAppImage2026-09-08at11.14.24AM.jpg" alt="HIGH STRENGTH METAL MATERIALS" loading="lazy">
      </div>
      <div class="card-info">
        <div class="card-category">Metal Series</div>
        <div class="card-title">HIGH STRENGTH METAL MATERIALS</div>
        <div class="card-price-row">
          <div class="card-price">₹0</div>
          <a href="/product/high-strength-metal-materials/" class="btn-view">VIEW PIECE</a>
        </div>
      </div>
    </div>
  
    <div class="luxury-card">
      <div class="card-media" style="position:relative;">
        <span style="position:absolute; top:12px; left:12px; background:rgba(18,18,18,0.9); color:#ffffff; font-size:11px; font-weight:700; letter-spacing:0.08em; padding:4px 10px; border-radius:3px; z-index:2; text-transform:uppercase; border:1px solid rgba(255,255,255,0.15);">SALE</span>
        <img src="https://reflectionelite.com/wp-content/uploads/2026/10/20260222_002716-scaled.jpg" alt="MODERN VICTORIAN" loading="lazy">
      </div>
      <div class="card-info">
        <div class="card-category">Venetian Mirror</div>
        <div class="card-title">MODERN VICTORIAN</div>
        <div class="card-price-row">
          <div class="card-price">₹58,787</div>
          <a href="/product/modern-victorian/" class="btn-view">VIEW PIECE</a>
        </div>
      </div>
    </div>
  
    </div>`;

  // Use precise replacement of catalog-grid-4
  const exactGridRegex = /<div class="catalog-grid-4">[\s\S]*?<\/div>(\s*<\/div>)?\s*<\/section>/i;
  const match = content.match(exactGridRegex);
  if (!match) {
    throw new Error('Could not regex match catalog-grid-4 up to </section>');
  }

  // Preserve whatever container closing tags exist before </section>
  const hasCycleContainer = content.includes('class="cycle-container"');
  let replacementSnippet = updatedGridHtml;
  if (hasCycleContainer) {
    replacementSnippet += '\n    </div>\n  </section>';
  } else {
    replacementSnippet += '\n  </section>';
  }

  const updatedContent = content.replace(exactGridRegex, replacementSnippet);

  console.log('2. Updating Page 68 via REST API...');
  const updateRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/68`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookies,
      'X-WP-Nonce': nonce
    },
    body: JSON.stringify({ content: updatedContent })
  });

  if (!updateRes.ok) {
    const errText = await updateRes.text();
    throw new Error(`Failed to update page 68: HTTP ${updateRes.status} - ${errText}`);
  }
  console.log('✓ Page 68 successfully updated!');

  // Clear Hostinger Cache
  console.log('3. Purging Hostinger cache...');
  try {
    const purgeRes = await fetch(`${siteUrl}/wp-json/hostinger-tools-plugin/v1/clear-cache`, {
      method: 'DELETE',
      headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
    });
    console.log('✓ Hostinger cache purge status:', purgeRes.status);
  } catch (e) {
    console.warn('Purge warning:', e.message);
  }

  // Verify
  console.log('4. Verifying live Page 68...');
  const verifyRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/68?context=edit&_nocache=${Date.now()}`, {
    headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
  });
  const vData = await verifyRes.json();
  const vRaw = vData.content?.raw || '';

  console.log('--- VERIFICATION RESULT ---');
  console.log('1. Antique Venetian Cushion:', vRaw.includes('ANTIQUE VENETIAN CUSHION'));
  console.log('2. Customised Mirror:', vRaw.includes('CUSTOMISED MIRROR'));
  console.log('3. High Strength Metal Materials:', vRaw.includes('HIGH STRENGTH METAL MATERIALS'));
  console.log('4. Modern Victorian:', vRaw.includes('MODERN VICTORIAN'));
  console.log('5. SOLD OUT badge present:', vRaw.includes('SOLD OUT'));
  console.log('6. SALE badge present:', vRaw.includes('SALE'));
  console.log('7. Heading TRENDING ERA preserved:', vRaw.includes('TRENDING ERA'));
}

updateMirrors().catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});
