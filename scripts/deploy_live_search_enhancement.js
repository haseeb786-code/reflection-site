import { getProdAuth } from './prod_auth_helper.js';

const LIVE_SEARCH_CSS = `
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

const LIVE_SEARCH_JS = `
<script id="re-live-instant-search-engine">
(function initInstantLiveSearch() {
  const PRODUCTS = [
    { title: "ANTIQUE VENETIAN CUSHION", cat: "Venetian Mirror", price: "₹81,500", link: "/product/antique-venetian-cushion/", img: "https://reflectionelite.com/wp-content/uploads/2026/10/1771694577552.jpg", tags: "antique venetian cushion beveled mirror vintage italian glass" },
    { title: "MODERN VICTORIAN", cat: "Venetian Mirror", price: "₹58,787", link: "/product/modern-victorian/", img: "https://reflectionelite.com/wp-content/uploads/2026/10/20260222_002716-scaled.jpg", tags: "modern victorian venetian classic heritage luxury mirror" },
    { title: "SILVER CROWN FRAMED", cat: "Venetian Mirror", price: "₹35,900", link: "/product/silver-crown-framed/", img: "https://reflectionelite.com/wp-content/uploads/2026/10/20260221_235950-scaled.jpg", tags: "silver crown framed venetian crest mirror silver floral" },
    { title: "ROCOCO FLORAL", cat: "Venetian Mirror", price: "₹14,000", link: "/product/rococo-floral/", img: "https://reflectionelite.com/wp-content/uploads/2026/10/20260222_092621-scaled.jpg", tags: "rococo floral oval venetian flowers etched mirror baroque" },
    { title: "MOSAIC MIRROR ART", cat: "Contemporary", price: "₹2,500 – ₹7,500", link: "/product/mosaic-mirror-art/", img: "https://reflectionelite.com/wp-content/uploads/2026/10/20260305_220825.jpg", tags: "mosaic mirror art geometric horse contemporary glass modern" },
    { title: "CUSTOMISED MIRROR", cat: "Custom", price: "₹100", link: "/product/customised-mirror/", img: "https://reflectionelite.com/wp-content/uploads/2026/10/WhatsAppImage2026-07-13at5.15.04PM.jpg", tags: "customised mirror smart led backlight phone mirror bespoke" },
    { title: "PREMIUM UPHOLSTERED FRAME", cat: "Statement Piece", price: "Price on Request", link: "/product/premium-upholstered-frame/", img: "https://reflectionelite.com/wp-content/uploads/2026/10/WhatsAppImage2026-09-18at3.57.23PM.jpg", tags: "premium upholstered frame velvet wavy floor mirror tall standing" }
  ];

  function setupSearch() {
    const overlays = document.querySelectorAll('.re-search-overlay-bar');
    if (!overlays.length) return;

    overlays.forEach(overlay => {
      if (overlay.querySelector('.re-search-extra-container')) return;

      const inner = overlay.querySelector('.re-search-inner');
      const input = overlay.querySelector('.re-search-field');
      if (!inner || !input) return;

      const extraWrap = document.createElement('div');
      extraWrap.className = 're-search-extra-container';
      extraWrap.innerHTML = \`
        <div class="re-search-suggestions">
          <span class="re-search-suggestions-label">Popular:</span>
          <span class="re-search-pill" data-term="Venetian">Venetian</span>
          <span class="re-search-pill" data-term="Victorian">Victorian</span>
          <span class="re-search-pill" data-term="Crown">Crown</span>
          <span class="re-search-pill" data-term="Rococo">Rococo</span>
          <span class="re-search-pill" data-term="Mosaic">Mosaic</span>
          <span class="re-search-pill" data-term="Custom">Custom</span>
          <span class="re-search-pill" data-term="Mirror">All Mirrors</span>
        </div>
        <div class="re-live-results-panel" id="reLiveResultsPanel" style="display:none;"></div>
      \`;
      inner.appendChild(extraWrap);

      const resultsPanel = extraWrap.querySelector('#reLiveResultsPanel');

      function renderResults(query) {
        const q = (query || '').trim().toLowerCase();
        if (!q) {
          resultsPanel.style.display = 'none';
          resultsPanel.innerHTML = '';
          return;
        }

        const matches = PRODUCTS.filter(p => {
          return p.title.toLowerCase().includes(q) ||
                 p.cat.toLowerCase().includes(q) ||
                 p.tags.toLowerCase().includes(q);
        });

        if (matches.length === 0) {
          resultsPanel.innerHTML = '<div class="re-live-no-results">No bespoke mirrors found matching "<strong>' + escapeHtml(query) + '</strong>".<br><span style="font-size:11px;color:#c5a572;margin-top:6px;display:inline-block;">Try: Venetian, Victorian, Crown, Rococo, or Mosaic</span></div>';
          resultsPanel.style.display = 'block';
          return;
        }

        let html = '';
        matches.forEach(p => {
          html += '<a href="' + p.link + '" class="re-live-item">' +
            '<img src="' + p.img + '" alt="' + escapeHtml(p.title) + '" class="re-live-thumb" />' +
            '<div class="re-live-info">' +
              '<div class="re-live-cat">' + p.cat + '</div>' +
              '<div class="re-live-title">' + p.title + '</div>' +
              '<div class="re-live-price">' + p.price + '</div>' +
            '</div>' +
            '<span class="re-live-action">VIEW PIECE &rarr;</span>' +
          '</a>';
        });
        html += '<div style="padding:8px 14px; background:#040506; font-size:11px; color:#888; text-align:center; border-top:1px solid rgba(255,255,255,0.06);">Press Enter or click SEARCH for full catalog view</div>';
        resultsPanel.innerHTML = html;
        resultsPanel.style.display = 'block';
      }

      function escapeHtml(str) {
        return (str || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
      }

      input.addEventListener('input', () => {
        renderResults(input.value);
      });

      extraWrap.querySelectorAll('.re-search-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
          e.stopPropagation();
          const term = pill.getAttribute('data-term');
          input.value = term;
          input.focus();
          renderResults(term);
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSearch);
  } else {
    setupSearch();
  }
})();
</script>
`;

async function deploy() {
  const auth = await getProdAuth();
  console.log('1. Fetching current WPCode settings...');
  const res = await fetch('https://reflectionelite.com/wp-admin/admin.php?page=wpcode-headers-footers', {
    headers: { 'Cookie': auth.cookies }
  });
  const html = await res.text();
  const nonceMatch = html.match(/name="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i)
                  || html.match(/id="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i);
  if (!nonceMatch) throw new Error('Could not find nonce');
  const nonce = nonceMatch[1];

  const headerMatch = html.match(/<textarea[^>]*id="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  const footerMatch = html.match(/<textarea[^>]*id="ihaf_insert_footer"[^>]*>([\s\S]*?)<\/textarea>/i);

  let currentHeader = headerMatch ? headerMatch[1] : '';
  let currentFooter = footerMatch ? footerMatch[1] : '';

  // Decode basic HTML entities from textarea
  currentHeader = currentHeader.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"');
  currentFooter = currentFooter.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"');

  // Avoid duplicate injection
  if (!currentHeader.includes('INSTANT LIVE AUTOCOMPLETE SEARCH STYLES')) {
    currentHeader += '\n\n' + LIVE_SEARCH_CSS;
  }
  if (!currentFooter.includes('re-live-instant-search-engine')) {
    currentFooter += '\n\n' + LIVE_SEARCH_JS;
  }

  console.log('2. Saving updated WPCode settings with Live Instant Search...');
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

deploy().catch(err => {
  console.error(err);
  process.exit(1);
});
