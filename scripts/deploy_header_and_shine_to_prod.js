import fs from 'fs';
import path from 'path';
import { getProdAuth } from './prod_auth_helper.js';
import { getReUnifiedHeader } from './re_header_system.js';

const PROD_URL = 'https://reflectionelite.com';

const GLOBAL_HEAD_CSS = `
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

/* ==========================================================================
   SHINE / SHIMMER EFFECT FOR PRODUCT CARDS ACROSS ENTIRE SITE
   ========================================================================== */
.luxury-card .card-media,
.product-card .product-media-wrap,
.luxury-card .prod-main-img-box,
.luxury-card .card-image-container,
.re-collection-card .card-media,
.re-collection-card .product-media-wrap,
.woocommerce ul.products li.product .woocommerce-loop-product__link {
  position: relative !important;
  overflow: hidden !important;
}

.luxury-card .card-media::after,
.product-card .product-media-wrap::after,
.luxury-card .prod-main-img-box::after,
.luxury-card .card-image-container::after,
.re-collection-card .card-media::after,
.re-collection-card .product-media-wrap::after,
.woocommerce ul.products li.product .woocommerce-loop-product__link::after {
  content: '';
  position: absolute;
  top: 0;
  left: -150%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent 0%,
    rgba(255, 255, 255, 0) 40%,
    rgba(255, 255, 255, 0.25) 50%,
    rgba(255, 255, 255, 0) 60%,
    transparent 100%
  );
  transform: skewX(-20deg);
  animation: shine-sweep 5s ease-in-out infinite;
  pointer-events: none;
  z-index: 2;
}

.luxury-card:nth-child(2n) .card-media::after,
.product-card:nth-child(2n) .product-media-wrap::after,
.woocommerce ul.products li.product:nth-child(2n) .woocommerce-loop-product__link::after {
  animation-delay: 1.2s;
}

.luxury-card:nth-child(3n) .card-media::after,
.product-card:nth-child(3n) .product-media-wrap::after,
.woocommerce ul.products li.product:nth-child(3n) .woocommerce-loop-product__link::after {
  animation-delay: 2.4s;
}

.luxury-card:nth-child(4n) .card-media::after,
.product-card:nth-child(4n) .product-media-wrap::after,
.woocommerce ul.products li.product:nth-child(4n) .woocommerce-loop-product__link::after {
  animation-delay: 3.6s;
}

@keyframes shine-sweep {
  0% { left: -150%; }
  35% { left: 150%; }
  100% { left: 150%; }
}
</style>
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
  console.log('--- 1. Updating WPCode with Global Luxury System & Shine Sweep Effect ---');
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
  formBody.append('ihaf_insert_header', GLOBAL_HEAD_CSS.trim());
  formBody.append('ihaf_insert_body', '');
  formBody.append('ihaf_insert_footer', '');

  const saveRes = await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookies
    },
    body: formBody.toString(),
    redirect: 'manual'
  });

  console.log(`✓ WPCode global header updated (HTTP ${saveRes.status})`);
}

async function updateCorePages(siteUrl, cookies, nonce) {
  console.log('\n--- 2. Updating Core Pages with 5-Tier Unified Header ---');

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

    // Remove old header HTML and old styles
    content = content.replace(/<style id="re-unified-header-system">[\s\S]*?<\/header>/gi, '');
    content = content.replace(/<!--\s*REPLICATED EXACT HEADER SYSTEM[\s\S]*?<\/header>/gi, '');
    content = content.replace(/<header class="re-unified-header-container"[\s\S]*?<\/header>/gi, '');
    content = content.replace(/<div class="announcement-bar">[\s\S]*?<\/header>/gi, '');
    content = content.replace(/<header class="site-header">[\s\S]*?<\/header>/gi, '');
    content = content.replace(/<div class="announcement-bar">[\s\S]*?<\/div>/gi, '');
    content = content.replace(/<script>\s*document\.addEventListener\('click'[\s\S]*?<\/script>/gi, '');

    // Strip outer wp:html block wrappers if present
    content = content.replace(/<!-- \/?wp:html -->/gi, '').trim();

    // Generate fresh unified header for production
    const newHeader = getReUnifiedHeader(siteUrl, pageInfo.active);

    // Insert new header right after <div class="te-live-page"> if present
    if (content.includes('<div class="te-live-page">')) {
      content = content.replace('<div class="te-live-page">', '<div class="te-live-page">\n' + newHeader);
    } else {
      content = `<div class="te-live-page">\n${newHeader}\n${content}\n</div>`;
    }

    // Wrap the entire content in a clean <!-- wp:html --> block to protect against wpautop
    // Note: If page is Cart or Checkout, ensure the shortcode block is preserved properly!
    let finalPayloadContent = '';
    if (pageInfo.isShortcode) {
      const shortcodeName = pageInfo.slug === 'cart' ? 'woocommerce_cart' : 'woocommerce_checkout';
      // Ensure the shortcode block is preserved outside wp:html if appropriate, or properly wrapped
      if (!content.includes(`[${shortcodeName}]`)) {
        console.warn(`WARNING: [${shortcodeName}] was missing, re-injecting shortcode!`);
        content += `\n<div class="te-wc-container">\n[${shortcodeName}]\n</div>`;
      }
      finalPayloadContent = `<!-- wp:html -->\n${content}\n<!-- /wp:html -->`;
    } else {
      finalPayloadContent = `<!-- wp:html -->\n${content}\n<!-- /wp:html -->`;
    }

    const updateRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/${pageInfo.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
        'X-WP-Nonce': nonce
      },
      body: JSON.stringify({
        content: finalPayloadContent,
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
    console.log(`✓ Page ${pageInfo.id} [${pageInfo.slug}] updated successfully (${updatedData.content?.raw?.length || 0} bytes)!`);
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
    console.log('✓ Cache successfully cleared:', data);
  } else {
    const text = await res.text();
    console.warn(`Cache clear returned HTTP ${res.status}:`, text);
  }
}

async function main() {
  console.log('=== DEPLOYING 5-TIER HEADER & SHINE SWEEP EFFECT TO REFLECTIONELITE.COM ===');
  const { siteUrl, cookies, nonce } = await getProdAuth();
  console.log('Authenticated to', siteUrl);

  await updateWpCode(siteUrl, cookies);
  await updateCorePages(siteUrl, cookies, nonce);
  await purgeCache(siteUrl, cookies, nonce);

  console.log('\n=== DEPLOYMENT AND CACHE PURGE COMPLETE! ===');
}

main().catch(err => {
  console.error('DEPLOYMENT FAILED:', err);
  process.exit(1);
});
