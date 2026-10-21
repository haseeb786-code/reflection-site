import { getProdAuth } from './prod_auth_helper.js';

const PROD_URL = 'https://reflectionelite.com';

// 1. MASTER WPCODE GLOBAL HEADER CSS
const MASTER_WPCODE_HEADER_CSS = `
<!-- Google Fonts & Trajan Pro -->
<link rel="stylesheet" href="https://fonts.cdnfonts.com/css/trajan-pro">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:wght@500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<style id="te-global-luxury-system">
@font-face {
  font-family: 'Trajan Pro Bold';
  src: url('https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/trajanpro-bold.otf.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Trajan Pro';
  src: url('https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/trajanpro-bold.otf.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

:root {
  --font-trajan: 'Trajan Pro Bold', 'Trajan Pro', 'Cinzel', Georgia, serif;
  --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --color-bg-dark: #0f1012;
  --color-surface-dark: #16181b;
  --color-card-dark: #131417;
  --color-gold: #c5a880;
  --color-gold-hover: #dfc299;
  --color-border: rgba(197, 168, 128, 0.22);
  --color-border-subtle: rgba(255, 255, 255, 0.08);
  --color-text-light: #f5f5f7;
  --color-text-muted: #a1a1aa;
  --site-max-width: 1380px;

  /* Legacy re- variables mapped cleanly to dark luxury palette */
  --re-trajan: 'Trajan Pro Bold', 'Trajan Pro', 'Cinzel', Georgia, serif;
  --re-font-serif: 'Trajan Pro Bold', 'Trajan Pro', 'Cinzel', Georgia, serif;
  --re-font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --re-gold: #c5a880;
  --re-gold-hover: #dfc299;
  --re-champagne-gold: #c5a880;
  --re-bg-black: #000000;
  --re-border: rgba(197, 168, 128, 0.22);
  --re-border-beige: rgba(197, 168, 128, 0.22);
  --re-deep-espresso: #ffffff;
}

/* Base Full-bleed Dark Background & Prevent Horizontal Scroll Blowout */
html, body, #page, .site, #primary, #content, .ast-container, .entry-content, 
.ast-separate-container, .ast-plain-container, .ast-article-single, .woocommerce, .te-live-page {
  background-color: var(--color-bg-dark) !important;
  background: var(--color-bg-dark) !important;
  color: var(--color-text-light) !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  overflow-x: hidden !important;
  max-width: 100vw !important;
}

/* Suppress Astra Chrome */
#masthead, #colophon, .ast-site-header, .ast-above-header-wrap, .ast-above-header, 
.ast-below-header-wrap, .ast-below-header, .site-below-footer-wrap, .site-primary-footer-wrap, 
.ast-breadcrumbs-wrapper, .entry-title.ast-single-post-order, .ast-banner-layout-1, 
.ast-header-break-point .main-header-bar-wrap, .entry-title, .elementor-20 {
  display: none !important;
}

/* Suppress WooCommerce default archive wrappers on shop page */
.woocommerce-products-header, .page-description {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
}
.woocommerce-breadcrumb, 
.ast-woocommerce-container > .woocommerce-products-header > .woocommerce-breadcrumb {
  display: none !important;
}

/* On Shop Page, hide WooCommerce's native archive product loop and ordering/counts so only our 7 curated cards in .catalog-grid-4 show! */
.woocommerce-shop ul.products,
.woocommerce-shop .woocommerce-ordering,
.woocommerce-shop .woocommerce-result-count,
.woocommerce-shop .woocommerce-pagination,
.woocommerce-shop nav.woocommerce-pagination,
.woocommerce-shop > .products,
.woocommerce-shop .woocommerce-info {
  display: none !important;
}

/* On Single Product pages, keep related and up-sells products grids styled properly */
.single-product .related.products ul.products,
.single-product .up-sells.products ul.products {
  display: grid !important;
}

h1, h2, h3, h4, .trajan-text, .nav-link, .btn-action, .price-display, .hero-tagline, .footer-heading, .footer-logo, .pillar-title {
  font-family: var(--font-trajan) !important;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

a {
  color: inherit;
  text-decoration: none;
}

/* ==========================================================================
   UNIFIED 5-TIER HEADER SYSTEM
   ========================================================================== */
.re-unified-header-container { position:relative; width:100%; z-index:99999; background:#000000; font-family:var(--font-trajan); box-sizing:border-box; }
.re-marquee-wrapper { position:relative; background:#0d0d0d; overflow:hidden; height:30px; display:flex; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); width:100%; box-sizing:border-box; }
.re-marquee { width:100%; overflow:hidden; white-space:nowrap; }
.re-marquee-track { display:inline-flex; width:max-content; animation:reMarqueeAnim 24s linear infinite; }
.re-marquee-track:hover { animation-play-state:paused; }
.re-marquee-item { display:inline-flex; align-items:center; font-family:var(--font-trajan); font-size:11px; letter-spacing:2px; color:#ffffff; padding:0 26px; text-transform:uppercase; }
.re-marquee-icon { margin-left:8px; font-size:13px; display:inline-block; }
@keyframes reMarqueeAnim { 0%{transform:translateX(0);} 100%{transform:translateX(-50%);} }

.re-main-header-row { background:#000000; padding:12px 28px; border-bottom:1px solid rgba(255,255,255,0.06); position:relative; width:100%; box-sizing:border-box; }
.re-header-row-inner { max-width:1380px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; }

/* Header Left & Right Action Groups */
.re-header-left-actions, .re-header-right-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.re-hamburger-btn { background:transparent; border:none; cursor:pointer; padding:8px; display:flex; flex-direction:column; justify-content:center; gap:6px; min-width:44px; min-height:44px; z-index:100001; box-sizing:border-box; }
.re-bar { display:block; width:26px; height:2px; background:#ffffff; transition:transform 0.25s ease,opacity 0.25s ease; }
.re-hamburger-btn.is-active .re-bar:nth-child(1) { transform:translateY(8px) rotate(45deg); }
.re-hamburger-btn.is-active .re-bar:nth-child(2) { opacity:0; }
.re-hamburger-btn.is-active .re-bar:nth-child(3) { transform:translateY(-8px) rotate(-45deg); }

.re-header-icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  min-width: 44px;
  min-height: 44px;
  border-radius: 50%;
  transition: all 0.25s ease;
  box-sizing: border-box;
  text-decoration: none;
}
.re-header-icon-btn:hover {
  color: var(--color-gold);
  background: rgba(197, 168, 128, 0.12);
}
.re-header-icon-btn svg {
  display: block;
  stroke: currentColor;
}

.re-brand-center { display:flex; align-items:center; justify-content:center; text-decoration:none; }
.re-main-logo-img { height:54px; width:auto; max-width:320px; display:block; object-fit:contain; }

.re-cart-link { display:flex; align-items:center; gap:8px; color:#ffffff; text-decoration:none; font-family:var(--font-trajan); font-size:13px; font-weight:700; letter-spacing:0.12em; transition:color 0.2s ease; min-height:44px; padding:4px 8px; box-sizing:border-box; }
.re-cart-link:hover { color:var(--color-gold); }
.re-cart-icon { display:flex; align-items:center; }

/* Slide-down luxury search bar */
.re-search-overlay-bar {
  display: none;
  background: #111215;
  border-top: 1px solid rgba(197, 168, 128, 0.25);
  border-bottom: 2px solid var(--color-gold);
  padding: 14px 24px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.9);
  animation: reSlideDown 0.25s ease-out;
}
@keyframes reSlideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
.re-search-inner {
  max-width: 800px;
  margin: 0 auto;
}
.re-search-form {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}
.re-search-form-icon {
  display: flex;
  align-items: center;
  color: var(--color-gold);
}
.re-search-field {
  flex: 1;
  background: #090a0c !important;
  border: 1px solid rgba(197, 168, 128, 0.4) !important;
  color: #ffffff !important;
  font-family: var(--font-body);
  font-size: 14px;
  padding: 10px 16px !important;
  border-radius: 2px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}
.re-search-field:focus {
  border-color: var(--color-gold) !important;
  box-shadow: 0 0 12px rgba(197, 168, 128, 0.3);
}
.re-search-submit-btn {
  background: var(--color-gold) !important;
  color: #000000 !important;
  border: 1px solid var(--color-gold) !important;
  font-family: var(--font-trajan) !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  letter-spacing: 0.12em !important;
  padding: 11px 20px !important;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.re-search-submit-btn:hover {
  background: var(--color-gold-hover) !important;
}
.re-search-close-btn {
  background: transparent !important;
  border: none !important;
  color: #a1a1aa !important;
  font-size: 22px;
  cursor: pointer;
  padding: 4px 8px;
  line-height: 1;
  transition: color 0.2s ease;
}
.re-search-close-btn:hover {
  color: #ffffff !important;
}

.re-announcement-strip { background:#080808; border-top:1px solid rgba(255,255,255,0.05); border-bottom:1px solid var(--color-border); padding:8px 16px; font-family:var(--font-trajan); font-size:0.72rem; font-weight:600; letter-spacing:0.16em; text-align:center; color:var(--color-gold); text-transform:uppercase; width:100%; box-sizing:border-box; }
.re-nav-row-desktop { background:#0a0a0a; border-bottom:1px solid rgba(255,255,255,0.06); padding:10px 28px; width:100%; box-sizing:border-box; }
.re-nav-inner { max-width:1380px; margin:0 auto; display:flex; align-items:center; gap:36px; }
.re-nav-sublogo { display:flex; align-items:center; text-decoration:none; }
.re-nav-sublogo img { height:22px; width:auto; display:block; }
.re-desktop-nav-links { display:flex; align-items:center; gap:24px; flex-wrap:nowrap; }
.re-nav-item { font-family:var(--font-trajan); font-size:0.78rem; letter-spacing:0.08em; color:#d4d4d8; text-decoration:none; padding:6px 0; transition:color 0.2s ease; white-space:nowrap; }
.re-nav-item:hover, .re-nav-item.is-active { color:var(--color-gold) !important; }
.re-book-survey-row { max-width:1380px; margin:0 auto; padding:14px 28px 10px; width:100%; box-sizing:border-box; }
.re-book-survey-inner { display:flex; justify-content:flex-start; }
.re-book-survey-btn { display:inline-block; border:1px solid var(--color-gold); background:transparent; color:var(--color-gold); font-family:var(--font-trajan); font-size:0.76rem; font-weight:700; letter-spacing:0.14em; padding:8px 20px; border-radius:2px; text-decoration:none; text-transform:uppercase; transition:all 0.25s ease; }
.re-book-survey-btn:hover { background:var(--color-gold); color:#000000 !important; }

#reMobileDrawer { display:none; position:absolute; top:100%; left:0; width:100%; background:#0e0f12; border-bottom:2px solid var(--color-gold); box-shadow:0 20px 40px rgba(0,0,0,0.95); z-index:100000; box-sizing:border-box; }
#reMobileDrawer.is-open { display:block !important; }
.re-mobile-menu-list { display:flex; flex-direction:column; padding:6px 0; margin:0; list-style:none; }
.re-mobile-link { display:flex !important; align-items:center; min-height:50px; padding:14px 24px; font-family:var(--font-trajan); font-size:0.92rem; letter-spacing:0.12em; color:#ffffff !important; text-decoration:none; border-bottom:1px solid rgba(255,255,255,0.08); width:100%; box-sizing:border-box; background:transparent; transition:background 0.2s ease,color 0.2s ease; }
.re-mobile-link:hover, .re-mobile-link:active, .re-mobile-link.is-active { background:rgba(197,168,128,0.12); color:var(--color-gold) !important; }
.re-mobile-btn-wrap { padding:16px 24px; }
.re-mobile-cta-btn { display:block; text-align:center; border:1px solid var(--color-gold); color:var(--color-gold) !important; background:transparent; font-family:var(--font-trajan); font-weight:700; padding:14px; font-size:0.86rem; letter-spacing:0.14em; border-radius:2px; text-decoration:none; transition:all 0.25s ease; }
.re-mobile-cta-btn:hover { background:var(--color-gold); color:#000000 !important; }

@media (min-width:768px) { #reMobileDrawer { display:none !important; } }
@media (max-width:767.98px) {
  .re-nav-row-desktop { display:none !important; }
  .re-book-survey-row { display:none !important; }
  .re-main-header-row { padding:8px 12px !important; }
  .re-header-left-actions, .re-header-right-actions { gap:4px !important; }
  .re-hamburger-btn { min-width:38px !important; min-height:38px !important; padding:6px !important; }
  .re-bar { width:22px !important; }
  .re-header-icon-btn { min-width:36px !important; min-height:36px !important; padding:6px !important; }
  .re-header-icon-btn svg { width:18px !important; height:18px !important; }
  .re-main-logo-img { height:36px !important; max-width:160px !important; }
  .re-cart-text { display:none !important; }
  .re-cart-link { min-height:36px !important; padding:4px 6px !important; }
  .re-cart-icon svg { width:18px !important; height:18px !important; }
  .re-search-overlay-bar { padding:10px 14px !important; }
  .re-search-form { gap:8px !important; }
  .re-search-field { font-size:13px !important; padding:8px 12px !important; }
  .re-search-submit-btn { padding:8px 14px !important; font-size:10px !important; }
  .re-announcement-strip { font-size:0.62rem !important; padding:7px 10px !important; letter-spacing:0.08em !important; line-height:1.4 !important; }
  .re-marquee-wrapper { height:26px !important; }
  .re-marquee-item { font-size:10px !important; padding:0 18px !important; }
}

/* ============================================================
   EXACT HERO BANNER & CAROUSEL SYSTEM + MOBILE FIXES
   ============================================================ */
.re-hero-section {
  width: 100%;
  background: #0f1012;
  position: relative;
  overflow: hidden;
}
.re-carousel-box {
  position: relative;
  width: 100%;
  max-width: 100%;
  height: 310px;
  overflow: hidden;
  background: #08090b;
}
@media (min-width: 768px) {
  .re-carousel-box {
    height: 520px;
    max-width: 1100px;
    margin: 0 auto;
    border-radius: 2px;
  }
}
@media (max-width: 767.98px) {
  /* Fix Issue B: Image Framing - give vertical room and center framing */
  .re-carousel-box {
    height: 390px !important;
    max-height: 80vh !important;
  }
  .re-carousel-img {
    object-fit: cover !important;
    object-position: center 38% !important;
  }
}
.re-carousel-track {
  position: relative;
  width: 100%;
  height: 100%;
}
.re-carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.8s ease-in-out;
}
.re-carousel-slide.active {
  opacity: 1;
  visibility: visible;
  z-index: 2;
}
.re-carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 25%;
  display: block;
}
.re-carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: rgba(15, 16, 18, 0.45);
  backdrop-filter: blur(4px);
  color: #f7ede2;
  border: 1px solid rgba(197, 168, 128, 0.3);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  transition: all 0.25s ease;
  user-select: none;
}
.re-carousel-nav:hover {
  background: #c5a880;
  color: #0f1012;
}
.re-carousel-nav.prev { left: 12px; }
.re-carousel-nav.next { right: 12px; }
.re-carousel-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  gap: 8px;
  align-items: center;
}
.re-carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
}
.re-carousel-dot.active {
  background: #c5a880;
  width: 10px;
  height: 10px;
  box-shadow: 0 0 8px rgba(197, 168, 128, 0.8);
}
.re-hero-content-block {
  text-align: center;
  padding: 24px 16px 36px;
  background: #0f1012;
  position: relative;
  z-index: 3;
  max-width: 700px;
  margin: 0 auto;
}
.re-hero-tagline {
  font-family: var(--font-trajan), 'Cinzel', serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  color: #c5a880;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.re-hero-main-title {
  font-family: var(--font-trajan), 'Cinzel', Georgia, serif;
  font-size: 27px;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: 0.08em;
  color: #e2c9a5;
  text-transform: uppercase;
  margin: 0 auto 20px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
}
@media (min-width: 768px) {
  .re-hero-main-title {
    font-size: 40px;
    letter-spacing: 0.1em;
    margin-bottom: 26px;
  }
}
.re-hero-cta-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}
.re-hero-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #111215;
  color: #ffffff !important;
  border: 1px solid #c5a880;
  font-family: var(--font-trajan), -apple-system, sans-serif;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 10px 16px;
  text-decoration: none;
  border-radius: 2px;
  transition: all 0.25s ease;
  white-space: nowrap;
}
.re-hero-btn:hover {
  background: #c5a880;
  color: #0f1012 !important;
  border-color: #d4af37;
}

/* Fix Issue A: Mobile CTA Stacking */
@media (max-width: 767.98px) {
  .re-hero-cta-buttons {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 10px !important;
    width: 100% !important;
    max-width: 320px !important;
    margin: 0 auto !important;
    padding: 0 16px !important;
    box-sizing: border-box !important;
  }
  .re-hero-btn {
    width: 100% !important;
    box-sizing: border-box !important;
    text-align: center !important;
    padding: 12px 16px !important;
    font-size: 11px !important;
    letter-spacing: 0.12em !important;
    white-space: normal !important;
  }
}

/* ==========================================================================
   STRICT RESPONSIVE GRID HIERARCHY
   ========================================================================== */
.catalog-grid-4, .catalog-grid, .shop-catalog-grid, .re-featured-products-grid, .re-collections-grid,
.single-product .related.products ul.products, .single-product .up-sells.products ul.products {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 26px !important;
  width: 100% !important;
  box-sizing: border-box !important;
  list-style: none !important;
  margin: 0 !important;
  padding: 0 !important;
}
@media (min-width: 768px) and (max-width: 1024px) {
  .catalog-grid-4, .catalog-grid, .shop-catalog-grid, .re-featured-products-grid, .re-collections-grid,
  .single-product .related.products ul.products, .single-product .up-sells.products ul.products {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 20px !important;
  }
}
@media (max-width: 767.98px) {
  .catalog-grid-4, .catalog-grid, .shop-catalog-grid, .re-featured-products-grid, .re-collections-grid,
  .single-product .related.products ul.products, .single-product .up-sells.products ul.products {
    grid-template-columns: 1fr !important;
    gap: 24px !important;
    width: 100% !important;
  }
  .luxury-card, .product-card, .re-catalog-card {
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }
}

/* ==========================================================================
   LUXURY PRODUCT CARD STYLES & SHINE SWEEP EFFECT
   ========================================================================== */
.luxury-card {
  background: var(--color-surface-dark);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}
.luxury-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-gold);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.6);
}
.card-media {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #090a0c;
  overflow: hidden;
}
.card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}
.luxury-card:hover .card-media img {
  transform: scale(1.05);
}
.card-info {
  padding: 20px 18px 22px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: var(--color-surface-dark);
}
.card-category {
  font-family: var(--font-trajan);
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  color: var(--color-gold);
  margin-bottom: 6px;
  text-transform: uppercase;
}
.card-title {
  font-family: var(--font-trajan);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text-light);
  margin-bottom: 12px;
  line-height: 1.35;
}
.card-price-row {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid var(--color-border-subtle);
}
.card-price {
  font-family: var(--font-trajan);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-gold);
}
.card-btn, .btn-view {
  font-family: var(--font-trajan);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 8px 14px;
  border: 1px solid var(--color-gold);
  color: var(--color-gold);
  background: transparent;
  border-radius: 2px;
  text-decoration: none;
  transition: all 0.25s ease;
}
.card-btn:hover, .btn-view:hover {
  background: var(--color-gold);
  color: #000000 !important;
}

/* SHINE / SHIMMER SWEEP ANIMATION */
.luxury-card .card-media, .product-card .product-media-wrap, .luxury-card .prod-main-img-box,
.luxury-card .card-image-container, .re-collection-card .card-media, .re-collection-card .product-media-wrap {
  position: relative !important;
  overflow: hidden !important;
}
.luxury-card .card-media::after, .product-card .product-media-wrap::after, .luxury-card .prod-main-img-box::after,
.luxury-card .card-image-container::after, .re-collection-card .card-media::after, .re-collection-card .product-media-wrap::after {
  content: '';
  position: absolute;
  top: 0;
  left: -150%;
  width: 60%;
  height: 100%;
  background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0) 60%, transparent 100%);
  transform: skewX(-20deg);
  animation: shine-sweep 5s ease-in-out infinite;
  pointer-events: none;
  z-index: 2;
}
.luxury-card:nth-child(2n) .card-media::after, .product-card:nth-child(2n) .product-media-wrap::after { animation-delay: 1.2s; }
.luxury-card:nth-child(3n) .card-media::after, .product-card:nth-child(3n) .product-media-wrap::after { animation-delay: 2.4s; }
.luxury-card:nth-child(4n) .card-media::after, .product-card:nth-child(4n) .product-media-wrap::after { animation-delay: 3.6s; }
@keyframes shine-sweep { 0% { left: -150%; } 35% { left: 150%; } 100% { left: 150%; } }

/* SHOP HERO & CATALOG TOOLBAR */
.shop-hero { padding: 60px 24px 40px; text-align: center; background: #0c0d0f; border-bottom: 1px solid var(--color-border); }
.shop-hero-content { max-width: 800px; margin: 0 auto; }
.shop-hero h1 { font-size: clamp(2rem, 4vw, 2.8rem); color: #ffffff; margin: 12px 0 16px; letter-spacing: 0.08em; }
.shop-hero p { color: var(--color-text-muted); font-size: 1.05rem; line-height: 1.6; margin: 0; }
.catalog-section { max-width: 1380px; margin: 0 auto; padding: 40px 24px 80px; }
.catalog-toolbar { display: flex; justify-content: space-between; align-items: center; font-family: var(--font-trajan); font-size: 0.8rem; color: var(--color-text-muted); letter-spacing: 0.08em; padding-bottom: 24px; border-bottom: 1px solid var(--color-border-subtle); margin-bottom: 32px; text-transform: uppercase; }

/* Value pillars */
.pillars-section { padding: 50px 20px; background: var(--color-surface-dark); border-top: 1px solid var(--color-border); }
.pillars-grid { max-width: var(--site-max-width); margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
@media (max-width: 900px) { .pillars-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 500px) { .pillars-grid { grid-template-columns: 1fr; } }
.pillar-card { text-align: center; padding: 16px; }
.pillar-icon { font-size: 1.8rem; color: var(--color-gold); margin-bottom: 12px; }
.pillar-title { font-family: var(--font-trajan); font-size: 0.9rem; font-weight: 700; color: #ffffff; margin-bottom: 8px; }
.pillar-desc { font-size: 0.82rem; color: var(--color-text-muted); line-height: 1.5; }

/* ==========================================================================
   ABOUT US / OUR STORY DARK LUXURY EDITORIAL SYSTEM (.re-story-*)
   ========================================================================== */
.re-story-page-wrapper {
  max-width: 1380px;
  margin: 0 auto;
  padding: 50px 24px 80px;
  box-sizing: border-box;
}
.re-story-hero {
  text-align: center;
  max-width: 860px;
  margin: 0 auto 60px auto;
  padding-bottom: 36px;
  border-bottom: 1px solid var(--color-border);
}
.re-catalog-breadcrumb {
  font-family: var(--font-trajan);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  color: var(--color-gold);
  margin-bottom: 12px;
  text-transform: uppercase;
  display: inline-block !important;
  position: static !important;
}
.re-sub-title-accent {
  font-family: var(--font-trajan);
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  color: var(--color-gold);
  margin-bottom: 12px;
  text-transform: uppercase;
}
.re-story-title {
  font-family: var(--font-trajan) !important;
  font-size: clamp(2.2rem, 4vw, 3.2rem) !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  margin: 0 0 16px 0 !important;
  letter-spacing: 0.04em !important;
}
.re-story-hero-sub {
  font-size: 1.1rem;
  color: #d4d4d8;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.7;
}
.re-story-origins-section {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 50px;
  align-items: center;
  margin-bottom: 80px;
}
.re-lead-text {
  font-size: 16px;
  line-height: 1.8;
  color: #f5f5f7;
  font-weight: 500;
  margin-bottom: 20px;
}
.re-body-text {
  font-size: 14.5px;
  line-height: 1.75;
  color: #a1a1aa;
  margin-bottom: 24px;
}
.re-btn-link {
  display: inline-block;
  color: var(--color-gold) !important;
  font-family: var(--font-trajan);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: color 0.2s ease;
  padding: 10px 0;
}
.re-btn-link:hover {
  color: #ffffff !important;
  text-decoration: underline;
}
.re-story-highlights-card {
  background: var(--color-surface-dark) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: 4px;
  padding: 36px 30px;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.5);
}
.re-highlights-card-title {
  font-family: var(--font-trajan) !important;
  font-size: 1.25rem !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  margin: 0 0 12px 0 !important;
  letter-spacing: 0.06em !important;
}
.re-gold-divider-mini {
  width: 44px;
  height: 2px;
  background: var(--color-gold);
  margin-bottom: 22px;
}
.re-gold-divider {
  width: 60px;
  height: 2px;
  background: var(--color-gold);
  margin: 14px auto 0 auto;
}
.re-highlights-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.re-highlight-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 1.6;
  color: #d4d4d8 !important;
}
.re-highlight-icon {
  font-size: 18px;
  line-height: 1.3;
  flex-shrink: 0;
}
.re-highlight-bold {
  color: #ffffff !important;
  font-weight: 700;
}
.re-story-pillars-section {
  margin-bottom: 80px;
  text-align: center;
}
.re-section-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 36px auto;
}
.re-section-title {
  font-family: var(--font-trajan) !important;
  font-size: clamp(1.8rem, 3vw, 2.3rem) !important;
  color: #ffffff !important;
  margin: 10px 0 14px 0 !important;
  font-weight: 700 !important;
  letter-spacing: 0.06em !important;
}
.re-story-pillars-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
}
.re-story-pillar-card {
  background: var(--color-surface-dark) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: 4px;
  padding: 32px 22px;
  text-align: center;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
.re-story-pillar-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-gold);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.6);
}
.re-pillar-icon-badge {
  font-size: 32px;
  margin-bottom: 14px;
}
.re-pillar-title {
  font-family: var(--font-trajan) !important;
  font-size: 1.05rem !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  margin: 0 0 10px 0 !important;
  letter-spacing: 0.06em !important;
}
.re-pillar-desc {
  font-size: 13.5px;
  color: #a1a1aa !important;
  line-height: 1.6;
  margin: 0;
}
.re-story-journey-section {
  background: #121316;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 50px 36px;
  margin-bottom: 80px;
  text-align: center;
}
.re-story-journey-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-top: 36px;
}
.re-journey-step-card {
  background: var(--color-surface-dark);
  border: 1px solid var(--color-border-subtle);
  border-radius: 4px;
  padding: 24px 16px;
  text-align: center;
  transition: transform 0.3s ease, border-color 0.3s ease;
}
.re-journey-step-card:hover {
  transform: translateY(-3px);
  border-color: var(--color-gold);
}
.re-journey-step-num {
  font-family: var(--font-trajan);
  font-size: 26px;
  font-weight: 700;
  color: var(--color-gold);
  line-height: 1;
  margin-bottom: 10px;
}
.re-journey-step-title {
  font-family: var(--font-trajan) !important;
  font-size: 0.88rem !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  margin: 0 0 8px 0 !important;
  line-height: 1.3 !important;
  letter-spacing: 0.04em !important;
}
.re-journey-step-desc {
  font-size: 12.5px;
  color: #a1a1aa !important;
  line-height: 1.55;
  margin: 0;
}
.re-story-studio-card {
  background: var(--color-surface-dark);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 48px 30px;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  margin-bottom: 20px;
}
.re-studio-card-heading {
  font-family: var(--font-trajan) !important;
  font-size: clamp(1.8rem, 3vw, 2.4rem) !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  margin: 8px 0 12px 0 !important;
  letter-spacing: 0.04em !important;
}
.re-studio-card-address {
  font-size: 15px;
  color: #d4d4d8 !important;
  line-height: 1.7;
  margin: 20px auto 30px auto;
  max-width: 640px;
}
.re-studio-bold {
  color: #ffffff !important;
  font-size: 16px;
  font-weight: 700;
}
.re-studio-contact {
  color: var(--color-gold) !important;
  font-weight: 600;
}
.re-studio-btn-group {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}
.re-btn-outline-gold {
  display: inline-block;
  background: transparent !important;
  color: var(--color-gold) !important;
  border: 1px solid var(--color-gold) !important;
  padding: 12px 24px;
  border-radius: 2px;
  font-family: var(--font-trajan);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.25s ease;
}
.re-btn-outline-gold:hover {
  background: var(--color-gold) !important;
  color: #000000 !important;
}

@media (max-width: 900px) {
  .re-story-origins-section { grid-template-columns: 1fr; gap: 36px; }
  .re-story-pillars-grid { grid-template-columns: repeat(2, 1fr); gap: 18px; }
  .re-story-journey-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
}
@media (max-width: 600px) {
  .re-story-pillars-grid { grid-template-columns: 1fr; }
  .re-story-journey-grid { grid-template-columns: 1fr; }
  .re-story-page-wrapper { padding: 30px 16px 60px; }
  .re-story-studio-card { padding: 32px 18px; }
  .re-story-journey-section { padding: 36px 18px; }
}

/* ==========================================================================
   CONTACT PAGE DARK LUXURY STYLES (.re-contact-*)
   ========================================================================== */
.re-contact-page-wrapper { max-width: 1380px; margin: 0 auto; padding: 50px 24px 80px; box-sizing: border-box; }
.re-contact-hero { text-align: center; max-width: 860px; margin: 0 auto 50px auto; padding-bottom: 30px; border-bottom: 1px solid var(--color-border); }
.re-contact-title { font-family: var(--font-trajan) !important; font-size: clamp(2.2rem, 4vw, 3.2rem) !important; font-weight: 700 !important; color: #ffffff !important; margin: 0 0 16px 0 !important; letter-spacing: 0.04em !important; }
.re-contact-hero-sub { font-size: 1.1rem; color: #d4d4d8; max-width: 700px; margin: 0 auto; line-height: 1.7; }
.re-contact-inner-container { max-width: 1240px; margin: 0 auto; }
.re-contact-cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 60px; }
.re-contact-card { background: var(--color-surface-dark); border: 1px solid var(--color-border); border-radius: 4px; padding: 32px 24px; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.3s ease; }
.re-contact-card:hover { transform: translateY(-4px); border-color: var(--color-gold); box-shadow: 0 12px 28px rgba(0, 0, 0, 0.6); }
.re-contact-icon-badge { font-size: 32px; margin-bottom: 16px; }
.re-contact-card-title { font-family: var(--font-trajan) !important; font-size: 1.15rem !important; color: #ffffff !important; margin: 0 0 10px 0 !important; font-weight: 700 !important; }
.re-contact-card-desc { font-size: 13.5px; color: #a1a1aa; line-height: 1.6; margin: 0 0 16px 0; }
.re-contact-highlight { font-size: 17px; font-weight: 700; color: #ffffff; margin-bottom: 18px; }
.re-contact-highlight-email { font-size: 13.5px; font-weight: 600; color: var(--color-gold); margin-bottom: 18px; word-break: break-all; }
.re-contact-hours { font-size: 12.5px; font-weight: 600; color: #a1a1aa; margin-bottom: 18px; }
.re-contact-inquiry-container { background: var(--color-surface-dark); border: 1px solid var(--color-border); border-radius: 4px; padding: 50px 36px; margin-bottom: 60px; }
.re-inquiry-header { text-align: center; max-width: 680px; margin: 0 auto 36px auto; }
.re-inquiry-heading { font-family: var(--font-trajan) !important; font-size: clamp(1.8rem, 3vw, 2.3rem) !important; color: #ffffff !important; margin: 10px 0 12px 0 !important; font-weight: 700 !important; }
.re-inquiry-sub { font-size: 14.5px; color: #d4d4d8; line-height: 1.6; margin: 12px 0 0 0; }
.re-inquiry-form-card { max-width: 640px; margin: 0 auto; }
.re-form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 18px; }
.re-form-group { margin-bottom: 18px; }
.re-form-label { display: block; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--color-gold); margin-bottom: 8px; font-family: var(--font-trajan); }
.re-form-input, .re-form-select, .re-form-textarea { width: 100%; box-sizing: border-box; background: #0c0d0f; border: 1px solid var(--color-border); border-radius: 2px; padding: 13px 16px; font-size: 14px; color: #ffffff; }
.re-form-input:focus, .re-form-select:focus, .re-form-textarea:focus { border-color: var(--color-gold); outline: none; }
.re-contact-faq-section { margin-bottom: 60px; }
.re-faq-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.re-faq-card { background: var(--color-surface-dark); border: 1px solid var(--color-border-subtle); border-radius: 4px; padding: 26px 22px; }
.re-faq-card-title { font-family: var(--font-trajan) !important; font-size: 1rem !important; color: #ffffff !important; margin: 0 0 8px 0 !important; font-weight: 700 !important; }
.re-faq-card-desc { font-size: 13.5px; color: #a1a1aa; line-height: 1.6; margin: 0; }

@media (max-width: 900px) {
  .re-contact-cards-grid { grid-template-columns: repeat(2, 1fr); }
  .re-faq-grid { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .re-contact-cards-grid { grid-template-columns: 1fr; }
  .re-form-row-2 { grid-template-columns: 1fr; }
  .re-contact-inquiry-container { padding: 30px 18px; }
}

/* ==========================================================================
   POLICY PAGES DARK LUXURY STYLES (.re-policy-*)
   ========================================================================== */
.re-policy-page-wrapper { max-width: 1000px; margin: 0 auto; padding: 50px 24px 80px; box-sizing: border-box; }
.re-policy-hero { text-align: center; margin-bottom: 50px; padding-bottom: 30px; border-bottom: 1px solid var(--color-border); }
.re-policy-title { font-family: var(--font-trajan) !important; font-size: clamp(2rem, 3.5vw, 2.8rem) !important; color: #ffffff !important; margin: 0 0 14px 0 !important; font-weight: 700 !important; }
.re-policy-hero-sub { font-size: 1.05rem; color: #d4d4d8; line-height: 1.6; }
.re-policy-card { background: var(--color-surface-dark); border: 1px solid var(--color-border); border-radius: 4px; padding: 36px 32px; margin-bottom: 30px; }
.re-policy-heading { font-family: var(--font-trajan) !important; font-size: 1.25rem !important; color: #ffffff !important; margin: 0 0 16px 0 !important; font-weight: 700 !important; }
.re-policy-lead { font-size: 15px; color: #ffffff; line-height: 1.7; margin-bottom: 14px; font-weight: 600; }
.re-policy-text { font-size: 14.5px; color: #d4d4d8; line-height: 1.8; margin-bottom: 14px; }
.re-policy-list { list-style: square; padding-left: 20px; color: #d4d4d8; line-height: 1.8; font-size: 14.5px; }
.re-policy-atelier-box { background: #121316; border-left: 3px solid var(--color-gold); padding: 20px 24px; margin: 24px 0; border-radius: 0 4px 4px 0; }
.re-gold-link { color: var(--color-gold) !important; text-decoration: underline; }

/* ==========================================================================
   CUSTOM DIMENSIONS / BESPOKE PAGE (.re-bespoke-*)
   ========================================================================== */
.re-dedicated-bespoke-wrapper { max-width: 1200px; margin: 0 auto; padding: 50px 24px 80px; }
.re-bespoke-glass-panel { background: var(--color-surface-dark); border: 1px solid var(--color-border); border-radius: 4px; padding: 60px 40px; text-align: center; }
.re-panel-eyebrow { font-family: var(--font-trajan); font-size: 0.74rem; letter-spacing: 0.18em; color: var(--color-gold); text-transform: uppercase; margin-bottom: 14px; }
.re-bespoke-heading { font-family: var(--font-trajan) !important; font-size: clamp(2rem, 3.5vw, 3rem) !important; color: #ffffff !important; margin: 0 0 18px 0 !important; font-weight: 700 !important; }
.re-gold-line { width: 50px; height: 2px; background: var(--color-gold); margin: 0 auto 24px auto; }
.re-bespoke-copy { font-size: 16px; line-height: 1.8; color: #d4d4d8; max-width: 780px; margin: 0 auto 36px auto; }
.re-gold-text-highlight { color: var(--color-gold); font-weight: 600; }
.re-bespoke-cta-wrap { display: flex; justify-content: center; }
.re-bespoke-pill-btn { display: inline-flex; align-items: center; gap: 14px; background: var(--color-gold); color: #0f1012 !important; padding: 14px 28px; border-radius: 30px; font-family: var(--font-trajan); font-size: 0.82rem; font-weight: 700; letter-spacing: 0.12em; text-decoration: none; text-transform: uppercase; transition: all 0.25s ease; }
.re-bespoke-pill-btn:hover { background: var(--color-gold-hover); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(197, 168, 128, 0.4); }
.re-pill-divider { color: rgba(15, 16, 18, 0.4); }

/* ==========================================================================
   WOOCOMMERCE ACCOUNT & SEARCH RESULT STYLES
   ========================================================================== */
.woocommerce-account .woocommerce, .woocommerce-MyAccount-content, .woocommerce-MyAccount-navigation {
  background: var(--color-bg-dark) !important;
  color: var(--color-text-light) !important;
}
.woocommerce-account .entry-content {
  max-width: 1000px;
  margin: 40px auto 80px auto;
  padding: 0 20px;
}
.woocommerce-MyAccount-navigation ul {
  list-style: none;
  padding: 0;
  margin: 0 0 30px 0;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.woocommerce-MyAccount-navigation li a {
  font-family: var(--font-trajan);
  font-size: 0.82rem;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  text-decoration: none;
  padding: 8px 0;
  display: inline-block;
  transition: color 0.2s ease;
}
.woocommerce-MyAccount-navigation li.is-active a, .woocommerce-MyAccount-navigation li a:hover {
  color: var(--color-gold) !important;
}
.woocommerce-form-login, .woocommerce-form-register, .woocommerce-EditAccountForm {
  background: var(--color-surface-dark) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: 4px;
  padding: 30px 24px !important;
  max-width: 500px;
  margin: 0 auto 30px auto;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
.woocommerce-form-login label, .woocommerce-form-register label {
  color: var(--color-gold) !important;
  font-family: var(--font-trajan);
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 6px;
  display: block;
}
.woocommerce-form-login input.input-text, .woocommerce-form-register input.input-text {
  background: #090a0c !important;
  border: 1px solid var(--color-border) !important;
  color: #ffffff !important;
  padding: 10px 14px !important;
  border-radius: 2px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 16px;
}
.woocommerce-button.button, button.woocommerce-form-login__submit, button.woocommerce-form-register__submit {
  background: var(--color-gold) !important;
  color: #0f1012 !important;
  font-family: var(--font-trajan) !important;
  font-weight: 700 !important;
  letter-spacing: 0.12em !important;
  border: none !important;
  padding: 12px 24px !important;
  border-radius: 2px !important;
  text-transform: uppercase !important;
  cursor: pointer;
  transition: all 0.2s ease;
}
.woocommerce-button.button:hover, button.woocommerce-form-login__submit:hover, button.woocommerce-form-register__submit:hover {
  background: var(--color-gold-hover) !important;
}

/* Search results product styling */
.search-results .woocommerce ul.products, .woocommerce-page.search ul.products {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 24px !important;
  max-width: 1380px !important;
  margin: 30px auto !important;
  padding: 0 20px !important;
  list-style: none !important;
}
@media (max-width: 900px) {
  .search-results .woocommerce ul.products, .woocommerce-page.search ul.products {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
@media (max-width: 500px) {
  .search-results .woocommerce ul.products, .woocommerce-page.search ul.products {
    grid-template-columns: 1fr !important;
  }
}
.search-results .woocommerce ul.products li.product, .woocommerce-page.search ul.products li.product {
  background: var(--color-surface-dark) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: 4px;
  padding: 16px !important;
  text-align: center;
}
.search-results .woocommerce ul.products li.product h2, .woocommerce-page.search ul.products li.product .woocommerce-loop-product__title {
  color: #ffffff !important;
  font-family: var(--font-trajan) !important;
  font-size: 0.95rem !important;
  margin: 12px 0 8px !important;
}
.search-results .woocommerce ul.products li.product .price, .woocommerce-page.search ul.products li.product .price {
  color: var(--color-gold) !important;
  font-family: var(--font-trajan) !important;
  font-weight: 700;
}
.search-results .woocommerce ul.products li.product .button, .woocommerce-page.search ul.products li.product .button {
  background: transparent !important;
  border: 1px solid var(--color-gold) !important;
  color: var(--color-gold) !important;
  font-family: var(--font-trajan) !important;
  font-size: 0.72rem !important;
  letter-spacing: 0.1em !important;
  padding: 8px 14px !important;
  border-radius: 2px !important;
  text-transform: uppercase !important;
}
.search-results .woocommerce ul.products li.product .button:hover, .woocommerce-page.search ul.products li.product .button:hover {
  background: var(--color-gold) !important;
  color: #000000 !important;
}

/* ==========================================================================
   UNIFIED LUXURY FOOTER
   ========================================================================== */
.site-footer, .re-unified-footer-container {
  background: #08080a !important;
  border-top: 1px solid var(--color-border) !important;
  padding: 60px 24px 30px !important;
  color: var(--color-text-muted) !important;
  font-family: var(--font-body);
  width: 100%;
  box-sizing: border-box;
}
.footer-inner, .re-footer-inner {
  max-width: 1380px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
  gap: 40px;
}
@media (max-width: 900px) {
  .footer-inner, .re-footer-inner { grid-template-columns: repeat(2, 1fr); gap: 30px; }
}
@media (max-width: 600px) {
  .footer-inner, .re-footer-inner { grid-template-columns: 1fr; gap: 28px; }
}
.footer-logo {
  font-family: var(--font-trajan);
  font-size: 1.15rem;
  letter-spacing: 0.14em;
  color: #ffffff;
  margin-bottom: 16px;
}
.footer-desc {
  font-size: 0.85rem;
  line-height: 1.7;
  color: var(--color-text-muted);
}
.footer-heading {
  font-family: var(--font-trajan);
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  color: var(--color-gold);
  margin-bottom: 18px;
  text-transform: uppercase;
}
.footer-links a {
  display: block;
  font-size: 0.85rem;
  color: #d4d4d8;
  margin-bottom: 10px;
  transition: color 0.2s ease;
  text-decoration: none;
}
.footer-links a:hover {
  color: var(--color-gold);
}
.footer-bottom, .re-footer-bottom {
  max-width: 1380px;
  margin: 40px auto 0;
  padding-top: 24px;
  border-top: 1px solid var(--color-border-subtle);
  text-align: center;
  font-size: 0.78rem;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
}
</style>
`;

// 2. MASTER WPCODE GLOBAL FOOTER JS
const MASTER_WPCODE_FOOTER_JS = `
<script id="re-global-scripts">
(function() {
  // Global search toggle function
  window.reToggleSearch = function(e) {
    if (e) e.stopPropagation();
    var s = document.getElementById('reSearchOverlayBar');
    var d = document.getElementById('reMobileDrawer');
    var b = document.getElementById('reHamburgerBtn');
    if (!s) return;
    var isOpen = s.style.display === 'none' || !s.style.display;
    s.style.display = isOpen ? 'block' : 'none';
    if (isOpen) {
      if (d) { d.style.display = 'none'; d.classList.remove('is-open'); }
      if (b) b.classList.remove('is-active');
      var inp = s.querySelector('.re-search-field');
      if (inp) {
        setTimeout(function() { inp.focus(); }, 60);
      }
    }
  };

  // Global mobile drawer toggle function
  window.reToggleDrawer = function(e) {
    if (e) e.stopPropagation();
    var d = document.getElementById('reMobileDrawer');
    var b = document.getElementById('reHamburgerBtn');
    var s = document.getElementById('reSearchOverlayBar');
    if (!d) return;
    var isOpen = d.style.display === 'none' || !d.style.display;
    d.style.display = isOpen ? 'block' : 'none';
    d.classList.toggle('is-open', isOpen);
    if (b) b.classList.toggle('is-active', isOpen);
    if (isOpen && s) {
      s.style.display = 'none';
    }
  };

  // Outside-click and Escape key handler
  document.addEventListener('click', function(e) {
    var d = document.getElementById('reMobileDrawer');
    var b = document.getElementById('reHamburgerBtn');
    if (d && (d.style.display === 'block' || d.classList.contains('is-open'))) {
      if (!d.contains(e.target) && (!b || !b.contains(e.target))) {
        d.style.display = 'none';
        d.classList.remove('is-open');
        if (b) b.classList.remove('is-active');
      }
    }

    var s = document.getElementById('reSearchOverlayBar');
    var searchBtn = document.getElementById('reSearchToggleBtn');
    if (s && s.style.display === 'block') {
      if (!s.contains(e.target) && (!searchBtn || !searchBtn.contains(e.target))) {
        s.style.display = 'none';
      }
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      var s = document.getElementById('reSearchOverlayBar');
      if (s) s.style.display = 'none';
      var d = document.getElementById('reMobileDrawer');
      if (d) { d.style.display = 'none'; d.classList.remove('is-open'); }
      var b = document.getElementById('reHamburgerBtn');
      if (b) b.classList.remove('is-active');
    }
  });

  // Hero carousel auto slider handler
  function initHeroSlider() {
    var slides = document.querySelectorAll('.re-carousel-slide');
    var dots = document.querySelectorAll('.re-carousel-dot');
    var prevBtn = document.getElementById('rePrevBtn');
    var nextBtn = document.getElementById('reNextBtn');
    if (!slides.length) return;

    var currentIndex = 0;
    var timer = null;

    function showSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentIndex = index;

      for (var i = 0; i < slides.length; i++) {
        slides[i].classList.toggle('active', i === currentIndex);
      }
      for (var j = 0; j < dots.length; j++) {
        dots[j].classList.toggle('active', j === currentIndex);
      }
    }

    function nextSlide() { showSlide(currentIndex + 1); }
    function prevSlide() { showSlide(currentIndex - 1); }
    function startAutoSlide() {
      stopAutoSlide();
      timer = setInterval(nextSlide, 4500);
    }
    function stopAutoSlide() {
      if (timer) clearInterval(timer);
    }

    if (nextBtn) {
      nextBtn.onclick = function(e) {
        e.preventDefault();
        nextSlide();
        startAutoSlide();
      };
    }
    if (prevBtn) {
      prevBtn.onclick = function(e) {
        e.preventDefault();
        prevSlide();
        startAutoSlide();
      };
    }
    dots.forEach(function(dot, idx) {
      dot.onclick = function(e) {
        e.preventDefault();
        showSlide(idx);
        startAutoSlide();
      };
    });

    startAutoSlide();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroSlider);
  } else {
    initHeroSlider();
  }
})();
</script>
`;

// 3. UPDATED HEADER ROW INNER HTML TO INJECT ACROSS ALL PAGES
const NEW_HEADER_ROW_INNER = `    <div class="re-header-row-inner">
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
      <a href="https://reflectionelite.com/" class="re-brand-center">
        <img decoding="async" src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/Logo-Reflection-e1777369196767-1024x186.png" alt="Reflection Elite" class="re-main-logo-img">
      </a>
      <div class="re-header-right-actions">
        <a href="https://reflectionelite.com/my-account/" class="re-header-icon-btn re-account-link" aria-label="Customer Account">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </a>
        <a href="https://reflectionelite.com/cart/" class="re-cart-link" aria-label="Shopping Cart">
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
        <form role="search" method="get" class="re-search-form" action="https://reflectionelite.com/">
          <span class="re-search-form-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
          <input type="search" class="re-search-field" placeholder="Search bespoke mirrors, venetian, collections..." value="" name="s" autocomplete="off" />
          <input type="hidden" name="post_type" value="product" />
          <button type="submit" class="re-search-submit-btn">SEARCH</button>
          <button type="button" class="re-search-close-btn" aria-label="Close Search" onclick="document.getElementById('reSearchOverlayBar').style.display='none';">✕</button>
        </form>
      </div>
    </div>`;

async function updateWpCode(siteUrl, cookies) {
  console.log('--- 1. Updating WPCode with Master Luxury System (All Pages Covered) ---');
  const res = await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { Cookie: cookies }
  });
  const html = await res.text();
  const nonceMatch = html.match(/id="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i) 
                  || html.match(/name="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i);
  if (!nonceMatch) throw new Error('Could not find nonce on WPCode page');
  const nonce = nonceMatch[1];

  const formBody = new URLSearchParams();
  formBody.append('insert-headers-and-footers_nonce', nonce);
  formBody.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-headers-footers');
  formBody.append('ihaf_insert_header', MASTER_WPCODE_HEADER_CSS.trim());
  formBody.append('ihaf_insert_body', '');
  formBody.append('ihaf_insert_footer', MASTER_WPCODE_FOOTER_JS.trim());

  const saveRes = await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookies
    },
    body: formBody.toString(),
    redirect: 'manual'
  });

  console.log(`✓ WPCode master header and footer updated (HTTP ${saveRes.status})`);
}

async function updatePageHeader(siteUrl, cookies, wpJsonNonce, pageId, slug) {
  const pageRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/${pageId}?context=edit`, {
    headers: {
      'Cookie': cookies,
      'X-WP-Nonce': wpJsonNonce
    }
  });
  const pageData = await pageRes.json();
  let rawContent = pageData.content.raw || pageData.content.rendered;

  // Check if header exists
  if (!rawContent.includes('re-unified-header-container')) {
    console.log(`  Page ${pageId} (${slug}) does not use re-unified-header-container. Skipping header replace.`);
    return;
  }

  // Check if already updated with search & account icons
  if (rawContent.includes('re-search-toggle-btn') && rawContent.includes('re-account-link')) {
    console.log(`  Page ${pageId} (${slug}) already has new search & account icons.`);
    return;
  }

  // Regex to match the old <div class="re-header-row-inner">...</div>
  const oldInnerRegex = /<div class="re-header-row-inner">[\s\S]*?<\/div>/i;
  if (!oldInnerRegex.test(rawContent)) {
    console.warn(`  Warning: Could not match re-header-row-inner on Page ${pageId} (${slug})`);
    return;
  }

  // Replace old inner with new inner + search bar
  const updatedContent = rawContent.replace(oldInnerRegex, NEW_HEADER_ROW_INNER);

  // Safety check: ensure no <style> tags were accidentally introduced
  if (/<style/i.test(updatedContent)) {
    throw new Error(`CRITICAL INVARIANT VIOLATION: <style> tag found in Page ${pageId} content! Aborting.`);
  }

  const updateRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/${pageId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies,
      'X-WP-Nonce': wpJsonNonce
    },
    body: JSON.stringify({
      content: updatedContent
    })
  });

  if (!updateRes.ok) {
    const errText = await updateRes.text();
    throw new Error(`Failed to update page ${pageId}: ${errText.slice(0, 300)}`);
  }

  console.log(`✓ Page ${pageId} (${slug}) header updated with Search & Account icons.`);
}

async function purgeCache(siteUrl, cookies, nonce) {
  console.log('\n--- 3. Purging Hostinger Server & Edge Cache ---');
  const res = await fetch(`${siteUrl}/wp-json/hostinger-tools-plugin/v1/clear-cache`, {
    method: 'DELETE',
    headers: {
      'Cookie': cookies,
      'X-WP-Nonce': nonce
    }
  });

  if (res.ok) {
    const data = await res.json();
    console.log('✓ Hostinger cache cleared:', data);
  } else {
    const text = await res.text();
    console.warn(`Cache clear returned HTTP ${res.status}:`, text);
  }
}

async function main() {
  console.log('======================================================================');
  console.log('DEPLOYING SEARCH & ACCOUNT ICONS + MOBILE OVERFLOW & FRAMING FIXES');
  console.log('Site: ' + PROD_URL);
  console.log('======================================================================\n');

  const { siteUrl, cookies, nonce } = await getProdAuth();
  console.log('✓ Authenticated as admin on', siteUrl);

  // 1. Update WPCode Header CSS & Footer JS
  await updateWpCode(siteUrl, cookies);

  // 2. Update Header markup on all key pages
  console.log('\n--- 2. Updating Header Markup with Search & Account Icons Across Pages ---');
  const targetPages = [
    { id: 68, slug: 'home' },
    { id: 6, slug: 'shop' },
    { id: 50, slug: 'about-us' },
    { id: 52, slug: 'contact' },
    { id: 120, slug: 'custom-dimensions' },
    { id: 103, slug: 'refund_returns-2' },
    { id: 102, slug: 'privacy-policy-2' },
    { id: 7, slug: 'cart' },
    { id: 8, slug: 'checkout' }
  ];

  for (const p of targetPages) {
    await updatePageHeader(siteUrl, cookies, nonce, p.id, p.slug);
  }

  // 3. Purge Hostinger cache
  await purgeCache(siteUrl, cookies, nonce);

  console.log('\n======================================================================');
  console.log('✓ ALL MASTER FIXES AND HEADER FEATURES DEPLOYED SUCCESSFULLY!');
  console.log('======================================================================');
}

main().catch(err => {
  console.error('DEPLOYMENT FAILED:', err);
  process.exit(1);
});
