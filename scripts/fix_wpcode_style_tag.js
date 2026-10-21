import { getProdAuth } from './prod_auth_helper.js';

async function fixHeader() {
  const auth = await getProdAuth();
  console.log('1. Fetching WPCode...');
  const res = await fetch('https://reflectionelite.com/wp-admin/admin.php?page=wpcode-headers-footers', {
    headers: { 'Cookie': auth.cookies }
  });
  const html = await res.text();
  const nonceMatch = html.match(/name="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i)
                  || html.match(/id="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i);
  const nonce = nonceMatch[1];

  const headerMatch = html.match(/<textarea[^>]*id="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  const footerMatch = html.match(/<textarea[^>]*id="ihaf_insert_footer"[^>]*>([\s\S]*?)<\/textarea>/i);

  let currentHeader = headerMatch ? headerMatch[1] : '';
  let currentFooter = footerMatch ? footerMatch[1] : '';

  // Decode basic HTML entities
  currentHeader = currentHeader.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"');
  currentFooter = currentFooter.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"');

  // Strip any un-wrapped LIVE_SEARCH_CSS
  currentHeader = currentHeader.replace(/\/\* =+ INSTANT LIVE AUTOCOMPLETE SEARCH STYLES[\s\S]*$/, '');

  // Now ensure it's inside the <style> tag
  const lastStyleClose = currentHeader.lastIndexOf('</style>');
  if (lastStyleClose !== -1) {
    const cssToInject = `
/* ==========================================================================
   INSTANT LIVE AUTOCOMPLETE SEARCH STYLES & RESULTS PAGE LUXURY STYLING
   ========================================================================== */
.re-search-suggestions {
  margin-top: 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 11px;
  letter-spacing: 0.05em;
}
.re-search-suggestions-label {
  color: var(--color-gold);
  font-family: var(--font-trajan);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.re-search-pill {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(197, 168, 128, 0.3);
  color: #e6e6e6;
  padding: 4px 10px;
  border-radius: 20px;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 11px;
  transition: all 0.2s ease;
  user-select: none;
}
.re-search-pill:hover {
  background: var(--color-gold);
  color: #000000;
  border-color: var(--color-gold);
  transform: translateY(-1px);
}
.re-live-results-panel {
  margin-top: 14px;
  background: #090a0c;
  border: 1px solid rgba(197, 168, 128, 0.3);
  border-radius: 4px;
  max-height: 380px;
  overflow-y: auto;
  box-shadow: 0 16px 36px rgba(0,0,0,0.8);
}
.re-live-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  text-decoration: none !important;
  transition: background 0.2s ease;
}
.re-live-item:last-child {
  border-bottom: none;
}
.re-live-item:hover, .re-live-item.is-focused {
  background: rgba(197, 168, 128, 0.14);
}
.re-live-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 3px;
  border: 1px solid rgba(197, 168, 128, 0.2);
  flex-shrink: 0;
}
.re-live-info {
  flex: 1;
  min-width: 0;
}
.re-live-cat {
  font-size: 10px;
  text-transform: uppercase;
  color: var(--color-gold);
  letter-spacing: 0.08em;
  font-family: var(--font-trajan);
}
.re-live-title {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  font-family: var(--font-trajan);
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.re-live-price {
  font-size: 12px;
  color: #d4af37;
  font-weight: 600;
  margin-top: 2px;
}
.re-live-action {
  font-family: var(--font-trajan);
  font-size: 10px;
  color: var(--color-gold);
  border: 1px solid rgba(197, 168, 128, 0.4);
  padding: 5px 10px;
  border-radius: 2px;
  white-space: nowrap;
  flex-shrink: 0;
}
.re-live-no-results {
  padding: 18px;
  text-align: center;
  color: #a0a0a0;
  font-size: 13px;
  font-family: var(--font-body);
}

/* Luxury Search Results Page Styling */
.search-results .ast-archive-description,
.search-results .page-header {
  background: transparent !important;
  text-align: center !important;
  padding: 40px 20px 20px 20px !important;
}
.search-results .page-title {
  color: var(--color-gold) !important;
  font-family: var(--font-trajan) !important;
  font-size: 2.2rem !important;
  letter-spacing: 0.1em !important;
  text-transform: uppercase !important;
  display: block !important;
}
.search-results .woocommerce-result-count {
  color: #888888 !important;
  text-align: center !important;
  font-size: 13px !important;
  margin-bottom: 24px !important;
}
.search-results ul.products {
  max-width: 1380px !important;
  margin: 0 auto !important;
  padding: 0 20px 60px 20px !important;
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 24px !important;
}
@media (max-width: 1024px) {
  .search-results ul.products { grid-template-columns: repeat(2, 1fr) !important; }
}
@media (max-width: 600px) {
  .search-results ul.products { grid-template-columns: 1fr !important; }
}
.search-results ul.products li.product {
  background: #111215 !important;
  border: 1px solid rgba(197, 168, 128, 0.25) !important;
  padding: 16px !important;
  border-radius: 4px !important;
  text-align: center !important;
  transition: transform 0.3s ease, border-color 0.3s ease !important;
  margin: 0 !important;
  width: 100% !important;
}
.search-results ul.products li.product:hover {
  border-color: var(--color-gold) !important;
  transform: translateY(-4px) !important;
}
.search-results ul.products li.product .woocommerce-loop-product__title {
  color: #ffffff !important;
  font-family: var(--font-trajan) !important;
  font-size: 15px !important;
  margin: 12px 0 8px 0 !important;
  letter-spacing: 0.05em !important;
}
.search-results ul.products li.product .price {
  color: var(--color-gold) !important;
  font-size: 14px !important;
  font-weight: 700 !important;
}
.search-results ul.products li.product .button {
  background: transparent !important;
  border: 1px solid var(--color-gold) !important;
  color: var(--color-gold) !important;
  font-family: var(--font-trajan) !important;
  font-size: 11px !important;
  letter-spacing: 0.1em !important;
  padding: 8px 16px !important;
  margin-top: 12px !important;
  transition: all 0.2s ease !important;
}
.search-results ul.products li.product .button:hover {
  background: var(--color-gold) !important;
  color: #000000 !important;
}
`;
    currentHeader = currentHeader.substring(0, lastStyleClose) + '\n' + cssToInject + '\n</style>';
  }

  console.log('2. Saving cleaned WPCode...');
  const formBody = new URLSearchParams();
  formBody.append('insert-headers-and-footers_nonce', nonce);
  formBody.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-headers-footers');
  formBody.append('ihaf_insert_header', currentHeader);
  formBody.append('ihaf_insert_body', '');
  formBody.append('ihaf_insert_footer', currentFooter);

  const saveRes = await fetch('https://reflectionelite.com/wp-admin/admin.php?page=wpcode-headers-footers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': auth.cookies
    },
    body: formBody.toString(),
    redirect: 'manual'
  });
  console.log('WPCode save status:', saveRes.status);

  console.log('3. Purging Hostinger CDN cache...');
  const cacheRes = await fetch('https://reflectionelite.com/wp-json/hostinger-tools-plugin/v1/clear-cache', {
    method: 'DELETE',
    headers: {
      'Cookie': auth.cookies,
      'X-WP-Nonce': auth.nonce
    }
  });
  console.log('Hostinger cache purge status:', cacheRes.status);
}

fixHeader().catch(err => {
  console.error(err);
  process.exit(1);
});
