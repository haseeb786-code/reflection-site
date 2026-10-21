import fs from 'fs';
import path from 'path';
import { getProdAuth } from './prod_auth_helper.js';

const PROD_URL = 'https://reflectionelite.com';
const BACKUP_DIR = path.resolve('backups/production_com_pre_swap_20261018');

// 1. The 7 EXACT FROZEN REAL PRODUCTS
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
  --site-max-width: 1360px;
}

html, body {
  background: var(--color-bg-dark) !important;
  color: var(--color-text-light) !important;
  font-family: var(--font-body);
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* CAROUSEL SYSTEM */
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
  margin: 0 auto;
  height: 360px;
  overflow: hidden;
  background: #000000;
}

@media (min-width: 768px) {
  .re-carousel-box {
    height: 580px;
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
  transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
  transform: scale(1.02);
}

.re-carousel-slide.active {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  z-index: 2;
}

.re-carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
  display: block;
}

/* Chevrons */
.re-carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: rgba(15, 16, 18, 0.45);
  backdrop-filter: blur(4px);
  color: #f7ede2;
  border: 1px solid rgba(197, 168, 128, 0.4);
  width: 38px;
  height: 38px;
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
  border-color: #d4af37;
}
.re-carousel-nav.prev {
  left: 14px;
}
.re-carousel-nav.next {
  right: 14px;
}

/* Centered Gold Dots directly on bottom of image */
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
  background: rgba(255, 255, 255, 0.4);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
}
.re-carousel-dot.active {
  background: #c5a880;
  width: 22px;
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(197, 168, 128, 0.7);
}

/* Text Content Block */
.re-hero-content-block {
  text-align: center;
  padding: 26px 18px 36px;
  background: #0f1012;
  position: relative;
  z-index: 3;
  max-width: 900px;
  margin: 0 auto;
}

.re-hero-tagline {
  font-family: var(--font-trajan), 'Cinzel', serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.24em;
  color: #c5a880;
  text-transform: uppercase;
  margin-bottom: 14px;
}

.re-hero-main-title {
  font-family: var(--font-trajan), 'Cinzel', Georgia, serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: 0.08em;
  color: #e2c9a5;
  text-transform: uppercase;
  margin: 0 auto 24px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
}

@media (min-width: 768px) {
  .re-hero-main-title {
    font-size: 42px;
    letter-spacing: 0.1em;
    margin-bottom: 30px;
  }
}

.re-hero-cta-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.re-hero-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #111215;
  color: #ffffff !important;
  border: 1px solid #c5a880;
  font-family: var(--font-trajan), -apple-system, sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 12px 20px;
  text-decoration: none;
  border-radius: 2px;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.re-hero-btn:hover {
  background: #c5a880;
  color: #0f1012 !important;
  border-color: #d4af37;
  transform: translateY(-1px);
}

/* CATALOG GRID */
.cycle-section {
  padding: 60px 24px 50px;
  max-width: var(--site-max-width);
  margin: 0 auto;
}
.cycle-header {
  text-align: center;
  margin-bottom: 40px;
}
.cycle-header h2 {
  font-family: var(--font-trajan);
  font-size: 2rem;
  color: #ffffff;
  margin-bottom: 12px;
  letter-spacing: 0.06em;
}
.catalog-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
@media (max-width: 1024px) {
  .catalog-grid-4 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .catalog-grid-4 { grid-template-columns: 1fr; }
}

.luxury-card {
  background: var(--color-surface-dark);
  border: 1px solid var(--color-border);
  border-radius: 2px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}
.luxury-card:hover {
  border-color: var(--color-gold);
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.5);
}
.card-media {
  position: relative;
  width: 100%;
  aspect-ratio: 4/5;
  background: #000;
  overflow: hidden;
}
.card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}
.luxury-card:hover .card-media img {
  transform: scale(1.05);
}
.card-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.card-category {
  font-family: var(--font-trajan);
  font-size: 0.7rem;
  color: var(--color-gold);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.card-title {
  font-family: var(--font-trajan);
  font-size: 1.05rem;
  color: #ffffff;
  margin-bottom: 12px;
  letter-spacing: 0.05em;
  line-height: 1.3;
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
.btn-view {
  font-family: var(--font-trajan);
  font-size: 0.75rem;
  color: var(--color-text-light);
  text-decoration: none;
  letter-spacing: 0.1em;
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}
.btn-view:hover {
  border-color: var(--color-gold);
  color: var(--color-gold);
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

/* 4 VALUE PILLARS */
.pillars-section {
  padding: 70px 24px;
  background: var(--color-surface-dark);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
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
  padding: 20px 10px;
}
.pillar-icon {
  font-size: 2rem;
  color: var(--color-gold);
  margin-bottom: 16px;
}
.pillar-title {
  font-family: var(--font-trajan);
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.12em;
  margin-bottom: 10px;
}
.pillar-desc {
  font-size: 0.88rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}
`;

function getHeaderHtml(activeSlug = 'home') {
  const logoUrl = 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/Logo-Reflection-e1777369196767-1024x186.png';
  return `
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
      <a href="${PROD_URL}/" class="re-brand-center">
        <img src="${logoUrl}" alt="Reflection Elite" class="re-main-logo-img">
      </a>
      <a href="${PROD_URL}/cart/" class="re-cart-link">
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
        <a href="${PROD_URL}/" class="re-mobile-link ${activeSlug === 'home' ? 'is-active' : ''}">HOME</a>
        <a href="${PROD_URL}/shop/" class="re-mobile-link ${activeSlug === 'shop' ? 'is-active' : ''}">COLLECTIONS (7)</a>
        <a href="${PROD_URL}/product/antique-venetian-cushion/" class="re-mobile-link">MURANA SHOWCASE</a>
        <a href="${PROD_URL}/about-us/" class="re-mobile-link">ABOUT US</a>
        <a href="${PROD_URL}/contact/" class="re-mobile-link">CONTACT</a>
        <a href="${PROD_URL}/refund_returns-2/" class="re-mobile-link">POLICIES</a>
        <a href="${PROD_URL}/cart/" class="re-mobile-link">CART</a>
        <div class="re-mobile-btn-wrap">
          <a href="${PROD_URL}/custom-dimensions/" class="re-mobile-cta-btn">BOOK SURVEY</a>
        </div>
      </nav>
    </div>
  </div>
  <div class="re-announcement-strip">
    <span>FREE COMPREHENSIVE ON-SITE CONSULTATION &amp; LASER TEMPLATING &bull; BESPOKE LUXURY MIRRORS</span>
  </div>
  <div class="re-nav-row-desktop">
    <div class="re-nav-inner">
      <a href="${PROD_URL}/" class="re-nav-sublogo">
        <img src="${logoUrl}" alt="Reflection Elite">
      </a>
      <nav class="re-desktop-nav-links">
        <a href="${PROD_URL}/" class="re-nav-item ${activeSlug === 'home' ? 'is-active' : ''}">HOME</a>
        <a href="${PROD_URL}/shop/" class="re-nav-item ${activeSlug === 'shop' ? 'is-active' : ''}">COLLECTIONS (7)</a>
        <a href="${PROD_URL}/product/antique-venetian-cushion/" class="re-nav-item">MURANA SHOWCASE</a>
        <a href="${PROD_URL}/about-us/" class="re-nav-item">ABOUT US</a>
        <a href="${PROD_URL}/contact/" class="re-nav-item">CONTACT</a>
        <a href="${PROD_URL}/refund_returns-2/" class="re-nav-item">POLICIES</a>
        <a href="${PROD_URL}/cart/" class="re-nav-item">CART</a>
      </nav>
    </div>
  </div>
  <div class="re-book-survey-row">
    <div class="re-book-survey-inner">
      <a href="${PROD_URL}/custom-dimensions/" class="re-book-survey-btn">BOOK SURVEY</a>
    </div>
  </div>
</header>
  `.trim();
}

function getFooterHtml() {
  const logoUrl = 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/Logo-Reflection-e1777369196767-1024x186.png';
  return `
<footer class="re-unified-footer-container">
  <div class="re-footer-inner">
    <div class="re-footer-col brand-col">
      <img src="${logoUrl}" alt="Reflection Elite" class="re-footer-logo-img">
      <p class="re-footer-desc">Master artisans in handcrafted Venetian and bespoke architectural mirrors. Serving luxury residences across India.</p>
    </div>
    <div class="re-footer-col links-col">
      <h4>NAVIGATION</h4>
      <ul>
        <li><a href="${PROD_URL}/">Home</a></li>
        <li><a href="${PROD_URL}/shop/">Collections (7)</a></li>
        <li><a href="${PROD_URL}/product/antique-venetian-cushion/">Murana Showcase</a></li>
        <li><a href="${PROD_URL}/about-us/">About Us</a></li>
        <li><a href="${PROD_URL}/contact/">Contact</a></li>
      </ul>
    </div>
    <div class="re-footer-col links-col">
      <h4>LEGAL &amp; SUPPORT</h4>
      <ul>
        <li><a href="${PROD_URL}/privacy-policy-2/">Privacy Policy</a></li>
        <li><a href="${PROD_URL}/refund_returns-2/">Refund &amp; Cancellation</a></li>
        <li><a href="${PROD_URL}/custom-dimensions/">Bespoke Laser Templating</a></li>
      </ul>
    </div>
    <div class="re-footer-col atelier-col">
      <h4>ATELIER HEADQUARTERS</h4>
      <p>KGN Glass, On the way of Saligao Road<br>Parra, Goa 403510, India<br>Direct Atelier: +91 7387463103<br>Email: reflectionelite.com@gmail.com</p>
    </div>
  </div>
  <div class="re-footer-bottom">
    <p>&copy; 2026 Reflection Elite. Handcrafted in India. All Rights Reserved.</p>
  </div>
</footer>
  `.trim();
}

function buildHomeHtmlWithSlider() {
  const headerHtml = getHeaderHtml('home');
  const footerHtml = getFooterHtml();

  const venetianProducts = REAL_PRODUCTS.slice(0, 4);
  const contemporaryProducts = REAL_PRODUCTS.slice(4, 7);

  const venetianCards = venetianProducts.map(p => `
    <div class="luxury-card">
      <div class="card-media">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
      </div>
      <div class="card-info">
        <div class="card-category">${p.category}</div>
        <div class="card-title">${p.title}</div>
        <div class="card-price-row">
          <div class="card-price">${p.price}</div>
          <a href="${p.link}" class="btn-view">VIEW PIECE</a>
        </div>
      </div>
    </div>
  `).join('');

  const contemporaryCards = contemporaryProducts.map(p => `
    <div class="luxury-card">
      <div class="card-media">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
      </div>
      <div class="card-info">
        <div class="card-category">${p.category}</div>
        <div class="card-title">${p.title}</div>
        <div class="card-price-row">
          <div class="card-price">${p.price}</div>
          <a href="${p.link}" class="btn-view">VIEW PIECE</a>
        </div>
      </div>
    </div>
  `).join('');

  return `<!-- wp:html -->
<style id="te-home-styles">
${THEME_CSS}
</style>
<div class="te-live-page">
  ${headerHtml}

  <!-- STRUCTURED AUTO-SLIDE HERO BANNER (REPLACING BROKEN HERO) -->
  <section class="re-hero-section">
    <div class="re-carousel-box" id="reHeroCarousel">
      <div class="re-carousel-track" id="reCarouselTrack">
        <!-- Slide 1: Round Venetian Mirror -->
        <div class="re-carousel-slide active" data-slide="0">
          <img src="https://reflectionelite.com/wp-content/uploads/2026/10/banner_round_mirror.jpg" alt="Round Venetian Mirror" class="re-carousel-img">
        </div>
        <!-- Slide 2: Grand Standing Floor Mirror -->
        <div class="re-carousel-slide" data-slide="1">
          <img src="https://reflectionelite.com/wp-content/uploads/2026/10/banner_standing_mirror.jpg" alt="Grand Standing Venetian Mirror" class="re-carousel-img">
        </div>
      </div>

      <!-- Left / Right Navigation Chevrons -->
      <button class="re-carousel-nav prev" id="rePrevBtn" aria-label="Previous Slide">&#10094;</button>
      <button class="re-carousel-nav next" id="reNextBtn" aria-label="Next Slide">&#10095;</button>

      <!-- Centered Gold Pagination Dots at Bottom of Image -->
      <div class="re-carousel-dots" id="reCarouselDots">
        <button class="re-carousel-dot active" data-index="0" aria-label="Slide 1"></button>
        <button class="re-carousel-dot" data-index="1" aria-label="Slide 2"></button>
      </div>
    </div>

    <!-- Structured Content Block matching user design reference -->
    <div class="re-hero-content-block">
      <div class="re-hero-tagline">&mdash; THE ART OF REFLECTION &mdash;</div>
      <h1 class="re-hero-main-title">ELEVATE YOUR<br>SANCTUARY</h1>
      <div class="re-hero-cta-buttons">
        <a href="/shop/" class="re-hero-btn">EXPLORE THE COLLECTION</a>
        <a href="/contact/" class="re-hero-btn">COMMISSION BESPOKE</a>
      </div>
    </div>
  </section>

  <!-- VENETIAN CYCLE (4 PIECES) -->
  <section class="cycle-section">
    <div class="cycle-header">
      <div class="re-hero-tagline">&mdash; THE VENETIAN HERITAGE COLLECTION &mdash;</div>
      <h2>CENTURIES-OLD TIERED BEVELING</h2>
      <p style="color:var(--color-text-muted); max-width:640px; margin:0 auto;">Handcrafted Venetian mirror heritage preserved by master glass artisans.</p>
    </div>
    <div class="catalog-grid-4">
      ${venetianCards}
    </div>
  </section>

  <!-- FULL-WIDTH ATELIER BANNER -->
  <section class="atelier-banner">
    <div class="atelier-content">
      <div class="re-hero-tagline">&mdash; BESPOKE PRECISION &mdash;</div>
      <h2 style="font-size:2.5rem; color:#fff; margin-bottom:16px;">PERFECT DIMENSIONS. ZERO MARGIN FOR COMPROMISE.</h2>
      <p style="color:var(--color-text-muted); margin-bottom:30px;">Every residential interior demands exact proportions. Our white-glove engineering team provides on-site laser templating across major Indian metropolitan corridors.</p>
      <a href="/custom-dimensions/" class="re-hero-btn" style="background:var(--color-gold); color:#0f1012 !important;">EXPLORE CUSTOM CAPABILITIES</a>
    </div>
  </section>

  <!-- CONTEMPORARY CYCLE (3 PIECES) -->
  <section class="cycle-section" style="padding-top:20px;">
    <div class="cycle-header">
      <div class="re-hero-tagline">&mdash; MODERN STATEMENTS &mdash;</div>
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

// SLIDER JS SCRIPT TO INJECT INTO WPCODE FOOTER
const SLIDER_JS_FOOTER = `
<script id="re-hero-slider-script">
(function() {
  function initHeroSlider() {
    var slides = document.querySelectorAll('.re-carousel-slide');
    var dots = document.querySelectorAll('.re-carousel-dot');
    var prevBtn = document.getElementById('rePrevBtn');
    var nextBtn = document.getElementById('reNextBtn');
    var carousel = document.getElementById('reHeroCarousel');
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

    function nextSlide() {
      showSlide(currentIndex + 1);
    }

    function prevSlide() {
      showSlide(currentIndex - 1);
    }

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

    // Touch swipe support for mobile
    var startX = 0;
    if (carousel) {
      carousel.addEventListener('touchstart', function(e) {
        startX = e.changedTouches[0].screenX;
        stopAutoSlide();
      }, { passive: true });

      carousel.addEventListener('touchend', function(e) {
        var endX = e.changedTouches[0].screenX;
        if (startX - endX > 40) {
          nextSlide();
        } else if (endX - startX > 40) {
          prevSlide();
        }
        startAutoSlide();
      }, { passive: true });

      carousel.addEventListener('mouseenter', stopAutoSlide);
      carousel.addEventListener('mouseleave', startAutoSlide);
    }

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

async function deploy() {
  console.log('=== STEP 1: AUTHENTICATING WITH PRODUCTION WORDPRESS ===');
  const auth = await getProdAuth();
  console.log('✓ Authenticated successfully with nonce:', auth.nonce);

  console.log('=== STEP 2: UPDATING WPCODE FOOTER WITH SLIDER RUNTIME ===');
  const wpCodeRes = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { Cookie: auth.cookies }
  });
  const wpCodeHtml = await wpCodeRes.text();
  const nonceMatch = wpCodeHtml.match(/id="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i) 
                  || wpCodeHtml.match(/name="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i);
  if (nonceMatch) {
    const wpNonce = nonceMatch[1];
    const formBody = new URLSearchParams();
    formBody.append('insert-headers-and-footers_nonce', wpNonce);
    formBody.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-headers-footers');
    formBody.append('ihaf_insert_header', ''); // keeps existing unless overridden
    formBody.append('ihaf_insert_body', '');
    formBody.append('ihaf_insert_footer', SLIDER_JS_FOOTER);

    // Fetch existing header so we don't wipe it
    const headMatch = wpCodeHtml.match(/<textarea[^>]*name="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
    if (headMatch) {
      formBody.set('ihaf_insert_header', headMatch[1]);
    }

    const saveWpCode = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': auth.cookies
      },
      body: formBody.toString(),
      redirect: 'manual'
    });
    console.log(`✓ WPCode footer updated with slider runtime (HTTP ${saveWpCode.status})`);
  }

  console.log('=== STEP 3: UPDATING HOME PAGE (PAGE 68) ===');
  const newHomeHtml = buildHomeHtmlWithSlider();
  const pageRes = await fetch(`${auth.siteUrl}/wp-json/wp/v2/pages/68`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': auth.cookies,
      'X-WP-Nonce': auth.nonce
    },
    body: JSON.stringify({
      title: 'Reflection Elite',
      slug: 'home',
      content: newHomeHtml,
      status: 'publish'
    })
  });

  if (!pageRes.ok) {
    const err = await pageRes.text();
    throw new Error(`Failed to update Page 68: HTTP ${pageRes.status} - ${err}`);
  }

  const pageData = await pageRes.json();
  console.log(`✓ Successfully updated Page 68 on reflectionelite.com (${pageData.content?.raw?.length || 0} bytes)`);
  console.log('=== DEPLOYMENT COMPLETE! ===');
}

deploy().catch(console.error);
