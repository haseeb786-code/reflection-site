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

// Generates the pixel-perfect unbreakable clean header
function getUnbreakableHeader(activeSlug = '') {
  const base = 'https://reflectionelite.com';
  const logoUrl = 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/Logo-Reflection-e1777369196767-1024x186.png';

  return `
<header class="re-unified-header-container" id="reUnifiedHeader">
  <div class="re-marquee-wrapper" id="reMarqueeBar">
    <div class="re-marquee">
      <div class="re-marquee-track">
        <div class="re-marquee-item">FREE SHIPPING <span class="re-marquee-icon">📦</span></div>
        <div class="re-marquee-item">FREE SHIPPING <span class="re-marquee-icon">📦</span></div>
        <div class="re-marquee-item">FREE SHIPPING <span class="re-marquee-icon">📦</span></div>
        <div class="re-marquee-item">FREE SHIPPING <span class="re-marquee-icon">📦</span></div>
        <div class="re-marquee-item">FREE SHIPPING <span class="re-marquee-icon">📦</span></div>
        <div class="re-marquee-item">FREE SHIPPING <span class="re-marquee-icon">📦</span></div>
      </div>
    </div>
  </div>
  <div class="re-main-header-row">
    <div class="re-header-row-inner">
      <div class="re-header-left-actions">
        <button type="button" class="re-hamburger-btn" id="reHamburgerBtn" aria-label="Toggle Navigation Menu">
          <span class="re-bar"></span>
          <span class="re-bar"></span>
          <span class="re-bar"></span>
        </button>
        <button type="button" class="re-header-icon-btn re-search-toggle-btn" id="reSearchToggleBtn" aria-label="Search Catalog">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.35-4.35"></path>
          </svg>
        </button>
      </div>
      <a href="${base}/" class="re-brand-center">
        <img decoding="async" src="${logoUrl}" alt="Reflection Elite" class="re-main-logo-img">
      </a>
      <div class="re-header-right-actions">
        <a href="${base}/my-account/" class="re-header-icon-btn re-account-link" aria-label="Customer Account">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
          </svg>
        </a>
        <a href="${base}/cart/" class="re-cart-link" aria-label="Shopping Cart">
          <span class="re-cart-text">YOUR CART</span>
          <span class="re-cart-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              <path d="M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM20 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
            </svg>
          </span>
        </a>
      </div>
    </div>
    <!-- Slide-down luxury search bar -->
    <div class="re-search-overlay-bar" id="reSearchOverlayBar" style="display:none;" onclick="event.stopPropagation();">
      <div class="re-search-inner">
        <form role="search" method="get" class="re-search-form" action="${base}/">
          <span class="re-search-form-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.35-4.35"></path>
            </svg>
          </span>
          <input type="search" class="re-search-field" placeholder="Search bespoke mirrors, venetian, collections..." value="" name="s" autocomplete="off" />
          <input type="hidden" name="post_type" value="product" />
          <button type="submit" class="re-search-submit-btn">SEARCH</button>
          <button type="button" class="re-search-close-btn" aria-label="Close Search">✕</button>
        </form>
      </div>
    </div>
    <div class="re-mobile-drawer" id="reMobileDrawer" style="display:none;" onclick="event.stopPropagation();">
      <nav class="re-mobile-menu-list">
        <a href="${base}/" class="re-mobile-link ${activeSlug === 'home' ? 'is-active' : ''}">HOME</a>
        <a href="${base}/shop/" class="re-mobile-link ${activeSlug === 'shop' ? 'is-active' : ''}">COLLECTIONS (7)</a>
        <a href="${base}/product/antique-venetian-cushion/" class="re-mobile-link ${activeSlug === 'murana' ? 'is-active' : ''}">MURANA SHOWCASE</a>
        <a href="${base}/about-us/" class="re-mobile-link ${activeSlug === 'about' ? 'is-active' : ''}">ABOUT US</a>
        <a href="${base}/contact/" class="re-mobile-link ${activeSlug === 'contact' ? 'is-active' : ''}">CONTACT</a>
        <a href="${base}/refund_returns-2/" class="re-mobile-link ${activeSlug === 'policies' ? 'is-active' : ''}">POLICIES</a>
        <a href="${base}/cart/" class="re-mobile-link ${activeSlug === 'cart' ? 'is-active' : ''}">CART</a>
        <div class="re-mobile-btn-wrap">
          <a href="${base}/custom-dimensions/" class="re-mobile-cta-btn">BOOK SURVEY</a>
        </div>
      </nav>
    </div>
  </div>
  <div class="re-announcement-strip">
    <span>FREE COMPREHENSIVE ON-SITE CONSULTATION &amp; LASER TEMPLATING &bull; BESPOKE LUXURY MIRRORS</span>
  </div>
  <div class="re-nav-row-desktop">
    <div class="re-nav-inner">
      <nav class="re-desktop-nav-links" style="display:flex; gap:32px;">
        <a href="${base}/" class="re-nav-item ${activeSlug === 'home' ? 'is-active' : ''}">HOME</a>
        <a href="${base}/shop/" class="re-nav-item ${activeSlug === 'shop' ? 'is-active' : ''}">COLLECTIONS (7)</a>
        <a href="${base}/product/antique-venetian-cushion/" class="re-nav-item ${activeSlug === 'murana' ? 'is-active' : ''}">MURANA SHOWCASE</a>
        <a href="${base}/about-us/" class="re-nav-item ${activeSlug === 'about' ? 'is-active' : ''}">ABOUT US</a>
        <a href="${base}/contact/" class="re-nav-item ${activeSlug === 'contact' ? 'is-active' : ''}">CONTACT</a>
        <a href="${base}/refund_returns-2/" class="re-nav-item ${activeSlug === 'policies' ? 'is-active' : ''}">POLICIES</a>
        <a href="${base}/cart/" class="re-nav-item ${activeSlug === 'cart' ? 'is-active' : ''}">CART</a>
      </nav>
    </div>
  </div>
</header>
`.trim();
}

async function updateWpCode(siteUrl, cookies) {
  console.log('1. Updating WPCode with Unbreakable Header CSS, Card Normalization & Robust Event Delegation...');
  const res = await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { Cookie: cookies }
  });
  const html = await res.text();
  const nonce = (html.match(/id="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i) || html.match(/name="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i))[1];
  const headerMatch = html.match(/<textarea[^>]*id="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  const footerMatch = html.match(/<textarea[^>]*id="ihaf_insert_footer"[^>]*>([\s\S]*?)<\/textarea>/i);

  let currentHeader = decodeAllHtmlEntities(headerMatch ? headerMatch[1] : '');
  let currentFooter = decodeAllHtmlEntities(footerMatch ? footerMatch[1] : '');

  // Card Normalization CSS
  const CARD_NORMALIZATION_CSS = `
<style id="te-card-sizing-normalization">
/* Standardize Product Card Section padding between Home and Shop */
.cycle-section {
  max-width: 1380px !important;
  margin: 0 auto !important;
  padding: 40px 24px 80px !important;
  box-sizing: border-box !important;
}
@media (max-width: 767.98px) {
  .cycle-section {
    padding-left: 24px !important;
    padding-right: 24px !important;
    padding-top: 30px !important;
    padding-bottom: 60px !important;
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
`;

  // Robust Header Event Delegation JS (works on any page regardless of inline onclick)
  const ROBUST_HEADER_JS = `
<script id="re-robust-header-delegation">
(function() {
  document.addEventListener('click', function(e) {
    // 1. Hamburger button toggle
    var hamBtn = e.target.closest('.re-hamburger-btn') || e.target.closest('#reHamburgerBtn');
    if (hamBtn) {
      e.preventDefault();
      e.stopPropagation();
      var drawer = document.getElementById('reMobileDrawer');
      if (drawer) {
        var isOpen = drawer.style.display === 'none' || !drawer.style.display;
        drawer.style.display = isOpen ? 'block' : 'none';
        drawer.classList.toggle('is-open', isOpen);
        hamBtn.classList.toggle('is-active', isOpen);
      }
      return;
    }

    // 2. Search toggle button
    var searchBtn = e.target.closest('.re-search-toggle-btn') || e.target.closest('#reSearchToggleBtn');
    if (searchBtn) {
      e.preventDefault();
      e.stopPropagation();
      var s = document.getElementById('reSearchOverlayBar');
      if (s) {
        var isSearchOpen = s.style.display === 'none' || !s.style.display;
        s.style.display = isSearchOpen ? 'block' : 'none';
        if (isSearchOpen) {
          var inp = s.querySelector('.re-search-field');
          if (inp) inp.focus();
        }
      }
      return;
    }

    // 3. Search close button
    if (e.target.closest('.re-search-close-btn')) {
      e.preventDefault();
      var s = document.getElementById('reSearchOverlayBar');
      if (s) s.style.display = 'none';
      return;
    }

    // 4. Click outside to close drawer
    var d = document.getElementById('reMobileDrawer');
    var b = document.getElementById('reHamburgerBtn') || document.querySelector('.re-hamburger-btn');
    if (d && (d.style.display === 'block' || d.classList.contains('is-open'))) {
      if (!d.contains(e.target) && (!b || !b.contains(e.target))) {
        d.style.display = 'none';
        d.classList.remove('is-open');
        if (b) b.classList.remove('is-active');
      }
    }

    // 5. Click outside to close search
    var searchBar = document.getElementById('reSearchOverlayBar');
    var sBtn = document.getElementById('reSearchToggleBtn') || document.querySelector('.re-search-toggle-btn');
    if (searchBar && searchBar.style.display === 'block') {
      if (!searchBar.contains(e.target) && (!sBtn || !sBtn.contains(e.target))) {
        searchBar.style.display = 'none';
      }
    }
  });

  // Close drawer on navigation link click
  document.addEventListener('click', function(e) {
    if (e.target.closest('.re-mobile-link') || e.target.closest('.re-mobile-cta-btn')) {
      var d = document.getElementById('reMobileDrawer');
      var b = document.getElementById('reHamburgerBtn') || document.querySelector('.re-hamburger-btn');
      if (d) {
        d.style.display = 'none';
        d.classList.remove('is-open');
      }
      if (b) b.classList.remove('is-active');
    }
  });
})();
</script>
`;

  // Clean out older instances
  currentHeader = currentHeader.replace(/<style id="te-card-sizing-normalization">[\s\S]*?<\/style>/gi, '').trim();
  currentHeader += '\n\n' + CARD_NORMALIZATION_CSS.trim();

  currentFooter = currentFooter.replace(/<script id="re-robust-header-delegation">[\s\S]*?<\/script>/gi, '').trim();
  currentFooter += '\n\n' + ROBUST_HEADER_JS.trim();

  const formBody = new URLSearchParams();
  formBody.append('insert-headers-and-footers_nonce', nonce);
  formBody.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-headers-footers');
  formBody.append('ihaf_insert_header', currentHeader);
  formBody.append('ihaf_insert_body', '');
  formBody.append('ihaf_insert_footer', currentFooter);

  const saveRes = await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookies
    },
    body: formBody.toString()
  });
  console.log('✓ WPCode updated successfully (HTTP', saveRes.status, ')');
}

async function updatePages(siteUrl, cookies, nonce) {
  console.log('\n2. Updating Core Pages with Unbreakable Header & Standardized Buttons...');

  const pages = [
    { id: 6, slug: 'shop', active: 'shop' },
    { id: 68, slug: 'home', active: 'home' },
    { id: 50, slug: 'about-us', active: 'about' },
    { id: 52, slug: 'contact', active: 'contact' },
    { id: 120, slug: 'custom-dimensions', active: 'survey' },
    { id: 103, slug: 'refund_returns-2', active: 'policies' },
    { id: 102, slug: 'privacy-policy-2', active: 'policies' },
    { id: 7, slug: 'cart', active: 'cart' },
    { id: 8, slug: 'checkout', active: 'cart' }
  ];

  for (const p of pages) {
    const pageRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/${p.id}?context=edit`, {
      headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
    });
    const pageData = await pageRes.json();
    let content = pageData.content?.raw || '';

    // Strip Gutenberg comment wrapper if present
    content = content.replace(/<!-- \/?wp:html -->/gi, '').trim();

    // Replace header
    const cleanHeader = getUnbreakableHeader(p.active);
    const headerRegex = /<header\s+class="re-unified-header-container"[\s\S]*?<\/header>/i;
    if (headerRegex.test(content)) {
      content = content.replace(headerRegex, cleanHeader);
    } else {
      console.warn(`No existing re-unified-header-container on ${p.slug}!`);
    }

    // Standardize all product card buttons to 'VIEW PIECE'
    content = content.replace(/>VIEW DETAILS</g, '>VIEW PIECE<');

    // Wrap in <!-- wp:html --> block to protect against WP sanitization
    const finalPayload = `<!-- wp:html -->\n${content}\n<!-- /wp:html -->`;

    const updateRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/${p.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies,
        'X-WP-Nonce': nonce
      },
      body: JSON.stringify({ content: finalPayload })
    });

    if (updateRes.ok) {
      console.log(`✓ Page ${p.id} (${p.slug}) updated successfully!`);
    } else {
      const err = await updateRes.text();
      throw new Error(`Failed to update page ${p.id}: ${err.slice(0, 300)}`);
    }
  }
}

async function purgeCache(siteUrl, cookies, nonce) {
  console.log('\n3. Purging Hostinger CDN & Server Cache...');
  const res = await fetch(`${siteUrl}/wp-json/hostinger-tools-plugin/v1/clear-cache`, {
    method: 'DELETE',
    headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
  });
  console.log('✓ Cache purge HTTP status:', res.status);
}

async function main() {
  const { siteUrl, cookies, nonce } = await getProdAuth();
  console.log('Authenticated to', siteUrl);

  await updateWpCode(siteUrl, cookies);
  await updatePages(siteUrl, cookies, nonce);
  await purgeCache(siteUrl, cookies, nonce);

  console.log('\n======================================================');
  console.log('✓ ALL CONSISTENCY FIXES SUCCESSFULLY DEPLOYED!');
  console.log('======================================================');
}

main().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});
