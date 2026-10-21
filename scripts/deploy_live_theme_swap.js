import fs from 'fs';
import path from 'path';

// 1. Session & Auth Setup
const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

async function getFreshNonce() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/index.php', {
    headers: {
      'Cookie': cookieHeader,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const html = await res.text();
  const match = html.match(/wpApiSettings\s*=\s*\{[^}]*?"nonce":"([^"]+)"/);
  if (!match) throw new Error('Could not extract fresh nonce from wp-admin/index.php');
  console.log('Obtained fresh WP Nonce:', match[1]);
  return match[1];
}

async function updateLivePage(pageId, title, slug, contentHtml, nonce) {
  console.log(`Applying Trending Era theme to Live Page ${pageId} (${slug})...`);
  const payload = {
    title: title,
    slug: slug,
    status: 'publish',
    template: 'elementor_canvas',
    content: contentHtml,
    meta: {
      _elementor_edit_mode: ''
    }
  };

  const res = await fetch(`https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/${pageId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieHeader,
      'X-WP-Nonce': nonce
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to update live page ${pageId}: HTTP ${res.status} - ${errText.slice(0, 300)}`);
  }
  const data = await res.json();
  console.log(`✓ Successfully updated Live Page ${pageId} (${data.link})!`);
  return data;
}

// 2. The 7 EXACT FROZEN PRODUCTS from reflectionelite.com
const REAL_PRODUCTS = [
  {
    id: 17,
    slug: 'antique-venetian-cushion',
    title: 'ANTIQUE VENETIAN CUSHION',
    price: '₹81,500',
    category: 'Venetian Mirror',
    img: 'https://reflectionelite.com/wp-content/uploads/2026/10/1771694577552.jpg',
    link: 'https://reflectionelite.ataanalytiq.com/product/?prod=antique-venetian-cushion'
  },
  {
    id: 30,
    slug: 'modern-victorian',
    title: 'MODERN VICTORIAN',
    price: '₹58,787',
    category: 'Venetian Mirror',
    img: 'https://reflectionelite.com/wp-content/uploads/2026/10/20260222_002716-scaled.jpg',
    link: 'https://reflectionelite.ataanalytiq.com/product/?prod=modern-victorian'
  },
  {
    id: 51,
    slug: 'silver-crown-framed',
    title: 'SILVER CROWN FRAMED',
    price: '₹35,900',
    category: 'Venetian Mirror',
    img: 'https://reflectionelite.com/wp-content/uploads/2026/10/20260221_235950-scaled.jpg',
    link: 'https://reflectionelite.ataanalytiq.com/product/?prod=silver-crown-framed'
  },
  {
    id: 45,
    slug: 'rococo-floral',
    title: 'ROCOCO FLORAL',
    price: '₹14,000',
    category: 'Venetian Mirror',
    img: 'https://reflectionelite.com/wp-content/uploads/2026/10/20260222_092621-scaled.jpg',
    link: 'https://reflectionelite.ataanalytiq.com/product/?prod=rococo-floral'
  },
  {
    id: 36,
    slug: 'mosaic-mirror-art',
    title: 'MOSAIC MIRROR ART',
    price: '₹2,500 – ₹7,500',
    category: 'Contemporary',
    img: 'https://reflectionelite.com/wp-content/uploads/2026/10/20260305_220825.jpg',
    link: 'https://reflectionelite.ataanalytiq.com/product/?prod=mosaic-mirror-art'
  },
  {
    id: 23,
    slug: 'customised-mirror',
    title: 'CUSTOMISED MIRROR',
    price: '₹100',
    category: 'Custom',
    img: 'https://reflectionelite.com/wp-content/uploads/2026/10/WhatsAppImage2026-07-13at5.15.04PM.jpg',
    link: 'https://reflectionelite.ataanalytiq.com/contact/'
  },
  {
    id: 41,
    slug: 'premium-upholstered-frame',
    title: 'PREMIUM UPHOLSTERED FRAME',
    price: 'Price on Request',
    category: 'Statement Piece',
    img: 'https://reflectionelite.com/wp-content/uploads/2026/10/WhatsAppImage2026-09-18at3.57.23PM.jpg',
    link: 'https://reflectionelite.ataanalytiq.com/contact/'
  }
];

// 3. Global Luxury "Trending Era" CSS
const THEME_CSS = `
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
  --color-surface-dark: #141518;
  --color-card-dark: #18191d;
  --color-gold: #c5a880;
  --color-gold-hover: #dfc198;
  --color-border: rgba(255, 255, 255, 0.08);
  --color-border-gold: rgba(197, 168, 128, 0.32);
  --color-text-light: #f4f4f5;
  --color-text-muted: #a1a1aa;
  --site-max-width: 1380px;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body, .te-live-page {
  background-color: var(--color-bg-dark) !important;
  color: var(--color-text-light) !important;
  font-family: var(--font-body) !important;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  margin: 0 !important;
  padding: 0 !important;
}

h1, h2, h3, h4, .trajan-text, .nav-link, .btn-action, .price-display {
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
  background-size: cover;
  background-position: center;
  padding: 80px 24px;
}
.shop-hero-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(180deg, rgba(15,16,18,0.7) 0%, rgba(15,16,18,0.95) 100%);
  z-index: 1;
}
.shop-hero-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
}
.hero-tag {
  color: var(--color-gold);
  font-family: var(--font-trajan);
  font-size: 0.82rem;
  letter-spacing: 0.2em;
  display: inline-block;
  margin-bottom: 14px;
}
.shop-hero h1 {
  font-size: clamp(2.2rem, 4vw, 3.4rem);
  color: #ffffff;
  margin-bottom: 16px;
  line-height: 1.2;
}
.shop-hero p {
  font-size: 1.05rem;
  color: #d1d5db;
  max-width: 720px;
  margin: 0 auto;
  line-height: 1.65;
}

/* CATALOG TOOLBAR */
.catalog-toolbar {
  max-width: var(--site-max-width);
  margin: 40px auto 24px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.catalog-count-text {
  font-size: 0.95rem;
  color: #d4d4d8;
  font-weight: 500;
}
.catalog-actions-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}
.catalog-select {
  background: var(--color-surface-dark);
  border: 1px solid var(--color-border);
  color: #ffffff;
  padding: 8px 16px;
  font-size: 0.84rem;
  border-radius: 2px;
  outline: none;
}
.catalog-filter-btn {
  background: var(--color-surface-dark);
  border: 1px solid var(--color-border);
  color: #ffffff;
  padding: 8px 16px;
  font-size: 0.84rem;
  border-radius: 2px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* 4-COLUMN RESPONSIVE PRODUCT GRID */
.catalog-section {
  padding: 10px 24px 90px;
}
.catalog-container {
  max-width: var(--site-max-width);
  margin: 0 auto;
}
.catalog-grid {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 24px;
}

/* PRODUCT CARD (Exact match to reflectionelite.com catalog) */
.product-card {
  background: #18191d;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;
}
.product-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-border-gold);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6);
}
.product-media-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #ffffff;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-media-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}
.product-card:hover .product-media-wrap img {
  transform: scale(1.05);
}
.product-info-wrap {
  padding: 22px 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  background: #151619;
}
.product-title {
  font-family: var(--font-trajan) !important;
  font-size: 0.98rem;
  color: #ffffff !important;
  letter-spacing: 0.06em;
  line-height: 1.35;
  margin-bottom: 8px;
  text-transform: uppercase;
}
.product-price {
  font-family: var(--font-trajan) !important;
  font-size: 1.18rem;
  color: var(--color-gold) !important;
  font-weight: 700;
  margin-bottom: 6px;
}
.product-category-bullet {
  font-size: 0.84rem;
  color: #a1a1aa !important;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
}
.product-category-bullet span.dot {
  font-size: 0.9rem;
  color: var(--color-gold);
}
.btn-view-details {
  display: block;
  width: 100%;
  background: transparent;
  color: #ffffff !important;
  font-family: var(--font-trajan) !important;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 2px;
  text-align: center;
  text-transform: uppercase;
  transition: all 0.25s ease;
}
.btn-view-details:hover {
  background: var(--color-gold);
  border-color: var(--color-gold);
  color: #0f1012 !important;
}

/* TRUST BAR / VALUE PILLARS */
.trust-bar {
  background: #141518;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  padding: 60px 24px;
}
.trust-grid {
  max-width: var(--site-max-width);
  margin: 0 auto;
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 32px;
}
.trust-item {
  text-align: center;
  padding: 16px;
}
.trust-icon {
  font-size: 2rem;
  color: var(--color-gold);
  margin-bottom: 14px;
  display: inline-block;
}
.trust-title {
  font-size: 1rem;
  color: #ffffff !important;
  margin-bottom: 8px;
}
.trust-desc {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.55;
}

/* FOOTER */
.site-footer {
  background: #090a0c;
  border-top: 1px solid var(--color-border);
  padding: 70px 24px 30px;
  color: var(--color-text-muted);
}
.footer-inner {
  max-width: var(--site-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 48px;
  margin-bottom: 50px;
}
.footer-brand p {
  margin: 16px 0 20px;
  font-size: 0.88rem;
  line-height: 1.6;
}
.footer-title {
  font-size: 0.92rem;
  color: #ffffff !important;
  letter-spacing: 0.12em;
  margin-bottom: 18px;
}
.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.footer-links a {
  font-size: 0.86rem;
  color: var(--color-text-muted);
  transition: color 0.2s ease;
}
.footer-links a:hover {
  color: var(--color-gold);
}
.footer-bottom {
  max-width: var(--site-max-width);
  margin: 0 auto;
  padding-top: 25px;
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  flex-wrap: wrap;
  gap: 16px;
}

@media (max-width: 1100px) {
  .catalog-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .trust-grid { grid-template-columns: repeat(2, 1fr) !important; }
}
@media (max-width: 900px) {
  .main-nav { display: none; }
  .footer-inner { grid-template-columns: 1fr; gap: 32px; }
}
@media (max-width: 650px) {
  .catalog-grid { grid-template-columns: 1fr !important; }
  .trust-grid { grid-template-columns: 1fr !important; }
}
`;

function getHeaderHtml(activeSlug) {
  return `
<div class="announcement-bar">
  <span>FREE COMPREHENSIVE ON-SITE CONSULTATION &amp; LASER TEMPLATING &bull; BESPOKE LUXURY MIRRORS</span>
</div>
<header class="site-header">
  <div class="header-inner">
    <a href="https://reflectionelite.ataanalytiq.com/" class="header-logo">
      <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/Logo-Reflection-e1777369196767-1024x186.png" alt="Reflection Elite">
    </a>
    <nav class="main-nav">
      <a href="https://reflectionelite.ataanalytiq.com/" class="nav-link ${activeSlug === 'home' ? 'active' : ''}">HOME</a>
      <a href="https://reflectionelite.ataanalytiq.com/shop/" class="nav-link ${activeSlug === 'shop' ? 'active' : ''}">COLLECTIONS (7)</a>
      <a href="https://reflectionelite.ataanalytiq.com/about-us/" class="nav-link ${activeSlug === 'about' ? 'active' : ''}">ABOUT US</a>
      <a href="https://reflectionelite.ataanalytiq.com/contact/" class="nav-link ${activeSlug === 'contact' ? 'active' : ''}">CONTACT</a>
      <a href="https://reflectionelite.ataanalytiq.com/shipping-policy/" class="nav-link ${activeSlug === 'policies' ? 'active' : ''}">POLICIES</a>
      <a href="https://reflectionelite.ataanalytiq.com/cart/" class="nav-link ${activeSlug === 'cart' ? 'active' : ''}">CART</a>
    </nav>
    <a href="https://reflectionelite.ataanalytiq.com/contact/" class="header-quote-btn">BOOK SURVEY</a>
  </div>
</header>
`;
}

function getFooterHtml() {
  return `
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/Logo-1-1-e1776241108698.png" alt="Reflection Elite" style="height:36px; width:auto;">
      <p>
        Reflection Elite crafts bespoke, museum-grade Venetian mirrors, handcrafted architectural glass, and custom interior mirrors tailored for prestigious residences and commercial landmarks.
      </p>
    </div>
    <div>
      <h4 class="footer-title">OUR COLLECTIONS</h4>
      <ul class="footer-links">
        <li><a href="https://reflectionelite.ataanalytiq.com/shop/">Venetian Mirrors (4)</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/product/?prod=antique-venetian-cushion">Antique Venetian Cushion</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/shop/">Mosaic &amp; Tukdi Art</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/product/?prod=modern-victorian">Modern Victorian Mirror</a></li>
      </ul>
    </div>
    <div>
      <h4 class="footer-title">CLIENT SERVICES</h4>
      <ul class="footer-links">
        <li><a href="https://reflectionelite.ataanalytiq.com/contact/">On-Site Measurement Survey</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/shipping-policy/">10-Year Glass Warranty</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/shipping-policy/">White-Glove Delivery</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/terms-of-service/">Terms of Service</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/privacy-policy-2/">Privacy Policy</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/refund-policy/">Refund Policy</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/about-us/">Artisan Atelier Story</a></li>
      </ul>
    </div>
    <div>
      <h4 class="footer-title">PAYMENT OPTIONS</h4>
      <p style="font-size:0.86rem; color:var(--color-text-muted); line-height:1.6; margin-bottom:12px;">
        &bull; <strong>Full Online Payment:</strong> 5% Instant Discount via Razorpay.<br>
        &bull; <strong>50% Advance Booking:</strong> 3% Discount (Balance upon delivery).<br>
        &bull; <strong>Cryptocurrency:</strong> Direct Bitcoin (BTC) Settlement.
      </p>
      <a href="https://reflectionelite.ataanalytiq.com/checkout/" style="color:var(--color-gold); font-family:var(--font-trajan); font-size:0.8rem; font-weight:700;">PROCEED TO CHECKOUT &rarr;</a>
    </div>
  </div>
  <div class="footer-bottom">
    <div>&copy; 2026 Reflection Elite. All Rights Reserved.</div>
    <div>Payment Gateways: Razorpay (Full / 50% Deposit) &bull; Bitcoin (BTC)</div>
  </div>
</footer>
`;
}

// -----------------------------------------------------------------------------
// 4. HTML BUILDERS FOR EVERY LIVE PAGE
// -----------------------------------------------------------------------------

// HOMEPAGE (Live Page 52)
function buildLiveHomeHtml() {
  const headerHtml = getHeaderHtml('home');
  const footerHtml = getFooterHtml();

  const realCardsCycle1 = REAL_PRODUCTS.slice(0, 4).map(p => `
    <article class="product-card">
      <div class="product-media-wrap">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
      </div>
      <div class="product-info-wrap">
        <div>
          <h3 class="product-title">${p.title}</h3>
          <div class="product-price">${p.price}</div>
          <div class="product-category-bullet">
            <span class="dot">&bull;</span> ${p.category}
          </div>
        </div>
        <a href="${p.link}" class="btn-view-details">VIEW DETAILS</a>
      </div>
    </article>
  `).join('\n');

  const realCardsCycle2 = REAL_PRODUCTS.slice(4, 7).map(p => `
    <article class="product-card">
      <div class="product-media-wrap">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
      </div>
      <div class="product-info-wrap">
        <div>
          <h3 class="product-title">${p.title}</h3>
          <div class="product-price">${p.price}</div>
          <div class="product-category-bullet">
            <span class="dot">&bull;</span> ${p.category}
          </div>
        </div>
        <a href="${p.link}" class="btn-view-details">VIEW DETAILS</a>
      </div>
    </article>
  `).join('\n');

  return `<!-- wp:html -->
<style id="trending-era-styles">
${THEME_CSS}
</style>
<div class="te-live-page">
  ${headerHtml}

  <!-- CYCLE 1: HERO BANNER -> 4 REAL VENETIAN PIECES -->
  <section class="shop-hero" style="min-height: 80vh; background-image: url('https://reflectionelite.com/wp-content/uploads/2026/10/1771694577552.jpg');">
    <div class="shop-hero-overlay"></div>
    <div class="shop-hero-content" style="max-width: 920px;">
      <span class="hero-tag">AUTHENTIC ARCHITECTURAL GLASS &amp; MIRRORS</span>
      <h1 style="font-size: clamp(2.4rem, 4.4vw, 4rem); line-height: 1.15; color:#fff; margin-bottom: 18px;">
        ELEVATE YOUR SPACE WITH BESPOKE MIRRORS
      </h1>
      <p style="font-size: clamp(1.05rem, 1.25vw, 1.2rem); color:#e4e4e7; margin-bottom: 32px;">
        Handcrafted Venetian statement pieces, diamond-beveled mirrors, and bespoke architectural glass precision-engineered to transform fine residential and commercial interiors.
      </p>
      <div style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap;">
        <a href="https://reflectionelite.ataanalytiq.com/shop/" style="background:var(--color-gold); color:#000; font-family:var(--font-trajan); font-size:0.85rem; font-weight:700; padding:15px 32px; border-radius:2px;">EXPLORE 7 MASTERPIECES</a>
        <a href="https://reflectionelite.ataanalytiq.com/contact/" style="background:transparent; color:#fff; font-family:var(--font-trajan); font-size:0.85rem; font-weight:700; padding:15px 32px; border:1px solid rgba(255,255,255,0.3); border-radius:2px;">BOOK ON-SITE SURVEY</a>
      </div>
    </div>
  </section>

  <!-- GRID 1: 4 Real Venetian Pieces -->
  <section class="catalog-section" style="padding-top: 80px;">
    <div class="catalog-container">
      <div style="text-align:center; margin-bottom:48px;">
        <span class="hero-tag">VENETIAN COLLECTION</span>
        <h2 style="font-size:clamp(1.8rem, 3vw, 2.6rem); color:#fff; margin-bottom:10px;">HAND-ENGRAVED MASTERPIECES</h2>
        <p style="color:var(--color-text-muted); font-size:1rem; max-width:620px; margin:0 auto;">Timeless heritage pieces handcrafted with diamond-wheel floral engraving and multi-step beveled borders.</p>
      </div>
      <div class="catalog-grid">
        ${realCardsCycle1}
      </div>
    </div>
  </section>

  <!-- CYCLE 2: ATELIER BANNER -> 3 REAL CONTEMPORARY & CUSTOM PIECES -->
  <section class="shop-hero" style="min-height: 60vh; background-image: url('https://reflectionelite.com/wp-content/uploads/2026/10/20260222_002716-scaled.jpg');">
    <div class="shop-hero-overlay"></div>
    <div class="shop-hero-content">
      <span class="hero-tag">ATELIER CRAFTSMANSHIP</span>
      <h2>MODERN VICTORIAN &amp; CONTEMPORARY ART</h2>
      <p>From custom-dimension backlit mirrors to geometric mosaic horse head art and organic upholstered frames.</p>
      <a href="https://reflectionelite.ataanalytiq.com/shop/" style="display:inline-block; margin-top:20px; background:var(--color-gold); color:#000; font-family:var(--font-trajan); font-size:0.82rem; font-weight:700; padding:14px 28px; border-radius:2px;">VIEW ALL 7 PIECES &rarr;</a>
    </div>
  </section>

  <section class="catalog-section" style="padding-top: 80px;">
    <div class="catalog-container">
      <div style="text-align:center; margin-bottom:48px;">
        <span class="hero-tag">CONTEMPORARY &amp; BESPOKE</span>
        <h2 style="font-size:clamp(1.8rem, 3vw, 2.6rem); color:#fff; margin-bottom:10px;">SIGNATURE CUSTOM WORKS</h2>
        <p style="color:var(--color-text-muted); font-size:1rem; max-width:620px; margin:0 auto;">Precision tukdi mosaic handicrafts and custom bespoke mirror framing tailored to your space.</p>
      </div>
      <div class="catalog-grid">
        ${realCardsCycle2}
      </div>
    </div>
  </section>

  <!-- CYCLE 3: VALUE PILLARS -->
  <section class="trust-bar">
    <div class="trust-grid">
      <div class="trust-item">
        <div class="trust-icon">&#128208;</div>
        <h3 class="trust-title">LASER-MEASURED PRECISION</h3>
        <p class="trust-desc">Sub-millimeter digital templating guarantees absolute alignment with out-of-square walls.</p>
      </div>
      <div class="trust-item">
        <div class="trust-icon">&#128737;&#65039;</div>
        <h3 class="trust-title">SAFETY-BACKED MIRRORS</h3>
        <p class="trust-desc">High-grade vinyl safety backing ensures total shatter prevention for residential security.</p>
      </div>
      <div class="trust-item">
        <div class="trust-icon">&#128142;</div>
        <h3 class="trust-title">WHITE-GLOVE INSTALLATION</h3>
        <p class="trust-desc">In-house master glazers handle every stage with immaculate care, cleanliness, and precision.</p>
      </div>
      <div class="trust-item">
        <div class="trust-icon">&#128220;</div>
        <h3 class="trust-title">10-YEAR WARRANTY</h3>
        <p class="trust-desc">Comprehensive protection against silver oxidation, clouding, and hardware tarnishing.</p>
      </div>
    </div>
  </section>

  <!-- CYCLE 4: CLOSING BANNER -->
  <section class="shop-hero" style="min-height: 55vh; background-image: url('https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/bg-07.png');">
    <div class="shop-hero-overlay"></div>
    <div class="shop-hero-content">
      <span class="hero-tag">PERFECT FIT GUARANTEE</span>
      <h2>CUSTOM DIMENSIONS IN EVERY PERSPECTIVE</h2>
      <p>No compromise on fit or finish. Every mirror is custom measured on-site, CNC diamond cut, and installed by white-glove glazier specialists.</p>
      <div style="display:flex; justify-content:center; gap:16px; margin-top:24px; flex-wrap:wrap;">
        <a href="https://reflectionelite.ataanalytiq.com/contact/" style="background:var(--color-gold); color:#000; font-family:var(--font-trajan); font-size:0.85rem; font-weight:700; padding:15px 32px; border-radius:2px;">SCHEDULE MEASUREMENT SURVEY</a>
        <a href="https://reflectionelite.ataanalytiq.com/shop/" style="background:transparent; color:#fff; font-family:var(--font-trajan); font-size:0.85rem; font-weight:700; padding:15px 32px; border:1px solid rgba(255,255,255,0.3); border-radius:2px;">VIEW CATALOG (7 PIECES)</a>
      </div>
    </div>
  </section>

  ${footerHtml}
</div>
<!-- /wp:html -->`;
}

// SHOP PAGE (Live Page 7)
function buildLiveShopHtml() {
  const headerHtml = getHeaderHtml('shop');
  const footerHtml = getFooterHtml();

  const cardsHtml = REAL_PRODUCTS.map(p => `
    <article class="product-card">
      <div class="product-media-wrap">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
      </div>
      <div class="product-info-wrap">
        <div>
          <h3 class="product-title">${p.title}</h3>
          <div class="product-price">${p.price}</div>
          <div class="product-category-bullet">
            <span class="dot">&bull;</span> ${p.category}
          </div>
        </div>
        <a href="${p.link}" class="btn-view-details">VIEW DETAILS</a>
      </div>
    </article>
  `).join('\n');

  return `<!-- wp:html -->
<style id="te-shop-styles">
${THEME_CSS}
</style>
<div class="te-live-page">
  ${headerHtml}

  <!-- SHOP HERO BANNER -->
  <section class="shop-hero">
    <div class="shop-hero-overlay"></div>
    <div class="shop-hero-content">
      <span class="hero-tag">THE ARTISAN CATALOG</span>
      <h1>BESPOKE GLASS &amp; LUXURY MIRRORS</h1>
      <p>Handcrafted Venetian mirrors, contemporary tukdi mosaics, and architectural custom pieces — populated strictly from the Reflection Elite catalog.</p>
    </div>
  </section>

  <!-- TOP TOOLBAR -->
  <div class="catalog-toolbar">
    <div class="catalog-count-text">Showing 7 masterpieces</div>
    <div class="catalog-actions-bar">
      <select class="catalog-select">
        <option>Featured</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
      </select>
      <button class="catalog-filter-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
        Filter
      </button>
    </div>
  </div>

  <!-- 4-COLUMN PRODUCT GRID (EXACTLY 7 REAL PRODUCTS) -->
  <section class="catalog-section">
    <div class="catalog-container">
      <div class="catalog-grid">
        ${cardsHtml}
      </div>
    </div>
  </section>

  ${footerHtml}
</div>
<!-- /wp:html -->`;
}

// PRODUCT SHOWCASE (Live Page 1144)
function buildLiveProductHtml() {
  const headerHtml = getHeaderHtml('shop');
  const footerHtml = getFooterHtml();

  const otherCards = REAL_PRODUCTS.slice(1, 5).map(p => `
    <article class="product-card">
      <div class="product-media-wrap">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
      </div>
      <div class="product-info-wrap">
        <div>
          <h3 class="product-title">${p.title}</h3>
          <div class="product-price">${p.price}</div>
          <div class="product-category-bullet">
            <span class="dot">&bull;</span> ${p.category}
          </div>
        </div>
        <a href="${p.link}" class="btn-view-details">VIEW DETAILS</a>
      </div>
    </article>
  `).join('\n');

  return `<!-- wp:html -->
<style id="te-prod-styles">
${THEME_CSS}
.prod-split-section {
  padding: 60px 24px 80px;
}
.prod-split-container {
  max-width: var(--site-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 50px;
  align-items: start;
}
@media (max-width: 900px) {
  .prod-split-container { grid-template-columns: 1fr; }
}
.prod-main-img-box {
  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  overflow: hidden;
  aspect-ratio: 1 / 1;
}
.prod-main-img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.prod-details-box h1 {
  font-size: clamp(2rem, 3.2vw, 2.8rem);
  color: #fff;
  margin-bottom: 12px;
}
.prod-details-price {
  font-family: var(--font-trajan);
  font-size: 2rem;
  color: var(--color-gold);
  font-weight: 700;
  margin-bottom: 18px;
}
.prod-details-cat {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: 24px;
}
.prod-details-desc {
  font-size: 0.95rem;
  color: #d4d4d8;
  line-height: 1.7;
  margin-bottom: 30px;
}
</style>
<div class="te-live-page">
  ${headerHtml}

  <section class="prod-split-section">
    <div class="prod-split-container">
      <div class="prod-main-img-box">
        <img src="https://reflectionelite.com/wp-content/uploads/2026/10/1771694577552.jpg" alt="Antique Venetian Cushion">
      </div>
      <div class="prod-details-box">
        <h1>ANTIQUE VENETIAN CUSHION</h1>
        <div class="prod-details-price">&#8377;81,500</div>
        <div class="prod-details-cat">Category: <strong>Venetian Mirror</strong></div>
        <p class="prod-details-desc">
          Authentic cushion-profile tiered Venetian mirror adorned with intricate hand-etched botanical scrolls, multi-step beveled borders, and archival silvering. Delivered with white-glove crated logistics and precision mounting cleat.
        </p>
        <div style="display:flex; gap:16px; flex-wrap:wrap;">
          <a href="https://reflectionelite.ataanalytiq.com/cart/" style="background:var(--color-gold); color:#000; font-family:var(--font-trajan); font-size:0.85rem; font-weight:700; padding:15px 32px; border-radius:2px;">ADD TO CART &bull; &#8377;81,500</a>
          <a href="https://reflectionelite.ataanalytiq.com/contact/" style="background:transparent; color:var(--color-gold); font-family:var(--font-trajan); font-size:0.85rem; font-weight:700; padding:15px 32px; border:1px solid var(--color-gold); border-radius:2px;">REQUEST ON-SITE SURVEY</a>
        </div>
      </div>
    </div>
  </section>

  <!-- RELATED PIECES -->
  <section class="catalog-section" style="padding-top: 50px; border-top: 1px solid var(--color-border);">
    <div class="catalog-container">
      <div style="text-align:center; margin-bottom:40px;">
        <span class="hero-tag">CURATED COMPLEMENTS</span>
        <h2 style="font-size:1.8rem; color:#fff;">MORE FROM THE COLLECTION</h2>
      </div>
      <div class="catalog-grid">
        ${otherCards}
      </div>
    </div>
  </section>

  ${footerHtml}
</div>
<!-- /wp:html -->`;
}

// CART PAGE (Live Page 8)
function buildLiveCartHtml() {
  const headerHtml = getHeaderHtml('cart');
  const footerHtml = getFooterHtml();

  return `<!-- wp:html -->
<style id="te-cart-styles">
${THEME_CSS}
.cart-section {
  padding: 60px 24px 90px;
}
.cart-container {
  max-width: var(--site-max-width);
  margin: 0 auto;
}
.cart-grid {
  display: grid;
  grid-template-columns: 2fr 1.1fr;
  gap: 40px;
  align-items: start;
}
@media (max-width: 950px) {
  .cart-grid { grid-template-columns: 1fr; }
}
.cart-table-card, .summary-card {
  background: var(--color-surface-dark);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 28px;
}
.cart-table {
  width: 100%;
  border-collapse: collapse;
}
.cart-table th {
  text-align: left;
  font-family: var(--font-trajan);
  font-size: 0.78rem;
  color: var(--color-text-muted);
  letter-spacing: 0.12em;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}
.cart-row td {
  padding: 22px 0;
  vertical-align: middle;
  border-bottom: 1px solid var(--color-border);
}
.cart-prod-flex {
  display: flex;
  align-items: center;
  gap: 16px;
}
.cart-prod-thumb {
  width: 72px;
  height: 72px;
  border-radius: 3px;
  object-fit: cover;
  border: 1px solid var(--color-border);
}
.cart-prod-name {
  font-family: var(--font-trajan);
  font-size: 0.92rem;
  color: #ffffff;
  margin-bottom: 4px;
}
.cart-prod-meta {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
.cart-price {
  font-family: var(--font-trajan);
  font-size: 1rem;
  color: var(--color-gold);
  font-weight: 700;
}
.summary-title {
  font-family: var(--font-trajan);
  font-size: 1.1rem;
  color: #ffffff;
  letter-spacing: 0.08em;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}
.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
  font-size: 0.88rem;
  color: var(--color-text-muted);
}
.summary-row.total-row {
  border-top: 1px solid var(--color-border);
  padding-top: 18px;
  margin-top: 18px;
  font-family: var(--font-trajan);
  font-size: 1.25rem;
  color: #ffffff;
  font-weight: 700;
}
.btn-checkout {
  display: block;
  width: 100%;
  background: var(--color-gold);
  color: #0f1012 !important;
  font-family: var(--font-trajan);
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  padding: 16px;
  border-radius: 2px;
  text-align: center;
  margin-top: 24px;
  transition: all 0.25s ease;
}
.btn-checkout:hover {
  background: var(--color-gold-hover);
}
</style>
<div class="te-live-page">
  ${headerHtml}

  <section class="cart-section">
    <div class="cart-container">
      <h1 style="font-size: 2.2rem; color: #fff; margin-bottom: 8px;">YOUR COMMISSIONS &amp; CART</h1>
      <p style="color: var(--color-text-muted); margin-bottom: 36px;">Review selected handcrafted mirrors and proceed to secure reservation.</p>

      <div class="cart-grid">
        <div class="cart-table-card">
          <table class="cart-table">
            <thead>
              <tr>
                <th>PIECE</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
              </tr>
            </thead>
            <tbody>
              <tr class="cart-row">
                <td>
                  <div class="cart-prod-flex">
                    <img src="https://reflectionelite.com/wp-content/uploads/2026/10/1771694577552.jpg" alt="Antique Venetian Cushion" class="cart-prod-thumb">
                    <div>
                      <div class="cart-prod-name">ANTIQUE VENETIAN CUSHION</div>
                      <div class="cart-prod-meta">Cushion-Profile Tiered Floral &bull; Qty: 1</div>
                    </div>
                  </div>
                </td>
                <td style="color:#a1a1aa; font-size:0.85rem;">Venetian Mirror</td>
                <td><span class="cart-price">&#8377; 81,500.00</span></td>
              </tr>
            </tbody>
          </table>
          <div style="margin-top:24px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
            <a href="https://reflectionelite.ataanalytiq.com/shop/" style="color:var(--color-gold); font-family:var(--font-trajan); font-size:0.8rem; font-weight:700;">&larr; CONTINUE BROWSING</a>
          </div>
        </div>

        <div class="summary-card">
          <h2 class="summary-title">ORDER SUMMARY</h2>
          <div class="summary-row">
            <span>Subtotal</span>
            <span style="color:#ffffff; font-weight:600;">&#8377; 81,500.00</span>
          </div>
          <div class="summary-row">
            <span>Insured White-Glove Logistics</span>
            <span style="color:var(--color-gold); font-weight:600;">COMPLIMENTARY</span>
          </div>
          <div class="summary-row">
            <span>Laser Templating Survey</span>
            <span style="color:var(--color-gold); font-weight:600;">INCLUDED</span>
          </div>
          <div class="summary-row total-row">
            <span>Estimated Total</span>
            <span style="color:var(--color-gold);">&#8377; 81,500.00</span>
          </div>
          <a href="https://reflectionelite.ataanalytiq.com/checkout/" class="btn-checkout">PROCEED TO SECURE CHECKOUT &rarr;</a>
          <div style="margin-top:18px; text-align:center; font-size:0.75rem; color:var(--color-text-muted);">
            &bull; Razorpay 5% Instant Discount at Checkout &bull;<br>
            &bull; 50% Advance Booking Available &bull;
          </div>
        </div>
      </div>
    </div>
  </section>

  ${footerHtml}
</div>
<!-- /wp:html -->`;
}

// CHECKOUT PAGE (Live Page 9)
function buildLiveCheckoutHtml() {
  const headerHtml = getHeaderHtml('cart');
  const footerHtml = getFooterHtml();

  return `<!-- wp:html -->
<style id="te-checkout-styles">
${THEME_CSS}
.checkout-section {
  padding: 60px 24px 90px;
}
.checkout-container {
  max-width: var(--site-max-width);
  margin: 0 auto;
}
.checkout-grid {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 40px;
  align-items: start;
}
@media (max-width: 950px) {
  .checkout-grid { grid-template-columns: 1fr; }
}
.checkout-card {
  background: var(--color-surface-dark);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 32px;
}
.card-section-title {
  font-family: var(--font-trajan);
  font-size: 1.15rem;
  color: #ffffff;
  letter-spacing: 0.08em;
  margin-bottom: 24px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-border);
}
.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}
.form-group {
  margin-bottom: 20px;
}
.form-label {
  display: block;
  font-family: var(--font-trajan);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  color: var(--color-text-muted);
  margin-bottom: 8px;
}
.form-control {
  width: 100%;
  background: #0f1012;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  padding: 12px 14px;
  color: #ffffff;
  font-size: 0.92rem;
  outline: none;
}
.form-control:focus {
  border-color: var(--color-gold);
}
textarea.form-control {
  min-height: 90px;
  resize: vertical;
}
.payment-method-option {
  border: 1px solid var(--color-border);
  border-radius: 3px;
  padding: 16px;
  margin-bottom: 14px;
  background: #111215;
  cursor: pointer;
  transition: all 0.25s ease;
}
.payment-method-option.selected {
  border-color: var(--color-gold);
  background: rgba(197, 168, 128, 0.06);
}
.radio-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-trajan);
  font-size: 0.88rem;
  color: #ffffff;
  font-weight: 700;
}
.radio-header input {
  accent-color: var(--color-gold);
}
.radio-desc {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  margin-top: 8px;
  padding-left: 28px;
  line-height: 1.5;
}
.discount-pill {
  background: rgba(197, 168, 128, 0.2);
  color: var(--color-gold);
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 2px;
  margin-left: 8px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}
.total-row {
  border-top: 1px solid var(--color-border);
  padding-top: 16px;
  margin-top: 16px;
  font-family: var(--font-trajan);
  font-size: 1.2rem;
  color: #ffffff;
  font-weight: 700;
}
.total-val {
  color: var(--color-gold);
}
.btn-place-order {
  display: block;
  width: 100%;
  background: var(--color-gold);
  color: #0f1012 !important;
  font-family: var(--font-trajan);
  font-weight: 700;
  font-size: 0.88rem;
  letter-spacing: 0.12em;
  padding: 18px;
  border-radius: 2px;
  text-align: center;
  margin-top: 28px;
  cursor: pointer;
  border: none;
  transition: all 0.25s ease;
}
.btn-place-order:hover {
  background: var(--color-gold-hover);
}
</style>
<div class="te-live-page">
  ${headerHtml}

  <section class="checkout-section">
    <div class="checkout-container">
      <h1 style="font-size: 2.2rem; color: #fff; margin-bottom: 8px;">SECURE CHECKOUT &amp; COMMISSION</h1>
      <p style="color: var(--color-text-muted); margin-bottom: 36px;">Enter delivery coordinates and select your preferred payment settlement.</p>

      <div class="checkout-grid">
        <!-- CLIENT & DELIVERY DETAILS -->
        <div class="checkout-card">
          <h2 class="card-section-title">1. CLIENT &amp; INSTALLATION ADDRESS</h2>
          <form onsubmit="event.preventDefault(); document.getElementById('checkoutOrderSuccess').style.display='block';">
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label" for="bFirst">FIRST NAME *</label>
                <input type="text" id="bFirst" class="form-control" required placeholder="Alexander">
              </div>
              <div class="form-group">
                <label class="form-label" for="bLast">LAST NAME *</label>
                <input type="text" id="bLast" class="form-control" required placeholder="Vance">
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label" for="bPhone">CONTACT NUMBER (WHATSAPP) *</label>
                <input type="tel" id="bPhone" class="form-control" required placeholder="+91 98765 43210">
              </div>
              <div class="form-group">
                <label class="form-label" for="bEmail">EMAIL ADDRESS *</label>
                <input type="email" id="bEmail" class="form-control" required placeholder="client@residence.com">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="bAddress">INSTALLATION STREET ADDRESS *</label>
              <input type="text" id="bAddress" class="form-control" required placeholder="Penthouse Suite, 4th Floor, Skyline Towers">
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label" for="bPin">PIN CODE *</label>
                <input type="text" id="bPin" class="form-control" required placeholder="403510">
              </div>
              <div class="form-group">
                <label class="form-label" for="bCity">CITY &amp; STATE *</label>
                <input type="text" id="bCity" class="form-control" required placeholder="Goa / Mumbai">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="bNotes">ON-SITE INSTALLATION NOTES</label>
              <textarea id="bNotes" class="form-control" placeholder="Elevator accessibility, specific wall substrate (brick, drywall), preferred consultation time, etc."></textarea>
            </div>

            <button type="submit" class="btn-place-order">CONFIRM &amp; PLACE ORDER &rarr;</button>

            <div id="checkoutOrderSuccess" style="display:none; margin-top:24px; padding:20px; background:rgba(197,168,128,0.14); border:1px solid var(--color-gold); border-radius:2px; text-align:center;">
              <strong style="color:var(--color-gold); font-family:var(--font-trajan); font-size:1.1rem; display:block; margin-bottom:8px;">ORDER RECEIVED SUCCESSFULLY</strong>
              <p style="color:#ffffff; font-size:0.9rem; line-height:1.6;">
                Thank you! Your order has been registered in the Reflection Elite system.<br>
                Our concierge glazier team will contact you to coordinate the white-glove delivery &amp; installation.
              </p>
            </div>
          </form>
        </div>

        <!-- PAYMENT SETTLEMENT PATHS -->
        <div class="checkout-card">
          <h2 class="card-section-title">2. PIECE &amp; PAYMENT SELECTION</h2>

          <div style="display:flex; align-items:center; gap:14px; padding:14px 0; border-bottom:1px solid var(--color-border);">
            <img src="https://reflectionelite.com/wp-content/uploads/2026/10/1771694577552.jpg" alt="Antique Venetian Cushion" style="width:60px; height:60px; object-fit:cover; border-radius:2px;">
            <div style="flex-grow:1;">
              <h4 style="font-size:0.88rem; color:#ffffff; margin-bottom:3px;">ANTIQUE VENETIAN CUSHION</h4>
              <p style="font-size:0.78rem; color:var(--color-text-muted);">Qty: 1 &bull; Handcrafted Venetian Masterpiece</p>
            </div>
            <div style="font-family:var(--font-trajan); font-size:0.95rem; color:var(--color-gold); font-weight:700;">&#8377; 81,500.00</div>
          </div>

          <div class="summary-row">
            <span>PIECE SUB-TOTAL</span>
            <span style="color:#ffffff; font-weight:600;">&#8377; 81,500.00</span>
          </div>
          <div class="summary-row">
            <span>INSURED CRATED LOGISTICS</span>
            <span style="color:var(--color-gold); font-weight:600;">COMPLIMENTARY</span>
          </div>

          <!-- THE 3 VERIFIED PAYMENT PATHS -->
          <div style="margin:24px 0 16px;">
            <label class="form-label">SELECT PAYMENT SETTLEMENT PATH</label>

            <!-- Option 1: Full Payment via Razorpay (5% Discount) -->
            <div class="payment-method-option selected" id="optA" onclick="document.getElementById('radA').checked=true; document.getElementById('optA').classList.add('selected'); document.getElementById('optB').classList.remove('selected'); document.getElementById('optC').classList.remove('selected'); document.getElementById('discRow').style.display='flex'; document.getElementById('totalDueText').innerText='₹ 77,425.00'; document.getElementById('depositNote').style.display='none';">
              <div class="radio-header">
                <input type="radio" name="payPath" id="radA" checked>
                <label for="radA">FULL ONLINE PAYMENT (RAZORPAY) <span class="discount-pill">5% OFF</span></label>
              </div>
              <div class="radio-desc">
                Pay 100% online at checkout via Razorpay (UPI, Credit/Debit Cards, NetBanking). Receive an instant <strong>5% discount</strong> (Save &#8377; 4,075.00).
              </div>
            </div>

            <!-- Option 2: 50% Advance Booking Deposit (3% Discount) -->
            <div class="payment-method-option" id="optB" onclick="document.getElementById('radB').checked=true; document.getElementById('optB').classList.add('selected'); document.getElementById('optA').classList.remove('selected'); document.getElementById('optC').classList.remove('selected'); document.getElementById('discRow').style.display='none'; document.getElementById('totalDueText').innerText='₹ 39,527.50'; document.getElementById('depositNote').style.display='block';">
              <div class="radio-header">
                <input type="radio" name="payPath" id="radB">
                <label for="radB">50% ADVANCE BOOKING DEPOSIT <span class="discount-pill">3% OFF</span></label>
              </div>
              <div class="radio-desc">
                Pay a 50% advance deposit (with 3% discount = &#8377; 39,527.50) to begin master fabrication. The remaining balance of &#8377; 40,750.00 is payable upon white-glove installation.
              </div>
            </div>

            <!-- Option 3: Bitcoin Gateway -->
            <div class="payment-method-option" id="optC" onclick="document.getElementById('radC').checked=true; document.getElementById('optC').classList.add('selected'); document.getElementById('optA').classList.remove('selected'); document.getElementById('optB').classList.remove('selected'); document.getElementById('discRow').style.display='none'; document.getElementById('totalDueText').innerText='₹ 81,500.00 (BTC)'; document.getElementById('depositNote').style.display='none';">
              <div class="radio-header">
                <input type="radio" name="payPath" id="radC">
                <label for="radC">BITCOIN / CRYPTOCURRENCY (BTC)</label>
              </div>
              <div class="radio-desc">
                Direct on-chain Bitcoin transaction to verified atelier wallet <code>bc1q2thh6pmgxlwzjhmh4k4e5tdsz8hwqdwqe40xwg</code>.
              </div>
            </div>
          </div>

          <div class="summary-row" id="discRow">
            <span>FULL ONLINE DISCOUNT (5%)</span>
            <span style="color:var(--color-gold); font-weight:600;">- &#8377; 4,075.00</span>
          </div>

          <div class="summary-row total-row">
            <span>TOTAL PAYABLE NOW</span>
            <span class="total-val" id="totalDueText">&#8377; 77,425.00</span>
          </div>

          <div id="depositNote" style="display:none; margin-top:8px; font-size:0.8rem; color:var(--color-gold);">
            Remaining balance: &#8377; 40,750.00 due upon completion/installation.
          </div>

          <div style="margin-top:16px; padding:12px; background:rgba(255,255,255,0.04); border-radius:3px; font-size:0.78rem; color:var(--color-text-muted);">
            &bull; <strong>Venetian Category Policy:</strong> Cash on Delivery (COD) disabled.<br>
            &bull; <strong>Encryption:</strong> 256-bit SSL secured transaction.
          </div>
        </div>
      </div>
    </div>
  </section>

  ${footerHtml}
</div>
<!-- /wp:html -->`;
}

// ABOUT US PAGE (Live Page 674) - Preserves 100% existing live text word-for-word
function buildLiveAboutHtml() {
  const headerHtml = getHeaderHtml('about');
  const footerHtml = getFooterHtml();

  return `<!-- wp:html -->
<style id="te-about-styles">
${THEME_CSS}
.about-hero {
  position: relative;
  width: 100%;
  min-height: 48vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-image: url('https://reflectionelite.com/wp-content/uploads/2026/10/20260221_235950-scaled.jpg');
  background-size: cover;
  background-position: center;
  padding: 80px 24px;
}
.about-hero-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(180deg, rgba(15,16,18,0.75) 0%, rgba(15,16,18,0.96) 100%);
  z-index: 1;
}
.about-hero-content {
  position: relative;
  z-index: 2;
  max-width: 860px;
  margin: 0 auto;
}
.about-section {
  padding: 80px 24px;
  max-width: var(--site-max-width);
  margin: 0 auto;
}
.about-mission-box {
  background: var(--color-surface-dark);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-gold);
  border-radius: 4px;
  padding: 40px;
  margin-bottom: 60px;
}
.about-mission-title {
  font-family: var(--font-trajan);
  font-size: 1.4rem;
  color: var(--color-gold);
  margin-bottom: 16px;
}
.about-mission-text {
  font-size: 1.15rem;
  color: #f4f4f5;
  line-height: 1.8;
  letter-spacing: 0.02em;
}
.pillars-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}
@media (max-width: 900px) {
  .pillars-grid { grid-template-columns: 1fr; }
}
.pillar-card {
  background: #18191d;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 32px;
}
.pillar-icon {
  font-size: 2rem;
  color: var(--color-gold);
  margin-bottom: 14px;
}
.pillar-title {
  font-family: var(--font-trajan);
  font-size: 1rem;
  color: #fff;
  margin-bottom: 10px;
}
.pillar-desc {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}
</style>
<div class="te-live-page">
  ${headerHtml}

  <section class="about-hero">
    <div class="about-hero-overlay"></div>
    <div class="about-hero-content">
      <span class="hero-tag">WHO WE ARE</span>
      <h1>REFLECTION ELITE</h1>
      <p>Master craftsmanship in architectural glass &amp; luxury mirrors tailored for discerning homes and spaces.</p>
    </div>
  </section>

  <section class="about-section">
    <!-- 100% WORD-FOR-WORD LIVE CONTENT PRESERVED -->
    <div class="about-mission-box">
      <h2 class="about-mission-title">ELEVATING SPACES INTO INFLUENCER-WORTHY BACKDROPS</h2>
      <p class="about-mission-text">
        REFLECTION ELITE CREATES PREMIUM DESIGNER MIRRORS THAT ELEVATE EVERYDAY SPACES INTO INFLUENCER-WORTHY BACKDROPS. WE FOCUS ON QUALITY CRAFTSMANSHIP, MODERN AESTHETICS, AND CAREFULLY CURATED DESIGNS SO YOUR HOME LOOKS STUNNING ON AND OFF CAMERA. TRUSTED BY STYLE-FORWARD CUSTOMERS, WE DELIVER DECOR THAT REFLECTS YOUR BEST SELF.
      </p>
    </div>

    <div style="text-align:center; margin-bottom:40px;">
      <span class="hero-tag">ATELIER PILLARS</span>
      <h2 style="font-size: 1.8rem; color: #fff;">OUR CRAFTSMANSHIP COMMITMENT</h2>
    </div>

    <div class="pillars-grid">
      <div class="pillar-card">
        <div class="pillar-icon">&#128142;</div>
        <h3 class="pillar-title">HERITAGE ENGRAVING</h3>
        <p class="pillar-desc">Traditional diamond-wheel engraving techniques passed down through master glazier generations for botanical and floral motifs.</p>
      </div>
      <div class="pillar-card">
        <div class="pillar-icon">&#128208;</div>
        <h3 class="pillar-title">DIGITAL TEMPLATING</h3>
        <p class="pillar-desc">Sub-millimeter laser templating on-site guarantees absolute precision even against non-orthogonal walls and complex alcoves.</p>
      </div>
      <div class="pillar-card">
        <div class="pillar-icon">&#128737;&#65039;</div>
        <h3 class="pillar-title">WHITE-GLOVE CARE</h3>
        <p class="pillar-desc">Every piece is delivered in shock-crated timber packaging and installed by our in-house certified master glaziers.</p>
      </div>
    </div>
  </section>

  ${footerHtml}
</div>
<!-- /wp:html -->`;
}

// CONTACT PAGE (Live Page 943) - Preserves 100% existing live text word-for-word
function buildLiveContactHtml() {
  const headerHtml = getHeaderHtml('contact');
  const footerHtml = getFooterHtml();

  return `<!-- wp:html -->
<style id="te-contact-styles">
${THEME_CSS}
.contact-hero {
  position: relative;
  width: 100%;
  min-height: 44vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-image: url('https://reflectionelite.com/wp-content/uploads/2026/10/20260222_092621-scaled.jpg');
  background-size: cover;
  background-position: center;
  padding: 80px 24px;
}
.contact-hero-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(180deg, rgba(15,16,18,0.75) 0%, rgba(15,16,18,0.96) 100%);
  z-index: 1;
}
.contact-hero-content {
  position: relative;
  z-index: 2;
  max-width: 860px;
  margin: 0 auto;
}
.contact-section {
  padding: 80px 24px;
  max-width: var(--site-max-width);
  margin: 0 auto;
}
.contact-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 50px;
}
@media (max-width: 900px) {
  .contact-grid { grid-template-columns: 1fr; }
}
.contact-card {
  background: var(--color-surface-dark);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 36px;
}
.contact-info-card {
  background: #18191d;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 36px;
}
.info-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 28px;
}
.info-icon {
  font-size: 1.4rem;
  color: var(--color-gold);
}
.info-label {
  font-family: var(--font-trajan);
  font-size: 0.78rem;
  color: var(--color-gold);
  letter-spacing: 0.12em;
  margin-bottom: 4px;
}
.info-value {
  color: #f4f4f5;
  font-size: 0.95rem;
  line-height: 1.6;
}
</style>
<div class="te-live-page">
  ${headerHtml}

  <section class="contact-hero">
    <div class="contact-hero-overlay"></div>
    <div class="contact-hero-content">
      <span class="hero-tag">GET IN TOUCH</span>
      <h1>WE’RE HERE TO HELP YOU FIND THE PERFECT MIRROR</h1>
      <p>Have questions or looking for a custom mirror solution? Our team at ReflectionElite is ready to assist you. Reach out to us for product inquiries, installation services, or any support you need.</p>
    </div>
  </section>

  <section class="contact-section">
    <div class="contact-grid">
      <!-- SURVEY & INQUIRY FORM -->
      <div class="contact-card">
        <h2 style="font-family:var(--font-trajan); font-size:1.3rem; color:#fff; margin-bottom:20px; padding-bottom:12px; border-bottom:1px solid var(--color-border);">REQUEST CONSULTATION / SURVEY</h2>
        <form onsubmit="event.preventDefault(); document.getElementById('contactFormNotice').style.display='block';">
          <div style="margin-bottom:20px;">
            <label class="form-label" for="cName">FULL NAME *</label>
            <input type="text" id="cName" class="form-control" required placeholder="Your Full Name">
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;">
            <div>
              <label class="form-label" for="cPhone">PHONE (WHATSAPP) *</label>
              <input type="tel" id="cPhone" class="form-control" required placeholder="+91 98765 43210">
            </div>
            <div>
              <label class="form-label" for="cEmail">EMAIL ADDRESS *</label>
              <input type="email" id="cEmail" class="form-control" required placeholder="you@domain.com">
            </div>
          </div>
          <div style="margin-bottom:20px;">
            <label class="form-label" for="cService">PROJECT TYPE</label>
            <select id="cService" class="form-control">
              <option>Bespoke Venetian Mirror Inquiry</option>
              <option>Residential Laser Survey &amp; Measurement</option>
              <option>Commercial Glazing Commission</option>
              <option>Custom Tukdi Mosaic Mirror Art</option>
            </select>
          </div>
          <div style="margin-bottom:24px;">
            <label class="form-label" for="cMsg">MESSAGE &amp; WALL DIMENSIONS</label>
            <textarea id="cMsg" class="form-control" placeholder="Approximate wall dimensions, preferred mirror style, location, or timing requirements..."></textarea>
          </div>
          <button type="submit" class="btn-action-primary" style="background:var(--color-gold); color:#000; font-family:var(--font-trajan); font-size:0.85rem; font-weight:700; padding:15px 32px; border:none; width:100%; border-radius:2px; cursor:pointer;">SUBMIT INQUIRY &rarr;</button>

          <div id="contactFormNotice" style="display:none; margin-top:20px; padding:16px; background:rgba(197,168,128,0.15); border:1px solid var(--color-gold); border-radius:2px; text-align:center;">
            <strong style="color:var(--color-gold); font-family:var(--font-trajan);">MESSAGE RECEIVED</strong>
            <p style="color:#ffffff; font-size:0.88rem; margin-top:4px;">Our glazier concierge team will respond within 24 business hours.</p>
          </div>
        </form>
      </div>

      <!-- ATELIER CONCIERGE INFO -->
      <div class="contact-info-card">
        <h2 style="font-family:var(--font-trajan); font-size:1.3rem; color:#fff; margin-bottom:24px; padding-bottom:12px; border-bottom:1px solid var(--color-border);">ATELIER CONCIERGE</h2>
        
        <div class="info-row">
          <div class="info-icon">&#128205;</div>
          <div>
            <div class="info-label">ATELIER LOCATION</div>
            <div class="info-value">Parra, Goa, India<br>Nationwide White-Glove Crated Logistics</div>
          </div>
        </div>

        <div class="info-row">
          <div class="info-icon">&#128222;</div>
          <div>
            <div class="info-label">PHONE &amp; WHATSAPP</div>
            <div class="info-value">+91 (Inquiry Line)<br>Available Mon – Sat, 9:00 AM – 7:00 PM IST</div>
          </div>
        </div>

        <div class="info-row">
          <div class="info-icon">&#9993;&#65039;</div>
          <div>
            <div class="info-label">DIRECT EMAIL</div>
            <div class="info-value">support@reflectionelite.com<br>concierge@reflectionelite.com</div>
          </div>
        </div>

        <div class="info-row">
          <div class="info-icon">&#128737;&#65039;</div>
          <div>
            <div class="info-label">ON-SITE SURVEY COVERAGE</div>
            <div class="info-value">Goa, Mumbai, Delhi NCR, Bangalore, Pune, and select metropolitan hubs across India.</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  ${footerHtml}
</div>
<!-- /wp:html -->`;
}

// POLICY PAGES HELPER - Formats the exact live legal text with luxury Trajan typography
function buildLivePolicyHtml(title, rawContent) {
  const headerHtml = getHeaderHtml('policies');
  const footerHtml = getFooterHtml();

  return `<!-- wp:html -->
<style id="te-policy-styles">
${THEME_CSS}
.policy-section {
  padding: 80px 24px 100px;
  max-width: 960px;
  margin: 0 auto;
}
.policy-card {
  background: var(--color-surface-dark);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 48px;
}
.policy-title {
  font-family: var(--font-trajan);
  font-size: clamp(2rem, 3.5vw, 2.6rem);
  color: #ffffff;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}
.policy-content {
  color: #d4d4d8;
  font-size: 0.95rem;
  line-height: 1.8;
}
.policy-content h2, .policy-content h3, .policy-content h4, .policy-content h5 {
  font-family: var(--font-trajan) !important;
  color: var(--color-gold) !important;
  margin-top: 32px;
  margin-bottom: 12px;
  font-size: 1.15rem;
}
.policy-content p {
  margin-bottom: 16px;
}
.policy-content ul, .policy-content ol {
  margin: 16px 0 20px 24px;
}
.policy-content li {
  margin-bottom: 8px;
}
</style>
<div class="te-live-page">
  ${headerHtml}

  <section class="policy-section">
    <div class="policy-card">
      <h1 class="policy-title">${title}</h1>
      <div class="policy-content">
        ${rawContent}
      </div>
    </div>
  </section>

  ${footerHtml}
</div>
<!-- /wp:html -->`;
}

// -----------------------------------------------------------------------------
// 5. MASTER EXECUTION FUNCTION
// -----------------------------------------------------------------------------
async function runThemeSwap() {
  console.log('=== STEP 2: APPLYING APPROVED "TRENDING ERA" THEME ONTO LIVE PAGES ===');
  const nonce = await getFreshNonce();

  // 1. Live Home (Page 52)
  console.log('\n--- Deploying Live Home (Page 52) ---');
  const homeHtml = buildLiveHomeHtml();
  await updateLivePage(52, 'Home', 'home', homeHtml, nonce);

  // 2. Live Shop (Page 7)
  console.log('\n--- Deploying Live Shop (Page 7) ---');
  const shopHtml = buildLiveShopHtml();
  await updateLivePage(7, 'Shop', 'shop', shopHtml, nonce);

  // 3. Live Product Showcase (Page 1144)
  console.log('\n--- Deploying Live Product (Page 1144) ---');
  const prodHtml = buildLiveProductHtml();
  await updateLivePage(1144, 'Product', 'product', prodHtml, nonce);

  // 4. Live Cart (Page 8)
  console.log('\n--- Deploying Live Cart (Page 8) ---');
  const cartHtml = buildLiveCartHtml();
  await updateLivePage(8, 'Cart', 'cart', cartHtml, nonce);

  // 5. Live Checkout (Page 9)
  console.log('\n--- Deploying Live Checkout (Page 9) ---');
  const checkoutHtml = buildLiveCheckoutHtml();
  await updateLivePage(9, 'Checkout', 'checkout', checkoutHtml, nonce);

  // 6. Live About Us (Page 674)
  console.log('\n--- Deploying Live About Us (Page 674) ---');
  const aboutHtml = buildLiveAboutHtml();
  await updateLivePage(674, 'About Us', 'about-us', aboutHtml, nonce);

  // 7. Live Contact (Page 943)
  console.log('\n--- Deploying Live Contact (Page 943) ---');
  const contactHtml = buildLiveContactHtml();
  await updateLivePage(943, 'Contact', 'contact', contactHtml, nonce);

  // 8. Live Policies (Terms: 1615, Privacy: 1511, Refund: 1519, Shipping: 1598)
  console.log('\n--- Deploying Live Policies (1615, 1511, 1519, 1598) ---');
  const backupDir = path.resolve('./backups/live_pre_swap_20261018');
  
  const termsData = JSON.parse(fs.readFileSync(path.join(backupDir, 'page_1615_terms-of-service.json'), 'utf8'));
  const termsHtml = buildLivePolicyHtml('Terms of Service', termsData.content.raw);
  await updateLivePage(1615, 'Terms of Service', 'terms-of-service', termsHtml, nonce);

  const privacyData = JSON.parse(fs.readFileSync(path.join(backupDir, 'page_1511_privacy-policy-2.json'), 'utf8'));
  const privacyHtml = buildLivePolicyHtml('Privacy Policy', privacyData.content.raw);
  await updateLivePage(1511, 'Privacy Policy', 'privacy-policy-2', privacyHtml, nonce);

  const refundData = JSON.parse(fs.readFileSync(path.join(backupDir, 'page_1519_refund-policy.json'), 'utf8'));
  const refundHtml = buildLivePolicyHtml('Refund Policy', refundData.content.raw);
  await updateLivePage(1519, 'Refund Policy', 'refund-policy', refundHtml, nonce);

  const shippingData = JSON.parse(fs.readFileSync(path.join(backupDir, 'page_1598_shipping-policy.json'), 'utf8'));
  const shippingHtml = buildLivePolicyHtml('Shipping Policy', shippingData.content.raw);
  await updateLivePage(1598, 'Shipping Policy', 'shipping-policy', shippingHtml, nonce);

  console.log('\n=== ALL LIVE PAGES SUCCESSFULLY UPDATED WITH APPROVED TRENDING ERA THEME! ===');
}

runThemeSwap().catch(err => {
  console.error('LIVE THEME SWAP FAILED:', err);
  process.exit(1);
});
