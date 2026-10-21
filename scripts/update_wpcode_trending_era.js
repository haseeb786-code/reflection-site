import { getProdAuth } from './prod_auth_helper.js';

const TRENDING_ERA_GLOBAL_HEAD = `
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
  --color-gold: #c5a880;
  --color-gold-hover: #dfc299;
  --color-border: rgba(197, 168, 128, 0.22);
  --color-border-subtle: rgba(255, 255, 255, 0.08);
  --color-text-light: #f5f5f7;
  --color-text-muted: #a1a1aa;
}

/* Force dark luxury background across all standard WordPress/Astra templates */
html, body, #page, .site, #primary, #content, .ast-container, .entry-content, .ast-separate-container, .ast-plain-container, .ast-article-single, .woocommerce {
  background-color: var(--color-bg-dark) !important;
  background: var(--color-bg-dark) !important;
  color: var(--color-text-light) !important;
}

/* Suppress all default Astra theme chrome and duplicate bars */
#masthead, #colophon, .ast-site-header, .ast-above-header-wrap, .ast-above-header, 
.ast-below-header-wrap, .ast-below-header, .site-below-footer-wrap, .site-primary-footer-wrap, 
.ast-breadcrumbs-wrapper, .entry-title.ast-single-post-order, .ast-banner-layout-1, 
.ast-header-break-point .main-header-bar-wrap {
  display: none !important;
}

/* Single Product Page Theming to match Trending Era */
.woocommerce-product-gallery, .summary.entry-summary {
  background: var(--color-bg-dark) !important;
  color: var(--color-text-light) !important;
}
.summary.entry-summary .product_title {
  font-family: var(--font-trajan) !important;
  color: #ffffff !important;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.summary.entry-summary .price, .summary.entry-summary .price .amount {
  font-family: var(--font-trajan) !important;
  color: var(--color-gold) !important;
  font-weight: 700;
}
.single_add_to_cart_button.button {
  font-family: var(--font-trajan) !important;
  background: var(--color-gold) !important;
  color: #0f1012 !important;
  font-weight: 700 !important;
  letter-spacing: 0.1em !important;
  text-transform: uppercase !important;
  border-radius: 2px !important;
  padding: 14px 28px !important;
}
.single_add_to_cart_button.button:hover {
  background: var(--color-gold-hover) !important;
}
.woocommerce-tabs ul.tabs {
  background: transparent !important;
  border-bottom: 1px solid var(--color-border) !important;
}
.woocommerce-tabs ul.tabs li a {
  font-family: var(--font-trajan) !important;
  color: var(--color-text-muted) !important;
}
.woocommerce-tabs ul.tabs li.active a {
  color: var(--color-gold) !important;
}
.woocommerce-tabs .panel {
  background: var(--color-surface-dark) !important;
  color: var(--color-text-light) !important;
  border: 1px solid var(--color-border) !important;
  padding: 24px !important;
}
</style>
`;

async function updateWpCode() {
  console.log('=== UPDATING WPCODE TO TRENDING ERA GLOBAL THEME ===');
  const { siteUrl, cookies } = await getProdAuth();

  // 1. Fetch current settings page to get the fresh nonce
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

  // 2. Post updated header (Trending Era) and empty footer (removes old beige client script)
  const formBody = new URLSearchParams();
  formBody.append('insert-headers-and-footers_nonce', nonce);
  formBody.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-headers-footers');
  formBody.append('ihaf_insert_header', TRENDING_ERA_GLOBAL_HEAD);
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

  console.log(`✓ WPCode updated successfully (HTTP ${saveRes.status})`);
}

updateWpCode().catch(console.error);
