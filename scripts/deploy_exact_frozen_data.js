import fs from 'fs';
import { getFreshNonce, updatePage, COMMON_CSS, getHeaderHtml, getFooterHtml } from './staging_real_data_helper.js';

// The 7 EXACT PRODUCTS from reflectionelite.com (100% Data Invariant)
const REAL_PRODUCTS = [
  {
    id: 17,
    slug: 'antique-venetian-cushion',
    title: 'ANTIQUE VENETIAN CUSHION',
    price: '₹81,500',
    category: 'Venetian Mirror',
    img: 'https://reflectionelite.com/wp-content/uploads/2026/10/1771694577552.jpg',
    link: 'https://reflectionelite.ataanalytiq.com/staging-product/?prod=antique-venetian-cushion&demo=1'
  },
  {
    id: 30,
    slug: 'modern-victorian',
    title: 'MODERN VICTORIAN',
    price: '₹58,787',
    category: 'Venetian Mirror',
    img: 'https://reflectionelite.com/wp-content/uploads/2026/10/20260222_002716-scaled.jpg',
    link: 'https://reflectionelite.ataanalytiq.com/staging-product/?prod=modern-victorian&demo=1'
  },
  {
    id: 51,
    slug: 'silver-crown-framed',
    title: 'SILVER CROWN FRAMED',
    price: '₹35,900',
    category: 'Venetian Mirror',
    img: 'https://reflectionelite.com/wp-content/uploads/2026/10/20260221_235950-scaled.jpg',
    link: 'https://reflectionelite.ataanalytiq.com/staging-product/?prod=silver-crown-framed&demo=1'
  },
  {
    id: 45,
    slug: 'rococo-floral',
    title: 'ROCOCO FLORAL',
    price: '₹14,000',
    category: 'Venetian Mirror',
    img: 'https://reflectionelite.com/wp-content/uploads/2026/10/20260222_092621-scaled.jpg',
    link: 'https://reflectionelite.ataanalytiq.com/staging-product/?prod=rococo-floral&demo=1'
  },
  {
    id: 36,
    slug: 'mosaic-mirror-art',
    title: 'MOSAIC MIRROR ART',
    price: '₹2,500 – ₹7,500',
    category: 'Contemporary',
    img: 'https://reflectionelite.com/wp-content/uploads/2026/10/20260305_220825.jpg',
    link: 'https://reflectionelite.ataanalytiq.com/staging-product/?prod=mosaic-mirror-art&demo=1'
  },
  {
    id: 23,
    slug: 'customised-mirror',
    title: 'CUSTOMISED MIRROR',
    price: '₹100',
    category: 'Custom',
    img: 'https://reflectionelite.com/wp-content/uploads/2026/10/WhatsAppImage2026-07-13at5.15.04PM.jpg',
    link: 'https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1'
  },
  {
    id: 41,
    slug: 'premium-upholstered-frame',
    title: 'PREMIUM UPHOLSTERED FRAME',
    price: 'Price on Request',
    category: 'Statement Piece',
    img: 'https://reflectionelite.com/wp-content/uploads/2026/10/WhatsAppImage2026-09-18at3.57.23PM.jpg',
    link: 'https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1'
  }
];

// Luxury CSS with Pure "Trending Era" Aesthetics & Exact Card Architecture
const THEME_CSS = `
${COMMON_CSS}

/* SHOP HERO BANNER */
.shop-hero {
  position: relative;
  width: 100%;
  min-height: 38vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-image: url('https://reflectionelite.com/wp-content/uploads/2026/10/1771694577552.jpg');
  background-size: cover;
  background-position: center;
  padding: 60px 24px;
}
.shop-hero-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(180deg, rgba(15,16,18,0.72) 0%, rgba(15,16,18,0.96) 100%);
  z-index: 1;
}
.shop-hero-content {
  position: relative;
  z-index: 2;
  max-width: 860px;
  margin: 0 auto;
}
.hero-tag {
  color: var(--color-gold);
  font-family: var(--font-trajan);
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  display: inline-block;
  margin-bottom: 12px;
}
.shop-hero h1 {
  font-size: clamp(2rem, 3.6vw, 3rem);
  color: #ffffff;
  margin-bottom: 12px;
}
.shop-hero p {
  font-size: 1.05rem;
  color: #d1d5db;
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.6;
}

/* TOP STATUS & FILTER BAR (Matches "Showing 7 masterpieces" + Filter in Screenshot) */
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

/* PRODUCT CARD (Matching the user's screenshot structure 1:1) */
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

@media (max-width: 1100px) {
  .catalog-grid { grid-template-columns: repeat(2, 1fr) !important; }
}
@media (max-width: 650px) {
  .catalog-grid { grid-template-columns: 1fr !important; }
}
`;

function buildShopHtml() {
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
<div class="te-staging-page">
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

  <!-- TOP TOOLBAR (Matches user screenshot: "Showing 7 masterpieces" | Featured | Filter) -->
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

  <!-- 4-COLUMN PRODUCT GRID (EXACTLY THE 7 REAL PRODUCTS) -->
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

// -----------------------------------------------------------------------------
// HOMEPAGE (Page 1984) - Rebuilt to showcase strictly the 7 real products
// -----------------------------------------------------------------------------
function buildHomeHtml() {
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
<div class="te-staging-page">
  ${headerHtml}

  <!-- CYCLE 1: HERO BANNER -> 4 REAL PRODUCTS -->
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
        <a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1" style="background:var(--color-gold); color:#000; font-family:var(--font-trajan); font-size:0.85rem; font-weight:700; padding:15px 32px; border-radius:2px;">EXPLORE 7 MASTERPIECES</a>
        <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" style="background:transparent; color:#fff; font-family:var(--font-trajan); font-size:0.85rem; font-weight:700; padding:15px 32px; border:1px solid rgba(255,255,255,0.3); border-radius:2px;">BOOK ON-SITE SURVEY</a>
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

  <!-- CYCLE 2: FEATURED BANNER -> 3 REAL CONTEMPORARY & CUSTOM PIECES -->
  <section class="shop-hero" style="min-height: 60vh; background-image: url('https://reflectionelite.com/wp-content/uploads/2026/10/20260222_002716-scaled.jpg');">
    <div class="shop-hero-overlay"></div>
    <div class="shop-hero-content">
      <span class="hero-tag">ATELIER CRAFTSMANSHIP</span>
      <h2>MODERN VICTORIAN &amp; CONTEMPORARY ART</h2>
      <p>From custom-dimension backlit mirrors to geometric mosaic horse head art and organic upholstered frames.</p>
      <a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1" style="display:inline-block; margin-top:20px; background:var(--color-gold); color:#000; font-family:var(--font-trajan); font-size:0.82rem; font-weight:700; padding:14px 28px; border-radius:2px;">VIEW ALL 7 PIECES &rarr;</a>
    </div>
  </section>

  <section class="catalog-section" style="padding-top: 80px;">
    <div class="catalog-container">
      <div style="text-align:center; margin-bottom:48px;">
        <span class="hero-tag">CONTEMPORARY &amp; BESPOKE</span>
        <h2 style="font-size:clamp(1.8rem, 3vw, 2.6rem); color:#fff; margin-bottom:10px;">SIGNATURE CUSTOM WORKS</h2>
        <p style="color:var(--color-text-muted); font-size:1rem; max-width:620px; margin:0 auto;">Precision tukdi mosaic handicrafts and custom bespoke mirror framing tailored to your space.</p>
      </div>
      <div class="catalog-grid" style="grid-template-columns: repeat(3, 1fr) !important;">
        ${realCardsCycle2}
      </div>
    </div>
  </section>

  <!-- CYCLE 3: VALUE REASSURANCE PILLARS -->
  <section style="background:#141518; border-top:1px solid var(--color-border); border-bottom:1px solid var(--color-border); padding:60px 24px;">
    <div style="max-width:var(--site-max-width); margin:0 auto; display:grid; grid-template-columns:repeat(4, 1fr); gap:30px; text-align:center;">
      <div>
        <div style="font-size:2rem; color:var(--color-gold); margin-bottom:12px;">&#128208;</div>
        <h3 style="font-family:var(--font-trajan); font-size:0.95rem; color:#fff; margin-bottom:8px;">LASER MEASURED PRECISION</h3>
        <p style="font-size:0.84rem; color:var(--color-text-muted); line-height:1.5;">Sub-millimeter digital templating guarantees absolute alignment with out-of-square walls.</p>
      </div>
      <div>
        <div style="font-size:2rem; color:var(--color-gold); margin-bottom:12px;">&#128737;&#65039;</div>
        <h3 style="font-family:var(--font-trajan); font-size:0.95rem; color:#fff; margin-bottom:8px;">SAFETY-BACKED MIRRORS</h3>
        <p style="font-size:0.84rem; color:var(--color-text-muted); line-height:1.5;">High-grade vinyl safety backing ensures total shatter prevention for residential security.</p>
      </div>
      <div>
        <div style="font-size:2rem; color:var(--color-gold); margin-bottom:12px;">&#128142;</div>
        <h3 style="font-family:var(--font-trajan); font-size:0.95rem; color:#fff; margin-bottom:8px;">WHITE-GLOVE INSTALLATION</h3>
        <p style="font-size:0.84rem; color:var(--color-text-muted); line-height:1.5;">In-house master glazers handle every stage with immaculate care, cleanliness, and precision.</p>
      </div>
      <div>
        <div style="font-size:2rem; color:var(--color-gold); margin-bottom:12px;">&#128220;</div>
        <h3 style="font-family:var(--font-trajan); font-size:0.95rem; color:#fff; margin-bottom:8px;">10-YEAR WARRANTY</h3>
        <p style="font-size:0.84rem; color:var(--color-text-muted); line-height:1.5;">Comprehensive protection against silver oxidation, clouding, and hardware tarnishing.</p>
      </div>
    </div>
  </section>

  ${footerHtml}
</div>
<!-- /wp:html -->`;
}

// -----------------------------------------------------------------------------
// SINGLE PRODUCT SHOWCASE (Page 1993) - Antique Venetian Cushion (₹81,500)
// -----------------------------------------------------------------------------
function buildProductHtml() {
  const headerHtml = getHeaderHtml('product');
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
<style id="te-product-styles">
${THEME_CSS}

.prod-split-section {
  padding: 60px 24px 80px;
}
.prod-split-container {
  max-width: var(--site-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
}
.prod-main-img-box {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  overflow: hidden;
}
.prod-main-img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.prod-details-box h1 {
  font-size: clamp(1.8rem, 3.2vw, 2.6rem);
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
<div class="te-staging-page">
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
          <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?demo=1" style="background:var(--color-gold); color:#000; font-family:var(--font-trajan); font-size:0.85rem; font-weight:700; padding:15px 32px; border-radius:2px;">ADD TO CART &bull; &#8377;81,500</a>
          <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" style="background:transparent; color:var(--color-gold); font-family:var(--font-trajan); font-size:0.85rem; font-weight:700; padding:15px 32px; border:1px solid var(--color-gold); border-radius:2px;">REQUEST ON-SITE SURVEY</a>
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

async function run() {
  console.log('Fetching fresh nonce...');
  const nonce = await getFreshNonce();

  // 1. Deploy Staging Shop (Page 1992)
  console.log('Deploying 100% exact reflectionelite.com data to Staging Shop (1992)...');
  const shopHtml = buildShopHtml();
  await updatePage(1992, 'Shop & Collections — Staging Preview (Trending Era)', 'staging-shop', shopHtml, nonce);

  // 2. Deploy Staging Home (Page 1984)
  console.log('Deploying 100% exact reflectionelite.com data to Staging Home (1984)...');
  const homeHtml = buildHomeHtml();
  await updatePage(1984, 'Home — Staging Preview (Trending Era)', 'staging-home', homeHtml, nonce);

  // 3. Deploy Staging Product (Page 1993)
  console.log('Deploying 100% exact reflectionelite.com data to Staging Product (1993)...');
  const prodHtml = buildProductHtml();
  await updatePage(1993, 'Single Product — Staging Preview (Trending Era)', 'staging-product', prodHtml, nonce);

  console.log('All pages deployed successfully!');
}

run().catch(console.error);
