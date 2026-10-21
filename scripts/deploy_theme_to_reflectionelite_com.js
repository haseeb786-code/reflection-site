import fs from 'fs';
import path from 'path';
import { getProdAuth } from './prod_auth_helper.js';

// 1. Production Site Configuration
const PROD_URL = 'https://reflectionelite.com';
const BACKUP_DIR = path.resolve('backups/production_com_pre_swap_20261018');

// 2. The 7 EXACT FROZEN REAL PRODUCTS from reflectionelite.com
const REAL_PRODUCTS = [
  {
    id: 17,
    slug: 'antique-venetian-cushion',
    title: 'ANTIQUE VENETIAN CUSHION',
    price: '₹81,500',
    category: 'Venetian Mirror',
    img: 'https://reflectionelite.com/wp-content/uploads/2026/10/1771694577552.jpg',
    link: '/product/antique-venetian-cushion/'
  },
  {
    id: 30,
    slug: 'modern-victorian',
    title: 'MODERN VICTORIAN',
    price: '₹58,787',
    category: 'Venetian Mirror',
    img: 'https://reflectionelite.com/wp-content/uploads/2026/10/20260222_002716-scaled.jpg',
    link: '/product/modern-victorian/'
  },
  {
    id: 51,
    slug: 'silver-crown-framed',
    title: 'SILVER CROWN FRAMED',
    price: '₹35,900',
    category: 'Venetian Mirror',
    img: 'https://reflectionelite.com/wp-content/uploads/2026/10/20260221_235950-scaled.jpg',
    link: '/product/silver-crown-framed/'
  },
  {
    id: 45,
    slug: 'rococo-floral',
    title: 'ROCOCO FLORAL',
    price: '₹14,000',
    category: 'Venetian Mirror',
    img: 'https://reflectionelite.com/wp-content/uploads/2026/10/20260222_092621-scaled.jpg',
    link: '/product/rococo-floral/'
  },
  {
    id: 36,
    slug: 'mosaic-mirror-art',
    title: 'MOSAIC MIRROR ART',
    price: '₹2,500 – ₹7,500',
    category: 'Contemporary',
    img: 'https://reflectionelite.com/wp-content/uploads/2026/10/20260305_220825.jpg',
    link: '/product/mosaic-mirror-art/'
  },
  {
    id: 23,
    slug: 'customised-mirror',
    title: 'CUSTOMISED MIRROR',
    price: '₹100',
    category: 'Custom',
    img: 'https://reflectionelite.com/wp-content/uploads/2026/10/WhatsAppImage2026-07-13at5.15.04PM.jpg',
    link: '/product/customised-mirror/'
  },
  {
    id: 41,
    slug: 'premium-upholstered-frame',
    title: 'PREMIUM UPHOLSTERED FRAME',
    price: 'Price on Request',
    category: 'Statement Piece',
    img: 'https://reflectionelite.com/wp-content/uploads/2026/10/WhatsAppImage2026-09-18at3.57.23PM.jpg',
    link: '/product/premium-upholstered-frame/'
  }
];

// 3. Global "Trending Era" Theme CSS
const THEME_CSS = `
@import url('https://fonts.cdnfonts.com/css/trajan-pro');

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
  --color-gold: #c5a880;
  --color-gold-hover: #dfc299;
  --color-border: rgba(197, 168, 128, 0.22);
  --color-border-subtle: rgba(255, 255, 255, 0.08);
  --color-text-light: #f5f5f7;
  --color-text-muted: #a1a1aa;
  --site-max-width: 1380px;
}

/* Force full-bleed obsidian background on Astra root elements */
html, body, #page, .site, #primary, #content, .ast-container, .entry-content, .ast-separate-container, .ast-plain-container, .te-live-page {
  background-color: var(--color-bg-dark) !important;
  background: var(--color-bg-dark) !important;
  color: var(--color-text-light) !important;
  margin: 0 !important;
  padding: 0 !important;
  max-width: 100% !important;
  width: 100% !important;
  border: none !important;
}

/* Suppress all default Astra theme chrome and duplicate bars */
#masthead, #colophon, .ast-site-header, .ast-above-header-wrap, .ast-above-header, .ast-below-header-wrap, .ast-below-header, .site-below-footer-wrap, .site-primary-footer-wrap, .ast-breadcrumbs-wrapper, .entry-title, .ast-single-post-order, .ast-banner-layout-1, .ast-header-break-point .main-header-bar-wrap {
  display: none !important;
}

h1, h2, h3, h4, .trajan-text, .nav-link, .btn-action, .price-display, .re-story-title, .re-contact-title, .re-policy-title {
  font-family: var(--font-trajan) !important;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

a {
  color: inherit;
  text-decoration: none;
}

/* HEADER & ANNOUNCEMENT BAR */
.announcement-bar {
  background: #090a0c;
  border-bottom: 1px solid var(--color-border);
  padding: 9px 16px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-align: center;
  color: var(--color-gold);
  text-transform: uppercase;
}
.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(15, 16, 18, 0.95);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--color-border);
  padding: 16px 32px;
}
.header-inner {
  max-width: var(--site-max-width);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.header-logo img {
  height: 42px;
  width: auto;
  display: block;
}
.main-nav {
  display: flex;
  align-items: center;
  gap: 28px;
}
.nav-link {
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  color: var(--color-text-light);
  transition: color 0.25s ease;
  padding: 4px 0;
}
.nav-link:hover, .nav-link.active {
  color: var(--color-gold) !important;
}
.header-quote-btn {
  font-family: var(--font-trajan) !important;
  background: transparent;
  color: var(--color-gold);
  border: 1px solid var(--color-gold);
  padding: 9px 20px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  border-radius: 2px;
  transition: all 0.25s ease;
  white-space: nowrap;
}
.header-quote-btn:hover {
  background: var(--color-gold);
  color: #000 !important;
}

/* BANNER & HERO SECTIONS */
.shop-hero {
  position: relative;
  width: 100%;
  min-height: 42vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-image: url('https://reflectionelite.com/wp-content/uploads/2026/10/1771694577552.jpg');
  background-size: cover;
  background-position: center;
}
.shop-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15,16,18,0.7) 0%, rgba(15,16,18,0.95) 100%);
}
.shop-hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 40px 20px;
}
.hero-tagline {
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  color: var(--color-gold);
  margin-bottom: 12px;
  font-weight: 600;
}
.shop-hero-content h1 {
  font-size: 2.8rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.15;
  margin-bottom: 14px;
}
.shop-hero-content p {
  font-size: 1rem;
  color: var(--color-text-muted);
  max-width: 600px;
  margin: 0 auto;
}

/* CATALOG GRID */
.catalog-section {
  padding: 50px 24px 80px;
  max-width: var(--site-max-width);
  margin: 0 auto;
}
.catalog-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 24px;
  margin-bottom: 32px;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.85rem;
  color: var(--color-text-muted);
}
.catalog-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
}
@media (max-width: 1100px) {
  .catalog-grid-4 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 650px) {
  .catalog-grid-4 { grid-template-columns: 1fr; }
}

.luxury-card {
  background: var(--color-surface-dark);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
.luxury-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-gold);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
}
.card-media {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: #000;
}
.card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.luxury-card:hover .card-media img {
  transform: scale(1.05);
}
.card-info {
  padding: 22px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.card-category {
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: var(--color-gold);
  text-transform: uppercase;
  margin-bottom: 6px;
  font-weight: 600;
}
.card-title {
  font-family: var(--font-trajan);
  font-size: 1.05rem;
  color: #ffffff;
  line-height: 1.35;
  margin-bottom: 12px;
  min-height: 2.7em;
}
.card-price-row {
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid var(--color-border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.card-price {
  font-family: var(--font-trajan);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-gold);
}
.btn-view {
  font-family: var(--font-trajan);
  background: transparent;
  color: #ffffff;
  border: 1px solid var(--color-border);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  font-weight: 700;
  padding: 8px 14px;
  border-radius: 2px;
  transition: all 0.25s ease;
}
.btn-view:hover {
  background: var(--color-gold);
  border-color: var(--color-gold);
  color: #0f1012 !important;
}

/* VALUE PROPOSITION PILLARS */
.pillars-section {
  background: #090a0c;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  padding: 60px 24px;
}
.pillars-grid {
  max-width: var(--site-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}
@media (max-width: 900px) {
  .pillars-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 500px) {
  .pillars-grid { grid-template-columns: 1fr; }
}
.pillar-card {
  text-align: center;
  padding: 20px 16px;
}
.pillar-icon {
  font-size: 1.8rem;
  color: var(--color-gold);
  margin-bottom: 14px;
}
.pillar-title {
  font-family: var(--font-trajan);
  font-size: 0.95rem;
  color: #ffffff;
  margin-bottom: 8px;
  letter-spacing: 0.08em;
}
.pillar-desc {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

/* FOOTER */
.site-footer {
  background: #08090a;
  border-top: 1px solid var(--color-border);
  padding: 70px 24px 30px;
}
.footer-inner {
  max-width: var(--site-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 48px;
  padding-bottom: 50px;
  border-bottom: 1px solid var(--color-border-subtle);
}
@media (max-width: 950px) {
  .footer-inner { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 550px) {
  .footer-inner { grid-template-columns: 1fr; }
}
.footer-col h4 {
  font-family: var(--font-trajan);
  font-size: 0.85rem;
  color: var(--color-gold);
  letter-spacing: 0.15em;
  margin-bottom: 20px;
}
.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer-col li {
  margin-bottom: 10px;
}
.footer-col a {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  transition: color 0.2s ease;
}
.footer-col a:hover {
  color: var(--color-gold);
}
.footer-bottom {
  max-width: var(--site-max-width);
  margin: 28px auto 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #666;
  flex-wrap: wrap;
  gap: 16px;
}

/* WOOCOMMERCE DYNAMIC SHORTCODE STYLING WRAPPER (CART & CHECKOUT) */
.te-wc-container {
  max-width: var(--site-max-width);
  margin: 0 auto;
  padding: 40px 24px 90px;
}
.te-wc-container .woocommerce,
.te-wc-container .woocommerce-cart,
.te-wc-container .woocommerce-checkout {
  color: var(--color-text-light) !important;
}

/* Tables */
.te-wc-container table.shop_table {
  background: var(--color-surface-dark) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: 4px;
  color: var(--color-text-light) !important;
  width: 100% !important;
}
.te-wc-container table.shop_table th {
  font-family: var(--font-trajan) !important;
  color: var(--color-gold) !important;
  background: #111215 !important;
  border-bottom: 1px solid var(--color-border) !important;
  letter-spacing: 0.1em;
  padding: 14px 16px !important;
}
.te-wc-container table.shop_table td {
  border-top: 1px solid var(--color-border-subtle) !important;
  padding: 16px !important;
  color: var(--color-text-light) !important;
}
.te-wc-container table.shop_table td.product-name a {
  font-family: var(--font-trajan) !important;
  color: #ffffff !important;
  font-size: 0.95rem;
}
.te-wc-container table.shop_table .amount {
  font-family: var(--font-trajan) !important;
  color: var(--color-gold) !important;
  font-weight: 700;
}

/* Inputs, Selects, Buttons in WooCommerce */
.te-wc-container input.input-text,
.te-wc-container select,
.te-wc-container textarea {
  background: #0f1012 !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  color: #ffffff !important;
  padding: 10px 14px !important;
  border-radius: 2px !important;
  outline: none !important;
}
.te-wc-container input.input-text:focus,
.te-wc-container select:focus,
.te-wc-container textarea:focus {
  border-color: var(--color-gold) !important;
}
.te-wc-container button.button,
.te-wc-container input.button,
.te-wc-container a.button,
.te-wc-container #place_order {
  font-family: var(--font-trajan) !important;
  background: var(--color-gold) !important;
  color: #0f1012 !important;
  border: none !important;
  font-weight: 700 !important;
  letter-spacing: 0.1em !important;
  padding: 14px 28px !important;
  border-radius: 2px !important;
  cursor: pointer !important;
  transition: all 0.25s ease !important;
  text-transform: uppercase !important;
}
.te-wc-container button.button:hover,
.te-wc-container input.button:hover,
.te-wc-container a.button:hover,
.te-wc-container #place_order:hover {
  background: var(--color-gold-hover) !important;
  color: #000000 !important;
}

/* Checkout Sections & Payment Box */
.te-wc-container #customer_details,
.te-wc-container #order_review,
.te-wc-container .cart_totals {
  background: var(--color-surface-dark) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: 4px;
  padding: 28px !important;
  margin-bottom: 30px;
}
.te-wc-container #order_review_heading,
.te-wc-container h3,
.te-wc-container .cart_totals h2 {
  font-family: var(--font-trajan) !important;
  color: #ffffff !important;
  border-bottom: 1px solid var(--color-border) !important;
  padding-bottom: 12px !important;
  margin-bottom: 20px !important;
  font-size: 1.2rem !important;
}
.te-wc-container #payment {
  background: #111215 !important;
  border: 1px solid var(--color-border) !important;
  border-radius: 4px;
}
.te-wc-container #payment ul.payment_methods {
  border-bottom: 1px solid var(--color-border) !important;
  padding: 16px !important;
}
.te-wc-container #payment div.payment_box {
  background: rgba(197, 168, 128, 0.08) !important;
  color: var(--color-text-light) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: 3px;
}
.te-wc-container #payment div.payment_box::before {
  border-bottom-color: var(--color-border) !important;
}
.te-wc-container .woocommerce-info,
.te-wc-container .woocommerce-message,
.te-wc-container .woocommerce-error {
  background: var(--color-surface-dark) !important;
  color: var(--color-text-light) !important;
  border-color: var(--color-gold) !important;
}
`;

function getHeaderHtml(activeSlug = '') {
  return `
  <div class="announcement-bar">
    Complimentary Insured White-Glove Logistics &amp; Laser Templating Across India
  </div>
  <header class="site-header">
    <div class="header-inner">
      <a href="/" class="header-logo" style="text-decoration:none;">
        <span style="font-family: var(--font-trajan); font-size: 1.35rem; color: #ffffff; letter-spacing: 0.16em; font-weight: 700;">REFLECTION ELITE</span>
      </a>
      <nav class="main-nav">
        <a href="/" class="nav-link ${activeSlug === 'home' ? 'active' : ''}">HOME</a>
        <a href="/shop/" class="nav-link ${activeSlug === 'shop' ? 'active' : ''}">COLLECTION</a>
        <a href="/about-us/" class="nav-link ${activeSlug === 'about' ? 'active' : ''}">OUR STORY</a>
        <a href="/contact/" class="nav-link ${activeSlug === 'contact' ? 'active' : ''}">CONCIERGE</a>
        <a href="/cart/" class="nav-link ${activeSlug === 'cart' ? 'active' : ''}">COMMISSIONS &amp; CART</a>
      </nav>
      <a href="/contact/" class="header-quote-btn">REQUEST BESPOKE</a>
    </div>
  </header>
  `;
}

function getFooterHtml() {
  return `
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-col">
        <div style="font-family: var(--font-trajan); font-size: 1.25rem; color: #ffffff; letter-spacing: 0.16em; font-weight: 700; margin-bottom: 16px;">REFLECTION ELITE</div>
        <p style="font-size:0.85rem; color:var(--color-text-muted); line-height:1.6; max-width:320px;">
          Curators of artisanal Venetian and architectural mirrors. Each piece is hand-beveled, precision laser-templated, and certified for luxury residences.
        </p>
      </div>
      <div class="footer-col">
        <h4>COLLECTION</h4>
        <ul>
          <li><a href="/shop/">Venetian Heritage</a></li>
          <li><a href="/shop/">Modern Architectural</a></li>
          <li><a href="/shop/">Crown &amp; Cushion</a></li>
          <li><a href="/custom-dimensions/">Bespoke Dimensions</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>SERVICES</h4>
        <ul>
          <li><a href="/contact/">Laser Templating</a></li>
          <li><a href="/contact/">White-Glove Delivery</a></li>
          <li><a href="/about-us/">Atelier Craftsmanship</a></li>
          <li><a href="/terms-of-service/">10-Year Warranty</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>ATELIER INQUIRIES</h4>
        <p style="font-size:0.85rem; color:var(--color-text-muted); margin-bottom:12px;">
          Direct WhatsApp Concierge &amp; Architectural Consultations.
        </p>
        <p style="font-family:var(--font-trajan); font-size:0.95rem; color:var(--color-gold); font-weight:700;">
          +91 98765 43210
        </p>
      </div>
    </div>
    <div class="footer-bottom">
      <div>&copy; 2026 Reflection Elite. All Rights Reserved.</div>
      <div style="display:flex; gap:20px;">
        <a href="/privacy-policy-2/">Privacy Policy</a>
        <a href="/refund_returns-2/">Refund &amp; Returns</a>
        <a href="/custom-dimensions/">Custom Dimensions</a>
      </div>
    </div>
  </footer>
  `;
}

// 4. Page HTML Generators

// HOME PAGE (Page 68)
function buildHomeHtml() {
  const headerHtml = getHeaderHtml('home');
  const footerHtml = getFooterHtml();

  const venetianCards = REAL_PRODUCTS.slice(0, 4).map(p => `
    <div class="luxury-card">
      <div class="card-media">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
      </div>
      <div class="card-info">
        <div class="card-category">${p.category}</div>
        <div class="card-title">${p.title}</div>
        <div class="card-price-row">
          <div class="card-price">${p.price}</div>
          <a href="${p.link}" class="btn-view">VIEW DETAILS</a>
        </div>
      </div>
    </div>
  `).join('');

  const contemporaryCards = REAL_PRODUCTS.slice(4).map(p => `
    <div class="luxury-card">
      <div class="card-media">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
      </div>
      <div class="card-info">
        <div class="card-category">${p.category}</div>
        <div class="card-title">${p.title}</div>
        <div class="card-price-row">
          <div class="card-price">${p.price}</div>
          <a href="${p.link}" class="btn-view">VIEW DETAILS</a>
        </div>
      </div>
    </div>
  `).join('');

  return `<!-- wp:html -->
<style id="te-home-styles">
${THEME_CSS}
.home-hero {
  position: relative;
  width: 100%;
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-image: url('https://reflectionelite.com/wp-content/uploads/2026/10/1771694577552.jpg');
  background-size: cover;
  background-position: center;
}
.home-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15,16,18,0.55) 0%, rgba(15,16,18,0.85) 60%, rgba(15,16,18,0.98) 100%);
}
.home-hero-content {
  position: relative;
  z-index: 2;
  max-width: 960px;
  padding: 40px 24px;
}
.home-hero-content h1 {
  font-size: 3.4rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.15;
  margin-bottom: 20px;
}
@media (max-width: 768px) {
  .home-hero-content h1 { font-size: 2.2rem; }
}
.home-hero-content p {
  font-size: 1.15rem;
  color: var(--color-text-light);
  max-width: 700px;
  margin: 0 auto 34px;
}
.cta-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}
.btn-primary-gold {
  font-family: var(--font-trajan);
  background: var(--color-gold);
  color: #0f1012 !important;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  padding: 16px 36px;
  border-radius: 2px;
  transition: all 0.25s ease;
}
.btn-primary-gold:hover {
  background: var(--color-gold-hover);
}
.btn-outline-gold {
  font-family: var(--font-trajan);
  background: transparent;
  color: #ffffff !important;
  border: 1px solid var(--color-gold);
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  padding: 16px 36px;
  border-radius: 2px;
  transition: all 0.25s ease;
}
.btn-outline-gold:hover {
  background: rgba(197, 168, 128, 0.15);
  border-color: var(--color-gold-hover);
}
.cycle-section {
  padding: 80px 24px 60px;
  max-width: var(--site-max-width);
  margin: 0 auto;
}
.cycle-header {
  text-align: center;
  margin-bottom: 50px;
}
.cycle-header h2 {
  font-size: 2.2rem;
  color: #ffffff;
  margin-bottom: 12px;
}
.atelier-banner {
  position: relative;
  width: 100%;
  min-height: 50vh;
  margin: 60px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-image: url('https://reflectionelite.com/wp-content/uploads/2026/10/20260221_235950-scaled.jpg');
  background-size: cover;
  background-position: center;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}
.atelier-banner::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(15, 16, 18, 0.78);
}
.atelier-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 40px 24px;
}
</style>
<div class="te-live-page">
  ${headerHtml}

  <section class="home-hero">
    <div class="home-hero-content">
      <div class="hero-tagline">&mdash; THE ART OF REFLECTION &mdash;</div>
      <h1>ELEVATE YOUR SANCTUARY WITH HANDCRAFTED VENETIAN &amp; BESPOKE MIRRORS</h1>
      <p>Hand-beveled glass, Italian tiered floral profiles, and precision bespoke architectural installations crafted for refined residences.</p>
      <div class="cta-group">
        <a href="/shop/" class="btn-primary-gold">EXPLORE THE COLLECTION</a>
        <a href="/contact/" class="btn-outline-gold">COMMISSION BESPOKE</a>
      </div>
    </div>
  </section>

  <!-- VENETIAN CYCLE (4 PIECES) -->
  <section class="cycle-section">
    <div class="cycle-header">
      <div class="hero-tagline">&mdash; ATELIER ARCHIVE &mdash;</div>
      <h2>THE VENETIAN HERITAGE COLLECTION</h2>
      <p style="color:var(--color-text-muted); max-width:640px; margin:0 auto;">Centuries-old tiered beveling methods preserved by master glass artisans.</p>
    </div>
    <div class="catalog-grid-4">
      ${venetianCards}
    </div>
  </section>

  <!-- FULL-WIDTH ATELIER BANNER -->
  <section class="atelier-banner">
    <div class="atelier-content">
      <div class="hero-tagline">&mdash; BESPOKE PRECISION &mdash;</div>
      <h2 style="font-size:2.5rem; color:#fff; margin-bottom:16px;">PERFECT DIMENSIONS. ZERO MARGIN FOR COMPROMISE.</h2>
      <p style="color:var(--color-text-muted); margin-bottom:30px;">Every residential interior demands exact proportions. Our white-glove engineering team provides on-site laser templating across major Indian metropolitan corridors.</p>
      <a href="/custom-dimensions/" class="btn-primary-gold">EXPLORE CUSTOM CAPABILITIES</a>
    </div>
  </section>

  <!-- CONTEMPORARY CYCLE (3 PIECES) -->
  <section class="cycle-section" style="padding-top:20px;">
    <div class="cycle-header">
      <div class="hero-tagline">&mdash; MODERN STATEMENTS &mdash;</div>
      <h2>CONTEMPORARY &amp; BESPOKE EDITIONS</h2>
      <p style="color:var(--color-text-muted); max-width:640px; margin:0 auto;">Geometric mosaic art, bespoke upholstered frames, and client-specified dimensional commissions.</p>
    </div>
    <div class="catalog-grid-4" style="grid-template-columns: repeat(3, 1fr); max-width: 1040px; margin: 0 auto;">
      ${contemporaryCards}
    </div>
  </section>

  <!-- 4 VALUE PILLARS -->
  <section class="pillars-section">
    <div class="pillars-grid">
      <div class="pillar-card">
        <div class="pillar-icon">&#9670;</div>
        <div class="pillar-title">HANDCRAFTED HERITAGE</div>
        <div class="pillar-desc">Authentic Italian Venetian beveling techniques sculpted by master craftsmen.</div>
      </div>
      <div class="pillar-card">
        <div class="pillar-icon">&#9671;</div>
        <div class="pillar-title">PRECISION TEMPLATING</div>
        <div class="pillar-desc">On-site architectural laser surveys ensuring flush, millimeter-perfect wall alignment.</div>
      </div>
      <div class="pillar-card">
        <div class="pillar-icon">&#9672;</div>
        <div class="pillar-title">INSURED LOGISTICS</div>
        <div class="pillar-desc">Specialized shock-proof timber crating with dedicated white-glove delivery across India.</div>
      </div>
      <div class="pillar-card">
        <div class="pillar-icon">&#9673;</div>
        <div class="pillar-title">10-YEAR CERTIFICATE</div>
        <div class="pillar-desc">Every piece is numbered and accompanied by a formal 10-year authenticity warranty.</div>
      </div>
    </div>
  </section>

  ${footerHtml}
</div>
<!-- /wp:html -->`;
}

// SHOP PAGE (Page 6)
function buildShopHtml() {
  const headerHtml = getHeaderHtml('shop');
  const footerHtml = getFooterHtml();

  const cardsHtml = REAL_PRODUCTS.map(p => `
    <div class="luxury-card">
      <div class="card-media">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
      </div>
      <div class="card-info">
        <div class="card-category">${p.category}</div>
        <div class="card-title">${p.title}</div>
        <div class="card-price-row">
          <div class="card-price">${p.price}</div>
          <a href="${p.link}" class="btn-view">VIEW DETAILS</a>
        </div>
      </div>
    </div>
  `).join('');

  return `<!-- wp:html -->
<style id="te-shop-styles">
${THEME_CSS}
</style>
<div class="te-live-page">
  ${headerHtml}

  <section class="shop-hero">
    <div class="shop-hero-content">
      <div class="hero-tagline">&mdash; EXCLUSIVE ATELIER CATALOG &mdash;</div>
      <h1>THE ARTISAN COLLECTION</h1>
      <p>Discover our curated portfolio of handcrafted Venetian mirrors, geometric mosaic art, and bespoke upholstered frames.</p>
    </div>
  </section>

  <section class="catalog-section">
    <div class="catalog-toolbar">
      <div>Showing <strong>7 masterpieces</strong> &bull; All prices inclusive of GST</div>
      <div>Curated by Atelier Reflection Elite</div>
    </div>
    <div class="catalog-grid-4">
      ${cardsHtml}
    </div>
  </section>

  <section class="pillars-section">
    <div class="pillars-grid">
      <div class="pillar-card">
        <div class="pillar-icon">&#9670;</div>
        <div class="pillar-title">HANDCRAFTED HERITAGE</div>
        <div class="pillar-desc">Authentic Italian Venetian beveling techniques sculpted by master craftsmen.</div>
      </div>
      <div class="pillar-card">
        <div class="pillar-icon">&#9671;</div>
        <div class="pillar-title">PRECISION TEMPLATING</div>
        <div class="pillar-desc">On-site architectural laser surveys ensuring flush, millimeter-perfect wall alignment.</div>
      </div>
      <div class="pillar-card">
        <div class="pillar-icon">&#9672;</div>
        <div class="pillar-title">INSURED LOGISTICS</div>
        <div class="pillar-desc">Specialized shock-proof timber crating with dedicated white-glove delivery across India.</div>
      </div>
      <div class="pillar-card">
        <div class="pillar-icon">&#9673;</div>
        <div class="pillar-title">10-YEAR CERTIFICATE</div>
        <div class="pillar-desc">Every piece is numbered and accompanied by a formal 10-year authenticity warranty.</div>
      </div>
    </div>
  </section>

  ${footerHtml}
</div>
<!-- /wp:html -->`;
}

// CART PAGE (Page 7) - SHORTCODE-WRAPPED (SAFE)
function buildCartHtml() {
  const headerHtml = getHeaderHtml('cart');
  const footerHtml = getFooterHtml();

  return `<!-- wp:html -->
<style id="te-cart-styles">
${THEME_CSS}
</style>
<div class="te-live-page">
  ${headerHtml}

  <div class="shop-hero" style="min-height: 28vh;">
    <div class="shop-hero-content" style="padding: 24px;">
      <div class="hero-tagline">&mdash; YOUR COMMISSIONS &mdash;</div>
      <h1 style="font-size: 2.2rem; margin-bottom: 6px;">COMMISSIONS &amp; CART</h1>
      <p style="font-size: 0.9rem;">Review your selected pieces and proceed to secure reservation.</p>
    </div>
  </div>

  <div class="te-wc-container">
<!-- /wp:html -->
<!-- wp:shortcode -->
[woocommerce_cart]
<!-- /wp:shortcode -->
<!-- wp:html -->
  </div>

  ${footerHtml}
</div>
<!-- /wp:html -->`;
}

// CHECKOUT PAGE (Page 8) - SHORTCODE-WRAPPED (SAFE)
function buildCheckoutHtml() {
  const headerHtml = getHeaderHtml('cart');
  const footerHtml = getFooterHtml();

  return `<!-- wp:html -->
<style id="te-checkout-styles">
${THEME_CSS}
</style>
<div class="te-live-page">
  ${headerHtml}

  <div class="shop-hero" style="min-height: 28vh;">
    <div class="shop-hero-content" style="padding: 24px;">
      <div class="hero-tagline">&mdash; SECURE CHECKOUT &mdash;</div>
      <h1 style="font-size: 2.2rem; margin-bottom: 6px;">SECURE CHECKOUT &amp; COMMISSION</h1>
      <p style="font-size: 0.9rem;">Enter your installation address and select your preferred payment settlement.</p>
    </div>
  </div>

  <div class="te-wc-container">
<!-- /wp:html -->
<!-- wp:shortcode -->
[woocommerce_checkout]
<!-- /wp:shortcode -->
<!-- wp:html -->
  </div>

  ${footerHtml}
</div>
<!-- /wp:html -->`;
}

// ABOUT US / OUR STORY (Page 50) - Preserves 100% live text word-for-word
function buildAboutHtml(rawLiveContent) {
  const headerHtml = getHeaderHtml('about');
  const footerHtml = getFooterHtml();

  return `<!-- wp:html -->
<style id="te-about-styles">
${THEME_CSS}
.story-wrapper {
  max-width: 1080px;
  margin: 0 auto;
  padding: 60px 24px 90px;
}
.re-story-page-wrapper {
  color: var(--color-text-light);
}
.re-story-hero {
  text-align: center;
  margin-bottom: 50px;
  padding-bottom: 30px;
  border-bottom: 1px solid var(--color-border);
}
.re-catalog-breadcrumb {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--color-gold);
  margin-bottom: 12px;
}
.re-sub-title-accent {
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  color: var(--color-gold);
  margin-bottom: 14px;
}
.re-story-title {
  font-family: var(--font-trajan) !important;
  font-size: 2.6rem;
  color: #ffffff;
  line-height: 1.2;
}
.re-serif-italic {
  font-style: italic;
  color: var(--color-gold);
}
.re-story-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin: 40px 0;
}
@media (max-width: 800px) {
  .re-story-grid { grid-template-columns: 1fr; }
}
.re-story-card, .re-story-pillar {
  background: var(--color-surface-dark);
  border: 1px solid var(--color-border);
  padding: 32px;
  border-radius: 4px;
}
.re-story-card h2, .re-story-card h3, .re-story-pillar h3 {
  font-family: var(--font-trajan) !important;
  color: #ffffff;
  margin-bottom: 14px;
}
.re-story-card p, .re-story-pillar p {
  color: var(--color-text-muted);
  line-height: 1.7;
}
</style>
<div class="te-live-page">
  ${headerHtml}

  <div class="story-wrapper">
    ${rawLiveContent}
  </div>

  <section class="pillars-section">
    <div class="pillars-grid">
      <div class="pillar-card">
        <div class="pillar-icon">&#9670;</div>
        <div class="pillar-title">HANDCRAFTED HERITAGE</div>
        <div class="pillar-desc">Authentic Italian Venetian beveling techniques sculpted by master craftsmen.</div>
      </div>
      <div class="pillar-card">
        <div class="pillar-icon">&#9671;</div>
        <div class="pillar-title">PRECISION TEMPLATING</div>
        <div class="pillar-desc">On-site architectural laser surveys ensuring flush, millimeter-perfect wall alignment.</div>
      </div>
      <div class="pillar-card">
        <div class="pillar-icon">&#9672;</div>
        <div class="pillar-title">INSURED LOGISTICS</div>
        <div class="pillar-desc">Specialized shock-proof timber crating with dedicated white-glove delivery across India.</div>
      </div>
      <div class="pillar-card">
        <div class="pillar-icon">&#9673;</div>
        <div class="pillar-title">10-YEAR CERTIFICATE</div>
        <div class="pillar-desc">Every piece is numbered and accompanied by a formal 10-year authenticity warranty.</div>
      </div>
    </div>
  </section>

  ${footerHtml}
</div>
<!-- /wp:html -->`;
}

// CONTACT (Page 52) - Preserves 100% live text word-for-word
function buildContactHtml(rawLiveContent) {
  const headerHtml = getHeaderHtml('contact');
  const footerHtml = getFooterHtml();

  return `<!-- wp:html -->
<style id="te-contact-styles">
${THEME_CSS}
.contact-wrapper {
  max-width: 1080px;
  margin: 0 auto;
  padding: 60px 24px 90px;
}
.re-contact-page-wrapper {
  color: var(--color-text-light);
}
.re-contact-hero {
  text-align: center;
  margin-bottom: 50px;
  padding-bottom: 30px;
  border-bottom: 1px solid var(--color-border);
}
.re-catalog-breadcrumb {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--color-gold);
  margin-bottom: 12px;
}
.re-sub-title-accent {
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  color: var(--color-gold);
  margin-bottom: 14px;
}
.re-contact-title {
  font-family: var(--font-trajan) !important;
  font-size: 2.6rem;
  color: #ffffff;
  line-height: 1.2;
}
.re-serif-italic {
  font-style: italic;
  color: var(--color-gold);
}
.re-contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin: 40px 0;
}
@media (max-width: 800px) {
  .re-contact-grid { grid-template-columns: 1fr; }
}
.re-contact-card, .re-contact-form-wrap {
  background: var(--color-surface-dark);
  border: 1px solid var(--color-border);
  padding: 32px;
  border-radius: 4px;
}
.re-contact-card h2, .re-contact-card h3, .re-contact-form-wrap h3 {
  font-family: var(--font-trajan) !important;
  color: #ffffff;
  margin-bottom: 14px;
}
.re-contact-card p, .re-contact-form-wrap p {
  color: var(--color-text-muted);
  line-height: 1.7;
}
.re-contact-card a {
  color: var(--color-gold);
}
</style>
<div class="te-live-page">
  ${headerHtml}

  <div class="contact-wrapper">
    ${rawLiveContent}
  </div>

  ${footerHtml}
</div>
<!-- /wp:html -->`;
}

// POLICY PAGES (Pages 102, 103, 120) - Preserves 100% live text word-for-word
function buildPolicyHtml(rawLiveContent) {
  const headerHtml = getHeaderHtml('policies');
  const footerHtml = getFooterHtml();

  return `<!-- wp:html -->
<style id="te-policy-styles">
${THEME_CSS}
.policy-wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 60px 24px 90px;
  color: var(--color-text-light);
}
.re-policy-page-wrapper, .re-dedicated-bespoke-wrapper {
  background: var(--color-surface-dark);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 40px;
}
.re-policy-hero {
  text-align: center;
  margin-bottom: 36px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
}
.re-catalog-breadcrumb {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--color-gold);
  margin-bottom: 10px;
}
.re-sub-title-accent {
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  color: var(--color-gold);
  margin-bottom: 12px;
}
.re-policy-title {
  font-family: var(--font-trajan) !important;
  font-size: 2.2rem;
  color: #ffffff;
}
.re-policy-content h2, .re-policy-content h3, .re-bespoke-glass-panel h2 {
  font-family: var(--font-trajan) !important;
  color: #ffffff;
  margin: 28px 0 14px;
}
.re-policy-content p, .re-policy-content li, .re-bespoke-glass-panel p {
  color: var(--color-text-muted);
  line-height: 1.7;
}
</style>
<div class="te-live-page">
  ${headerHtml}

  <div class="policy-wrapper">
    ${rawLiveContent}
  </div>

  ${footerHtml}
</div>
<!-- /wp:html -->`;
}

// 5. Execution Routine
async function deployTheme() {
  console.log('=== STARTING PHASE 2: DEPLOYING THEME TO REFLECTIONELITE.COM ===');

  const { siteUrl, cookies, nonce } = await getProdAuth();
  console.log('✓ Authenticated to', siteUrl);

  async function updatePage(id, title, slug, content) {
    console.log(`\nDeploying Theme to Page ${id} [${slug}] - "${title}"...`);
    const payload = {
      title,
      slug,
      status: 'publish',
      content,
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
    };

    const res = await fetch(`${siteUrl}/wp-json/wp/v2/pages/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
        'X-WP-Nonce': nonce
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to update page ${id}: HTTP ${res.status} - ${err}`);
    }

    const data = await res.json();
    console.log(`✓ Successfully updated Page ${id} [${slug}] (${data.content?.raw?.length || 0} bytes)`);
    return data;
  }

  // 1. Home (Page 68)
  const homeHtml = buildHomeHtml();
  await updatePage(68, 'Reflection Elite', 'home', homeHtml);

  // 2. Shop (Page 6)
  const shopHtml = buildShopHtml();
  await updatePage(6, 'Shop', 'shop', shopHtml);

  // 3. Cart (Page 7) - SHORTCODE-WRAPPED
  const cartHtml = buildCartHtml();
  await updatePage(7, 'Cart', 'cart', cartHtml);

  // 4. Checkout (Page 8) - SHORTCODE-WRAPPED
  const checkoutHtml = buildCheckoutHtml();
  await updatePage(8, 'Checkout', 'checkout', checkoutHtml);

  // 5. About Us (Page 50) - Word-for-word copy from backup
  const p50Backup = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, 'page_50_about-us.json'), 'utf8'));
  const aboutHtml = buildAboutHtml(p50Backup.content.raw);
  await updatePage(50, 'Our Story', 'about-us', aboutHtml);

  // 6. Contact (Page 52) - Word-for-word copy from backup
  const p52Backup = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, 'page_52_contact.json'), 'utf8'));
  const contactHtml = buildContactHtml(p52Backup.content.raw);
  await updatePage(52, 'Contact', 'contact', contactHtml);

  // 7. Privacy Policy (Page 102) - Word-for-word copy from backup
  const p102Backup = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, 'page_102_privacy-policy-2.json'), 'utf8'));
  const privacyHtml = buildPolicyHtml(p102Backup.content.raw);
  await updatePage(102, 'Privacy Policy', 'privacy-policy-2', privacyHtml);

  // 8. Refund Policy (Page 103) - Word-for-word copy from backup
  const p103Backup = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, 'page_103_refund_returns-2.json'), 'utf8'));
  const refundHtml = buildPolicyHtml(p103Backup.content.raw);
  await updatePage(103, 'Refund & Returns Policy', 'refund_returns-2', refundHtml);

  // 9. Custom Dimensions (Page 120) - Word-for-word copy from backup
  const p120Backup = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, 'page_120_custom-dimensions.json'), 'utf8'));
  const customDimensionsHtml = buildPolicyHtml(p120Backup.content.raw);
  await updatePage(120, 'Custom Dimensions & Bespoke Design', 'custom-dimensions', customDimensionsHtml);

  console.log('\n=== PHASE 2 COMPLETED SUCCESSFULLY ACROSS ALL MAPPED PAGES ===');
  console.log('Cart (7) and Checkout (8) are SHORTCODE-WRAPPED only.');
  console.log('Catalog & word-for-word copy 100% preserved.');
}

deployTheme().catch(err => {
  console.error('PHASE 2 FAILED:', err);
  process.exit(1);
});
