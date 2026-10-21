import fs from 'fs';

// 1. GLOBAL LUXURY CSS (Warm Ivory, Champagne Gold, Editorial Typography)
export function generateGlobalCss() {
  return `
<!-- Google Fonts: Playfair Display, Cinzel, Montserrat, Plus Jakarta Sans -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<style id="re-luxury-editorial-design-system">
  :root {
    --re-ivory: #F7F1E8;
    --re-cream: #FAF6F0;
    --re-soft-beige: #E9D9C4;
    --re-border-beige: #E2D6C5;
    --re-border-light: rgba(199, 161, 90, 0.25);
    --re-champagne-gold: #C7A15A;
    --re-gold-light: #DFBA73;
    --re-gold-dark: #A68038;
    --re-deep-espresso: #2A170D;
    --re-warm-walnut: #68462E;
    --re-charcoal: #11100F;
    --re-charcoal-glass: rgba(17, 16, 15, 0.82);
    --re-text-muted: #7A7268;
    --re-font-serif: 'Playfair Display', Georgia, serif;
    --re-font-display: 'Cinzel', serif;
    --re-font-sans: 'Plus Jakarta Sans', 'Montserrat', -apple-system, sans-serif;
  }

  /* Reset & Global Canvas */
  html, body, #page, .site, .site-content, .ast-container, #content, .entry-content, article {
    background-color: var(--re-ivory) !important;
    color: var(--re-deep-espresso) !important;
    font-family: var(--re-font-sans) !important;
    -webkit-font-smoothing: antialiased;
    margin: 0;
    padding: 0;
  }

  /* Astra Container Full-Width Breakout for Luxury Pages */
  .home #primary,
  .home #content,
  .home #content .ast-container,
  .home .entry-content,
  .woocommerce-shop #primary,
  .woocommerce-shop #content,
  .woocommerce-shop #content .ast-container,
  .woocommerce-shop .ast-woocommerce-container,
  body.page-id-120 #primary,
  body.page-id-120 #content,
  body.page-id-120 #content .ast-container,
  body.page-id-120 .entry-content,
  body.custom-dimensions #primary,
  body.custom-dimensions #content,
  body.custom-dimensions #content .ast-container,
  body.custom-dimensions .entry-content,
  body.page-id-50 #primary,
  body.page-id-50 #content,
  body.page-id-50 #content .ast-container,
  body.page-id-50 .entry-content,
  body.page-id-52 #primary,
  body.page-id-52 #content,
  body.page-id-52 #content .ast-container,
  body.page-id-52 .entry-content,
  body.page-id-102 #primary,
  body.page-id-102 #content,
  body.page-id-102 #content .ast-container,
  body.page-id-102 .entry-content,
  body.page-id-103 #primary,
  body.page-id-103 #content,
  body.page-id-103 #content .ast-container,
  body.page-id-103 .entry-content {
    max-width: 100% !important;
    width: 100% !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  /* Suppress default entry titles on custom pages */
  .home .entry-header,
  .home .entry-title,
  body.page-id-120 .entry-header,
  body.page-id-120 .entry-title,
  body.custom-dimensions .entry-header,
  body.custom-dimensions .entry-title,
  body.page-id-50 .entry-header,
  body.page-id-50 .entry-title,
  body.page-id-52 .entry-header,
  body.page-id-52 .entry-title,
  body.page-id-102 .entry-header,
  body.page-id-102 .entry-title,
  body.page-id-103 .entry-header,
  body.page-id-103 .entry-title,
  .woocommerce-shop .woocommerce-products-header,
  .woocommerce-shop .woocommerce-breadcrumb,
  .woocommerce-shop .ast-woocommerce-container > .woocommerce-notices-wrapper {
    display: none !important;
  }

  /* Suppress Astra default footer so only restrained luxury footer displays */
  footer#colophon,
  .site-footer,
  .ast-footer-copyright {
    display: none !important;
  }

  /* Suppress WordPress wpautop artifacts in grids */
  .re-collections-grid > p,
  .re-collections-grid br,
  .re-featured-products-grid > p,
  .re-featured-products-grid br,
  .re-contact-cards-grid > p,
  .re-contact-cards-grid br,
  .re-faq-grid > p,
  .re-faq-grid br,
  .re-form-row-2 > p,
  .re-form-row-2 br,
  .re-contact-inner-container > p,
  .entry-content > p:empty {
    display: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Editorial Typography */
  h1, h2, h3, h4, h5, h6,
  .re-serif-heading,
  .entry-title, .product_title,
  .woocommerce-loop-product__title {
    font-family: var(--re-font-serif) !important;
    color: var(--re-deep-espresso) !important;
    font-weight: 500;
    letter-spacing: -0.01em;
  }
  .re-serif-italic {
    font-family: var(--re-font-serif) !important;
    font-style: italic !important;
    color: var(--re-champagne-gold) !important;
  }

  /* --------------------------------------------------------------------------
     1. TOP ANNOUNCEMENT BAR
     -------------------------------------------------------------------------- */
  .re-top-announcement {
    background: #EFE7DC;
    border-bottom: 1px solid var(--re-border-beige);
    padding: 8px 16px;
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--re-deep-espresso);
    font-family: var(--re-font-sans);
  }
  .re-top-announcement span {
    opacity: 0.9;
  }
  .re-top-announcement .re-dot {
    margin: 0 10px;
    color: var(--re-champagne-gold);
  }

  /* --------------------------------------------------------------------------
     2. LUXURY HEADER & NAVIGATION BAR
     -------------------------------------------------------------------------- */
  header#masthead, .site-header, .main-header-bar, .ast-primary-header-bar, .ast-desktop-header {
    background-color: var(--re-ivory) !important;
    border-bottom: 1px solid var(--re-border-beige) !important;
    box-shadow: 0 2px 10px rgba(42, 23, 13, 0.03) !important;
  }
  .site-title a, .ast-site-title a {
    font-family: var(--re-font-serif) !important;
    font-size: 22px !important;
    font-weight: 700 !important;
    letter-spacing: 3px !important;
    text-transform: uppercase !important;
    color: var(--re-deep-espresso) !important;
    text-decoration: none !important;
  }
  .main-header-menu a, .main-navigation a, .ast-nav-menu a {
    font-family: var(--re-font-sans) !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    letter-spacing: 1px !important;
    text-transform: uppercase !important;
    color: var(--re-deep-espresso) !important;
    transition: color 0.25s ease !important;
  }
  .main-header-menu a:hover, .main-navigation a:hover, .ast-nav-menu a:hover,
  .main-header-menu .current-menu-item > a {
    color: var(--re-champagne-gold) !important;
  }

  /* Header Utility Icons (Search, Account, Cart) */
  .re-header-icons {
    display: flex;
    align-items: center;
    gap: 18px;
    margin-left: 24px;
  }
  .re-header-icon-link {
    color: var(--re-deep-espresso);
    text-decoration: none;
    position: relative;
    display: inline-flex;
    align-items: center;
    transition: color 0.2s;
  }
  .re-header-icon-link:hover {
    color: var(--re-champagne-gold);
  }
  .re-cart-badge {
    position: absolute;
    top: -5px;
    right: -8px;
    background: var(--re-deep-espresso);
    color: var(--re-ivory);
    font-size: 10px;
    font-weight: 700;
    min-width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Mobile Navigation Drawer Styling */
  .ast-header-break-point .ast-mobile-header-wrap,
  .ast-header-break-point .ast-mobile-header-content {
    background-color: var(--re-cream) !important;
    border-bottom: 1px solid var(--re-border-beige) !important;
  }
  .ast-header-break-point #ast-hf-mobile-menu {
    background-color: var(--re-cream) !important;
    padding: 8px 0 !important;
  }
  .ast-header-break-point #ast-hf-mobile-menu li {
    border-bottom: 1px solid rgba(199, 161, 90, 0.15) !important;
  }
  .ast-header-break-point #ast-hf-mobile-menu li:last-child {
    border-bottom: none !important;
  }
  .ast-header-break-point #ast-hf-mobile-menu a {
    font-family: var(--re-font-sans) !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    letter-spacing: 1.5px !important;
    text-transform: uppercase !important;
    color: var(--re-deep-espresso) !important;
    padding: 14px 24px !important;
    display: block !important;
    transition: all 0.2s ease !important;
  }
  .ast-header-break-point #ast-hf-mobile-menu .current-menu-item > a,
  .ast-header-break-point #ast-hf-mobile-menu .current_page_item > a,
  .ast-header-break-point #ast-hf-mobile-menu a:hover {
    color: var(--re-champagne-gold) !important;
    background-color: rgba(199, 161, 90, 0.08) !important;
    border-left: 3px solid var(--re-champagne-gold) !important;
  }
  .ast-header-break-point .main-header-menu-toggle {
    color: var(--re-deep-espresso) !important;
  }
  .ast-header-break-point .main-header-menu-toggle:hover,
  .ast-header-break-point .main-header-menu-toggle:focus {
    color: var(--re-champagne-gold) !important;
  }

  /* --------------------------------------------------------------------------
     3. HOMEPAGE HERO SECTION (Reference Image 1)
     -------------------------------------------------------------------------- */
  .re-hero-section {
    position: relative;
    width: 100%;
    min-height: 640px;
    background-image: url('https://mediumpurple-salamander-731288.hostingersite.com/wp-content/uploads/2026/10/reflection-elite-luxury-hero-bg.jpg');
    background-size: cover;
    background-position: center right;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--re-border-beige);
    box-sizing: border-box;
    padding: 80px 5vw;
  }
  .re-hero-container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .re-hero-content {
    max-width: 580px;
    z-index: 2;
  }
  .re-eyebrow-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }
  .re-eyebrow-line {
    width: 36px;
    height: 1px;
    background: var(--re-champagne-gold);
  }
  .re-eyebrow {
    font-family: var(--re-font-sans);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--re-warm-walnut);
  }
  .re-hero-heading {
    font-family: var(--re-font-serif) !important;
    font-size: clamp(36px, 4.5vw, 56px) !important;
    font-weight: 400 !important;
    line-height: 1.15 !important;
    margin: 0 0 22px 0 !important;
    color: var(--re-deep-espresso) !important;
    letter-spacing: -0.02em !important;
  }
  .re-hero-subheading {
    font-family: var(--re-font-sans);
    font-size: 16px;
    line-height: 1.7;
    color: #55483F;
    margin: 0 0 34px 0;
    font-weight: 400;
    max-width: 480px;
  }
  .re-hero-cta-group {
    display: flex;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
  }
  .re-btn-primary {
    background: var(--re-deep-espresso) !important;
    color: #FFFFFF !important;
    font-family: var(--re-font-sans) !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    letter-spacing: 1.8px !important;
    text-transform: uppercase !important;
    padding: 14px 28px !important;
    border-radius: 4px !important;
    text-decoration: none !important;
    display: inline-block !important;
    border: 1px solid var(--re-deep-espresso) !important;
    transition: all 0.25s ease !important;
    box-shadow: 0 4px 14px rgba(42, 23, 13, 0.15) !important;
  }
  .re-btn-primary:hover {
    background: var(--re-champagne-gold) !important;
    border-color: var(--re-champagne-gold) !important;
    color: #FFFFFF !important;
    transform: translateY(-2px);
  }
  .re-btn-secondary {
    background: transparent !important;
    color: var(--re-deep-espresso) !important;
    font-family: var(--re-font-sans) !important;
    font-size: 11.5px !important;
    font-weight: 600 !important;
    letter-spacing: 1.5px !important;
    text-transform: uppercase !important;
    padding: 13px 20px !important;
    border-radius: 4px !important;
    text-decoration: none !important;
    display: block !important;
    border: 1px solid var(--re-border-beige) !important;
    transition: all 0.25s ease !important;
    text-align: center !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }
  .re-btn-secondary:hover {
    background: var(--re-cream) !important;
    border-color: var(--re-champagne-gold) !important;
    color: var(--re-deep-espresso) !important;
    transform: translateY(-2px);
  }
  .re-btn-link {
    font-family: var(--re-font-sans);
    font-size: 13px;
    font-weight: 600;
    color: var(--re-deep-espresso);
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-color: var(--re-champagne-gold);
    transition: color 0.2s;
  }
  .re-btn-link:hover {
    color: var(--re-champagne-gold);
  }

  /* Venezia Badge on Hero (Reference 1) */
  .re-hero-badge {
    position: absolute;
    bottom: -15px;
    right: 0;
    background: #FFFFFF;
    border: 1px solid var(--re-border-beige);
    padding: 12px 20px;
    border-radius: 4px;
    box-shadow: 0 8px 24px rgba(42, 23, 13, 0.08);
    text-align: right;
    z-index: 2;
  }
  .re-badge-title {
    font-family: var(--re-font-serif);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--re-deep-espresso);
  }
  .re-badge-sub {
    font-family: var(--re-font-sans);
    font-size: 11px;
    color: var(--re-text-muted);
    font-style: italic;
    margin-top: 3px;
  }

  /* --------------------------------------------------------------------------
     4. FEATURED COLLECTIONS SECTION (Reference Image 1)
     -------------------------------------------------------------------------- */
  .re-collections-section {
    padding: 70px 5vw 40px 5vw;
    max-width: 1360px;
    margin: 0 auto;
    box-sizing: border-box;
  }
  .re-section-header {
    text-align: center;
    margin-bottom: 40px;
  }
  .re-sub-title-accent {
    font-family: var(--re-font-sans);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--re-champagne-gold);
    margin-bottom: 10px;
  }
  .re-section-title {
    font-family: var(--re-font-serif) !important;
    font-size: clamp(28px, 3.5vw, 40px) !important;
    font-weight: 400 !important;
    color: var(--re-deep-espresso) !important;
    margin: 0 !important;
  }

  .re-collections-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 50px;
  }
  .re-collection-card {
    position: relative;
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    text-decoration: none;
    box-shadow: 0 4px 18px rgba(42, 23, 13, 0.08);
    display: block;
    background: #2A170D;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .re-collection-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(42, 23, 13, 0.14);
  }
  .re-card-cover-link {
    position: absolute;
    inset: 0;
    z-index: 10;
    text-decoration: none;
    cursor: pointer;
  }
  .re-collection-img-wrap {
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    overflow: hidden;
  }
  .re-collection-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .re-collection-card:hover .re-collection-img-wrap img {
    transform: scale(1.08);
  }
  .re-collection-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(17,16,15,0.1) 0%, rgba(17,16,15,0.7) 100%);
    display: flex;
    align-items: flex-end;
    padding: 24px;
    box-sizing: border-box;
    z-index: 2;
  }
  .re-collection-overlay h3 {
    font-family: var(--re-font-serif) !important;
    font-size: 22px !important;
    color: #FFFFFF !important;
    margin: 0 !important;
    font-weight: 400 !important;
    letter-spacing: 0.5px;
  }

  /* --------------------------------------------------------------------------
     5. FEATURED PRODUCTS (Reference Image 1: Split 3 Cards)
     -------------------------------------------------------------------------- */
  .re-featured-products-section {
    max-width: 1360px;
    margin: 0 auto 70px auto;
    padding: 0 5vw;
    box-sizing: border-box;
  }
  .re-featured-products-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  .re-featured-product-card {
    background: #FFFFFF;
    border: 1px solid var(--re-border-beige);
    border-radius: 8px;
    padding: 18px;
    display: flex;
    align-items: center;
    gap: 18px;
    box-shadow: 0 2px 10px rgba(42, 23, 13, 0.03);
    transition: transform 0.25s, box-shadow 0.25s;
    box-sizing: border-box;
  }
  .re-featured-product-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(42, 23, 13, 0.08);
  }
  .re-product-card-img {
    width: 110px;
    height: 130px;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 4px;
    background: #FAF6F0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .re-product-card-img img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    transition: transform 0.4s;
  }
  .re-featured-product-card:hover .re-product-card-img img {
    transform: scale(1.05);
  }
  .re-product-card-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .re-product-card-title {
    font-family: var(--re-font-serif) !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    letter-spacing: 0.8px !important;
    text-transform: uppercase !important;
    color: var(--re-deep-espresso) !important;
    margin: 0 0 8px 0 !important;
    line-height: 1.35 !important;
  }
  .re-product-card-price {
    font-family: var(--re-font-serif);
    font-size: 18px;
    font-weight: 700;
    color: var(--re-champagne-gold);
    margin-bottom: 14px;
  }
  .re-btn-view-details {
    display: inline-block;
    border: 1px solid var(--re-champagne-gold);
    background: transparent;
    color: var(--re-deep-espresso);
    font-family: var(--re-font-sans);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    padding: 8px 16px;
    border-radius: 3px;
    text-decoration: none;
    text-align: center;
    transition: all 0.2s;
    width: fit-content;
  }
  .re-btn-view-details:hover {
    background: var(--re-deep-espresso);
    color: #FFFFFF;
    border-color: var(--re-deep-espresso);
  }

  /* --------------------------------------------------------------------------
     6. FULL CATALOG PAGE (Reference Image 2: /shop/)
     -------------------------------------------------------------------------- */
  .re-catalog-hero {
    position: relative;
    width: 100%;
    min-height: 340px;
    background-image: url('https://mediumpurple-salamander-731288.hostingersite.com/wp-content/uploads/2026/10/reflection-elite-luxury-catalog-banner.jpg');
    background-size: cover;
    background-position: center 25%;
    background-repeat: no-repeat;
    border-bottom: 1px solid var(--re-border-beige);
    padding: 50px 5vw 45px 5vw;
    box-sizing: border-box;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .re-catalog-breadcrumb {
    position: absolute;
    top: 24px;
    left: 5vw;
    font-family: var(--re-font-sans);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    color: #55483F;
  }
  .re-catalog-hero-inner {
    max-width: 820px;
    margin: 0 auto;
  }
  .re-catalog-eyebrow {
    font-family: var(--re-font-sans);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--re-champagne-gold);
    margin-bottom: 10px;
  }
  .re-catalog-title {
    font-family: var(--re-font-serif) !important;
    font-size: clamp(32px, 4vw, 46px) !important;
    font-weight: 400 !important;
    color: var(--re-deep-espresso) !important;
    margin: 0 0 12px 0 !important;
  }
  .re-catalog-sub {
    font-family: var(--re-font-sans);
    font-size: 15px;
    color: #55483F;
    max-width: 620px;
    margin: 0 auto 28px auto;
    line-height: 1.6;
  }

  /* Filter Pills */
  .re-filter-pills {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .re-pill-btn {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(4px);
    border: 1px solid var(--re-champagne-gold);
    color: var(--re-deep-espresso);
    font-family: var(--re-font-sans);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    padding: 8px 22px;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.25s;
  }
  .re-pill-btn:hover {
    border-color: var(--re-deep-espresso);
    color: var(--re-deep-espresso);
    background: #FFFFFF;
  }
  .re-pill-btn.active {
    background: var(--re-deep-espresso);
    color: #FFFFFF;
    border-color: var(--re-deep-espresso);
    box-shadow: 0 4px 12px rgba(42, 23, 13, 0.15);
  }

  /* Catalog Toolbar */
  .re-catalog-toolbar {
    max-width: 1360px;
    margin: 28px auto 20px auto;
    padding: 0 5vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: var(--re-text-muted);
    font-family: var(--re-font-sans);
    box-sizing: border-box;
  }
  .re-toolbar-controls {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .re-sort-dropdown {
    background: #FFFFFF;
    border: 1px solid var(--re-border-beige);
    border-radius: 4px;
    padding: 7px 14px;
    font-family: var(--re-font-sans);
    font-size: 12px;
    color: var(--re-deep-espresso);
    cursor: pointer;
    outline: none;
  }
  .re-toolbar-divider {
    color: var(--re-border-beige);
  }
  .re-toolbar-filter-btn {
    background: #FFFFFF;
    border: 1px solid var(--re-border-beige);
    border-radius: 4px;
    padding: 7px 14px;
    font-family: var(--re-font-sans);
    font-size: 12px;
    font-weight: 600;
    color: var(--re-deep-espresso);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }

  /* Catalog 4-Column Product Grid (Horizontal Split Cards matching Ref 2) */
  .re-catalog-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    max-width: 1360px;
    margin: 0 auto 70px auto;
    padding: 0 5vw;
    box-sizing: border-box;
  }
  .re-catalog-card {
    background: #FFFFFF;
    border: 1px solid var(--re-border-beige);
    border-radius: 8px;
    padding: 14px;
    display: flex;
    gap: 14px;
    box-shadow: 0 2px 6px rgba(42, 23, 13, 0.02);
    position: relative;
    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    box-sizing: border-box;
  }
  .re-catalog-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(42, 23, 13, 0.08);
    border-color: var(--re-champagne-gold);
  }
  .re-catalog-img-wrap {
    width: 44%;
    height: 155px;
    flex-shrink: 0;
    border-radius: 4px;
    overflow: hidden;
    background: #FAF6F0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .re-catalog-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    transition: transform 0.4s;
  }
  .re-catalog-card:hover .re-catalog-img-wrap img {
    transform: scale(1.06);
  }
  .re-catalog-info {
    width: 56%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-top: 2px;
  }
  .re-wishlist-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: #9E9184;
    transition: color 0.2s;
    z-index: 2;
  }
  .re-wishlist-btn:hover, .re-wishlist-btn.active {
    color: #D9383A;
  }
  .re-catalog-card-title {
    font-family: var(--re-font-serif) !important;
    font-size: 13px !important;
    font-weight: 700 !important;
    letter-spacing: 0.8px !important;
    text-transform: uppercase !important;
    color: var(--re-deep-espresso) !important;
    margin: 0 0 6px 0 !important;
    line-height: 1.35 !important;
    padding-right: 20px;
  }
  .re-catalog-card-price {
    font-family: var(--re-font-serif);
    font-size: 16px;
    font-weight: 700;
    color: var(--re-champagne-gold);
    margin-bottom: 6px;
  }
  .re-catalog-card-category {
    font-family: var(--re-font-sans);
    font-size: 11px;
    color: var(--re-text-muted);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .re-catalog-card-category::before {
    content: "○";
    font-size: 10px;
    color: var(--re-champagne-gold);
  }
  .re-btn-action {
    display: block;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    padding: 8px 10px;
    font-family: var(--re-font-sans);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    border-radius: 4px;
    text-decoration: none;
    transition: all 0.2s;
  }
  .re-btn-view {
    border: 1px solid var(--re-border-beige);
    background: #FFFFFF;
    color: var(--re-deep-espresso);
  }
  .re-btn-view:hover {
    border-color: var(--re-deep-espresso);
    background: var(--re-deep-espresso);
    color: #FFFFFF;
  }
  .re-btn-add {
    background: var(--re-deep-espresso);
    border: 1px solid var(--re-deep-espresso);
    color: #FFFFFF;
  }
  .re-btn-add:hover {
    background: var(--re-champagne-gold);
    border-color: var(--re-champagne-gold);
    color: #FFFFFF;
  }

  /* --------------------------------------------------------------------------
     7. BESPOKE / CUSTOM DIMENSIONS SECTION (Reference Image 3)
     -------------------------------------------------------------------------- */
  .re-bespoke-section,
  .re-dedicated-bespoke-wrapper {
    position: relative;
    width: 100%;
    min-height: 720px;
    background-color: var(--re-charcoal);
    background-image: url('https://mediumpurple-salamander-731288.hostingersite.com/wp-content/uploads/2026/10/reflection-elite-bespoke-custom-bg.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 80px 4vw 70px 4vw;
    box-sizing: border-box;
    color: #FFFFFF;
  }
  .re-bespoke-catalog-link-wrap {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 35px;
    width: 100%;
    max-width: 820px;
  }
  .re-gold-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(199, 161, 90, 0.6), transparent);
  }
  .re-btn-outline-gold {
    border: 1px solid var(--re-champagne-gold);
    border-radius: 50px;
    padding: 10px 28px;
    font-family: var(--re-font-sans);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #FAF4EB;
    text-decoration: none;
    background: rgba(17, 16, 15, 0.5);
    backdrop-filter: blur(8px);
    transition: all 0.25s;
    white-space: nowrap;
  }
  .re-btn-outline-gold:hover {
    background: var(--re-champagne-gold);
    color: #11100F;
    box-shadow: 0 0 25px rgba(199, 161, 90, 0.5);
  }

  /* Glassmorphism Panel matching Reference 3 */
  .re-bespoke-glass-panel {
    background: rgba(17, 16, 15, 0.78);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(199, 161, 90, 0.45);
    border-radius: 20px;
    padding: 50px 45px;
    max-width: 780px;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    position: relative;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.75), 0 0 40px rgba(199, 161, 90, 0.15);
  }
  .re-bespoke-glass-panel::before {
    content: "";
    position: absolute;
    top: -1px;
    left: 20%;
    right: 20%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #FFE4A0, transparent);
    border-radius: 2px;
    box-shadow: 0 0 10px #FFE4A0;
  }
  .re-bespoke-glass-panel::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 20%;
    right: 20%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #FFE4A0, transparent);
    border-radius: 2px;
    box-shadow: 0 0 10px #FFE4A0;
  }

  .re-panel-eyebrow {
    font-family: var(--re-font-sans);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--re-champagne-gold);
    margin-bottom: 20px;
  }
  .re-bespoke-heading {
    font-family: var(--re-font-serif) !important;
    font-size: clamp(28px, 3.8vw, 44px) !important;
    font-weight: 400 !important;
    color: #FFFFFF !important;
    line-height: 1.25 !important;
    margin: 0 0 20px 0 !important;
    letter-spacing: -0.01em !important;
  }
  .re-bespoke-copy {
    font-family: var(--re-font-sans);
    font-size: 15px;
    line-height: 1.7;
    color: #D3C9BE;
    max-width: 620px;
    margin: 0 auto 36px auto;
    font-weight: 300;
  }

  /* Glowing WhatsApp Pill Button */
  .re-bespoke-pill-btn {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    background: rgba(17, 16, 15, 0.9);
    border: 1px solid #DFBA73;
    box-shadow: 0 0 22px rgba(199, 161, 90, 0.4);
    border-radius: 50px;
    padding: 14px 30px;
    text-decoration: none;
    color: #FFFFFF;
    font-family: var(--re-font-sans);
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .re-bespoke-pill-btn:hover {
    box-shadow: 0 0 38px rgba(223, 186, 115, 0.7);
    transform: translateY(-2px);
    border-color: #FFE4A0;
    color: #FFFFFF;
  }
  .re-pill-icon {
    display: flex;
    align-items: center;
    color: #25D366;
  }
  .re-pill-divider {
    color: rgba(223, 186, 115, 0.4);
    font-weight: 300;
  }
  .re-gold-text-highlight {
    color: #DFBA73;
    font-weight: 700;
  }
  .re-pill-arrow {
    display: flex;
    align-items: center;
    color: #DFBA73;
    margin-left: 4px;
  }

  /* Dedicated Custom Dimensions Page (/custom-dimensions/) */
  body.page-id-120,
  body.custom-dimensions,
  body.page-id-120 #page,
  body.custom-dimensions #page,
  body.page-id-120 .site,
  body.custom-dimensions .site,
  body.page-id-120 .site-content,
  body.custom-dimensions .site-content,
  body.page-id-120 #content,
  body.custom-dimensions #content,
  body.page-id-120 .ast-container,
  body.custom-dimensions .ast-container,
  body.page-id-120 #primary,
  body.custom-dimensions #primary,
  body.page-id-120 .entry-content,
  body.custom-dimensions .entry-content,
  .re-dedicated-bespoke-wrapper {
    background-color: var(--re-charcoal) !important;
  }
  body.page-id-120 header#masthead,
  body.page-id-120 .site-header,
  body.page-id-120 .main-header-bar,
  body.page-id-120 .ast-primary-header-bar,
  body.page-id-120 .ast-desktop-header,
  body.custom-dimensions header#masthead,
  body.custom-dimensions .site-header,
  body.custom-dimensions .main-header-bar,
  body.custom-dimensions .ast-primary-header-bar,
  body.custom-dimensions .ast-desktop-header {
    background-color: #0E0D0C !important;
    border-bottom: 1px solid rgba(199, 161, 90, 0.3) !important;
  }
  body.page-id-120 .site-title a,
  body.custom-dimensions .site-title a {
    color: #FFFFFF !important;
  }
  body.page-id-120 .main-header-menu a,
  body.custom-dimensions .main-header-menu a,
  body.page-id-120 .re-header-icon-link,
  body.custom-dimensions .re-header-icon-link {
    color: #FAF4EB !important;
  }
  body.page-id-120 .main-header-menu a:hover,
  body.custom-dimensions .main-header-menu a:hover {
    color: var(--re-champagne-gold) !important;
  }
  body.page-id-120 .re-top-announcement,
  body.custom-dimensions .re-top-announcement {
    background: #0B0A09 !important;
    color: #E2D6C5 !important;
    border-bottom: 1px solid rgba(199, 161, 90, 0.2) !important;
  }

  /* --------------------------------------------------------------------------
     8. LUXURY FOOTER (Reference Image 3)
     -------------------------------------------------------------------------- */
  .re-luxury-footer {
    width: 100%;
    background: #0B0A09;
    border-top: 1px solid rgba(199, 161, 90, 0.3);
    padding: 24px 16px;
    text-align: center;
    font-family: var(--re-font-sans);
    font-size: 12px;
    color: #9C9184;
    letter-spacing: 0.5px;
    box-sizing: border-box;
  }
  .re-luxury-footer a {
    color: #C7A15A;
    text-decoration: none;
  }

  /* --------------------------------------------------------------------------
     9. WOOCOMMERCE CORE HARMONIZATION (Checkout, Cart, Single Product)
     -------------------------------------------------------------------------- */
  .woocommerce-cart .cart_totals,
  .woocommerce-checkout #order_review,
  .woocommerce-checkout #customer_details,
  .single-product div.product {
    background: #FFFFFF !important;
    border: 1px solid var(--re-border-beige) !important;
    border-radius: 12px !important;
    padding: 24px !important;
    box-shadow: 0 4px 20px rgba(42, 23, 13, 0.05) !important;
  }
  table.shop_table {
    border: 1px solid var(--re-border-beige) !important;
    background: #FFFFFF !important;
  }
  table.shop_table th {
    background: #FAF6F0 !important;
    color: var(--re-deep-espresso) !important;
    font-family: var(--re-font-serif) !important;
    border-bottom: 1px solid var(--re-border-beige) !important;
  }
  table.shop_table td {
    border-top: 1px solid var(--re-border-beige) !important;
    color: var(--re-deep-espresso) !important;
  }
  .woocommerce #respond input#submit, 
  .woocommerce a.button, 
  .woocommerce button.button, 
  .woocommerce input.button,
  .woocommerce #respond input#submit.alt, 
  .woocommerce a.button.alt, 
  .woocommerce button.button.alt, 
  .woocommerce input.button.alt {
    background: var(--re-deep-espresso) !important;
    color: #FFFFFF !important;
    font-family: var(--re-font-sans) !important;
    font-weight: 600 !important;
    letter-spacing: 1px !important;
    text-transform: uppercase !important;
    padding: 12px 24px !important;
    border-radius: 4px !important;
    border: none !important;
    transition: all 0.2s !important;
  }
  .woocommerce a.button:hover, 
  .woocommerce button.button:hover, 
  .woocommerce input.button:hover {
    background: var(--re-champagne-gold) !important;
    color: #FFFFFF !important;
  }
  #payment {
    background: #FAF6F0 !important;
    border: 1px solid var(--re-border-beige) !important;
    border-radius: 8px !important;
  }
  #payment div.payment_box {
    background: #FFFFFF !important;
    color: var(--re-deep-espresso) !important;
    border: 1px solid var(--re-border-beige) !important;
  }

  /* --------------------------------------------------------------------------
     10. OUR STORY / ABOUT US LUXURY EDITORIAL (Warm Ivory & Champagne System)
     -------------------------------------------------------------------------- */
  .re-story-page-wrapper {
    width: 100%;
    max-width: 100%;
    background-color: var(--re-ivory);
    color: var(--re-deep-espresso);
    font-family: var(--re-font-sans);
    padding-bottom: 70px;
    box-sizing: border-box;
  }
  .re-story-hero {
    position: relative;
    width: 100%;
    min-height: 380px;
    background-image: linear-gradient(180deg, rgba(247, 241, 232, 0.88) 0%, rgba(247, 241, 232, 0.95) 100%), url('https://reflectionelite.com/wp-content/uploads/2026/10/reflection-elite-luxury-catalog-banner.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 70px 24px 60px 24px;
    box-sizing: border-box;
    border-bottom: 1px solid var(--re-border-beige);
    margin-bottom: 50px;
  }
  .re-story-title {
    font-family: var(--re-font-serif) !important;
    font-size: clamp(32px, 4.5vw, 52px) !important;
    font-weight: 400 !important;
    color: var(--re-deep-espresso) !important;
    margin: 12px 0 18px 0 !important;
    letter-spacing: -0.02em !important;
    line-height: 1.2 !important;
  }
  .re-story-hero-sub {
    font-family: var(--re-font-sans);
    font-size: 16px;
    line-height: 1.8;
    color: #55483F;
    max-width: 720px;
    margin: 0 auto;
    font-weight: 400;
  }
  .re-story-inner-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 5vw;
    box-sizing: border-box;
  }
  .re-story-origins-section {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 48px;
    align-items: center;
    margin-bottom: 75px;
  }
  .re-story-section-heading {
    font-family: var(--re-font-serif) !important;
    font-size: clamp(26px, 3.2vw, 38px) !important;
    font-weight: 400 !important;
    color: var(--re-deep-espresso) !important;
    margin: 0 0 20px 0 !important;
    line-height: 1.25 !important;
  }
  .re-story-paragraph {
    font-size: 15px;
    line-height: 1.8;
    color: #55483F;
    margin-bottom: 18px;
    font-weight: 400;
  }
  .re-dark-accent {
    color: var(--re-deep-espresso);
    font-weight: 600;
  }
  .re-story-cta-group {
    display: flex;
    gap: 20px;
    align-items: center;
    margin-top: 28px;
    flex-wrap: wrap;
  }
  .re-story-highlights-card {
    background: #FFFFFF;
    border: 1px solid var(--re-border-beige);
    border-radius: 12px;
    padding: 36px 30px;
    box-shadow: 0 8px 30px rgba(42, 23, 13, 0.05);
  }
  .re-highlights-card-title {
    font-family: var(--re-font-serif) !important;
    font-size: 21px !important;
    color: var(--re-deep-espresso) !important;
    margin: 0 0 10px 0 !important;
    font-weight: 500 !important;
  }
  .re-gold-divider-mini {
    width: 40px;
    height: 1.5px;
    background: var(--re-champagne-gold);
    margin-bottom: 20px;
  }
  .re-gold-divider {
    width: 60px;
    height: 1.5px;
    background: var(--re-champagne-gold);
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
    font-size: 13.5px;
    line-height: 1.6;
    color: #55483F;
  }
  .re-highlight-icon {
    font-size: 18px;
    line-height: 1.3;
    flex-shrink: 0;
  }
  .re-highlight-bold {
    color: var(--re-deep-espresso);
    font-weight: 600;
  }
  .re-story-pillars-section {
    margin-bottom: 75px;
    text-align: center;
  }
  .re-story-pillars-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 22px;
    margin-top: 40px;
  }
  .re-story-pillar-card {
    background: #FFFFFF;
    border: 1px solid var(--re-border-beige);
    border-radius: 10px;
    padding: 32px 22px;
    text-align: center;
    box-shadow: 0 4px 18px rgba(42, 23, 13, 0.04);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .re-story-pillar-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(42, 23, 13, 0.08);
  }
  .re-pillar-icon-badge {
    font-size: 32px;
    margin-bottom: 14px;
  }
  .re-pillar-title {
    font-family: var(--re-font-serif) !important;
    font-size: 17px !important;
    font-weight: 600 !important;
    color: var(--re-deep-espresso) !important;
    margin: 0 0 10px 0 !important;
  }
  .re-pillar-desc {
    font-size: 13px;
    color: #68462E;
    line-height: 1.6;
    margin: 0;
  }
  .re-story-journey-section {
    background: #FAF6F0;
    border: 1px solid var(--re-border-beige);
    border-radius: 14px;
    padding: 50px 36px;
    margin-bottom: 75px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(42, 23, 13, 0.03);
  }
  .re-story-journey-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    margin-top: 36px;
  }
  .re-journey-step-card {
    background: #FFFFFF;
    border: 1px solid var(--re-border-beige);
    border-radius: 8px;
    padding: 24px 16px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(42, 23, 13, 0.03);
    transition: transform 0.3s ease, border-color 0.3s ease;
  }
  .re-journey-step-card:hover {
    transform: translateY(-3px);
    border-color: var(--re-champagne-gold);
  }
  .re-journey-step-num {
    font-family: var(--re-font-serif);
    font-size: 26px;
    font-weight: 700;
    color: var(--re-champagne-gold);
    line-height: 1;
    margin-bottom: 10px;
  }
  .re-journey-step-title {
    font-family: var(--re-font-serif) !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    color: var(--re-deep-espresso) !important;
    margin: 0 0 8px 0 !important;
    line-height: 1.3 !important;
  }
  .re-journey-step-desc {
    font-size: 12px;
    color: #68462E;
    line-height: 1.5;
    margin: 0;
  }
  .re-story-studio-card {
    background: #FAF6F0;
    border: 1px solid var(--re-champagne-gold);
    border-radius: 14px;
    padding: 48px 30px;
    text-align: center;
    box-shadow: 0 6px 24px rgba(42, 23, 13, 0.05);
    margin-bottom: 20px;
  }
  .re-studio-card-heading {
    font-family: var(--re-font-serif) !important;
    font-size: 28px !important;
    font-weight: 400 !important;
    color: var(--re-deep-espresso) !important;
    margin: 6px 0 0 0 !important;
  }
  .re-studio-card-address {
    font-size: 14.5px;
    color: #55483F;
    line-height: 1.7;
    margin: 20px auto 28px auto;
    max-width: 620px;
  }
  .re-studio-bold {
    color: var(--re-deep-espresso);
    font-size: 16px;
  }
  .re-studio-contact {
    color: var(--re-deep-espresso);
    font-weight: 600;
  }
  .re-studio-btn-group {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .re-studio-btn-group .re-btn-outline-gold {
    background: #143525 !important;
    color: #FFFFFF !important;
    border: 1px solid rgba(199, 161, 90, 0.6) !important;
  }
  .re-studio-btn-group .re-btn-outline-gold:hover {
    background: #25D366 !important;
    border-color: #25D366 !important;
    color: #FFFFFF !important;
  }

  /* --------------------------------------------------------------------------
     11. CONTACT PAGE (Page ID 52)
     -------------------------------------------------------------------------- */
  .re-contact-page-wrapper {
    background-color: var(--re-ivory);
    min-height: 100vh;
    padding-bottom: 80px;
  }
  .re-contact-hero {
    position: relative;
    background-color: var(--re-cream);
    border-bottom: 1px solid var(--re-border-beige);
    padding: 60px 4vw 50px 4vw;
    text-align: center;
  }
  .re-contact-title {
    font-family: var(--re-font-serif) !important;
    font-size: clamp(30px, 4.5vw, 48px) !important;
    font-weight: 400 !important;
    color: var(--re-deep-espresso) !important;
    margin: 12px 0 16px 0 !important;
    line-height: 1.2 !important;
  }
  .re-contact-hero-sub {
    font-size: 15.5px;
    color: #5A4E45;
    max-width: 680px;
    margin: 0 auto;
    line-height: 1.7;
  }
  .re-contact-hero .re-catalog-breadcrumb,
  .re-policy-hero .re-catalog-breadcrumb,
  .re-story-hero .re-catalog-breadcrumb {
    position: static !important;
    margin: 0 auto 16px auto !important;
    display: inline-block !important;
  }
  .re-policy-hero .re-gold-divider-mini,
  .re-inquiry-header .re-gold-divider-mini {
    margin: 14px auto 18px auto !important;
  }
  .re-contact-inner-container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 50px 24px 0 24px;
  }
  .re-contact-cards-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 60px;
  }
  .re-contact-card {
    background: #ffffff;
    border: 1px solid var(--re-border-beige);
    border-radius: 12px;
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 4px 20px rgba(42, 23, 13, 0.04);
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  }
  .re-contact-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(42, 23, 13, 0.08);
    border-color: var(--re-champagne-gold);
  }
  .re-contact-icon-badge {
    font-size: 32px;
    margin-bottom: 16px;
  }
  .re-contact-card-title {
    font-family: var(--re-font-serif) !important;
    font-size: 20px !important;
    color: var(--re-deep-espresso) !important;
    margin: 0 0 10px 0 !important;
    font-weight: 600 !important;
  }
  .re-contact-card-desc {
    font-size: 13.5px;
    color: #66584F;
    line-height: 1.6;
    margin: 0 0 16px 0;
  }
  .re-contact-highlight {
    font-size: 18px;
    font-weight: 700;
    color: var(--re-deep-espresso);
    margin-bottom: 20px;
    letter-spacing: 0.5px;
  }
  .re-contact-highlight-email {
    font-size: 14px;
    font-weight: 600;
    color: var(--re-champagne-gold);
    margin-bottom: 20px;
    word-break: break-all;
  }
  .re-contact-hours {
    font-size: 12.5px;
    font-weight: 600;
    color: #7A6C62;
    margin-bottom: 20px;
  }
  .re-contact-inquiry-container {
    background: var(--re-cream);
    border: 1px solid var(--re-border-beige);
    border-radius: 16px;
    padding: 50px 40px;
    margin-bottom: 60px;
    box-shadow: 0 4px 25px rgba(42, 23, 13, 0.04);
  }
  .re-inquiry-header {
    text-align: center;
    max-width: 680px;
    margin: 0 auto 36px auto;
  }
  .re-inquiry-heading {
    font-family: var(--re-font-serif) !important;
    font-size: clamp(24px, 3.5vw, 34px) !important;
    color: var(--re-deep-espresso) !important;
    margin: 10px 0 12px 0 !important;
    font-weight: 400 !important;
  }
  .re-inquiry-sub {
    font-size: 14.5px;
    color: #5A4E45;
    line-height: 1.6;
    margin: 16px 0 0 0;
  }
  .re-inquiry-form-card {
    max-width: 640px;
    margin: 0 auto;
  }
  .re-form-row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    margin-bottom: 18px;
  }
  .re-form-group {
    margin-bottom: 18px;
  }
  .re-form-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--re-deep-espresso);
    margin-bottom: 8px;
  }
  .re-form-input,
  .re-form-select,
  .re-form-textarea {
    width: 100%;
    box-sizing: border-box;
    background: #ffffff;
    border: 1px solid var(--re-border-beige);
    border-radius: 6px;
    padding: 13px 16px;
    font-size: 14px;
    font-family: var(--re-font-sans);
    color: var(--re-deep-espresso);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .re-form-input:focus,
  .re-form-select:focus,
  .re-form-textarea:focus {
    outline: none;
    border-color: var(--re-champagne-gold);
    box-shadow: 0 0 0 3px rgba(199, 161, 90, 0.2);
  }
  .re-btn-whatsapp-submit {
    width: 100%;
    background: var(--re-deep-espresso);
    color: #ffffff;
    font-family: var(--re-font-sans);
    font-size: 13.5px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 16px 24px;
    border: 1px solid var(--re-deep-espresso);
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    transition: background-color 0.25s, border-color 0.25s, transform 0.2s;
    box-shadow: 0 4px 15px rgba(42, 23, 13, 0.15);
  }
  .re-btn-whatsapp-submit:hover {
    background: var(--re-champagne-gold);
    border-color: var(--re-champagne-gold);
    color: var(--re-deep-espresso);
    transform: translateY(-2px);
  }
  .re-btn-icon-wa {
    fill: currentColor;
  }
  .re-contact-faq-section {
    margin-top: 60px;
  }
  .re-faq-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  .re-faq-card {
    background: #ffffff;
    border: 1px solid var(--re-border-beige);
    border-left: 3px solid var(--re-champagne-gold);
    border-radius: 8px;
    padding: 26px 24px;
    box-shadow: 0 4px 15px rgba(42, 23, 13, 0.03);
  }
  .re-faq-card-title {
    font-family: var(--re-font-serif) !important;
    font-size: 17px !important;
    color: var(--re-deep-espresso) !important;
    margin: 0 0 10px 0 !important;
    font-weight: 600 !important;
  }
  .re-faq-card-desc {
    font-size: 13.5px;
    color: #55483F;
    line-height: 1.65;
    margin: 0;
  }

  /* --------------------------------------------------------------------------
     12. POLICY PAGES (Page IDs 102 & 103)
     -------------------------------------------------------------------------- */
  .re-policy-page-wrapper {
    background-color: var(--re-ivory);
    min-height: 100vh;
    padding-bottom: 80px;
  }
  .re-policy-hero {
    background-color: var(--re-cream);
    border-bottom: 1px solid var(--re-border-beige);
    padding: 50px 24px 40px 24px;
    text-align: center;
  }
  .re-policy-title {
    font-family: var(--re-font-serif) !important;
    font-size: clamp(28px, 4vw, 42px) !important;
    color: var(--re-deep-espresso) !important;
    margin: 12px 0 14px 0 !important;
    font-weight: 400 !important;
  }
  .re-policy-hero-sub {
    font-size: 14.5px;
    color: #66584F;
    max-width: 600px;
    margin: 14px auto 0 auto;
    line-height: 1.6;
  }
  .re-policy-card {
    max-width: 900px;
    margin: 40px auto 0 auto;
    padding: 48px 44px;
    background: #ffffff;
    border: 1px solid var(--re-border-beige);
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(42, 23, 13, 0.04);
  }
  .re-policy-lead {
    font-size: 15.5px;
    color: #4A3B32;
    line-height: 1.8;
    margin-bottom: 28px;
  }
  .re-policy-heading {
    font-family: var(--re-font-serif) !important;
    font-size: 22px !important;
    color: var(--re-deep-espresso) !important;
    margin: 32px 0 14px 0 !important;
    font-weight: 600 !important;
    border-bottom: 1px solid rgba(199, 161, 90, 0.2);
    padding-bottom: 8px;
  }
  .re-policy-text {
    font-size: 14.5px;
    color: #4A3B32;
    line-height: 1.75;
    margin-bottom: 16px;
  }
  .re-policy-list {
    padding-left: 24px;
    margin-bottom: 24px;
  }
  .re-policy-list li {
    font-size: 14px;
    color: #4A3B32;
    line-height: 1.75;
    margin-bottom: 10px;
  }
  .re-policy-atelier-box {
    background: var(--re-cream);
    border: 1px solid var(--re-border-beige);
    border-left: 3px solid var(--re-champagne-gold);
    border-radius: 8px;
    padding: 20px 24px;
    font-size: 14px;
    color: #4A3B32;
    line-height: 1.7;
    margin-top: 24px;
  }
  .re-gold-link {
    color: var(--re-champagne-gold) !important;
    text-decoration: underline !important;
    font-weight: 600 !important;
  }
  .re-gold-link:hover {
    color: var(--re-deep-espresso) !important;
  }

  /* --------------------------------------------------------------------------
     13. WOOCOMMERCE & GLOBAL LUXURY ACCENTS OVERRIDES
     -------------------------------------------------------------------------- */
  .woocommerce-tabs ul.tabs {
    background: transparent !important;
    border-bottom: 1px solid var(--re-border-beige) !important;
  }
  .woocommerce-tabs ul.tabs li {
    background-color: var(--re-cream) !important;
    border: 1px solid var(--re-border-beige) !important;
    border-bottom: none !important;
    border-radius: 4px 4px 0 0 !important;
  }
  .woocommerce-tabs ul.tabs li a {
    color: var(--re-deep-espresso) !important;
    font-family: var(--re-font-sans) !important;
    font-weight: 600 !important;
    font-size: 13px !important;
    letter-spacing: 0.5px !important;
  }
  .woocommerce-tabs ul.tabs li.active {
    background-color: #ffffff !important;
    border-color: var(--re-border-beige) !important;
    border-top: 2px solid var(--re-champagne-gold) !important;
  }
  .woocommerce-tabs ul.tabs li.active a {
    color: var(--re-champagne-gold) !important;
  }
  .woocommerce-tabs ul.tabs li::before,
  .woocommerce-tabs ul.tabs li::after {
    display: none !important;
  }
  .woocommerce-tabs .panel {
    background: #ffffff !important;
    border: 1px solid var(--re-border-beige) !important;
    border-top: none !important;
    padding: 30px !important;
    border-radius: 0 0 8px 8px !important;
    color: #4A3B32 !important;
  }

  /* Notices & Info Banners (Blue Overrides) */
  .woocommerce-info,
  .woocommerce-message,
  .woocommerce-noreviews {
    background-color: var(--re-cream) !important;
    color: var(--re-deep-espresso) !important;
    border-top: 3px solid var(--re-champagne-gold) !important;
    border-left: 1px solid var(--re-border-beige) !important;
    border-right: 1px solid var(--re-border-beige) !important;
    border-bottom: 1px solid var(--re-border-beige) !important;
    border-radius: 6px !important;
    font-size: 14px !important;
  }
  .woocommerce-info::before,
  .woocommerce-message::before {
    color: var(--re-champagne-gold) !important;
  }
  .woocommerce-info a,
  .woocommerce-message a {
    color: var(--re-champagne-gold) !important;
    font-weight: 600 !important;
  }

  /* My Account Links & Buttons (Blue Overrides) */
  .woocommerce-MyAccount-navigation ul {
    border-right: 1px solid var(--re-border-beige) !important;
  }
  .woocommerce-MyAccount-navigation li a {
    color: var(--re-deep-espresso) !important;
    font-weight: 500 !important;
  }
  .woocommerce-MyAccount-navigation li.is-active a {
    color: var(--re-champagne-gold) !important;
    font-weight: 700 !important;
  }
  .woocommerce-MyAccount-content a {
    color: var(--re-champagne-gold) !important;
    text-decoration: underline !important;
  }
  .woocommerce-MyAccount-content a.button,
  .woocommerce-Button,
  .button.wc-backward {
    background-color: var(--re-deep-espresso) !important;
    color: var(--re-ivory) !important;
    border-radius: 4px !important;
    font-weight: 600 !important;
    letter-spacing: 1px !important;
    text-transform: uppercase !important;
    border: 1px solid var(--re-deep-espresso) !important;
    text-decoration: none !important;
  }
  .woocommerce-MyAccount-content a.button:hover,
  .woocommerce-Button:hover,
  .button.wc-backward:hover {
    background-color: var(--re-champagne-gold) !important;
    border-color: var(--re-champagne-gold) !important;
    color: var(--re-deep-espresso) !important;
  }

  /* Astra Scroll-to-Top Brand Re-skin (Luxury Dark Espresso & Champagne Gold) */
  #ast-scroll-top,
  .ast-scroll-top-icon {
    background-color: var(--re-deep-espresso) !important;
    color: var(--re-champagne-gold) !important;
    border: 1px solid var(--re-champagne-gold) !important;
    border-radius: 50% !important;
    box-shadow: 0 4px 16px rgba(42, 23, 13, 0.35) !important;
    width: 44px !important;
    height: 44px !important;
    line-height: 42px !important;
    text-align: center !important;
    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1) !important;
  }
  #ast-scroll-top:hover,
  #ast-scroll-top:focus {
    background-color: var(--re-champagne-gold) !important;
    color: #FFFFFF !important;
    border-color: #FFE4A0 !important;
    box-shadow: 0 6px 24px rgba(199, 161, 90, 0.5) !important;
    transform: translateY(-2px) !important;
  }
  #ast-scroll-top .ast-icon {
    fill: currentColor !important;
    color: currentColor !important;
  }

  /* --------------------------------------------------------------------------
     14. RESPONSIVE BREAKPOINTS (Desktop, Tablet, Mobile)
     -------------------------------------------------------------------------- */
  @media (max-width: 992px) {
    .re-hero-section {
      min-height: 520px;
      padding: 60px 4vw;
    }
    .re-collections-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .re-collection-card {
      height: 160px;
    }
    .re-featured-products-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .re-catalog-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    .re-hero-badge {
      position: static;
      margin-top: 24px;
      display: inline-block;
      text-align: left;
    }
    .re-story-origins-section {
      grid-template-columns: 1fr;
      gap: 36px;
    }
    .re-story-pillars-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
    }
    .re-story-journey-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
    }
    .re-contact-cards-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
    }
  }

  @media (max-width: 768px) {
    /* Prevent 320px horizontal overflow across all pages */
    html, body {
      overflow-x: hidden !important;
      max-width: 100vw !important;
    }

    /* Remove clashing floating button on mobile to avoid content & WhatsApp collision */
    #ast-scroll-top {
      display: none !important;
    }

    /* Top Announcement Bar Responsive */
    .re-top-announcement {
      padding: 7px 12px !important;
      font-size: 10px !important;
      letter-spacing: 0.8px !important;
      line-height: 1.35 !important;
    }
    .re-announcement-nowrap {
      white-space: nowrap !important;
    }

    /* Hero Section Mobile Polish - Frosted Luxury Scrim & High Contrast CTA */
    .re-hero-section {
      min-height: 500px !important;
      padding: 32px 16px 40px 16px !important;
      background-position: 82% center !important;
      align-items: center !important;
      box-sizing: border-box !important;
    }
    .re-hero-content {
      max-width: 100% !important;
      width: 100% !important;
      background: linear-gradient(135deg, rgba(247, 241, 232, 0.94) 0%, rgba(250, 246, 240, 0.90) 70%, rgba(247, 241, 232, 0.85) 100%) !important;
      backdrop-filter: blur(12px) !important;
      -webkit-backdrop-filter: blur(12px) !important;
      padding: 24px 18px !important;
      border-radius: 12px !important;
      border: 1px solid rgba(199, 161, 90, 0.35) !important;
      box-shadow: 0 10px 30px rgba(42, 23, 13, 0.10) !important;
      box-sizing: border-box !important;
    }
    .re-hero-heading {
      font-size: clamp(24px, 6.5vw, 30px) !important;
      line-height: 1.25 !important;
      margin-bottom: 12px !important;
      color: var(--re-deep-espresso) !important;
    }
    .re-hero-subheading {
      font-size: 13.5px !important;
      line-height: 1.6 !important;
      margin-bottom: 20px !important;
      color: #4A3E36 !important;
    }
    .re-hero-badge {
      display: none !important;
    }
    .re-hero-cta-group {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 10px !important;
    }
    .re-btn-primary {
      text-align: center !important;
      width: 100% !important;
      box-sizing: border-box !important;
      padding: 13px 20px !important;
      font-size: 11.5px !important;
    }
    .re-btn-link {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 11px 16px !important;
      background: rgba(199, 161, 90, 0.12) !important;
      border: 1px solid rgba(199, 161, 90, 0.45) !important;
      border-radius: 4px !important;
      color: var(--re-deep-espresso) !important;
      font-weight: 700 !important;
      font-size: 12px !important;
      text-decoration: none !important;
      transition: all 0.2s ease !important;
    }
    .re-btn-link:hover {
      background: rgba(199, 161, 90, 0.25) !important;
      color: var(--re-deep-espresso) !important;
    }

    .re-collections-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .re-collection-card {
      height: 170px;
    }

    /* Category Filter Pills: Elegant Horizontal Scroll Rail */
    .re-filter-pills {
      display: flex !important;
      flex-wrap: nowrap !important;
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch !important;
      justify-content: flex-start !important;
      gap: 8px !important;
      padding: 10px 16px 12px 16px !important;
      margin: 0 -20px !important;
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
    }
    .re-filter-pills::-webkit-scrollbar {
      display: none !important;
    }
    .re-pill-btn {
      flex-shrink: 0 !important;
      white-space: nowrap !important;
      padding: 7px 16px !important;
      font-size: 11.5px !important;
    }

    /* 2-Column Product Catalog Grid: Aligned Baselines & Uniform Cards */
    .re-catalog-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 12px !important;
      padding: 0 16px !important;
      box-sizing: border-box !important;
    }
    .re-catalog-grid.re-single-result {
      grid-template-columns: 1fr !important;
      max-width: 320px !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
    .re-catalog-card {
      display: flex !important;
      flex-direction: column !important;
      height: 100% !important;
      box-sizing: border-box !important;
      padding: 10px !important;
      background: #FFFFFF !important;
      border: 1px solid var(--re-border-beige) !important;
      border-radius: 8px !important;
      position: relative !important;
    }
    .re-catalog-img-wrap {
      width: 100% !important;
      height: 140px !important;
      flex-shrink: 0 !important;
      border-radius: 4px !important;
      background: #FAF6F0 !important;
      border: 1px solid rgba(199, 161, 90, 0.15) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      overflow: hidden !important;
      box-sizing: border-box !important;
    }
    .re-catalog-img-wrap img {
      width: 100% !important;
      height: 100% !important;
      object-fit: contain !important;
    }
    .re-catalog-info {
      flex: 1 !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      width: 100% !important;
      box-sizing: border-box !important;
      margin-top: 10px !important;
      padding-top: 0 !important;
    }
    .re-catalog-card-header-group {
      display: flex !important;
      flex-direction: column !important;
    }
    .re-catalog-card-title {
      font-size: 11.5px !important;
      line-height: 1.35 !important;
      margin: 0 0 4px 0 !important;
      padding-right: 0 !important;
      min-height: 32px !important;
      display: -webkit-box !important;
      -webkit-line-clamp: 2 !important;
      -webkit-box-orient: vertical !important;
      overflow: hidden !important;
      color: var(--re-deep-espresso) !important;
    }
    .re-catalog-card-price {
      font-size: 13.5px !important;
      margin-bottom: 4px !important;
      min-height: 18px !important;
      color: var(--re-champagne-gold) !important;
    }
    .re-catalog-card-category {
      font-size: 10px !important;
      margin-bottom: 8px !important;
      min-height: 16px !important;
      color: var(--re-text-muted) !important;
    }
    .re-btn-action {
      margin-top: auto !important;
      display: block !important;
      width: 100% !important;
      box-sizing: border-box !important;
      text-align: center !important;
      padding: 8px 10px !important;
      font-size: 10.5px !important;
      letter-spacing: 0.8px !important;
      font-weight: 700 !important;
      border-radius: 4px !important;
      border: 1px solid var(--re-border-beige) !important;
      background: #FFFFFF !important;
      color: var(--re-deep-espresso) !important;
      text-decoration: none !important;
      transition: all 0.2s ease !important;
    }
    .re-btn-action:hover,
    .re-btn-action:focus {
      border-color: var(--re-champagne-gold) !important;
      background: var(--re-champagne-gold) !important;
      color: #FFFFFF !important;
    }

    .re-catalog-breadcrumb {
      position: static;
      margin-bottom: 12px;
    }
    .re-catalog-toolbar {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
      padding: 0 16px;
    }

    /* Bespoke & Custom Dimensions Section Mobile Fix */
    .re-bespoke-section,
    .re-dedicated-bespoke-wrapper {
      min-height: auto;
      padding: 40px 14px 36px 14px !important;
      box-sizing: border-box !important;
      max-width: 100% !important;
    }
    .re-bespoke-catalog-link-wrap {
      max-width: 100% !important;
      width: 100% !important;
      box-sizing: border-box !important;
      justify-content: center !important;
      gap: 10px !important;
      margin-bottom: 24px !important;
    }
    .re-gold-line {
      max-width: 30px !important;
    }
    .re-btn-outline-gold {
      max-width: 100% !important;
      box-sizing: border-box !important;
      white-space: normal !important;
      text-align: center !important;
      padding: 8px 16px !important;
      font-size: 10.5px !important;
      letter-spacing: 1px !important;
    }
    .re-bespoke-glass-panel {
      padding: 28px 16px !important;
      border-radius: 14px !important;
      box-sizing: border-box !important;
      max-width: 100% !important;
      width: 100% !important;
    }
    .re-bespoke-heading {
      font-size: 22px !important;
      line-height: 1.3 !important;
    }
    .re-bespoke-copy {
      font-size: 13px !important;
      line-height: 1.6 !important;
      margin-bottom: 22px !important;
      word-break: break-word !important;
    }
    .re-bespoke-pill-btn {
      padding: 10px 14px !important;
      font-size: 11.5px !important;
      flex-wrap: wrap !important;
      justify-content: center !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
      text-align: center !important;
      line-height: 1.4 !important;
      gap: 6px !important;
    }
    .re-bespoke-pill-btn .re-pill-text {
      word-break: break-word !important;
    }
    .re-pill-divider {
      display: none !important;
    }

    /* Our Story Page Mobile */
    .re-story-hero {
      min-height: 300px;
      padding: 40px 16px 30px 16px !important;
    }
    .re-story-title {
      font-size: 26px !important;
    }
    .re-story-hero-sub {
      font-size: 13.5px !important;
      line-height: 1.6 !important;
    }
    .re-story-inner-container {
      padding: 0 14px !important;
      box-sizing: border-box !important;
      max-width: 100% !important;
    }
    .re-story-origins-section {
      margin-bottom: 40px !important;
    }
    .re-story-pillars-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .re-story-journey-section {
      padding: 30px 16px !important;
      margin-bottom: 40px !important;
    }
    .re-story-journey-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    /* Goa Atelier Card: Zero Button Overflow Fix */
    .re-story-studio-card {
      padding: 28px 16px !important;
      border-radius: 12px !important;
      box-sizing: border-box !important;
      max-width: 100% !important;
      overflow: hidden !important;
      margin-bottom: 30px !important;
    }
    .re-studio-card-heading {
      font-size: 22px !important;
      margin: 8px 0 !important;
    }
    .re-studio-card-address {
      font-size: 13.5px !important;
      line-height: 1.6 !important;
      margin: 14px auto 20px auto !important;
    }
    .re-studio-btn-group {
      display: flex !important;
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 10px !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }
    .re-studio-btn-group a {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
      white-space: normal !important;
      text-align: center !important;
      font-size: 11px !important;
      letter-spacing: 0.8px !important;
      padding: 12px 14px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin: 0 !important;
    }
    .re-studio-btn-group a.re-btn-outline-gold {
      background: #143525 !important;
      color: #FFFFFF !important;
      border: 1px solid rgba(199, 161, 90, 0.6) !important;
      box-shadow: 0 4px 14px rgba(20, 53, 37, 0.25) !important;
    }
    .re-studio-btn-group a.re-btn-outline-gold:hover,
    .re-studio-btn-group a.re-btn-outline-gold:focus {
      background: #25D366 !important;
      border-color: #25D366 !important;
      color: #FFFFFF !important;
    }

    /* Contact Page Mobile */
    .re-contact-hero {
      padding: 40px 16px 30px 16px !important;
    }
    .re-contact-title {
      font-size: 26px !important;
    }
    .re-contact-cards-grid {
      grid-template-columns: 1fr !important;
      gap: 16px !important;
    }
    .re-contact-inquiry-container {
      padding: 28px 16px !important;
      box-sizing: border-box !important;
    }
    .re-form-row-2 {
      grid-template-columns: 1fr !important;
      gap: 14px !important;
    }
    .re-faq-grid {
      grid-template-columns: 1fr !important;
      gap: 16px !important;
    }

    /* Policy Pages Mobile */
    .re-policy-hero {
      padding: 36px 16px 24px 16px !important;
    }
    .re-policy-title {
      font-size: 24px !important;
    }
    .re-policy-card {
      padding: 24px 16px !important;
      margin: 16px 12px 0 12px !important;
      box-sizing: border-box !important;
    }
  }

  /* Ultra-small viewports (320px - 360px) */
  @media (max-width: 480px) {
    .re-top-announcement {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 2px !important;
      padding: 6px 10px !important;
      font-size: 9px !important;
      letter-spacing: 0.6px !important;
    }
    .re-top-announcement .re-dot {
      display: none !important;
    }
    .re-gold-line {
      display: none !important;
    }
    .re-bespoke-catalog-link-wrap {
      justify-content: center !important;
    }
    .re-catalog-grid {
      gap: 8px !important;
      padding: 0 10px !important;
    }
    .re-catalog-card {
      padding: 8px !important;
    }
    .re-catalog-img-wrap {
      height: 125px !important;
    }
    .re-catalog-card-title {
      font-size: 11px !important;
      min-height: 30px !important;
    }
    .site-title a, .ast-site-title a {
      font-size: clamp(16px, 4.8vw, 20px) !important;
      letter-spacing: 1px !important;
      white-space: nowrap !important;
    }
    .re-btn-action {
      padding: 7px 6px !important;
      font-size: 10px !important;
    }
  }
</style>
`;
}
