import { getFreshNonce, updatePage, COMMON_CSS, getHeaderHtml, getFooterHtml } from './staging_real_data_helper.js';

const SHOP_CSS = `
${COMMON_CSS}

/* SHOP HERO */
.shop-hero {
  position: relative;
  width: 100%;
  min-height: 42vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-image: url('https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/generat-an-led-luxurious-mirror.webp');
  background-size: cover;
  background-position: center;
  padding: 60px 24px;
}
.shop-hero-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(180deg, rgba(15,16,18,0.7) 0%, rgba(15,16,18,0.94) 100%);
  z-index: 1;
}
.shop-hero-content {
  position: relative;
  z-index: 2;
  max-width: 860px;
  margin: 0 auto;
}
.hero-badge {
  display: inline-block;
  color: var(--color-gold);
  font-family: var(--font-trajan);
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  padding: 6px 18px;
  border: 1px solid var(--color-border-gold);
  background: rgba(197, 168, 128, 0.08);
  border-radius: 40px;
  margin-bottom: 14px;
}
.shop-hero h1 {
  font-size: clamp(2rem, 3.8vw, 3.2rem);
  color: #ffffff;
  margin-bottom: 12px;
}
.shop-hero p {
  font-size: clamp(0.95rem, 1.1vw, 1.1rem);
  color: #d1d5db;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

/* FILTER BAR */
.filter-bar {
  background: var(--color-surface-dark);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  padding: 16px 24px;
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

/* CATALOG GRID */
.shop-catalog-section {
  padding: 60px 24px 90px;
}
.catalog-container {
  max-width: var(--site-max-width);
  margin: 0 auto;
}
.catalog-grid {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 26px;
}
.product-card {
  background: var(--color-card-dark);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}
.product-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-gold);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5);
}
.product-media {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #141518;
  overflow: hidden;
}
.product-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.product-card:hover .product-media img {
  transform: scale(1.06);
}
.product-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(15, 16, 18, 0.9);
  border: 1px solid var(--color-border);
  color: var(--color-gold);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  padding: 4px 10px;
  border-radius: 2px;
  font-family: var(--font-trajan);
  font-weight: 700;
}
.product-badge.book-badge {
  background: rgba(197, 168, 128, 0.18);
  border-color: var(--color-gold);
  color: #fff;
}
.product-body {
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  gap: 14px;
  background: linear-gradient(180deg, rgba(24,25,29,0.7) 0%, rgba(18,19,22,1) 100%);
}
.product-title {
  font-size: 1rem;
  color: #ffffff;
  line-height: 1.35;
  margin-bottom: 6px;
}
.product-desc {
  font-size: 0.84rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}
.product-price-box {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 12px;
}
.price-current {
  font-size: 1.15rem;
  color: var(--color-gold);
  font-weight: 700;
}
.price-original {
  font-size: 0.88rem;
  color: #71717a;
  text-decoration: line-through;
}
.product-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
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
.btn-action-book {
  background: #c5a880 !important;
  color: #000000 !important;
  font-weight: 800 !important;
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

  return `<!-- wp:html -->
<style id="te-shop-styles">
${SHOP_CSS}
</style>
<div class="te-staging-page">
  ${headerHtml}

  <!-- SHOP HERO BANNER -->
  <section class="shop-hero">
    <div class="shop-hero-overlay"></div>
    <div class="shop-hero-content">
      <span class="hero-badge">OFFICIAL LIVE CATALOG</span>
      <h1>LUXURY VENETIAN &amp; BESPOKE MIRRORS</h1>
      <p>Mastercrafted Venetian mirrors, hand-beveled cushion designs, and geometric mosaic art — populated exclusively from the Reflection Elite live catalog with verified pricing.</p>
    </div>
  </section>

  <!-- CATEGORY FILTER BAR -->
  <div class="filter-bar">
    <div class="filter-inner">
      <button class="filter-btn active">ALL PIECES (7)</button>
      <button class="filter-btn">VENETIAN MIRRORS (4)</button>
      <button class="filter-btn">STATEMENT MIRRORS (2)</button>
      <button class="filter-btn">DIY &amp; MOSAIC ART (1)</button>
    </div>
  </div>

  <!-- PRODUCT CATALOG GRID (EXACTLY 7 REAL PRODUCTS) -->
  <section class="shop-catalog-section">
    <div class="catalog-container">
      <div class="catalog-grid">

        <!-- Product 1: Murana Mirror (ID: 1794) -->
        <article class="product-card">
          <div class="product-media">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/05/23952812_master.jpg" alt="Murana Mirror">
            <span class="product-badge">FLAGSHIP MASTERPIECE</span>
          </div>
          <div class="product-body">
            <div>
              <h3 class="product-title">MURANA MIRROR</h3>
              <p class="product-desc">Authentic Venetian heritage featuring hand-cut floral crests, multi-step beveled borders, and diamond-engraved rosettes.</p>
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

        <!-- Product 2: Antique Venetian Cushion (ID: 1132) -> Venetian mirror category (BOOK NOW) -->
        <article class="product-card">
          <div class="product-media">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/1771694577552-2.webp" alt="Antique Venetian Cushion">
            <span class="product-badge book-badge">VENETIAN &bull; BOOK NOW</span>
          </div>
          <div class="product-body">
            <div>
              <h3 class="product-title">ANTIQUE VENETIAN CUSHION</h3>
              <p class="product-desc">Cushion-profile tiered mirror adorned with intricate hand-etched botanical scrolls and solid brass corner accents.</p>
            </div>
            <div>
              <div class="product-price-box">
                <span class="price-current">&#8377; 31,500.00</span>
                <span class="price-original">&#8377; 43,300.00</span>
              </div>
              <div class="product-actions">
                <a href="https://reflectionelite.ataanalytiq.com/staging-checkout/?add-to-cart=1132&book_now=1&demo=1" class="btn-action-primary btn-action-book">BOOK NOW</a>
                <a href="https://reflectionelite.ataanalytiq.com/staging-product/?demo=1" class="btn-action-secondary">DETAILS &rarr;</a>
              </div>
            </div>
          </div>
        </article>

        <!-- Product 3: Modern Victorian (ID: 1127) -> Venetian mirror category (BOOK NOW) -->
        <article class="product-card">
          <div class="product-media">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260222_002716.jpg" alt="Modern Victorian">
            <span class="product-badge book-badge">VENETIAN &bull; BOOK NOW</span>
          </div>
          <div class="product-body">
            <div>
              <h3 class="product-title">MODERN VICTORIAN</h3>
              <p class="product-desc">Architectural Victorian silhouette refined with crisp contemporary beveling and ultra-clear low-iron silvering.</p>
            </div>
            <div>
              <div class="product-price-box">
                <span class="price-current">&#8377; 58,787.00</span>
                <span class="price-original">&#8377; 81,502.00</span>
              </div>
              <div class="product-actions">
                <a href="https://reflectionelite.ataanalytiq.com/staging-checkout/?add-to-cart=1127&book_now=1&demo=1" class="btn-action-primary btn-action-book">BOOK NOW</a>
                <a href="https://reflectionelite.ataanalytiq.com/staging-product/?demo=1" class="btn-action-secondary">DETAILS &rarr;</a>
              </div>
            </div>
          </div>
        </article>

        <!-- Product 4: Rococo Floral (ID: 1121) -> Venetian mirror category (BOOK NOW) -->
        <article class="product-card">
          <div class="product-media">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260222_092621-1.webp" alt="Rococo Floral">
            <span class="product-badge book-badge">VENETIAN &bull; BOOK NOW</span>
          </div>
          <div class="product-body">
            <div>
              <h3 class="product-title">ROCOCO FLORAL</h3>
              <p class="product-desc">Baroque-inspired hand-carved glass crown featuring delicate leaf flourishes and antique silver patina.</p>
            </div>
            <div>
              <div class="product-price-box">
                <span class="price-current">&#8377; 14,000.00</span>
                <span class="price-original">&#8377; 18,520.00</span>
              </div>
              <div class="product-actions">
                <a href="https://reflectionelite.ataanalytiq.com/staging-checkout/?add-to-cart=1121&book_now=1&demo=1" class="btn-action-primary btn-action-book">BOOK NOW</a>
                <a href="https://reflectionelite.ataanalytiq.com/staging-product/?demo=1" class="btn-action-secondary">DETAILS &rarr;</a>
              </div>
            </div>
          </div>
        </article>

        <!-- Product 5: Silver Crown Framed (ID: 1115) -> Venetian mirror category (BOOK NOW) -->
        <article class="product-card">
          <div class="product-media">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260221_235950-1.webp" alt="Silver Crown Framed">
            <span class="product-badge book-badge">VENETIAN &bull; BOOK NOW</span>
          </div>
          <div class="product-body">
            <div>
              <h3 class="product-title">SILVER CROWN FRAMED</h3>
              <p class="product-desc">Regal crown crest with multi-faceted diamond-cut glass borders and corrosion-resistant silvering.</p>
            </div>
            <div>
              <div class="product-price-box">
                <span class="price-current">&#8377; 28,175.00</span>
                <span class="price-original">&#8377; 38,137.00</span>
              </div>
              <div class="product-actions">
                <a href="https://reflectionelite.ataanalytiq.com/staging-checkout/?add-to-cart=1115&book_now=1&demo=1" class="btn-action-primary btn-action-book">BOOK NOW</a>
                <a href="https://reflectionelite.ataanalytiq.com/staging-product/?demo=1" class="btn-action-secondary">DETAILS &rarr;</a>
              </div>
            </div>
          </div>
        </article>

        <!-- Product 6: Mosaic Mirror Art (ID: 451) -> DIY Glass Mirror (ADD TO CART) -->
        <article class="product-card">
          <div class="product-media">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260305_220825.webp" alt="Mosaic Mirror Art">
            <span class="product-badge">DIY GLASS &bull; TUKDI ART</span>
          </div>
          <div class="product-body">
            <div>
              <h3 class="product-title">MOSAIC MIRROR ART</h3>
              <p class="product-desc">Traditional geometric tukdi mirror art assembled piece-by-piece to create a dazzling kaleidoscopic light reflection.</p>
            </div>
            <div>
              <div class="product-price-box">
                <span class="price-current">&#8377; 2,500.00</span>
                <span class="price-original">&#8377; 5,000.00</span>
              </div>
              <div class="product-actions">
                <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?add-to-cart=451&demo=1" class="btn-action-primary">ADD TO CART</a>
                <a href="https://reflectionelite.ataanalytiq.com/staging-product/?demo=1" class="btn-action-secondary">DETAILS &rarr;</a>
              </div>
            </div>
          </div>
        </article>

        <!-- Product 7: Rococo Floral Simple (ID: 586) -> ADD TO CART -->
        <article class="product-card">
          <div class="product-media">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260222_092621-scaled.webp" alt="Rococo Floral (Simple Variant)">
            <span class="product-badge">ATELIER CRAFT</span>
          </div>
          <div class="product-body">
            <div>
              <h3 class="product-title">ROCOCO FLORAL (CLASSIC)</h3>
              <p class="product-desc">Essential handcrafted Rococo floral mirror with traditional diamond wheel engraving and antique silvering.</p>
            </div>
            <div>
              <div class="product-price-box">
                <span class="price-current">&#8377; 14,000.00</span>
              </div>
              <div class="product-actions">
                <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?add-to-cart=586&demo=1" class="btn-action-primary">ADD TO CART</a>
                <a href="https://reflectionelite.ataanalytiq.com/staging-product/?demo=1" class="btn-action-secondary">DETAILS &rarr;</a>
              </div>
            </div>
          </div>
        </article>

      </div>
    </div>
  </section>

  ${footerHtml}
</div>
<!-- /wp:html -->`;
}

async function run() {
  const nonce = await getFreshNonce();
  const html = buildShopHtml();
  await updatePage(1992, 'Shop & Collections — Staging Preview (Trending Era)', 'staging-shop', html, nonce);
}

run().catch(console.error);
