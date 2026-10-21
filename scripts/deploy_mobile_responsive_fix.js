import { getProdAuth } from './prod_auth_helper.js';

const RESPONSIVE_GLOBAL_CSS = `
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

/* ==========================================================================
   STRICT RESPONSIVE GRID HIERARCHY FOR ALL PRODUCT GRIDS ACROSS THE SITE
   ========================================================================== */

/* 1. Desktop (>1024px): 4 Columns */
.catalog-grid-4,
.catalog-grid,
.shop-catalog-grid,
.re-featured-products-grid,
.re-collections-grid,
.woocommerce ul.products,
.woocommerce-page ul.products,
.related.products ul.products,
.up-sells.products ul.products {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 26px !important;
  width: 100% !important;
  box-sizing: border-box !important;
  list-style: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* 2. Tablet (768px - 1024px): Exactly 2 Columns */
@media (min-width: 768px) and (max-width: 1024px) {
  .catalog-grid-4,
  .catalog-grid,
  .shop-catalog-grid,
  .re-featured-products-grid,
  .re-collections-grid,
  .woocommerce ul.products,
  .woocommerce-page ul.products,
  .related.products ul.products,
  .up-sells.products ul.products {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 20px !important;
  }
  .nav-desktop {
    gap: 14px !important;
  }
  .nav-link {
    font-size: 0.72rem !important;
  }
  .header-inner {
    padding: 12px 18px !important;
  }
  .catalog-section,
  .cycle-section,
  .pillars-section,
  .site-footer,
  .home-hero,
  .shop-hero {
    padding-left: 20px !important;
    padding-right: 20px !important;
  }
}

/* 3. Mobile (<768px): Exactly 1 Column, Full-Width Stacked Cards */
@media (max-width: 767.98px) {
  .catalog-grid-4,
  .catalog-grid,
  .shop-catalog-grid,
  .re-featured-products-grid,
  .re-collections-grid,
  .woocommerce ul.products,
  .woocommerce-page ul.products,
  .related.products ul.products,
  .up-sells.products ul.products {
    grid-template-columns: 1fr !important;
    gap: 24px !important;
    width: 100% !important;
  }

  .luxury-card,
  .product-card,
  .re-catalog-card,
  .woocommerce ul.products li.product {
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
    margin: 0 0 10px 0 !important;
  }

  /* Prevent horizontal overflow on mobile viewports */
  html, body, #page, .site, .te-live-page {
    overflow-x: hidden !important;
    max-width: 100vw !important;
  }

  /* Section padding normalization on mobile */
  .catalog-section,
  .cycle-section,
  .pillars-section,
  .site-footer,
  .home-hero,
  .shop-hero {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }

  /* Navigation: Hide wide desktop text links to avoid horizontal scrollbar blowout */
  .nav-desktop {
    display: none !important;
  }
  .header-inner {
    padding: 12px 16px !important;
  }

  /* Toolbar stack on phone screens */
  .catalog-toolbar {
    flex-direction: column !important;
    gap: 8px !important;
    text-align: center !important;
  }

  /* Title sizing adjustment */
  .shop-hero-content h1 {
    font-size: 1.8rem !important;
  }
  .home-hero-content h1 {
    font-size: 1.9rem !important;
  }
}

/* CARD STYLING */
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

async function deployResponsiveFix() {
  console.log('=== DEPLOYING RESPONSIVE BREAKPOINT FIX TO REFLECTIONELITE.COM ===');
  const { siteUrl, cookies, nonce } = await getProdAuth();

  // 1. Update WPCode Header with strict responsive hierarchy
  console.log('1. Updating WPCode Header...');
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
  formBody.append('ihaf_insert_header', RESPONSIVE_GLOBAL_CSS);
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
  console.log('✓ WPCode Header updated with responsive breakpoints.');

  // 2. Clear Hostinger Server Cache
  console.log('2. Purging Hostinger cache...');
  const purgeRes = await fetch(`${siteUrl}/wp-json/hostinger-tools-plugin/v1/clear-cache`, {
    method: 'DELETE',
    headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
  });
  console.log('✓ Cache purge response:', purgeRes.status, await purgeRes.json());
}

deployResponsiveFix().catch(console.error);
