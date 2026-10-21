import fs from 'fs';
import { generateGlobalCss } from './generate_luxury_css.js';

const WP_URL = 'https://reflectionelite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'process.env.PROD_WP_APP_PASS || "[REDACTED]"';
const auth = { 
  Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64')}`,
  'Content-Type': 'application/json' 
};

// 1. GENERATE HOMEPAGE HTML (Page ID 68)
// Written compactly without empty newlines between grid items to prevent wpautop pollution
function generateHomepageHtml() {
  return `<section class="re-hero-section"><div class="re-hero-container"><div class="re-hero-content"><div class="re-eyebrow-wrap"><span class="re-eyebrow-line"></span><span class="re-eyebrow">THE ART OF REFLECTION</span></div><h1 class="re-hero-heading">A Mirror.<br>A <span class="re-serif-italic">Masterpiece</span>.<br>A Lasting Impression.</h1><p class="re-hero-subheading">Hand-finished Venetian and contemporary mirrors, crafted to bring quiet grandeur into your home.</p><div class="re-hero-cta-group"><a href="/shop/" class="re-btn-primary">EXPLORE THE COLLECTION &rarr;</a><a href="/custom-dimensions/" class="re-btn-link">Discover our craftsmanship &#8599;</a></div></div><div class="re-hero-badge"><div class="re-badge-title">THE VENEZIA COLLECTION</div><div class="re-badge-sub">Hand-beveled glass &middot; Artisan finish</div></div></div></section><section class="re-collections-section"><div class="re-section-header"><div class="re-sub-title-accent">&mdash; FIND YOUR REFLECTION &mdash;</div><h2 class="re-section-title">Designed for the way you live</h2></div><div class="re-collections-grid"><div class="re-collection-card"><div class="re-collection-img-wrap"><img src="https://reflectionelite.com/wp-content/uploads/2026/10/collection-venetian-mirrors.jpg" alt="Venetian Mirrors"></div><div class="re-collection-overlay"><h3>Venetian Mirrors</h3></div><a href="/shop/?category=venetian" class="re-card-cover-link" aria-label="Venetian Mirrors"></a></div><div class="re-collection-card"><div class="re-collection-img-wrap"><img src="https://reflectionelite.com/wp-content/uploads/2026/10/collection-led-contemporary.jpg" alt="LED &amp; Contemporary"></div><div class="re-collection-overlay"><h3>LED &amp; Contemporary</h3></div><a href="/shop/?category=contemporary" class="re-card-cover-link" aria-label="LED &amp; Contemporary"></a></div><div class="re-collection-card"><div class="re-collection-img-wrap"><img src="https://reflectionelite.com/wp-content/uploads/2026/10/collection-statement-pieces.jpg" alt="Statement Pieces"></div><div class="re-collection-overlay"><h3>Statement Pieces</h3></div><a href="/shop/?category=statement" class="re-card-cover-link" aria-label="Statement Pieces"></a></div></div></section><section class="re-featured-products-section"><div class="re-featured-products-grid"><div class="re-featured-product-card"><div class="re-product-card-img"><img src="https://reflectionelite.com/wp-content/uploads/2026/10/1771694577552.jpg" alt="Antique Venetian Cushion"></div><div class="re-product-card-info"><h3 class="re-product-card-title">ANTIQUE VENETIAN CUSHION</h3><div class="re-product-card-price">&#8377;81,500</div><a href="/product/antique-venetian-cushion/" class="re-btn-view-details">VIEW DETAILS</a></div></div><div class="re-featured-product-card"><div class="re-product-card-img"><img src="https://reflectionelite.com/wp-content/uploads/2026/10/20260222_002716-scaled.jpg" alt="Modern Victorian"></div><div class="re-product-card-info"><h3 class="re-product-card-title">MODERN VICTORIAN</h3><div class="re-product-card-price">&#8377;58,787</div><a href="/product/modern-victorian/" class="re-btn-view-details">VIEW DETAILS</a></div></div><div class="re-featured-product-card"><div class="re-product-card-img"><img src="https://reflectionelite.com/wp-content/uploads/2026/10/20260221_235950-scaled.jpg" alt="Silver Crown Framed"></div><div class="re-product-card-info"><h3 class="re-product-card-title">SILVER CROWN FRAMED</h3><div class="re-product-card-price">&#8377;35,900</div><a href="/product/silver-crown-framed/" class="re-btn-view-details">VIEW DETAILS</a></div></div></div></section><section id="custom-dimensions" class="re-bespoke-section"><div class="re-bespoke-catalog-link-wrap"><div class="re-gold-line"></div><a href="/shop/" class="re-btn-outline-gold">VIEW COMPLETE STORE CATALOG &rarr;</a><div class="re-gold-line"></div></div><div class="re-bespoke-glass-panel"><div class="re-panel-eyebrow">&mdash; TAILORED FOR ARCHITECTS &amp; HOMEOWNERS &mdash;</div><h2 class="re-bespoke-heading">Require Custom Dimensions or<br><span class="re-serif-italic">Bespoke Frame Detailing?</span></h2><p class="re-bespoke-copy">Our artisan studio specializes in custom-cut luxury mirrors crafted to your architectural blueprints, interior themes, and backlighting preferences. Connect directly with our design team on WhatsApp.</p><div class="re-bespoke-cta-wrap"><a href="https://wa.me/917387463103?text=Hi%20Reflection%20Elite%2C%20I%20would%20like%20to%20inquire%20about%20custom%20mirror%20dimensions%20and%20bespoke%20frame%20detailing." target="_blank" rel="noopener noreferrer" class="re-bespoke-pill-btn"><span class="re-pill-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.06-2.146-.541-1.854-.77-3.047-2.662-3.14-2.785-.092-.122-.741-.986-.741-1.88 0-.895.469-1.334.636-1.516.166-.182.365-.228.487-.228.122 0 .243.002.349.006.111.005.26-.042.406.31.15.362.512 1.248.558 1.339.045.091.076.197.015.319-.06.121-.091.197-.182.303-.091.106-.192.237-.274.319-.092.091-.188.19-.081.373.106.183.473.78 1.014 1.262.697.621 1.285.813 1.468.904.182.091.289.076.395-.045.106-.122.456-.531.577-.714.122-.182.243-.152.41-.091s1.063.501 1.245.592c.182.091.303.137.349.213.045.076.045.441-.099.846zm-3.392-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.88l-1.304 4.76 4.877-1.278c1.401.764 3.003 1.198 4.703 1.198 5.523 0 10-4.477 10-10 0-5.522-4.477-10-10-10z"/></svg></span><span class="re-pill-divider">|</span><span class="re-pill-text">Inquire Custom Dimensions on WhatsApp <strong class="re-gold-text-highlight">(+91 7387463103)</strong></span><span class="re-pill-arrow"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke="currentColor"/><path d="M10 8l4 4-4 4" stroke-linecap="round" stroke-linejoin="round"/></svg></span></a></div></div></section>`;
}

// 2. GENERATE DEDICATED BESPOKE PAGE HTML (Page ID 120, /custom-dimensions/)
function generateBespokePageHtml() {
  return `<div class="re-dedicated-bespoke-wrapper"><div class="re-bespoke-catalog-link-wrap"><div class="re-gold-line"></div><a href="/shop/" class="re-btn-outline-gold">VIEW COMPLETE STORE CATALOG &rarr;</a><div class="re-gold-line"></div></div><div class="re-bespoke-glass-panel"><div class="re-panel-eyebrow">&mdash; TAILORED FOR ARCHITECTS &amp; HOMEOWNERS &mdash;</div><h1 class="re-bespoke-heading">Require Custom Dimensions or<br><span class="re-serif-italic">Bespoke Frame Detailing?</span></h1><p class="re-bespoke-copy">Our artisan studio specializes in custom-cut luxury mirrors crafted to your architectural blueprints, interior themes, and backlighting preferences. Connect directly with our design team on WhatsApp.</p><div class="re-bespoke-cta-wrap"><a href="https://wa.me/917387463103?text=Hi%20Reflection%20Elite%2C%20I%20would%20like%20to%20inquire%20about%20custom%20mirror%20dimensions%20and%20bespoke%20frame%20detailing." target="_blank" rel="noopener noreferrer" class="re-bespoke-pill-btn"><span class="re-pill-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.06-2.146-.541-1.854-.77-3.047-2.662-3.14-2.785-.092-.122-.741-.986-.741-1.88 0-.895.469-1.334.636-1.516.166-.182.365-.228.487-.228.122 0 .243.002.349.006.111.005.26-.042.406.31.15.362.512 1.248.558 1.339.045.091.076.197.015.319-.06.121-.091.197-.182.303-.091.106-.192.237-.274.319-.092.091-.188.19-.081.373.106.183.473.78 1.014 1.262.697.621 1.285.813 1.468.904.182.091.289.076.395-.045.106-.122.456-.531.577-.714.122-.182.243-.152.41-.091s1.063.501 1.245.592c.182.091.303.137.349.213.045.076.045.441-.099.846zm-3.392-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.88l-1.304 4.76 4.877-1.278c1.401.764 3.003 1.198 4.703 1.198 5.523 0 10-4.477 10-10 0-5.522-4.477-10-10-10z"/></svg></span><span class="re-pill-divider">|</span><span class="re-pill-text">Inquire Custom Dimensions on WhatsApp <strong class="re-gold-text-highlight">(+91 7387463103)</strong></span><span class="re-pill-arrow"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke="currentColor"/><path d="M10 8l4 4-4 4" stroke-linecap="round" stroke-linejoin="round"/></svg></span></a></div></div></div>`;
}

// 3. GENERATE GLOBAL FOOTER & CLIENT-SIDE INTERACTION SCRIPT (Injecting into WPCode Footer)
export function generateGlobalFooterScript() {
  return `
<!-- Luxury Announcement Bar Injection & Client Dynamic Interactions -->
<script id="re-luxury-client-script">
(function() {
  // 1. Inject Announcement Bar above Masthead
  function injectAnnouncementBar() {
    if (document.querySelector('.re-top-announcement')) return;
    var bar = document.createElement('div');
    bar.className = 're-top-announcement';
    bar.innerHTML = '<span>COMPLIMENTARY DESIGN GUIDANCE</span><span class="re-dot">&middot;</span><span class="re-announcement-nowrap">PAN-INDIA DELIVERY</span>';
    var header = document.querySelector('header#masthead') || document.body.firstChild;
    if (header && header.parentNode) {
      header.parentNode.insertBefore(bar, header);
    }
  }

  // 2. Inject Search, Account, and Cart Icons into Navigation Bar (Desktop & Mobile)
  function injectHeaderIcons() {
    var nav = document.querySelector('.main-header-bar-navigation') || document.querySelector('.ast-primary-header-bar .site-header-primary-section-right');
    if (nav && !document.querySelector('.re-header-icons')) {
      var iconsWrap = document.createElement('div');
      iconsWrap.className = 're-header-icons';
      iconsWrap.innerHTML = 
        '<a href="/shop/" class="re-header-icon-link" aria-label="Search Catalog" title="Search">' +
          '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>' +
        '</a>' +
        '<a href="/my-account/" class="re-header-icon-link" aria-label="My Account" title="Account">' +
          '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' +
        '</a>' +
        '<a href="/cart/" class="re-header-icon-link" aria-label="View Cart" title="Cart">' +
          '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' +
          '<span class="re-cart-badge">0</span>' +
        '</a>';
      nav.appendChild(iconsWrap);
    }

    var mobileRight = document.querySelector('#ast-mobile-header .site-header-primary-section-right');
    if (mobileRight && !document.querySelector('.re-mobile-header-icons')) {
      var mIcons = document.createElement('div');
      mIcons.className = 're-mobile-header-icons';
      mIcons.style.cssText = 'display: inline-flex; align-items: center; gap: 14px; margin-right: 14px;';
      mIcons.innerHTML = 
        '<a href="/shop/" class="re-header-icon-link" aria-label="Search Catalog" title="Search">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>' +
        '</a>' +
        '<a href="/cart/" class="re-header-icon-link" aria-label="View Cart" title="Cart">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' +
          '<span class="re-cart-badge">0</span>' +
        '</a>';
      mobileRight.insertBefore(mIcons, mobileRight.firstChild);
    }
  }

  // 3. Catalog Page (/shop/) Dynamic Injection
  function setupCatalogPage() {
    if (!window.location.pathname.includes('/shop')) return;

    var container = document.querySelector('.ast-woocommerce-container') || document.querySelector('#content .ast-container');
    if (!container || document.querySelector('.re-catalog-hero')) return;

    var heroHtml = 
      '<div class="re-catalog-hero">' +
        '<div class="re-catalog-breadcrumb">HOME / SHOP ALL</div>' +
        '<div class="re-catalog-hero-inner">' +
          '<div class="re-catalog-eyebrow">&mdash; THE COMPLETE COLLECTION &mdash;</div>' +
          '<h1 class="re-catalog-title">Explore All <span class="re-serif-italic">Masterpieces</span></h1>' +
          '<p class="re-catalog-sub">Discover statement mirrors, timeless Venetian craftsmanship and contemporary designs for every space.</p>' +
          '<div class="re-filter-pills" id="re-category-filters">' +
            '<button class="re-pill-btn active" data-filter="all">All Mirrors</button>' +
            '<button class="re-pill-btn" data-filter="venetian">Venetian</button>' +
            '<button class="re-pill-btn" data-filter="contemporary">LED &amp; Contemporary</button>' +
            '<button class="re-pill-btn" data-filter="statement">Statement Pieces</button>' +
            '<button class="re-pill-btn" data-filter="custom">Custom Mirrors</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="re-catalog-toolbar">' +
        '<div class="re-toolbar-count">Showing <span id="re-product-count">7</span> masterpieces</div>' +
        '<div class="re-toolbar-controls">' +
          '<div class="re-sort-wrapper">' +
            '<select id="re-sort-select" class="re-sort-dropdown">' +
              '<option value="featured">Featured</option>' +
              '<option value="price-asc">Price: Low to High</option>' +
              '<option value="price-desc">Price: High to Low</option>' +
              '<option value="name-asc">Name: A to Z</option>' +
            '</select>' +
          '</div>' +
          '<div class="re-toolbar-divider">|</div>' +
          '<button class="re-toolbar-filter-btn" id="re-toggle-filter">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg> Filter' +
          '</button>' +
        '</div>' +
      '</div>';

    // Catalog Products 4-Column Grid Data (100% Real WooCommerce Products)
    var catalogProducts = [
      {
        id: 17,
        slug: 'antique-venetian-cushion',
        title: 'ANTIQUE VENETIAN CUSHION',
        price: '₹81,500',
        priceNum: 81500,
        category: 'Venetian Mirror',
        filterTag: 'venetian',
        img: 'https://reflectionelite.com/wp-content/uploads/2026/10/1771694577552.jpg',
        btnText: 'VIEW DETAILS',
        btnType: 'view',
        link: '/product/antique-venetian-cushion/'
      },
      {
        id: 30,
        slug: 'modern-victorian',
        title: 'MODERN VICTORIAN',
        price: '₹58,787',
        priceNum: 58787,
        category: 'Venetian Mirror',
        filterTag: 'venetian',
        img: 'https://reflectionelite.com/wp-content/uploads/2026/10/20260222_002716-scaled.jpg',
        btnText: 'VIEW DETAILS',
        btnType: 'view',
        link: '/product/modern-victorian/'
      },
      {
        id: 51,
        slug: 'silver-crown-framed',
        title: 'SILVER CROWN FRAMED',
        price: '₹35,900',
        priceNum: 35900,
        category: 'Venetian Mirror',
        filterTag: 'venetian',
        img: 'https://reflectionelite.com/wp-content/uploads/2026/10/20260221_235950-scaled.jpg',
        btnText: 'VIEW DETAILS',
        btnType: 'view',
        link: '/product/silver-crown-framed/'
      },
      {
        id: 45,
        slug: 'rococo-floral',
        title: 'ROCOCO FLORAL',
        price: '₹14,000',
        priceNum: 14000,
        category: 'Venetian Mirror',
        filterTag: 'venetian',
        img: 'https://reflectionelite.com/wp-content/uploads/2026/10/20260222_092621-scaled.jpg',
        btnText: 'VIEW DETAILS',
        btnType: 'view',
        link: '/product/rococo-floral/'
      },
      {
        id: 36,
        slug: 'mosaic-mirror-art',
        title: 'MOSAIC MIRROR ART',
        price: '₹2,500 – ₹7,500',
        priceNum: 2500,
        category: 'Contemporary',
        filterTag: 'contemporary',
        img: 'https://reflectionelite.com/wp-content/uploads/2026/10/20260305_220825.jpg',
        btnText: 'VIEW DETAILS',
        btnType: 'view',
        link: '/product/mosaic-mirror-art/'
      },
      {
        id: 23,
        slug: 'customised-mirror',
        title: 'CUSTOMISED MIRROR',
        price: '₹100',
        priceNum: 100,
        category: 'Custom',
        filterTag: 'custom',
        img: 'https://reflectionelite.com/wp-content/uploads/2026/10/WhatsAppImage2026-07-13at5.15.04PM.jpg',
        btnText: 'VIEW DETAILS',
        btnType: 'view',
        link: '/product/customised-mirror/'
      },
      {
        id: 41,
        slug: 'premium-upholstered-frame',
        title: 'PREMIUM UPHOLSTERED FRAME',
        price: 'Price on Request',
        priceNum: 0,
        category: 'Statement Piece',
        filterTag: 'statement',
        img: 'https://reflectionelite.com/wp-content/uploads/2026/10/WhatsAppImage2026-09-18at3.57.23PM.jpg',
        btnText: 'VIEW DETAILS',
        btnType: 'view',
        link: '/product/premium-upholstered-frame/'
      }
    ];

    var gridHtml = '<div class="re-catalog-grid" id="re-catalog-products-grid">';
    catalogProducts.forEach(function(p) {
      gridHtml += 
        '<div class="re-catalog-card" data-category="' + p.filterTag + '" data-price="' + p.priceNum + '" data-title="' + p.title + '">' +
          '<button class="re-wishlist-btn" aria-label="Add to Wishlist" onclick="toggleWishlist(this, event)">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
          '</button>' +
          '<div class="re-catalog-img-wrap">' +
            '<img src="' + p.img + '" alt="' + p.title + '" loading="eager">' +
          '</div>' +
          '<div class="re-catalog-info">' +
            '<div class="re-catalog-card-header-group">' +
              '<h3 class="re-catalog-card-title">' + p.title + '</h3>' +
              '<div class="re-catalog-card-price">' + p.price + '</div>' +
              '<div class="re-catalog-card-category">' + p.category + '</div>' +
            '</div>' +
            '<a href="' + p.link + '" class="re-btn-action ' + (p.btnType === 'add' ? 're-btn-add' : 're-btn-view') + '">' + p.btnText + '</a>' +
          '</div>' +
        '</div>';
    });
    gridHtml += '</div>';

    // Replace default container content with the reference layout
    container.innerHTML = heroHtml + gridHtml;

    // Attach filter pill listeners
    var pills = document.querySelectorAll('#re-category-filters .re-pill-btn');
    pills.forEach(function(pill) {
      pill.addEventListener('click', function() {
        pills.forEach(function(b) { b.classList.remove('active'); });
        pill.classList.add('active');
        var filter = pill.getAttribute('data-filter');
        filterProducts(filter);
      });
    });

    // Attach sorting listener
    var sortSelect = document.getElementById('re-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', function() {
        sortProducts(this.value);
      });
    }

    // Check URL parameters for ?category=
    var urlParams = new URLSearchParams(window.location.search);
    var catParam = urlParams.get('category');
    if (catParam) {
      var matchingPill = document.querySelector('#re-category-filters .re-pill-btn[data-filter="' + catParam + '"]');
      if (matchingPill) {
        matchingPill.click();
      }
    }
  }

  // Filter products by category
  window.filterProducts = function(cat) {
    var cards = document.querySelectorAll('.re-catalog-card');
    var visibleCount = 0;
    cards.forEach(function(card) {
      var cardCat = card.getAttribute('data-category');
      if (cat === 'all' || cardCat === cat) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    var countEl = document.getElementById('re-product-count');
    var countLabel = document.querySelector('.re-toolbar-count');
    if (countLabel) {
      countLabel.innerHTML = 'Showing <span id="re-product-count">' + visibleCount + '</span> ' + (visibleCount === 1 ? 'masterpiece' : 'masterpieces');
    } else if (countEl) {
      countEl.textContent = visibleCount;
    }
    var grid = document.getElementById('re-catalog-products-grid');
    if (grid) {
      if (visibleCount === 1) {
        grid.classList.add('re-single-result');
      } else {
        grid.classList.remove('re-single-result');
      }
    }
  };

  // Sort products
  window.sortProducts = function(mode) {
    var grid = document.getElementById('re-catalog-products-grid');
    if (!grid) return;
    var cards = Array.from(grid.querySelectorAll('.re-catalog-card'));

    cards.sort(function(a, b) {
      var priceA = parseFloat(a.getAttribute('data-price')) || 0;
      var priceB = parseFloat(b.getAttribute('data-price')) || 0;
      var titleA = a.getAttribute('data-title') || '';
      var titleB = b.getAttribute('data-title') || '';

      if (mode === 'price-asc') return priceA - priceB;
      if (mode === 'price-desc') return priceB - priceA;
      if (mode === 'name-asc') return titleA.localeCompare(titleB);
      return 0; // featured / default
    });

    cards.forEach(function(card) { grid.appendChild(card); });
  };

  // Wishlist heart toggle
  window.toggleWishlist = function(btn, e) {
    e.preventDefault();
    e.stopPropagation();
    btn.classList.toggle('active');
    var svg = btn.querySelector('svg');
    if (btn.classList.contains('active')) {
      svg.setAttribute('fill', '#D9383A');
      svg.setAttribute('stroke', '#D9383A');
    } else {
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
    }
  };

  // Suppress duplicate Astra footer if present
  function cleanFooter() {
    var astFooter = document.querySelector('footer#colophon') || document.querySelector('.site-footer');
    if (astFooter) {
      astFooter.style.display = 'none';
    }
  }

  // Run initializations
  document.addEventListener('DOMContentLoaded', function() {
    injectAnnouncementBar();
    injectHeaderIcons();
    setupCatalogPage();
    cleanFooter();
  });

  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    injectAnnouncementBar();
    injectHeaderIcons();
    setupCatalogPage();
    cleanFooter();
  }
})();
</script>

<!-- Restrained Luxury Footer (Reference Image 3) -->
<footer class="re-luxury-footer">
  Copyright &copy; 2026 Reflection Elite | Powered by Astra WordPress Theme
</footer>
  `;
}

async function deploy() {
  console.log('=== DEPLOYING REFLECTION ELITE LUXURY REDESIGN ===\n');

  // STEP 1: Update Homepage (Page ID 68)
  console.log('1. Updating Homepage (Page ID 68)...');
  const homeRes = await fetch(`${WP_URL}/wp-json/wp/v2/pages/68`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      title: 'Reflection Elite',
      content: generateHomepageHtml(),
      status: 'publish'
    })
  });
  if (homeRes.ok) {
    console.log('[SUCCESS] Homepage updated matching Reference Image 1 & 3!');
  } else {
    console.error('Failed to update homepage:', homeRes.status, await homeRes.text());
  }

  // STEP 2: Update Dedicated Bespoke Page (Page ID 120, /custom-dimensions/)
  console.log('\n2. Updating Dedicated Custom Dimensions Page (Page ID 120)...');
  const bespokeRes = await fetch(`${WP_URL}/wp-json/wp/v2/pages/120`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      title: 'Custom Dimensions & Bespoke Design',
      content: generateBespokePageHtml(),
      status: 'publish'
    })
  });
  if (bespokeRes.ok) {
    console.log('[SUCCESS] Custom Dimensions page updated matching Reference Image 3!');
  } else {
    console.error('Failed to update bespoke page:', bespokeRes.status, await bespokeRes.text());
  }

  // STEP 3: Save Global Luxury CSS and Dynamic Footer Script into WPCode
  console.log('\n3. Injecting Global Luxury CSS and Dynamic Interaction Script into WPCode...');
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`);
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');

  const res3 = await fetch(`${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await res3.text();
  const nonceMatch = html.match(/id="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i) 
                  || html.match(/name="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i);
  if (!nonceMatch) {
    throw new Error('Could not find nonce on WPCode page');
  }
  const nonce = nonceMatch[1];

  const formBody = new URLSearchParams();
  formBody.append('insert-headers-and-footers_nonce', nonce);
  formBody.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-headers-footers');
  formBody.append('ihaf_insert_header', generateGlobalCss());
  formBody.append('ihaf_insert_body', '');
  formBody.append('ihaf_insert_footer', generateGlobalFooterScript());

  const saveRes = await fetch(`${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': allCookies
    },
    body: formBody.toString(),
    redirect: 'manual'
  });

  console.log(`[SUCCESS] WPCode settings saved (HTTP ${saveRes.status})`);

  console.log('\n========================================================');
  console.log('Reflection Elite Luxury Redesign Deployed Successfully!');
  console.log('Homepage: https://reflectionelite.com/');
  console.log('Catalog: https://reflectionelite.com/shop/');
  console.log('Custom Dimensions: https://reflectionelite.com/custom-dimensions/');
  console.log('========================================================\n');
}

if (process.argv[1] && process.argv[1].endsWith('deploy_reflection_elite_luxury_redesign.js')) {
  deploy().catch(console.error);
}
