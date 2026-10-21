import fs from 'fs';
import { getProdAuth } from './prod_auth_helper.js';

function decodeAllHtmlEntities(str) {
  let s = str;
  for (let i = 0; i < 3; i++) {
    s = s
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&');
  }
  return s;
}

async function main() {
  const { siteUrl, cookies, nonce } = await getProdAuth();
  console.log('Authenticated to', siteUrl);

  // 1. Fetch current Page 68 (Homepage)
  console.log('\n--- 1. FETCHING CURRENT PAGE 68 ---');
  const pageRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/68?context=edit`, {
    headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
  });
  if (!pageRes.ok) {
    throw new Error(`Failed to fetch page 68: HTTP ${pageRes.status}`);
  }
  const pageData = await pageRes.json();
  let content = pageData.content?.raw || '';
  console.log('Current page 68 length:', content.length);

  // Backup current content
  fs.writeFileSync('backups/page_68_before_trending_era.html', content);
  console.log('✓ Saved backup to backups/page_68_before_trending_era.html');

  // Verify the section exists
  const sectionStartIdx = content.indexOf('<section class="cycle-section">');
  if (sectionStartIdx === -1) {
    throw new Error('Could not find <section class="cycle-section"> in page 68!');
  }
  const sectionEndIdx = content.indexOf('</section>', sectionStartIdx) + '</section>'.length;

  const currentSectionHtml = content.slice(sectionStartIdx, sectionEndIdx);
  console.log('Found current section length:', currentSectionHtml.length);

  // Extract catalog-grid-4 exactly as is (preserving all 4 cards byte-for-byte)
  const gridMatch = currentSectionHtml.match(/<div class="catalog-grid-4">[\s\S]*?<\/div>\s*<\/section>/i);
  if (!gridMatch) {
    throw new Error('Could not extract catalog-grid-4 from current section!');
  }
  const gridHtmlWithEnd = gridMatch[0]; // contains `<div class="catalog-grid-4">...</div>\n  </section>`
  const gridHtml = gridHtmlWithEnd.slice(0, gridHtmlWithEnd.lastIndexOf('</section>')).trim();

  // Verify the 4 products are in the gridHtml
  const cardCount = (gridHtml.match(/class="luxury-card"/g) || []).length;
  console.log(`Verified product cards count in grid: ${cardCount} (expected: 4)`);
  if (cardCount !== 4) {
    throw new Error(`Expected 4 product cards, found ${cardCount}!`);
  }

  // Construct the updated section:
  // - Pure black background (#000000)
  // - Single line heading: "TRENDING ERA" — white color, bold, all capital letters, centered
  // - Preserves all 4 cards and their buttons completely untouched
  const updatedSectionHtml = `<section class="cycle-section" style="background-color: #000000 !important; background: #000000 !important; width: 100% !important; max-width: 100% !important; margin: 0 !important; padding: 50px 0 80px 0 !important; box-sizing: border-box !important;">
    <div class="cycle-container" style="max-width: 1380px; margin: 0 auto; padding: 0 24px; box-sizing: border-box;">
      <div class="cycle-header" style="text-align: center; margin-bottom: 36px;">
        <h2 style="color: #ffffff !important; font-weight: bold !important; text-transform: uppercase !important; font-family: var(--font-trajan), serif !important; margin: 0 auto; letter-spacing: 0.08em; font-size: 2rem;">TRENDING ERA</h2>
      </div>
      ${gridHtml}
    </div>
  </section>`;

  // Replace in page content
  const newContent = content.slice(0, sectionStartIdx) + updatedSectionHtml + content.slice(sectionEndIdx);

  // 2. Update Page 68
  console.log('\n--- 2. UPDATING PAGE 68 IN WORDPRESS ---');
  const updateRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/68`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookies,
      'X-WP-Nonce': nonce
    },
    body: JSON.stringify({ content: newContent })
  });

  if (!updateRes.ok) {
    const errText = await updateRes.text();
    throw new Error(`Failed to update page 68: HTTP ${updateRes.status} - ${errText.slice(0, 300)}`);
  }
  console.log('✓ Page 68 successfully updated in WordPress!');

  // 3. Update WPCode with pure black background for .cycle-section
  console.log('\n--- 3. UPDATING WPCODE GLOBAL STYLES ---');
  const wpCodeRes = await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { Cookie: cookies }
  });
  const wpCodeHtml = await wpCodeRes.text();
  const wpCodeNonce = (wpCodeHtml.match(/id="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i) || 
                       wpCodeHtml.match(/name="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i))[1];
  const headerMatch = wpCodeHtml.match(/<textarea[^>]*id="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  const footerMatch = wpCodeHtml.match(/<textarea[^>]*id="ihaf_insert_footer"[^>]*>([\s\S]*?)<\/textarea>/i);

  let currentHeader = decodeAllHtmlEntities(headerMatch ? headerMatch[1] : '');
  let currentFooter = decodeAllHtmlEntities(footerMatch ? footerMatch[1] : '');

  // Backup WPCode
  fs.writeFileSync('backups/wpcode_header_before_trending_era.html', currentHeader);

  // Replace or add the .cycle-section normalization
  const UPDATED_NORMALIZATION_CSS = `
<style id="te-card-sizing-normalization">
/* Standardize Product Card Section padding and pure black background */
.cycle-section {
  background-color: #000000 !important;
  background: #000000 !important;
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 50px 0 80px 0 !important;
  box-sizing: border-box !important;
}
.cycle-container {
  max-width: 1380px !important;
  margin: 0 auto !important;
  padding: 0 24px !important;
  box-sizing: border-box !important;
}
@media (max-width: 767.98px) {
  .cycle-section {
    padding-top: 30px !important;
    padding-bottom: 60px !important;
  }
  .cycle-container {
    padding-left: 24px !important;
    padding-right: 24px !important;
  }
}

/* Bulletproof Global Header Icons Consistency across all pages */
.re-header-icon-btn,
.re-cart-link {
  color: #ffffff !important;
  display: flex !important;
  align-items: center !important;
}
.re-header-left-actions svg,
.re-header-right-actions svg,
.re-header-icon-btn svg {
  stroke: #ffffff !important;
  fill: none !important;
  stroke-width: 1.8 !important;
  stroke-linecap: round !important;
  stroke-linejoin: round !important;
}
.re-cart-icon svg {
  stroke: #ffffff !important;
  fill: none !important;
  stroke-width: 2 !important;
  stroke-linecap: round !important;
  stroke-linejoin: round !important;
}
.re-cart-icon svg path[d*="M9 22"] {
  fill: #ffffff !important;
  stroke: #ffffff !important;
}
.re-account-link svg {
  stroke: #ffffff !important;
  fill: none !important;
}
.re-search-toggle-btn svg {
  stroke: #ffffff !important;
  fill: none !important;
}
</style>
`.trim();

  currentHeader = currentHeader.replace(/<style id="te-card-sizing-normalization">[\s\S]*?<\/style>/gi, '').trim();
  currentHeader += '\n\n' + UPDATED_NORMALIZATION_CSS;

  const formBody = new URLSearchParams();
  formBody.append('insert-headers-and-footers_nonce', wpCodeNonce);
  formBody.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-headers-footers');
  formBody.append('ihaf_insert_header', currentHeader);
  formBody.append('ihaf_insert_body', '');
  formBody.append('ihaf_insert_footer', currentFooter);

  const saveWpCodeRes = await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookies
    },
    body: formBody.toString()
  });
  console.log('✓ WPCode updated with HTTP', saveWpCodeRes.status);

  // 4. Purge Hostinger cache
  console.log('\n--- 4. PURGING CACHES ---');
  try {
    const purgeRes = await fetch(`${siteUrl}/wp-json/hostinger-tools-plugin/v1/clear-cache`, {
      method: 'DELETE',
      headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
    });
    console.log('✓ Hostinger cache purge HTTP status:', purgeRes.status);
  } catch (e) {
    console.warn('Hostinger purge notice:', e.message);
  }

  // Also purge LiteSpeed if available
  try {
    const dashRes = await fetch(`${siteUrl}/wp-admin/`, {
      headers: { Cookie: cookies }
    });
    const dashHtml = await dashRes.text();
    const purgeMatch = dashHtml.match(/href="([^"]*(?:litespeed-purge-all|purge_all|litespeed_purge)[^"]*)"/i);
    if (purgeMatch) {
      const purgeUrl = purgeMatch[1].replace(/&amp;/g, '&');
      const finalUrl = purgeUrl.startsWith('http') ? purgeUrl : `${siteUrl}/wp-admin/${purgeUrl}`;
      const pRes = await fetch(finalUrl, { headers: { Cookie: cookies } });
      console.log('✓ LiteSpeed purge HTTP status:', pRes.status);
    }
  } catch (e) {
    console.warn('LiteSpeed purge notice:', e.message);
  }

  console.log('\n===============================================================');
  console.log('✓ SUCCESS: "Venetian Heritage Collection" updated to "TRENDING ERA"');
  console.log('✓ Pure black (#000000) background applied to section');
  console.log('===============================================================');
}

main().catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});
