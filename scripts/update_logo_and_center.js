import { getProdAuth } from './prod_auth_helper.js';

function decodeAllHtmlEntities(str) {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"');
}

async function main() {
  console.log('1. Authenticating to WordPress...');
  const { siteUrl, cookies, nonce: wpNonce } = await getProdAuth();

  console.log('2. Fetching current WPCode settings...');
  const res = await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { Cookie: cookies }
  });
  const html = await res.text();

  const nonceMatch = html.match(/id="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i) ||
                     html.match(/name="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i);
  if (!nonceMatch) {
    throw new Error('Failed to find WPCode nonce in page');
  }
  const formNonce = nonceMatch[1];

  const headerMatch = html.match(/<textarea[^>]*name="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  const bodyMatch = html.match(/<textarea[^>]*name="ihaf_insert_body"[^>]*>([\s\S]*?)<\/textarea>/i);
  const footerMatch = html.match(/<textarea[^>]*name="ihaf_insert_footer"[^>]*>([\s\S]*?)<\/textarea>/i);

  let currentHeader = decodeAllHtmlEntities(headerMatch ? headerMatch[1] : '');
  let currentBody = decodeAllHtmlEntities(bodyMatch ? bodyMatch[1] : '');
  let currentFooter = decodeAllHtmlEntities(footerMatch ? footerMatch[1] : '');

  const NEW_LOGO_CSS = `
<style id="re-brand-logo-centering-fix">
/* ==========================================================================
   HEADER BRAND LOGO SIZING & DEAD-CENTER ALIGNMENT
   ========================================================================== */
.re-header-row-inner {
  max-width: 1380px !important;
  margin: 0 auto !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  position: relative !important;
  min-height: 80px !important;
}

.re-header-left-actions {
  flex: 1 1 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 16px !important;
  z-index: 2 !important;
}

.re-header-right-actions {
  flex: 1 1 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: flex-end !important;
  gap: 20px !important;
  z-index: 2 !important;
}

.re-brand-center {
  position: absolute !important;
  left: 50% !important;
  top: 50% !important;
  transform: translate(-50%, -50%) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-decoration: none !important;
  z-index: 5 !important;
  pointer-events: auto !important;
}

.re-main-logo-img {
  height: 70px !important;
  width: auto !important;
  max-width: 400px !important;
  display: block !important;
  object-fit: contain !important;
  filter: brightness(1.1) contrast(1.05) drop-shadow(0 2px 6px rgba(0,0,0,0.35)) !important;
  transition: transform 0.3s ease, filter 0.3s ease !important;
}

.re-brand-center:hover .re-main-logo-img {
  transform: scale(1.02) !important;
  filter: brightness(1.18) contrast(1.08) drop-shadow(0 4px 12px rgba(197, 168, 128, 0.25)) !important;
}

@media (max-width: 767.98px) {
  .re-header-row-inner {
    min-height: 56px !important;
  }
  .re-main-logo-img {
    height: 44px !important;
    max-width: 220px !important;
  }
}
</style>
`.trim();

  const existingStyleRegex = /<style id="re-brand-logo-centering-fix">[\s\S]*?<\/style>/i;
  if (existingStyleRegex.test(currentHeader)) {
    currentHeader = currentHeader.replace(existingStyleRegex, NEW_LOGO_CSS);
  } else {
    currentHeader += '\n\n' + NEW_LOGO_CSS;
  }

  console.log('3. Saving updated CSS to WPCode...');
  const formBody = new URLSearchParams();
  formBody.append('insert-headers-and-footers_nonce', formNonce);
  formBody.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-headers-footers');
  formBody.append('ihaf_insert_header', currentHeader);
  formBody.append('ihaf_insert_body', currentBody);
  formBody.append('ihaf_insert_footer', currentFooter);

  const saveRes = await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookies
    },
    body: formBody.toString()
  });

  if (!saveRes.ok) {
    throw new Error(`Failed to save WPCode: HTTP ${saveRes.status}`);
  }
  console.log('? WPCode updated successfully.');

  console.log('4. Purging Hostinger server and edge cache...');
  const purgeRes = await fetch(`${siteUrl}/wp-json/hostinger-tools-plugin/v1/clear-cache`, {
    method: 'DELETE',
    headers: {
      'Cookie': cookies,
      'X-WP-Nonce': wpNonce
    }
  });

  if (purgeRes.ok) {
    console.log('? Hostinger cache cleared successfully.');
  } else {
    console.warn(`Cache clear returned HTTP ${purgeRes.status}`);
  }

  console.log('ALL DONE!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
