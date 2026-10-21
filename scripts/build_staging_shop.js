import fs from 'fs';
import http from 'https';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
const nonce = 'f5b146aecd';

const IMGS = {
  logo: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/Logo-Reflection-e1777369196767-1024x186.png',
  heroBg: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/generat-an-led-luxurious-mirror.webp',
  
  // Real products from WC store API
  p1: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/05/23952812_master.jpg', // Murana Mirror
  p2: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/1771694577552-2.webp', // Antique venetian cushion
  p3: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260222_002716.jpg', // Modern victorian
  p4: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260222_092621-1.webp', // Rococo floral
  p5: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260221_235950-1.webp', // Silver Crown framed
  p6: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260305_220825.webp', // Mosaic mirror art
  p7: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/pomelli_photoshoot_image_4_5_0414_4.webp', // Frameless Shower
  p8: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/mirror_cutout_before_087347fa24-modified_430x.webp' // Partition
};

const rawCss = `
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
  --font-trajan: 'Trajan Pro Bold', 'Trajan Pro', trajanpro, 'Cinzel', Georgia, serif;
  --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --color-bg-dark: #0f1012;
  --color-surface-dark: #141518;
  --color-card-dark: #18191d;
  --color-gold: #c5a880;
  --color-gold-hover: #dfc198;
  --color-border: rgba(255, 255, 255, 0.08);
  --color-border-gold: rgba(197, 168, 128, 0.28);
  --color-text-light: #f4f4f5;
  --color-text-muted: #a1a1aa;
  --site-max-width: 1380px;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body, .te-shop-page {
  background-color: var(--color-bg-dark) !important;
  color: var(--color-text-light) !important;
  font-family: var(--font-body) !important;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

h1, h2, h3, h4, .trajan-text {
  font-family: var(--font-trajan) !important;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

a {
  color: inherit;
  text-decoration: none;
}

/* ANNOUNCEMENT BAR */
.announcement-bar {
  background: #090a0c;
  border-bottom: 1px solid var(--color-border);
  padding: 8px 16px;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-align: center;
  color: var(--color-gold);
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

/* HEADER */
.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(15, 16, 18, 0.94);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--color-border);
  padding: 14px 32px;
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
  height: 40px;
  width: auto;
  display: block;
}
.main-nav {
  display: flex;
  align-items: center;
  gap: 28px;
}
.nav-link {
  font-family: var(--font-trajan) !important;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  color: var(--color-text-light);
  transition: color 0.25s ease;
  position: relative;
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
  padding: 8px 18px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  border-radius: 2px;
  transition: all 0.25s ease;
  white-space: nowrap;
}
.header-quote-btn:hover {
  background: var(--color-gold);
  color: #000;
}

/* HERO BANNER */
.shop-hero {
  position: relative;
  width: 100%;
  min-height: 48vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-size: cover;
  background-position: center;
  padding: 70px 24px;
  overflow: hidden;
}
.shop-hero-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(180deg, rgba(15,16,18,0.6) 0%, rgba(15,16,18,0.92) 100%);
  z-index: 1;
}
.shop-hero-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
}
.hero-badge {
  display: inline-block;
  color: var(--color-gold);
  font-family: var(--font-trajan);
  font-size: 0.82rem;
  letter-spacing: 0.22em;
  padding: 6px 18px;
  border: 1px solid var(--color-border-gold);
  background: rgba(197, 168, 128, 0.08);
  border-radius: 40px;
  margin-bottom: 16px;
}
.shop-hero h1 {
  font-size: clamp(2.2rem, 4.2vw, 3.5rem);
  line-height: 1.18;
  color: #ffffff;
  margin-bottom: 14px;
  text-shadow: 0 4px 20px rgba(0,0,0,0.8);
}
.shop-hero p {
  font-size: clamp(1rem, 1.2vw, 1.15rem);
  color: #d1d5db;
  max-width: 720px;
  margin: 0 auto;
  line-height: 1.65;
}

/* FILTER TABS */
.filter-bar {
  background: var(--color-surface-dark);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  padding: 18px 24px;
}
.filter-inner {
  max-width: var(--site-max-width);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}
.filter-btn {
  font-family: var(--font-trajan);
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  padding: 8px 18px;
  border-radius: 30px;
  background: transparent;
  color: var(--color-text-muted);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.25s ease;
}
.filter-btn:hover, .filter-btn.active {
  color: #0f1012;
  background: var(--color-gold);
  border-color: var(--color-gold);
  font-weight: 700;
}

/* PRODUCT GRID SECTION */
.shop-catalog-section {
  padding: 70px 24px 90px;
}
.catalog-container {
  max-width: var(--site-max-width);
  margin: 0 auto;
}
.catalog-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
}

/* PRODUCT CARD */
.product-card {
  background: var(--color-card-dark);
  border: 1px solid var(--color-border);
  border-radius: 3px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.35s ease;
  position: relative;
}
.product-card:hover {
  transform: translateY(-6px);
  border-color: var(--color-border-gold);
  box-shadow: 0 16px 36px rgba(0,0,0,0.55);
}
.product-media {
  position: relative;
  width: 100%;
  padding-top: 115%;
  background: #111215;
  overflow: hidden;
}
.product-media img {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.product-card:hover .product-media img {
  transform: scale(1.06);
}
.product-badge {
  position: absolute;
  top: 14px; left: 14px;
  background: rgba(15, 16, 18, 0.88);
  border: 1px solid var(--color-border-gold);
  color: var(--color-gold);
  font-family: var(--font-trajan);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  padding: 4px 10px;
  border-radius: 2px;
  backdrop-filter: blur(6px);
}
.product-body {
  padding: 22px 20px 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
}
.product-title {
  font-size: 1.05rem;
  color: #ffffff;
  margin-bottom: 8px;
  line-height: 1.35;
  transition: color 0.2s ease;
}
.product-card:hover .product-title {
  color: var(--color-gold);
}
.product-desc {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin-bottom: 14px;
}
.product-price-box {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 18px;
}
.price-current {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-gold);
  font-family: var(--font-body);
}
.price-original {
  font-size: 0.9rem;
  color: #71717a;
  text-decoration: line-through;
}
.product-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.btn-action-primary {
  background: var(--color-gold);
  color: #0f1012 !important;
  font-family: var(--font-trajan);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 10px 8px;
  border-radius: 2px;
  text-align: center;
  border: 1px solid var(--color-gold);
  transition: all 0.25s ease;
}
.btn-action-primary:hover {
  background: var(--color-gold-hover);
}
.btn-action-secondary {
  background: transparent;
  color: #ffffff !important;
  font-family: var(--font-trajan);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 10px 8px;
  border-radius: 2px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: all 0.25s ease;
}
.btn-action-secondary:hover {
  border-color: var(--color-gold);
  color: var(--color-gold) !important;
}

/* TRUST BAR */
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
  font-size: 1.05rem;
  color: #ffffff !important;
  margin-bottom: 8px;
}
.trust-desc {
  font-size: 0.88rem;
  color: var(--color-text-muted);
  line-height: 1.55;
}

/* FOOTER */
.site-footer {
  background: #090a0c;
  border-top: 1px solid var(--color-border);
  padding: 80px 24px 30px;
  color: var(--color-text-muted);
}
.footer-inner {
  max-width: var(--site-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 48px;
  margin-bottom: 60px;
}
.footer-brand p {
  margin: 16px 0 20px;
  font-size: 0.9rem;
  line-height: 1.6;
}
.footer-title {
  font-size: 0.92rem;
  color: #ffffff !important;
  letter-spacing: 0.12em;
  margin-bottom: 20px;
}
.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.footer-links a {
  font-size: 0.88rem;
  color: var(--color-text-muted);
  transition: color 0.2s ease;
}
.footer-links a:hover {
  color: var(--color-gold);
}
.footer-bottom {
  max-width: var(--site-max-width);
  margin: 0 auto;
  padding-top: 30px;
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
  flex-wrap: wrap;
  gap: 16px;
}

@media (max-width: 1100px) {
  .catalog-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .trust-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
@media (max-width: 768px) {
  .site-header { padding: 12px 16px !important; }
  .header-logo img { height: 32px !important; }
  .main-nav { display: none; }
  .catalog-grid {
    grid-template-columns: 1fr;
  }
  .trust-grid {
    grid-template-columns: 1fr !important;
  }
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
`;

const cleanCss = rawCss.split('\n').map(l => l.trim()).filter(Boolean).join('\n');

const bodyHtml = `
<!-- TOP ANNOUNCEMENT BAR -->
<div class="announcement-bar">
  <span>FREE COMPREHENSIVE ON-SITE CONSULTATION &amp; LASER TEMPLATING</span>
  <span>•</span>
  <span>PREMIUM ARCHITECTURAL GLASS &amp; MIRROR INSTALLATIONS</span>
</div>

<!-- HEADER NAVIGATION -->
<header class="site-header">
  <div class="header-inner">
    <a href="https://reflectionelite.ataanalytiq.com/staging-home/?demo=1" class="header-logo">
      <img src="${IMGS.logo}" alt="Reflection Elite Luxury Glass &amp; Mirrors">
    </a>
    <nav class="main-nav">
      <a href="https://reflectionelite.ataanalytiq.com/staging-home/?demo=1" class="nav-link">HOME</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1" class="nav-link active">SHOP &amp; COLLECTIONS</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-product/?demo=1" class="nav-link">SINGLE PRODUCT</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-about-us/?demo=1" class="nav-link">ABOUT US</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="nav-link">CONTACT</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-policies/?demo=1" class="nav-link">POLICIES</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?demo=1" class="nav-link">CART</a>
    </nav>
    <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="header-quote-btn">BOOK SURVEY</a>
  </div>
</header>

<!-- SHOP HERO BANNER -->
<section class="shop-hero" style="background-image: url('${IMGS.heroBg}');">
  <div class="shop-hero-overlay"></div>
  <div class="shop-hero-content">
    <span class="hero-badge">THE ARTISAN CATALOG</span>
    <h1>BESPOKE GLASS &amp; LUXURY MIRRORS</h1>
    <p>Hand-engraved Venetian masterpieces, smart illuminated LED mirrors, frameless shower systems, and architectural glass engineered to elevate fine interiors.</p>
  </div>
</section>

<!-- CATEGORY FILTER BAR -->
<div class="filter-bar">
  <div class="filter-inner">
    <button class="filter-btn active">ALL PIECES (8)</button>
    <button class="filter-btn">VENETIAN MIRRORS</button>
    <button class="filter-btn">SMART LED MIRRORS</button>
    <button class="filter-btn">FRAMELESS SHOWERS</button>
    <button class="filter-btn">ARCHITECTURAL GLAZING</button>
    <button class="filter-btn">MOSAIC &amp; TUKDI ART</button>
  </div>
</div>

<!-- PRODUCT CATALOG GRID -->
<section class="shop-catalog-section">
  <div class="catalog-container">
    <div class="catalog-grid">

      <!-- Product 1: Murana Mirror -->
      <article class="product-card">
        <div class="product-media">
          <img src="${IMGS.p1}" alt="Murana Mirror">
          <span class="product-badge">HERITAGE VENETIAN</span>
        </div>
        <div class="product-body">
          <div>
            <h3 class="product-title">MURANA STATEMENT MIRROR</h3>
            <p class="product-desc">Authentic Venetian craftsmanship featuring hand-cut floral crests, multi-step beveled glass borders, and diamond-engraved rosettes.</p>
          </div>
          <div>
            <div class="product-price-box">
              <span class="price-current">&#8377; 160,000.00</span>
              <span class="price-original">&#8377; 180,000.00</span>
            </div>
            <div class="product-actions">
              <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?add-to-cart=1794&demo=1" class="btn-action-primary">ADD TO CART</a>
              <a href="https://reflectionelite.ataanalytiq.com/staging-product/?demo=1" class="btn-action-secondary">DETAILS &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- Product 2: Antique Venetian Cushion -->
      <article class="product-card">
        <div class="product-media">
          <img src="${IMGS.p2}" alt="Antique Venetian Cushion">
          <span class="product-badge">HAND-ENGRAVED</span>
        </div>
        <div class="product-body">
          <div>
            <h3 class="product-title">ANTIQUE VENETIAN CUSHION</h3>
            <p class="product-desc">Cushion-profile tiered mirror adorned with intricate hand-etched botanical scrolls and solid brass corner accents.</p>
          </div>
          <div>
            <div class="product-price-box">
              <span class="price-current">&#8377; 31,500.00</span>
            </div>
            <div class="product-actions">
              <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?add-to-cart=1132&demo=1" class="btn-action-primary">ADD TO CART</a>
              <a href="https://reflectionelite.ataanalytiq.com/staging-product/?demo=1" class="btn-action-secondary">DETAILS &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- Product 3: Modern Victorian -->
      <article class="product-card">
        <div class="product-media">
          <img src="${IMGS.p3}" alt="Modern Victorian Mirror">
          <span class="product-badge">BEVELED FILIGREE</span>
        </div>
        <div class="product-body">
          <div>
            <h3 class="product-title">MODERN VICTORIAN MIRROR</h3>
            <p class="product-desc">Architectural Victorian silhouette refined with crisp contemporary beveling and ultra-clear low-iron silvering.</p>
          </div>
          <div>
            <div class="product-price-box">
              <span class="price-current">&#8377; 58,787.00</span>
            </div>
            <div class="product-actions">
              <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?add-to-cart=1127&demo=1" class="btn-action-primary">ADD TO CART</a>
              <a href="https://reflectionelite.ataanalytiq.com/staging-product/?demo=1" class="btn-action-secondary">DETAILS &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- Product 4: Rococo Floral -->
      <article class="product-card">
        <div class="product-media">
          <img src="${IMGS.p4}" alt="Rococo Floral Mirror">
          <span class="product-badge">FLORAL CREST</span>
        </div>
        <div class="product-body">
          <div>
            <h3 class="product-title">ROCOCO FLORAL ART MIRROR</h3>
            <p class="product-desc">Baroque-inspired hand-carved glass crown featuring delicate leaf flourishes and antique silver patina.</p>
          </div>
          <div>
            <div class="product-price-box">
              <span class="price-current">&#8377; 14,000.00</span>
            </div>
            <div class="product-actions">
              <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?add-to-cart=1121&demo=1" class="btn-action-primary">ADD TO CART</a>
              <a href="https://reflectionelite.ataanalytiq.com/staging-product/?demo=1" class="btn-action-secondary">DETAILS &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- Product 5: Silver Crown Framed -->
      <article class="product-card">
        <div class="product-media">
          <img src="${IMGS.p5}" alt="Silver Crown Framed Mirror">
          <span class="product-badge">ARISTOCRATIC MOTIF</span>
        </div>
        <div class="product-body">
          <div>
            <h3 class="product-title">SILVER CROWN FRAMED MIRROR</h3>
            <p class="product-desc">Regal crown crest with multi-faceted diamond-cut glass borders and corrosion-resistant silvering.</p>
          </div>
          <div>
            <div class="product-price-box">
              <span class="price-current">&#8377; 28,175.00</span>
            </div>
            <div class="product-actions">
              <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?add-to-cart=1115&demo=1" class="btn-action-primary">ADD TO CART</a>
              <a href="https://reflectionelite.ataanalytiq.com/staging-product/?demo=1" class="btn-action-secondary">DETAILS &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- Product 6: Mosaic Mirror Art -->
      <article class="product-card">
        <div class="product-media">
          <img src="${IMGS.p6}" alt="Mosaic Mirror Art">
          <span class="product-badge">TUKDI HANDICRAFT</span>
        </div>
        <div class="product-body">
          <div>
            <h3 class="product-title">HANDCRAFTED MOSAIC ART</h3>
            <p class="product-desc">Traditional geometric tukdi mirror art assembled piece-by-piece to create a dazzling kaleidoscopic light reflection.</p>
          </div>
          <div>
            <div class="product-price-box">
              <span class="price-current">&#8377; 2,500.00</span>
            </div>
            <div class="product-actions">
              <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?add-to-cart=451&demo=1" class="btn-action-primary">ADD TO CART</a>
              <a href="https://reflectionelite.ataanalytiq.com/staging-product/?demo=1" class="btn-action-secondary">DETAILS &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- Product 7: Frameless Shower Systems -->
      <article class="product-card">
        <div class="product-media">
          <img src="${IMGS.p7}" alt="Frameless Shower Enclosure Systems">
          <span class="product-badge">CUSTOM GLAZING</span>
        </div>
        <div class="product-body">
          <div>
            <h3 class="product-title">FRAMELESS SHOWER SYSTEMS</h3>
            <p class="product-desc">Custom-engineered 10mm/12mm toughened low-iron safety glass with concealed marine-grade solid brass hardware.</p>
          </div>
          <div>
            <div class="product-price-box">
              <span class="price-current">FROM &#8377; 45,000.00</span>
            </div>
            <div class="product-actions">
              <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="btn-action-primary">BOOK SURVEY</a>
              <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="btn-action-secondary">GET QUOTE &rarr;</a>
            </div>
          </div>
        </div>
      </article>

      <!-- Product 8: Architectural Partitions -->
      <article class="product-card">
        <div class="product-media">
          <img src="${IMGS.p8}" alt="Architectural Glass Partitions">
          <span class="product-badge">INTERIOR DIVISION</span>
        </div>
        <div class="product-body">
          <div>
            <h3 class="product-title">ACOUSTIC GLASS PARTITIONS</h3>
            <p class="product-desc">Crittall-inspired slimline aluminum framing and acoustic laminated glass for luxury offices and modern living spaces.</p>
          </div>
          <div>
            <div class="product-price-box">
              <span class="price-current">FROM &#8377; 65,000.00</span>
            </div>
            <div class="product-actions">
              <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="btn-action-primary">BOOK SURVEY</a>
              <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="btn-action-secondary">GET QUOTE &rarr;</a>
            </div>
          </div>
        </div>
      </article>

    </div>
  </div>
</section>

<!-- VALUE PILLARS & TRUST -->
<section class="trust-bar">
  <div class="trust-grid">
    <div class="trust-item">
      <span class="trust-icon">&#9672;</span>
      <h3 class="trust-title">DIGITAL LASER TEMPLATING</h3>
      <p class="trust-desc">Sub-millimeter on-site 3D survey guarantees zero-gap precision fit.</p>
    </div>
    <div class="trust-item">
      <span class="trust-icon">&#9672;</span>
      <h3 class="trust-title">100% LOW-IRON GLASS</h3>
      <p class="trust-desc">Crystal optical clarity eliminating all green edge tint.</p>
    </div>
    <div class="trust-item">
      <span class="trust-icon">&#9672;</span>
      <h3 class="trust-title">CERTIFIED MASTER GLAZIERS</h3>
      <p class="trust-desc">White-glove delivery, structural mounting, and hygienic clean finish.</p>
    </div>
    <div class="trust-item">
      <span class="trust-icon">&#9672;</span>
      <h3 class="trust-title">10-YEAR WARRANTY</h3>
      <p class="trust-desc">Guaranteed against silvering deterioration and hardware corrosion.</p>
    </div>
  </div>
</section>

<!-- LUXURY BRAND FOOTER -->
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <img src="${IMGS.logo}" alt="Reflection Elite" style="height:36px; margin-bottom:12px;">
      <p>Reflection Elite is an architectural glass and bespoke mirror atelier specializing in frameless shower systems, custom LED mirrors, acoustic office partitions, and handcrafted Venetian mirrors.</p>
    </div>
    <div>
      <h4 class="footer-title">COLLECTIONS</h4>
      <ul class="footer-links">
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1">Frameless Showers</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1">Venetian Statement Mirrors</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1">LED Smart Mirrors</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1">Architectural Partitions</a></li>
      </ul>
    </div>
    <div>
      <h4 class="footer-title">NAVIGATION</h4>
      <ul class="footer-links">
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-home/?demo=1">Home</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-about-us/?demo=1">About Us</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1">Contact Concierge</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-policies/?demo=1">Policies &amp; Warranty</a></li>
      </ul>
    </div>
    <div>
      <h4 class="footer-title">STUDIO CONCIERGE</h4>
      <p style="font-size:0.88rem; line-height:1.6; margin-bottom:12px;">Direct Line: +91 98765 43210<br>Email: concierge@reflectionelite.com<br>Mon – Sat: 9:00 AM – 7:00 PM</p>
      <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="header-quote-btn" style="display:inline-block; margin-top:8px;">BOOK SURVEY</a>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2026 Reflection Elite. All Rights Reserved. Staging Preview.</p>
    <p style="color:var(--color-gold);">TRENDING ERA LUXURY EDITION</p>
  </div>
</footer>
`;

const fullGutenbergPayload = `<!-- wp:html -->
<style id="te-shop-styles">
${cleanCss}
</style>
<div class="te-shop-page">
${bodyHtml}
</div>
<!-- /wp:html -->`;

async function deployShop() {
  console.log('Deploying Staging Shop / Collections page...');
  
  // Check if staging-shop already exists
  const checkReq = http.get('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages?slug=staging-shop', {
    headers: { 'Cookie': cookieHeader }
  }, res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
      const existing = JSON.parse(body);
      const targetId = existing.length > 0 ? existing[0].id : null;
      
      const payload = JSON.stringify({
        title: 'Shop & Collections — Staging Preview (Trending Era)',
        slug: 'staging-shop',
        status: 'publish',
        template: 'elementor_canvas',
        content: fullGutenbergPayload,
        meta: {
          _elementor_edit_mode: ''
        }
      });
      
      const endpoint = targetId 
        ? `https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/${targetId}`
        : 'https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages';
        
      console.log(`Sending to ${endpoint} (Target ID: ${targetId || 'NEW'})...`);
      
      const req = http.request(endpoint, {
        method: 'POST',
        headers: {
          'Cookie': cookieHeader,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          'X-WP-Nonce': nonce
        }
      }, resPost => {
        let postBody = '';
        resPost.on('data', d => postBody += d);
        resPost.on('end', () => {
          console.log('Deploy response code:', resPost.statusCode);
          try {
            const result = JSON.parse(postBody);
            console.log('Staging Shop Page ID:', result.id, '| Link:', result.link);
          } catch(e) {
            console.log('Error parsing response:', postBody.slice(0, 300));
          }
        });
      });
      req.write(payload);
      req.end();
    });
  });
}

deployShop();
