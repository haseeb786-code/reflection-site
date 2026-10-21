import fs from 'fs';
import path from 'path';
import { getProdAuth } from './prod_auth_helper.js';
import { getReUnifiedHeader } from './re_header_system.js';

const PROD_URL = 'https://reflectionelite.com';

const MASTER_WPCODE_HEADER_CSS = `
<!-- Google Fonts & Trajan Pro -->
<link rel="stylesheet" href="https://fonts.cdnfonts.com/css/trajan-pro">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap" rel="stylesheet">

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

/* CRITICAL: On Shop Page, hide WooCommerce's native archive product loop and ordering/counts so only our 7 curated cards in .catalog-grid-4 show! */
.woocommerce-shop ul.products,
.woocommerce-shop .woocommerce-result-count,
.woocommerce-shop .woocommerce-ordering,
.woocommerce-shop .ast-woocommerce-container > ul.products,
.post-type-archive-product ul.products,
.post-type-archive-product .woocommerce-result-count,
.post-type-archive-product .woocommerce-ordering {
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
.re-hamburger-btn { background:transparent; border:none; cursor:pointer; padding:8px; display:flex; flex-direction:column; justify-content:center; gap:6px; min-width:44px; min-height:44px; z-index:100001; box-sizing:border-box; }
.re-bar { display:block; width:26px; height:2px; background:#ffffff; transition:transform 0.25s ease,opacity 0.25s ease; }
.re-hamburger-btn.is-active .re-bar:nth-child(1) { transform:translateY(8px) rotate(45deg); }
.re-hamburger-btn.is-active .re-bar:nth-child(2) { opacity:0; }
.re-hamburger-btn.is-active .re-bar:nth-child(3) { transform:translateY(-8px) rotate(-45deg); }
.re-brand-center { display:flex; align-items:center; justify-content:center; text-decoration:none; }
.re-main-logo-img { height:54px; width:auto; max-width:320px; display:block; object-fit:contain; }
.re-cart-link { display:flex; align-items:center; gap:8px; color:#ffffff; text-decoration:none; font-family:var(--font-trajan); font-size:13px; font-weight:700; letter-spacing:0.12em; transition:color 0.2s ease; min-height:44px; padding:4px 8px; box-sizing:border-box; }
.re-cart-link:hover { color:var(--color-gold); }
.re-cart-icon { display:flex; align-items:center; }
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
  .re-main-logo-img { height:38px !important; max-width:210px !important; }
  .re-cart-text { display:none !important; }
  .re-main-header-row { padding:8px 16px !important; }
  .re-announcement-strip { font-size:0.62rem !important; padding:7px 10px !important; letter-spacing:0.08em !important; line-height:1.4 !important; }
  .re-marquee-wrapper { height:26px !important; }
  .re-marquee-item { font-size:10px !important; padding:0 18px !important; }
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
.card-btn {
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
.card-btn:hover {
  background: var(--color-gold);
  color: #000000;
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
  margin-bottom: 14px;
  text-transform: uppercase;
}
.re-story-title {
  font-family: var(--font-trajan) !important;
  font-size: clamp(2.2rem, 4vw, 3.2rem) !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  margin: 0 0 18px 0 !important;
  line-height: 1.2 !important;
  letter-spacing: 0.04em !important;
}
.re-serif-italic {
  font-style: italic;
  font-weight: 400;
  color: var(--color-gold);
}
.re-story-hero-sub {
  font-size: 1.1rem !important;
  line-height: 1.8 !important;
  color: #d4d4d8 !important;
  margin: 0 auto !important;
  max-width: 740px !important;
}
.re-story-inner-container {
  max-width: 1280px;
  margin: 0 auto;
}
.re-story-origins-section {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 50px;
  align-items: center;
  margin-bottom: 80px;
}
.re-eyebrow-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.re-eyebrow-line {
  display: inline-block;
  width: 32px;
  height: 1.5px;
  background: var(--color-gold);
}
.re-eyebrow {
  font-family: var(--font-trajan);
  font-size: 0.74rem;
  letter-spacing: 0.16em;
  color: var(--color-gold);
  text-transform: uppercase;
}
.re-story-section-heading {
  font-family: var(--font-trajan) !important;
  font-size: clamp(1.8rem, 3vw, 2.4rem) !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  margin: 0 0 20px 0 !important;
  line-height: 1.3 !important;
  letter-spacing: 0.04em !important;
}
.re-story-paragraph {
  font-size: 15px !important;
  line-height: 1.85 !important;
  color: #d4d4d8 !important;
  margin-bottom: 18px !important;
}
.re-dark-accent {
  color: #ffffff !important;
  font-weight: 700 !important;
}
.re-story-cta-group {
  display: flex;
  gap: 18px;
  align-items: center;
  margin-top: 32px;
  flex-wrap: wrap;
}
.re-btn-primary {
  display: inline-block;
  background: var(--color-gold) !important;
  color: #0f1012 !important;
  font-family: var(--font-trajan);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  padding: 12px 26px;
  border-radius: 2px;
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.25s ease;
}
.re-btn-primary:hover {
  background: var(--color-gold-hover) !important;
  color: #000000 !important;
  box-shadow: 0 6px 20px rgba(197, 168, 128, 0.4);
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
</style>
`;

const MASTER_WPCODE_FOOTER_JS = `
<script id="re-global-scripts">
(function() {
  document.addEventListener('click', function(e) {
    var d = document.getElementById('reMobileDrawer');
    var b = document.getElementById('reHamburgerBtn');
    if (d && (d.style.display === 'block' || d.classList.contains('is-open'))) {
      if (!d.contains(e.target) && !b.contains(e.target)) {
        d.style.display = 'none';
        d.classList.remove('is-open');
        if (b) b.classList.remove('is-active');
      }
    }
  });
})();
</script>
`;

const CORE_PAGES = [
  { id: 68, slug: 'home', active: 'home', title: 'Reflection Elite' },
  { id: 6, slug: 'shop', active: 'shop', title: 'Shop' },
  { id: 7, slug: 'cart', active: 'cart', title: 'Cart', isShortcode: true },
  { id: 8, slug: 'checkout', active: 'cart', title: 'Checkout', isShortcode: true },
  { id: 50, slug: 'about-us', active: 'about', title: 'Our Story' },
  { id: 52, slug: 'contact', active: 'contact', title: 'Contact' },
  { id: 102, slug: 'privacy-policy-2', active: 'policies', title: 'Privacy Policy' },
  { id: 103, slug: 'refund_returns-2', active: 'policies', title: 'Refund & Returns Policy' },
  { id: 120, slug: 'custom-dimensions', active: 'survey', title: 'Custom Dimensions & Bespoke Design' }
];

async function updateWpCode(siteUrl, cookies) {
  console.log('--- 1. Updating WPCode with Master Dark Luxury System & Global Scripts ---');
  const res = await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { Cookie: cookies }
  });
  const html = await res.text();
  const nonceMatch = html.match(/id="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i) 
                  || html.match(/name="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i);
  if (!nonceMatch) {
    throw new Error('Could not find nonce on WPCode page');
  }
  const nonce = nonceMatch[1];
  console.log('✓ Found WPCode Nonce:', nonce);

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

async function cleanAndUpdatePages(siteUrl, cookies, nonce) {
  console.log('\n--- 2. Cleaning and Updating All Core Pages (Zero Raw Code Leaks) ---');

  for (const pageInfo of CORE_PAGES) {
    console.log(`\nProcessing Page ${pageInfo.id} [${pageInfo.slug}] - "${pageInfo.title}"...`);

    const res = await fetch(`${siteUrl}/wp-json/wp/v2/pages/${pageInfo.id}?context=edit`, {
      headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch page ${pageInfo.id}: HTTP ${res.status}`);
    }
    const pageData = await res.json();
    let content = pageData.content?.raw || '';

    // 1. Strip ALL <style> tags completely from post content
    content = content.replace(/<style[\s\S]*?<\/style>/gi, '');

    // 2. Strip ALL <script> tags completely from post content
    content = content.replace(/<script[\s\S]*?<\/script>/gi, '');

    // 3. Strip any existing header HTML structures
    content = content.replace(/<!--\s*REPLICATED EXACT HEADER SYSTEM[\s\S]*?<\/header>/gi, '');
    content = content.replace(/<header class="re-unified-header-container"[\s\S]*?<\/header>/gi, '');
    content = content.replace(/<div class="announcement-bar">[\s\S]*?<\/header>/gi, '');
    content = content.replace(/<header class="site-header">[\s\S]*?<\/header>/gi, '');
    content = content.replace(/<div class="announcement-bar">[\s\S]*?<\/div>/gi, '');

    // 4. Strip outer wp:html block wrappers and outer te-live-page
    content = content.replace(/<!-- \/?wp:html -->/gi, '').trim();
    content = content.replace(/^<div class="te-live-page">/i, '').trim();
    if (content.endsWith('</div>')) {
      content = content.slice(0, -6).trim();
    }

    // 5. Generate clean pure HTML header
    const cleanHeaderHtml = getReUnifiedHeader(siteUrl, pageInfo.active);

    // 6. Assemble clean page content
    let finalContent = '';
    if (pageInfo.isShortcode) {
      const shortcodeName = pageInfo.slug === 'cart' ? 'woocommerce_cart' : 'woocommerce_checkout';
      if (!content.includes(`[${shortcodeName}]`)) {
        console.warn(`[WARNING] Re-injecting missing shortcode [${shortcodeName}]`);
        content += `\n<div class="te-wc-container">\n[${shortcodeName}]\n</div>`;
      }
      finalContent = `<div class="te-live-page">\n${cleanHeaderHtml}\n${content}\n</div>`;
    } else {
      finalContent = `<div class="te-live-page">\n${cleanHeaderHtml}\n${content}\n</div>`;
    }

    // Wrap in standard block comment to protect against unwanted wpautop
    const finalPayload = `<!-- wp:html -->\n${finalContent}\n<!-- /wp:html -->`;

    const updateRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/${pageInfo.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
        'X-WP-Nonce': nonce
      },
      body: JSON.stringify({
        content: finalPayload,
        meta: {
          'site-sidebar-layout': 'no-sidebar',
          'site-content-layout': 'page-builder',
          'ast-site-content-layout': 'full-width-container',
          'ast-global-header-display': 'disabled',
          'ast-main-header-display': 'disabled',
          'ast-hfb-above-header-display': 'disabled',
          'ast-hfb-below-header-display': 'disabled',
          'site-post-title': 'disabled',
          'footer-sml-layout': 'disabled',
          'theme-transparent-header-meta': 'disabled'
        }
      })
    });

    if (!updateRes.ok) {
      const err = await updateRes.text();
      throw new Error(`Failed to update page ${pageInfo.id}: HTTP ${updateRes.status} - ${err.slice(0, 300)}`);
    }

    const updatedData = await updateRes.json();
    console.log(`✓ Page ${pageInfo.id} [${pageInfo.slug}] updated successfully (${updatedData.content?.raw?.length || 0} bytes)! Zero <style> and Zero <script> in body.`);
  }
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
    console.log('✓ Hostinger cache successfully cleared:', data);
  } else {
    const text = await res.text();
    console.warn(`Cache clear returned HTTP ${res.status}:`, text);
  }
}

async function main() {
  console.log('======================================================================');
  console.log('DEPLOYING PRODUCTION COMPLETE FIXES: SHOP & ABOUT US & GLOBAL SYSTEMS');
  console.log('Target: ' + PROD_URL);
  console.log('======================================================================\n');

  const { siteUrl, cookies, nonce } = await getProdAuth();
  console.log('Authenticated to', siteUrl);

  await updateWpCode(siteUrl, cookies);
  await cleanAndUpdatePages(siteUrl, cookies, nonce);
  await purgeCache(siteUrl, cookies, nonce);

  console.log('\n======================================================================');
  console.log('✓ ALL UPDATES DEPLOYED AND CACHE PURGED SUCCESSFULLY!');
  console.log('======================================================================');
}

main().catch(err => {
  console.error('DEPLOYMENT FAILED:', err);
  process.exit(1);
});
