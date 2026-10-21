import fs from 'fs';
import http from 'https';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
const nonce = 'f5b146aecd';

const IMGS = {
  logo: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/Logo-Reflection-e1777369196767-1024x186.png',
  mainProd: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/05/23952812_master.jpg',
  thumb1: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/05/23952812_master.jpg',
  thumb2: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/1771694577552-2.webp',
  thumb3: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260222_002716.jpg',
  thumb4: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260221_235950-1.webp',
  
  // Related products
  rel1: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/1771694577552-2.webp',
  rel2: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260222_002716.jpg',
  rel3: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260222_092621-1.webp',
  rel4: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260221_235950-1.webp'
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

body, .te-product-page {
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

/* BREADCRUMB */
.breadcrumb-bar {
  background: var(--color-surface-dark);
  border-bottom: 1px solid var(--color-border);
  padding: 14px 24px;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
}
.breadcrumb-inner {
  max-width: var(--site-max-width);
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
}
.breadcrumb-inner a:hover {
  color: var(--color-gold);
}
.breadcrumb-current {
  color: var(--color-gold);
  font-weight: 600;
}

/* PRODUCT SECTION */
.product-detail-section {
  padding: 60px 24px 80px;
}
.product-detail-container {
  max-width: var(--site-max-width);
  margin: 0 auto;
}
.product-split {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 60px;
  align-items: flex-start;
}

/* GALLERY COLUMN */
.gallery-column {
  position: sticky;
  top: 100px;
}
.main-image-wrap {
  position: relative;
  width: 100%;
  padding-top: 120%;
  background: #111215;
  border: 1px solid var(--color-border-gold);
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.6);
}
.main-image-wrap img {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  object-fit: cover;
}
.thumb-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-top: 16px;
}
.thumb-item {
  position: relative;
  padding-top: 100%;
  background: #141518;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 2px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.25s ease;
}
.thumb-item:hover, .thumb-item.active {
  border-color: var(--color-gold);
}
.thumb-item img {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  object-fit: cover;
}

/* INFO COLUMN */
.info-column {
  display: flex;
  flex-direction: column;
}
.prod-badge {
  display: inline-block;
  color: var(--color-gold);
  font-family: var(--font-trajan);
  font-size: 0.78rem;
  letter-spacing: 0.2em;
  padding: 4px 14px;
  border: 1px solid var(--color-border-gold);
  background: rgba(197, 168, 128, 0.08);
  border-radius: 40px;
  margin-bottom: 12px;
  width: fit-content;
}
.prod-title {
  font-size: clamp(2rem, 3.2vw, 2.8rem);
  line-height: 1.2;
  color: #ffffff;
  margin-bottom: 12px;
}
.rating-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  font-size: 0.88rem;
}
.stars {
  color: #f59e0b;
  letter-spacing: 2px;
}
.rating-count {
  color: var(--color-text-muted);
}
.prod-price-box {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 16px 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 24px;
}
.prod-price-current {
  font-size: 1.85rem;
  font-weight: 700;
  color: var(--color-gold);
}
.prod-price-original {
  font-size: 1.15rem;
  color: #71717a;
  text-decoration: line-through;
}
.prod-save-pill {
  font-size: 0.75rem;
  font-family: var(--font-trajan);
  background: rgba(197, 168, 128, 0.15);
  border: 1px solid var(--color-gold);
  color: var(--color-gold);
  padding: 4px 10px;
  border-radius: 2px;
}
.prod-excerpt {
  color: #d1d5db;
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 28px;
}

/* SPECS QUICK LIST */
.specs-quick-list {
  background: var(--color-surface-dark);
  border: 1px solid var(--color-border);
  padding: 20px;
  border-radius: 3px;
  margin-bottom: 28px;
}
.specs-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.88rem;
}
.specs-item:last-child {
  border-bottom: none;
}
.specs-key {
  color: var(--color-text-muted);
}
.specs-val {
  color: #ffffff;
  font-weight: 600;
}

/* PURCHASE ACTIONS */
.purchase-box {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}
.qty-btn-group {
  display: flex;
  align-items: center;
  gap: 16px;
}
.qty-selector {
  display: flex;
  align-items: center;
  background: #111215;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 2px;
}
.qty-btn {
  background: transparent;
  color: #ffffff;
  border: none;
  width: 44px;
  height: 48px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.qty-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}
.qty-input {
  width: 50px;
  height: 48px;
  background: transparent;
  border: none;
  color: #ffffff;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
}
.btn-add-to-cart {
  flex-grow: 1;
  background: var(--color-gold);
  color: #0f1012 !important;
  font-family: var(--font-trajan);
  font-weight: 700;
  font-size: 0.92rem;
  letter-spacing: 0.14em;
  padding: 16px 28px;
  border-radius: 2px;
  border: 1px solid var(--color-gold);
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  display: inline-block;
}
.btn-add-to-cart:hover {
  background: var(--color-gold-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(197, 168, 128, 0.3);
}
.btn-custom-quote {
  background: transparent;
  color: var(--color-gold) !important;
  border: 1px solid var(--color-gold);
  font-family: var(--font-trajan);
  font-weight: 700;
  font-size: 0.88rem;
  letter-spacing: 0.12em;
  padding: 14px 24px;
  border-radius: 2px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s ease;
  display: inline-block;
}
.btn-custom-quote:hover {
  background: var(--color-gold);
  color: #000 !important;
}

/* DETAILS TABS */
.product-tabs-section {
  background: var(--color-surface-dark);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  padding: 70px 24px;
}
.tabs-container {
  max-width: var(--site-max-width);
  margin: 0 auto;
}
.tabs-nav {
  display: flex;
  gap: 30px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 30px;
}
.tab-nav-btn {
  font-family: var(--font-trajan);
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  padding-bottom: 14px;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  background: transparent;
  border-top: none;
  border-left: none;
  border-right: none;
}
.tab-nav-btn.active {
  color: var(--color-gold);
  border-bottom-color: var(--color-gold);
}
.tab-content p {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 16px;
}

/* RELATED SECTION */
.related-section {
  padding: 80px 24px;
}
.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
  margin-top: 40px;
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

@media (max-width: 1024px) {
  .product-split {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .gallery-column {
    position: static;
  }
  .related-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .footer-inner {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 768px) {
  .site-header { padding: 12px 16px !important; }
  .header-logo img { height: 32px !important; }
  .main-nav { display: none; }
  .qty-btn-group { flex-direction: column; }
  .qty-selector { width: 100%; justify-content: center; }
  .btn-add-to-cart { width: 100%; }
  .related-grid { grid-template-columns: 1fr; }
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
      <a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1" class="nav-link">SHOP &amp; COLLECTIONS</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-product/?demo=1" class="nav-link active">SINGLE PRODUCT</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-about-us/?demo=1" class="nav-link">ABOUT US</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="nav-link">CONTACT</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-policies/?demo=1" class="nav-link">POLICIES</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?demo=1" class="nav-link">CART</a>
    </nav>
    <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="header-quote-btn">BOOK SURVEY</a>
  </div>
</header>

<!-- BREADCRUMBS -->
<div class="breadcrumb-bar">
  <div class="breadcrumb-inner">
    <a href="https://reflectionelite.ataanalytiq.com/staging-home/?demo=1">HOME</a>
    <span>/</span>
    <a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1">COLLECTIONS</a>
    <span>/</span>
    <span>VENETIAN MIRRORS</span>
    <span>/</span>
    <span class="breadcrumb-current">MURANA STATEMENT MIRROR</span>
  </div>
</div>

<!-- MAIN PRODUCT DETAIL -->
<section class="product-detail-section">
  <div class="product-detail-container">
    <div class="product-split">

      <!-- LEFT: MULTI-IMAGE GALLERY -->
      <div class="gallery-column">
        <div class="main-image-wrap">
          <img id="mainProdView" src="${IMGS.mainProd}" alt="Murana Statement Mirror">
        </div>
        <div class="thumb-strip">
          <div class="thumb-item active" onclick="document.getElementById('mainProdView').src='${IMGS.thumb1}';">
            <img src="${IMGS.thumb1}" alt="Front Profile">
          </div>
          <div class="thumb-item" onclick="document.getElementById('mainProdView').src='${IMGS.thumb2}';">
            <img src="${IMGS.thumb2}" alt="Bevel Profile">
          </div>
          <div class="thumb-item" onclick="document.getElementById('mainProdView').src='${IMGS.thumb3}';">
            <img src="${IMGS.thumb3}" alt="Floral Rosette Detail">
          </div>
          <div class="thumb-item" onclick="document.getElementById('mainProdView').src='${IMGS.thumb4}';">
            <img src="${IMGS.thumb4}" alt="Crest Detail">
          </div>
        </div>
      </div>

      <!-- RIGHT: PURCHASE SPECIFICATIONS -->
      <div class="info-column">
        <span class="prod-badge">AUTHENTIC VENETIAN ATELIER</span>
        <h1 class="prod-title">MURANA STATEMENT MIRROR</h1>
        
        <div class="rating-bar">
          <span class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
          <span class="rating-count">5.0 (1 verified architectural review)</span>
        </div>

        <div class="prod-price-box">
          <span class="prod-price-current">&#8377; 160,000.00</span>
          <span class="prod-price-original">&#8377; 180,000.00</span>
          <span class="prod-save-pill">SAVE &#8377; 20,000</span>
        </div>

        <p class="prod-excerpt">
          The Murana Statement Mirror is an authentic Venetian tour de force, handcrafted by master glass artisans. Each piece features diamond-wheel engraved botanical scrolls, precision-beveled framing, and hand-cut glass rosettes anchored with traditional floral studs. Fabricated from 100% ultra-clear low-iron glass for flawless color-neutral reflection.
        </p>

        <!-- SPECIFICATIONS TABLE -->
        <div class="specs-quick-list">
          <div class="specs-item">
            <span class="specs-key">STANDARD DIMENSIONS</span>
            <span class="specs-val">48&quot; Height x 36&quot; Width x 1.5&quot; Depth</span>
          </div>
          <div class="specs-item">
            <span class="specs-key">GLASS PURITY</span>
            <span class="specs-val">Ultra-Clear Low-Iron (Zero Green Edge Tint)</span>
          </div>
          <div class="specs-item">
            <span class="specs-key">EDGE BEVELING</span>
            <span class="specs-val">Hand-Polished Multi-Step Diamond Bevel</span>
          </div>
          <div class="specs-item">
            <span class="specs-key">SILVERING PROTECTION</span>
            <span class="specs-val">Archival Anti-Tarnish Dual Sealant</span>
          </div>
          <div class="specs-item">
            <span class="specs-key">STRUCTURAL MOUNTING</span>
            <span class="specs-val">Heavy-Duty French Cleat System Included</span>
          </div>
        </div>

        <!-- PURCHASE ACTION BUTTONS -->
        <div class="purchase-box">
          <div class="qty-btn-group">
            <div class="qty-selector">
              <button type="button" class="qty-btn" onclick="let q=document.getElementById('prodQty'); if(parseInt(q.value)>1)q.value=parseInt(q.value)-1;">-</button>
              <input type="number" id="prodQty" class="qty-input" value="1" min="1" readonly>
              <button type="button" class="qty-btn" onclick="let q=document.getElementById('prodQty'); q.value=parseInt(q.value)+1;">+</button>
            </div>
            <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?add-to-cart=1794&demo=1" class="btn-add-to-cart">
              ADD TO CART &bull; &#8377; 160,000.00
            </a>
          </div>

          <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="btn-custom-quote">
            REQUEST CUSTOM BESPOKE DIMENSIONS &rarr;
          </a>
        </div>

        <div style="font-size:0.85rem; color:var(--color-text-muted); line-height:1.6; border-top:1px solid var(--color-border); padding-top:16px;">
          &bull; <strong>White-Glove Delivery:</strong> Crated in cushioned architectural packaging.<br>
          &bull; <strong>10-Year Warranty:</strong> Guaranteed against silvering degradation and hardware tarnishing.<br>
          &bull; <strong>Master Glazier Support:</strong> Optional on-site white-glove installation available.
        </div>

      </div>

    </div>
  </div>
</section>

<!-- SPECIFICATIONS & ARCHITECTURAL TABS -->
<section class="product-tabs-section">
  <div class="tabs-container">
    <div class="tabs-nav">
      <button class="tab-nav-btn active">ARTISANAL HERITAGE</button>
      <button class="tab-nav-btn">INSTALLATION &amp; CARE</button>
      <button class="tab-nav-btn">10-YEAR WARRANTY</button>
    </div>
    <div class="tab-content">
      <p>Every Murana mirror begins with hand-blown crystal-grade glass formed according to centuries-old Venetian tradition. Artisan master carvers manually guide diamond engraving wheels across the glass to sculpt botanical motifs, acanthus leaves, and fluted scrolls with remarkable tactile depth.</p>
      <p>The reflective surface utilizes our proprietary silver-mirroring process, layered with protective anti-corrosion backing to prevent moisture oxidation, ensuring your investment retains its sparkling radiance for decades in humid master suites and living salons alike.</p>
    </div>
  </div>
</section>

<!-- YOU MAY ALSO ADMIRE -->
<section class="related-section">
  <div class="product-detail-container">
    <div style="text-align:center;">
      <span class="prod-badge">CURATED COMPLEMENTS</span>
      <h2 style="font-size:clamp(1.8rem, 2.8vw, 2.4rem); color:#ffffff; margin-top:8px;">YOU MAY ALSO ADMIRE</h2>
    </div>

    <div class="related-grid">
      <!-- Related 1 -->
      <article class="product-card" style="background:var(--color-card-dark); border:1px solid var(--color-border); border-radius:3px; overflow:hidden;">
        <div style="position:relative; width:100%; padding-top:110%;">
          <img src="${IMGS.rel1}" alt="Antique Venetian Cushion" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;">
        </div>
        <div style="padding:18px;">
          <h3 style="font-size:1rem; color:#fff; margin-bottom:6px;">ANTIQUE VENETIAN CUSHION</h3>
          <div style="color:var(--color-gold); font-weight:700; margin-bottom:12px;">&#8377; 31,500.00</div>
          <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?add-to-cart=1132&demo=1" style="display:block; text-align:center; background:var(--color-gold); color:#000; font-family:var(--font-trajan); font-size:0.75rem; font-weight:700; padding:10px; border-radius:2px;">ADD TO CART</a>
        </div>
      </article>

      <!-- Related 2 -->
      <article class="product-card" style="background:var(--color-card-dark); border:1px solid var(--color-border); border-radius:3px; overflow:hidden;">
        <div style="position:relative; width:100%; padding-top:110%;">
          <img src="${IMGS.rel2}" alt="Modern Victorian" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;">
        </div>
        <div style="padding:18px;">
          <h3 style="font-size:1rem; color:#fff; margin-bottom:6px;">MODERN VICTORIAN MIRROR</h3>
          <div style="color:var(--color-gold); font-weight:700; margin-bottom:12px;">&#8377; 58,787.00</div>
          <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?add-to-cart=1127&demo=1" style="display:block; text-align:center; background:var(--color-gold); color:#000; font-family:var(--font-trajan); font-size:0.75rem; font-weight:700; padding:10px; border-radius:2px;">ADD TO CART</a>
        </div>
      </article>

      <!-- Related 3 -->
      <article class="product-card" style="background:var(--color-card-dark); border:1px solid var(--color-border); border-radius:3px; overflow:hidden;">
        <div style="position:relative; width:100%; padding-top:110%;">
          <img src="${IMGS.rel3}" alt="Rococo Floral" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;">
        </div>
        <div style="padding:18px;">
          <h3 style="font-size:1rem; color:#fff; margin-bottom:6px;">ROCOCO FLORAL ART</h3>
          <div style="color:var(--color-gold); font-weight:700; margin-bottom:12px;">&#8377; 14,000.00</div>
          <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?add-to-cart=1121&demo=1" style="display:block; text-align:center; background:var(--color-gold); color:#000; font-family:var(--font-trajan); font-size:0.75rem; font-weight:700; padding:10px; border-radius:2px;">ADD TO CART</a>
        </div>
      </article>

      <!-- Related 4 -->
      <article class="product-card" style="background:var(--color-card-dark); border:1px solid var(--color-border); border-radius:3px; overflow:hidden;">
        <div style="position:relative; width:100%; padding-top:110%;">
          <img src="${IMGS.rel4}" alt="Silver Crown Framed" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;">
        </div>
        <div style="padding:18px;">
          <h3 style="font-size:1rem; color:#fff; margin-bottom:6px;">SILVER CROWN FRAMED</h3>
          <div style="color:var(--color-gold); font-weight:700; margin-bottom:12px;">&#8377; 28,175.00</div>
          <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?add-to-cart=1115&demo=1" style="display:block; text-align:center; background:var(--color-gold); color:#000; font-family:var(--font-trajan); font-size:0.75rem; font-weight:700; padding:10px; border-radius:2px;">ADD TO CART</a>
        </div>
      </article>
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
<style id="te-product-styles">
${cleanCss}
</style>
<div class="te-product-page">
${bodyHtml}
</div>
<!-- /wp:html -->`;

async function deployProduct() {
  console.log('Deploying Staging Single Product page...');
  
  // Check if staging-product already exists
  const checkReq = http.get('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages?slug=staging-product', {
    headers: { 'Cookie': cookieHeader }
  }, res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
      const existing = JSON.parse(body);
      const targetId = existing.length > 0 ? existing[0].id : null;
      
      const payload = JSON.stringify({
        title: 'Murana Statement Mirror — Staging Preview (Trending Era)',
        slug: 'staging-product',
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
            console.log('Staging Product Page ID:', result.id, '| Link:', result.link);
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

deployProduct();
