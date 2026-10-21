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

// Generates the pixel-perfect clean header identical to Home
function getCleanHeader(activeSlug = '') {
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
        <button class="re-hamburger-btn" id="reHamburgerBtn" aria-label="Toggle Navigation Menu" onclick="if(window.reToggleDrawer){reToggleDrawer(event);}else{var d=document.getElementById('reMobileDrawer');var isOpen=d.style.display==='none'||!d.style.display;d.style.display=isOpen?'block':'none';d.classList.toggle('is-open',isOpen);this.classList.toggle('is-active',isOpen);event.stopPropagation();}">
          <span class="re-bar"></span>
          <span class="re-bar"></span>
          <span class="re-bar"></span>
        </button>
        <button class="re-header-icon-btn re-search-toggle-btn" id="reSearchToggleBtn" aria-label="Search Catalog" onclick="if(window.reToggleSearch){reToggleSearch(event);}else{var s=document.getElementById('reSearchOverlayBar');var isOpen=s.style.display==='none'||!s.style.display;s.style.display=isOpen?'block':'none';if(isOpen){var inp=s.querySelector('.re-search-field');if(inp)inp.focus();}event.stopPropagation();}">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
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
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </a>
        <a href="${base}/cart/" class="re-cart-link" aria-label="Shopping Cart">
          <span class="re-cart-text">YOUR CART</span>
          <span class="re-cart-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
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
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
          <input type="search" class="re-search-field" placeholder="Search bespoke mirrors, venetian, collections..." value="" name="s" autocomplete="off" />
          <input type="hidden" name="post_type" value="product" />
          <button type="submit" class="re-search-submit-btn">SEARCH</button>
          <button type="button" class="re-search-close-btn" aria-label="Close Search" onclick="document.getElementById('reSearchOverlayBar').style.display='none';">✕</button>
        </form>
      </div>
    </div>
    <div class="re-mobile-drawer" id="reMobileDrawer" style="display:none;" onclick="event.stopPropagation();">
      <nav class="re-mobile-menu-list">
        <a href="${base}/" class="re-mobile-link ${activeSlug === 'home' ? 'is-active' : ''}">HOME</a>
        <a href="${base}/shop/" class="re-mobile-link ${activeSlug === 'shop' ? 'is-active' : ''}">COLLECTIONS</a>
        <a href="${base}/about-us/" class="re-mobile-link ${activeSlug === 'about' ? 'is-active' : ''}">ABOUT US</a>
        <a href="${base}/contact/" class="re-mobile-link ${activeSlug === 'contact' ? 'is-active' : ''}">CONTACT</a>
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
      <nav class="re-desktop-nav-links" style="display:flex; justify-content:center; align-items:center; gap:44px;">
        <a href="${base}/" class="re-nav-item ${activeSlug === 'home' ? 'is-active' : ''}">HOME</a>
        <a href="${base}/shop/" class="re-nav-item ${activeSlug === 'shop' ? 'is-active' : ''}">COLLECTIONS</a>
        <a href="${base}/about-us/" class="re-nav-item ${activeSlug === 'about' ? 'is-active' : ''}">ABOUT US</a>
        <a href="${base}/contact/" class="re-nav-item ${activeSlug === 'contact' ? 'is-active' : ''}">CONTACT</a>
      </nav>
    </div>
  </div>
</header>
`.trim();
}

async function updateFunctionsPhp(siteUrl, cookies) {
  console.log('\n--- STEP 1: Updating functions.php with Unautop & KSES SVG filters ---');
  const res = await fetch(`${siteUrl}/wp-admin/theme-editor.php?file=functions.php&theme=astra`, {
    headers: {
      Cookie: cookies,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      Referer: `${siteUrl}/wp-admin/theme-editor.php`
    }
  });
  const html = await res.text();
  const nonce = (html.match(/id="nonce"\s+name="nonce"\s+value="([^"]+)"/i) || html.match(/name="nonce"\s+value="([^"]+)"/i))[1];
  const rawText = html.match(/<textarea[^>]*id="newcontent"[^>]*>([\s\S]*?)<\/textarea>/i)[1];
  let decoded = decodeAllHtmlEntities(rawText);

  // Clean out any previous RE_SHOP_DESCRIPTION or RE_KSES snippets
  decoded = decoded.replace(/\/\/ RE_SHOP_DESCRIPTION_RAW_UNAUTOP[\s\S]*?(?=(\/\/ RE_TEMPLATE|\Z))/, '').trim();
  decoded = decoded.replace(/\/\/ RE_KSES_ALLOW_SVG[\s\S]*?(?=(\/\/ RE_TEMPLATE|\Z))/, '').trim();

  let codeToAdd = '';
  if (!decoded.includes('re_prevent_shop_wpautop_corruption')) {
    codeToAdd += `

// RE_SHOP_DESCRIPTION_RAW_UNAUTOP
if ( ! function_exists( 're_prevent_shop_wpautop_corruption' ) ) {
    add_filter( 'woocommerce_format_content', 're_prevent_shop_wpautop_corruption', 1, 2 );
    function re_prevent_shop_wpautop_corruption( $content, $raw_string = '' ) {
        if ( ! empty( $raw_string ) && ( strpos( $raw_string, 'te-live-page' ) !== false || strpos( $raw_string, 're-unified-header-container' ) !== false ) ) {
            return $raw_string;
        }
        return $content;
    }
}
`;
  }

  if (!decoded.includes('re_allow_svg_in_post_content')) {
    codeToAdd += `

// RE_KSES_ALLOW_SVG
if ( ! function_exists( 're_allow_svg_in_post_content' ) ) {
    add_filter( 'wp_kses_allowed_html', 're_allow_svg_in_post_content', 10, 2 );
    function re_allow_svg_in_post_content( $tags, $context ) {
        if ( $context === 'post' ) {
            $tags['svg'] = array( 'viewbox' => true, 'viewBox' => true, 'width' => true, 'height' => true, 'fill' => true, 'stroke' => true, 'stroke-width' => true, 'stroke-linecap' => true, 'stroke-linejoin' => true, 'xmlns' => true, 'class' => true, 'style' => true );
            $tags['circle'] = array( 'cx' => true, 'cy' => true, 'r' => true, 'fill' => true, 'stroke' => true, 'stroke-width' => true );
            $tags['line'] = array( 'x1' => true, 'y1' => true, 'x2' => true, 'y2' => true, 'stroke' => true, 'stroke-width' => true, 'stroke-linecap' => true );
            $tags['path'] = array( 'd' => true, 'fill' => true, 'stroke' => true, 'stroke-width' => true, 'stroke-linecap' => true, 'stroke-linejoin' => true );
            $tags['button'] = array( 'class' => true, 'id' => true, 'aria-label' => true, 'type' => true, 'onclick' => true, 'style' => true );
        }
        return $tags;
    }
}
`;
  }

  if (!codeToAdd) {
    console.log('functions.php already has both functions declared.');
    return;
  }

  const finalContent = decoded + codeToAdd;

  const params = new URLSearchParams();
  params.append('action', 'edit-theme-plugin-file');
  params.append('_ajax_nonce', nonce);
  params.append('nonce', nonce);
  params.append('file', 'functions.php');
  params.append('theme', 'astra');
  params.append('newcontent', finalContent);

  const ajaxRes = await fetch(`${siteUrl}/wp-admin/admin-ajax.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookies,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      Referer: `${siteUrl}/wp-admin/theme-editor.php`
    },
    body: params.toString()
  });

  const json = await ajaxRes.json();
  console.log('functions.php update result:', json);
  if (!json.success) throw new Error('Failed to update functions.php');
}

async function updateWpCodeCss(siteUrl, cookies) {
  console.log('\n--- STEP 2: Normalizing Product Card Sizing CSS in WPCode ---');
  const res = await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { Cookie: cookies }
  });
  const html = await res.text();
  const nonce = (html.match(/id="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i) || html.match(/name="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i))[1];
  const headerMatch = html.match(/<textarea[^>]*id="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  const footerMatch = html.match(/<textarea[^>]*id="ihaf_insert_footer"[^>]*>([\s\S]*?)<\/textarea>/i);

  let currentHeader = decodeAllHtmlEntities(headerMatch ? headerMatch[1] : '');
  let currentFooter = decodeAllHtmlEntities(footerMatch ? footerMatch[1] : '');

  // Add card sizing standardization CSS
  const CARD_NORMALIZATION_CSS = `
/* ==========================================================================
   PRODUCT CARD SIZING STANDARDIZATION (MATCHING SHOP/COLLECTIONS REFERENCE)
   ========================================================================== */
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
`;

  if (!currentHeader.includes('PRODUCT CARD SIZING STANDARDIZATION')) {
    currentHeader += '\n\n<style id="te-card-sizing-normalization">\n' + CARD_NORMALIZATION_CSS.trim() + '\n</style>';
  }

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
  console.log('WPCode Header CSS update status:', saveRes.status);
}

async function updatePages(siteUrl, cookies, nonce) {
  console.log('\n--- STEP 3: Syncing Pixel-Consistent Header & Button Labels across Pages ---');

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
    console.log(`Processing page ${p.id} (${p.slug})...`);
    const pageRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/${p.id}?context=edit`, {
      headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
    });
    const pageData = await pageRes.json();
    let content = pageData.content?.raw || '';

    // Replace header with clean unified header
    const cleanHeader = getCleanHeader(p.active);
    const headerRegex = /<header\s+class="re-unified-header-container"[\s\S]*?<\/header>/i;
    if (headerRegex.test(content)) {
      content = content.replace(headerRegex, cleanHeader);
    } else {
      console.warn(`No existing re-unified-header-container found on ${p.slug}!`);
    }

    // On Shop page (and any other pages): standardize all buttons to 'VIEW PIECE'
    if (p.slug === 'shop' || p.slug === 'home') {
      content = content.replace(/>VIEW DETAILS</g, '>VIEW PIECE<');
    }

    const updateRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/${p.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies,
        'X-WP-Nonce': nonce
      },
      body: JSON.stringify({ content })
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
  console.log('\n--- STEP 4: Purging Hostinger CDN & Server Cache ---');
  const res = await fetch(`${siteUrl}/wp-json/hostinger-tools-plugin/v1/clear-cache`, {
    method: 'DELETE',
    headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
  });
  console.log('Hostinger cache purge status:', res.status);
}

async function main() {
  const { siteUrl, cookies, nonce } = await getProdAuth();
  console.log('Authenticated to', siteUrl);

  await updateFunctionsPhp(siteUrl, cookies);
  await updateWpCodeCss(siteUrl, cookies);
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
