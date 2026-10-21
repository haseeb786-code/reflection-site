export function getReUnifiedHeader(siteUrl = '', activeSlug = '') {
  const base = siteUrl.replace(/\/+$/, '');
  const isProd = base.includes('reflectionelite.com');
  const policiesPath = isProd ? '/refund_returns-2/' : '/refund-policy/';
  const muranaPath = isProd ? '/product/antique-venetian-cushion/' : '/product/murana-mirror/';
  const logoUrl = 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/Logo-Reflection-e1777369196767-1024x186.png';

  // Return strictly clean HTML markup for the header.
  // NO inline <style> and NO inline <script> tags here!
  // All styles live in WPCode global head snippet (te-global-luxury-system),
  // and all scripts live in WPCode global footer snippet (re-global-scripts).
  // This prevents WordPress wp_kses_post from stripping tags and dumping raw code on the screen.
  const html = `
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
      <button class="re-hamburger-btn" id="reHamburgerBtn" aria-label="Toggle Navigation Menu" onclick="var d=document.getElementById('reMobileDrawer');var isOpen=d.style.display==='none'||!d.style.display;d.style.display=isOpen?'block':'none';d.classList.toggle('is-open',isOpen);this.classList.toggle('is-active',isOpen);event.stopPropagation();">
        <span class="re-bar"></span>
        <span class="re-bar"></span>
        <span class="re-bar"></span>
      </button>
      <a href="${base}/" class="re-brand-center">
        <img src="${logoUrl}" alt="Reflection Elite" class="re-main-logo-img">
      </a>
      <a href="${base}/cart/" class="re-cart-link">
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
    <div class="re-nav-inner">
      <nav class="re-desktop-nav-links" style="display:flex; justify-content:center; align-items:center; gap:44px;">
        <a href="${base}/" class="re-nav-item ${activeSlug === 'home' ? 'is-active' : ''}">HOME</a>
        <a href="${base}/shop/" class="re-nav-item ${activeSlug === 'shop' ? 'is-active' : ''}">COLLECTIONS</a>
        <a href="${base}/about-us/" class="re-nav-item ${activeSlug === 'about' ? 'is-active' : ''}">ABOUT US</a>
        <a href="${base}/contact/" class="re-nav-item ${activeSlug === 'contact' ? 'is-active' : ''}">CONTACT</a>
      </nav>
    </div>
  </div>
  <div class="re-book-survey-row">
    <div class="re-book-survey-inner">
      <a href="${base}/custom-dimensions/" class="re-book-survey-btn">BOOK SURVEY</a>
    </div>
  </div>
</header>
`.trim();

  return html;
}
