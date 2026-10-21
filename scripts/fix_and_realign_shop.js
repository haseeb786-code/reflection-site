import { getProdAuth } from './prod_auth_helper.js';
import fs from 'fs';

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

function getHeaderHtml(activeSlug = 'shop') {
  return `
  <div class="announcement-bar">
    Complimentary Insured White-Glove Logistics &amp; Laser Templating Across India
  </div>
  <header class="site-header">
    <div class="header-inner">
      <a href="/" class="header-logo" style="text-decoration:none;">
        <span style="font-family: var(--font-trajan); font-size: 1.35rem; color: #ffffff; letter-spacing: 0.16em; font-weight: 700;">REFLECTION ELITE</span>
        <span style="font-family: var(--font-trajan); font-size: 0.65rem; color: var(--color-gold); letter-spacing: 0.32em; text-transform: uppercase;">ATELIER PRIV&Eacute;</span>
      </a>
      <nav class="nav-desktop">
        <a href="/" class="nav-link ${activeSlug === 'home' ? 'active' : ''}">HOME</a>
        <a href="/shop/" class="nav-link ${activeSlug === 'shop' ? 'active' : ''}">COLLECTIONS</a>
        <a href="/about-us/" class="nav-link ${activeSlug === 'about' ? 'active' : ''}">OUR STORY</a>
        <a href="/custom-dimensions/" class="nav-link ${activeSlug === 'custom-dimensions' ? 'active' : ''}">BESPOKE</a>
        <a href="/contact/" class="nav-link ${activeSlug === 'contact' ? 'active' : ''}">CONCIERGE</a>
      </nav>
      <div class="header-actions">
        <a href="/contact/" class="btn-action">COMMISSION BESPOKE</a>
        <a href="/cart/" class="cart-icon-btn" aria-label="Cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </a>
      </div>
    </div>
  </header>`;
}

function getFooterHtml() {
  return `
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-col">
        <div class="footer-logo">REFLECTION ELITE</div>
        <p class="footer-desc">Atelier of museum-grade Venetian mirrors, handcrafted glasswork, and bespoke architectural installations.</p>
        <div style="font-family: var(--font-trajan); font-size: 0.8rem; color: var(--color-gold); margin-top: 14px;">
          CONCIERGE: +91 7387463103
        </div>
      </div>
      <div class="footer-col">
        <div class="footer-heading">COLLECTIONS</div>
        <div class="footer-links">
          <a href="/shop/">All Masterpieces</a>
          <a href="/product/antique-venetian-cushion/">Venetian Heritage</a>
          <a href="/product/mosaic-mirror-art/">Contemporary Glass</a>
          <a href="/custom-dimensions/">Bespoke Commissions</a>
        </div>
      </div>
      <div class="footer-col">
        <div class="footer-heading">ATELIER</div>
        <div class="footer-links">
          <a href="/about-us/">Our Story &amp; Heritage</a>
          <a href="/contact/">Design Studio &amp; Concierge</a>
          <a href="/privacy-policy-2/">Privacy Policy</a>
          <a href="/refund_returns-2/">Refund &amp; Logistics Policy</a>
        </div>
      </div>
      <div class="footer-col">
        <div class="footer-heading">BESPOKE SERVICES</div>
        <p class="footer-desc" style="margin-bottom: 14px;">Direct CAD blueprint consultation &amp; laser surveying for interior designers and architects.</p>
        <a href="/contact/" class="btn-action" style="display:inline-block; font-size: 0.75rem; padding: 10px 18px;">INQUIRE VIA WHATSAPP</a>
      </div>
    </div>
    <div class="footer-bottom">
      &copy; 2026 Reflection Elite Atelier. All Rights Reserved. Mastercrafted in India &bull; Complimentary White-Glove Insured Delivery.
    </div>
  </footer>`;
}

function buildCleanShopHtml() {
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

// Complete Global CSS including Shop Hero & Grid styles
const COMPLETE_GLOBAL_CSS = `
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
}

/* Force dark luxury background across all standard WordPress/Astra templates */
html, body, #page, .site, #primary, #content, .ast-container, .entry-content, 
.ast-separate-container, .ast-plain-container, .ast-article-single, .woocommerce, .te-live-page {
  background-color: var(--color-bg-dark) !important;
  background: var(--color-bg-dark) !important;
  color: var(--color-text-light) !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
}

/* Suppress all default Astra theme chrome and duplicate bars */
#masthead, #colophon, .ast-site-header, .ast-above-header-wrap, .ast-above-header, 
.ast-below-header-wrap, .ast-below-header, .site-below-footer-wrap, .site-primary-footer-wrap, 
.ast-breadcrumbs-wrapper, .entry-title.ast-single-post-order, .ast-banner-layout-1, 
.ast-header-break-point .main-header-bar-wrap, .entry-title {
  display: none !important;
}

/* Suppress WooCommerce default archive wrappers on shop page */
.woocommerce-products-header, .page-description {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
}
.woocommerce-breadcrumb, 
.ast-woocommerce-container > .woocommerce-products-header > .woocommerce-breadcrumb,
.ast-woocommerce-container > ul.products,
.ast-woocommerce-container > .woocommerce-result-count,
.ast-woocommerce-container > .woocommerce-ordering {
  display: none !important;
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
  z-index: 999;
  background: rgba(15, 16, 18, 0.94);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--color-border);
}
.header-inner {
  max-width: var(--site-max-width);
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-logo {
  display: flex;
  flex-direction: column;
}
.nav-desktop {
  display: flex;
  gap: 28px;
}
.nav-link {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-muted);
  transition: color 0.25s ease;
}
.nav-link:hover, .nav-link.active {
  color: var(--color-gold);
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
.btn-action {
  font-family: var(--font-trajan);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  padding: 10px 20px;
  border: 1px solid var(--color-gold);
  color: var(--color-gold) !important;
  background: transparent;
  border-radius: 2px;
  transition: all 0.25s ease;
}
.btn-action:hover {
  background: var(--color-gold);
  color: #0f1012 !important;
}
.cart-icon-btn {
  color: var(--color-text-light);
  display: flex;
  align-items: center;
  transition: color 0.25s ease;
}
.cart-icon-btn:hover {
  color: var(--color-gold);
}

/* SHOP HERO */
.shop-hero {
  position: relative;
  width: 100%;
  padding: 70px 24px 50px;
  text-align: center;
  border-bottom: 1px solid var(--color-border);
  background: linear-gradient(180deg, #131417 0%, #0f1012 100%);
}
.shop-hero-content {
  max-width: 800px;
  margin: 0 auto;
}
.hero-tagline {
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--color-gold);
  letter-spacing: 0.22em;
  margin-bottom: 14px;
}
.shop-hero-content h1 {
  font-size: clamp(1.8rem, 3.2vw, 2.6rem);
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
}
.shop-hero-content p {
  color: var(--color-text-muted);
  font-size: 0.98rem;
  line-height: 1.6;
}

/* CATALOG SECTION & GRID */
.catalog-section {
  max-width: var(--site-max-width);
  margin: 0 auto;
  padding: 40px 24px 80px;
}
.catalog-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 14px;
  margin-bottom: 34px;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}
.catalog-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
@media (max-width: 1100px) {
  .catalog-grid-4 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .catalog-grid-4 { grid-template-columns: 1fr; }
}

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
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
}
.card-category {
  font-size: 0.72rem;
  color: var(--color-gold);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.card-title {
  font-family: var(--font-trajan);
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
  line-height: 1.35;
}
.card-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid var(--color-border-subtle);
}
.card-price {
  font-family: var(--font-trajan);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-gold);
}
.btn-view {
  font-family: var(--font-trajan);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 7px 14px;
  background: transparent;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  transition: all 0.2s ease;
}
.btn-view:hover {
  background: var(--color-gold);
  color: #0f1012 !important;
  border-color: var(--color-gold);
}

/* VALUE PILLARS */
.pillars-section {
  border-top: 1px solid var(--color-border);
  background: #111215;
  padding: 60px 24px;
}
.pillars-grid {
  max-width: var(--site-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
}
@media (max-width: 900px) {
  .pillars-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .pillars-grid { grid-template-columns: 1fr; }
}
.pillar-card {
  text-align: center;
}
.pillar-icon {
  font-size: 1.4rem;
  color: var(--color-gold);
  margin-bottom: 12px;
}
.pillar-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}
.pillar-desc {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  line-height: 1.55;
}

/* FOOTER */
.site-footer {
  background: #090a0c;
  border-top: 1px solid var(--color-border);
  padding: 60px 24px 30px;
}
.footer-inner {
  max-width: var(--site-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 40px;
  margin-bottom: 50px;
}
@media (max-width: 900px) {
  .footer-inner { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .footer-inner { grid-template-columns: 1fr; }
}
.footer-logo {
  font-size: 1.2rem;
  color: #ffffff;
  margin-bottom: 12px;
}
.footer-desc {
  color: var(--color-text-muted);
  font-size: 0.84rem;
  line-height: 1.6;
}
.footer-heading {
  font-size: 0.82rem;
  color: var(--color-gold);
  margin-bottom: 16px;
}
.footer-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.footer-links a {
  color: var(--color-text-muted);
  font-size: 0.82rem;
  transition: color 0.25s ease;
}
.footer-links a:hover {
  color: #ffffff;
}
.footer-bottom {
  max-width: var(--site-max-width);
  margin: 0 auto;
  border-top: 1px solid var(--color-border-subtle);
  padding-top: 24px;
  text-align: center;
  font-size: 0.74rem;
  color: #71717a;
}
</style>
`;

async function executeFix() {
  console.log('=== FIXING AND REALIGNING SHOP PAGE & GLOBAL STYLES ===');
  const { siteUrl, cookies, nonce } = await getProdAuth();

  // 1. Update WPCode with full global stylesheet
  console.log('1. Updating WPCode with complete Trending Era global styles...');
  const res = await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { Cookie: cookies }
  });
  const html = await res.text();
  const nonceMatch = html.match(/id="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i) 
                  || html.match(/name="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i);
  if (!nonceMatch) throw new Error('Nonce not found');

  const formBody = new URLSearchParams();
  formBody.append('insert-headers-and-footers_nonce', nonceMatch[1]);
  formBody.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-headers-footers');
  formBody.append('ihaf_insert_header', COMPLETE_GLOBAL_CSS);
  formBody.append('ihaf_insert_body', '');
  formBody.append('ihaf_insert_footer', '');

  await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookies
    },
    body: formBody.toString(),
    redirect: 'manual'
  });
  console.log('✓ WPCode updated with complete global styles.');

  // 2. Update Page 6 with clean HTML (no raw style tags inside the post)
  console.log('2. Updating Page 6 [shop] with clean Trending Era markup...');
  const shopHtml = buildCleanShopHtml();
  const p6Res = await fetch(`${siteUrl}/wp-json/wp/v2/pages/6`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies,
      'X-WP-Nonce': nonce
    },
    body: JSON.stringify({
      title: 'Shop',
      slug: 'shop',
      status: 'publish',
      content: shopHtml,
      meta: {
        'site-sidebar-layout': 'no-sidebar',
        'site-content-layout': 'page-builder',
        'ast-site-content-layout': 'full-width-container',
        'ast-global-header-display': 'disabled',
        'ast-main-header-display': 'disabled',
        'site-post-title': 'disabled',
        'footer-sml-layout': 'disabled'
      }
    })
  });
  if (!p6Res.ok) throw new Error(`Failed to update page 6: ${p6Res.status}`);
  console.log('✓ Page 6 updated cleanly.');

  // 3. Clear Hostinger Server Cache
  console.log('3. Purging Hostinger edge and server cache...');
  const purgeRes = await fetch(`${siteUrl}/wp-json/hostinger-tools-plugin/v1/clear-cache`, {
    method: 'DELETE',
    headers: {
      'Cookie': cookies,
      'X-WP-Nonce': nonce
    }
  });
  console.log('✓ Purge response:', purgeRes.status, await purgeRes.json());

  console.log('\n=== REALIGNMENT COMPLETE ===');
}

executeFix().catch(console.error);
