import { getProdAuth } from './prod_auth_helper.js';

const pages = [
  { id: 68, slug: 'home', active: 'home' },
  { id: 6, slug: 'shop', active: 'shop' },
  { id: 50, slug: 'about-us', active: 'about' },
  { id: 52, slug: 'contact', active: 'contact' },
  { id: 120, slug: 'custom-dimensions', active: 'survey' },
  { id: 103, slug: 'refund_returns-2', active: 'policies' },
  { id: 102, slug: 'privacy-policy-2', active: 'policies' },
  { id: 7, slug: 'cart', active: 'cart' },
  { id: 8, slug: 'checkout', active: 'cart' }
];

function getCleanHeader(activeSlug) {
  const base = 'https://reflectionelite.com';
  return `
<header class="re-unified-header-container" id="reUnifiedHeader">
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
        <img decoding="async" src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/Logo-Reflection-e1777369196767-1024x186.png" alt="Reflection Elite" class="re-main-logo-img">
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
    <div class="re-search-overlay-bar" id="reSearchOverlayBar" style="display:none;" onclick="event.stopPropagation();">
      <div class="re-search-inner">
        <form role="search" method="get" class="re-search-form" action="${base}/">
          <span class="re-search-form-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.35-4.35"></path>
            </svg>
          </span>
          <input type="search" class="re-search-field" placeholder="Search bespoke mirrors, venetian, collections..." value="" name="s" autocomplete="off">
          <input type="hidden" name="post_type" value="product">
          <button type="submit" class="re-search-submit-btn">SEARCH</button>
          <button type="button" class="re-search-close-btn" aria-label="Close Search">✕</button>
        </form>
      </div>
    </div>
    <div class="re-mobile-drawer" id="reMobileDrawer" style="display:none;" onclick="event.stopPropagation();">
      <nav class="re-mobile-menu-list">
        <a href="${base}/" class="re-mobile-link ${activeSlug === 'home' ? 'is-active' : ''}" onclick="document.getElementById('reMobileDrawer').style.display='none';document.getElementById('reMobileDrawer').classList.remove('is-open');document.getElementById('reHamburgerBtn').classList.remove('is-active');">HOME</a>
        <a href="${base}/shop/" class="re-mobile-link ${activeSlug === 'shop' ? 'is-active' : ''}" onclick="document.getElementById('reMobileDrawer').style.display='none';document.getElementById('reMobileDrawer').classList.remove('is-open');document.getElementById('reHamburgerBtn').classList.remove('is-active');">COLLECTIONS</a>
        <a href="${base}/about-us/" class="re-mobile-link ${activeSlug === 'about' ? 'is-active' : ''}" onclick="document.getElementById('reMobileDrawer').style.display='none';document.getElementById('reMobileDrawer').classList.remove('is-open');document.getElementById('reHamburgerBtn').classList.remove('is-active');">ABOUT US</a>
        <a href="${base}/contact/" class="re-mobile-link ${activeSlug === 'contact' ? 'is-active' : ''}" onclick="document.getElementById('reMobileDrawer').style.display='none';document.getElementById('reMobileDrawer').classList.remove('is-open');document.getElementById('reHamburgerBtn').classList.remove('is-active');">CONTACT</a>
        <div class="re-mobile-btn-wrap">
          <a href="${base}/custom-dimensions/" class="re-mobile-cta-btn" onclick="document.getElementById('reMobileDrawer').style.display='none';document.getElementById('reMobileDrawer').classList.remove('is-open');document.getElementById('reHamburgerBtn').classList.remove('is-active');">BOOK SURVEY</a>
        </div>
      </nav>
    </div>
  </div>
  <div class="re-announcement-strip">
    <span>We Cover The Heavy Duty Cost On Every Mirror</span>
  </div>
  <div class="re-nav-row-desktop">
    <div class="re-nav-inner" style="display:flex; justify-content:center; align-items:center; width:100%; margin:0 auto;">
      <nav class="re-desktop-nav-links" style="display:flex; justify-content:center; align-items:center; gap:48px; margin:0 auto;">
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

async function main() {
  const { siteUrl, cookies, nonce } = await getProdAuth();
  console.log('Authenticated to:', siteUrl);

  for (const p of pages) {
    console.log(`Processing page ${p.id} (${p.slug})...`);
    const pageRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/${p.id}?context=edit`, {
      headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
    });
    if (!pageRes.ok) {
      console.warn(`Could not fetch page ${p.id}: HTTP ${pageRes.status}`);
      continue;
    }
    const pageData = await pageRes.json();
    let content = pageData.content?.raw || '';

    const cleanHeader = getCleanHeader(p.active);
    const headerRegex = /<header\s+class="re-unified-header-container"[\s\S]*?<\/header>/i;
    if (headerRegex.test(content)) {
      content = content.replace(headerRegex, cleanHeader);
    } else {
      console.warn(`No existing re-unified-header-container found on ${p.slug}!`);
      continue;
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
      console.error(`Failed to update page ${p.id}:`, err.slice(0, 200));
    }
  }

  // Purge cache
  console.log('Purging Hostinger CDN & server cache...');
  const purgeRes = await fetch(`${siteUrl}/wp-json/hostinger-tools-plugin/v1/clear-cache`, {
    method: 'DELETE',
    headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
  });
  console.log('✓ Cache purge HTTP status:', purgeRes.status);
}

main().catch(console.error);
