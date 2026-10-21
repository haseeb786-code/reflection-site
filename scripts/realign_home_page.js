import { getFreshNonce, updatePage, COMMON_CSS, getHeaderHtml, getFooterHtml } from './staging_real_data_helper.js';

const HOME_CSS = `
${COMMON_CSS}

/* BANNER SECTIONS (FULL-BLEED HEROES) */
.banner-section {
  position: relative;
  width: 100%;
  min-height: 82vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 100px 24px;
}
.banner-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(180deg, rgba(15,16,18,0.5) 0%, rgba(15,16,18,0.92) 100%);
  z-index: 1;
}
.banner-content {
  position: relative;
  z-index: 2;
  max-width: 960px;
  margin: 0 auto;
}
.banner-badge {
  display: inline-block;
  color: var(--color-gold);
  font-family: var(--font-trajan);
  font-size: 0.85rem;
  letter-spacing: 0.22em;
  padding: 6px 20px;
  border: 1px solid var(--color-border-gold);
  background: rgba(197, 168, 128, 0.08);
  border-radius: 40px;
  margin-bottom: 20px;
}
.banner-heading {
  font-size: clamp(2.4rem, 4.8vw, 4rem);
  line-height: 1.15;
  color: #ffffff;
  margin-bottom: 18px;
  text-shadow: 0 4px 24px rgba(0,0,0,0.8);
}
.banner-desc {
  font-size: clamp(1.05rem, 1.3vw, 1.25rem);
  color: #e4e4e7;
  max-width: 760px;
  margin: 0 auto 36px;
  line-height: 1.65;
}
.banner-cta-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
}
.cta-btn-primary {
  background: var(--color-gold);
  color: #0f1012 !important;
  font-family: var(--font-trajan);
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.14em;
  padding: 15px 32px;
  border-radius: 2px;
  border: 1px solid var(--color-gold);
  transition: all 0.3s ease;
  display: inline-block;
}
.cta-btn-primary:hover {
  background: var(--color-gold-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(197, 168, 128, 0.35);
}
.cta-btn-secondary {
  background: transparent;
  color: #ffffff !important;
  font-family: var(--font-trajan);
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.14em;
  padding: 15px 32px;
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  display: inline-block;
}
.cta-btn-secondary:hover {
  border-color: var(--color-gold);
  color: var(--color-gold) !important;
}

/* GRID SECTIONS */
.grid-section {
  padding: 90px 24px 100px;
  background: var(--color-bg-dark);
}
.grid-container {
  max-width: var(--site-max-width);
  margin: 0 auto;
}
.section-header {
  text-align: center;
  margin-bottom: 56px;
}
.section-tagline {
  color: var(--color-gold);
  font-family: var(--font-trajan);
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  display: block;
  margin-bottom: 10px;
}
.section-heading {
  font-size: clamp(1.9rem, 3.2vw, 2.7rem);
  color: #ffffff;
  margin-bottom: 12px;
}
.section-desc {
  color: var(--color-text-muted);
  font-size: 1.02rem;
  max-width: 680px;
  margin: 0 auto;
}

.tiles-grid {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 26px !important;
}
.tile-card {
  background: var(--color-surface-dark);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.35s ease;
  display: flex;
  flex-direction: column;
}
.tile-card:hover {
  transform: translateY(-6px);
  border-color: var(--color-gold);
  box-shadow: 0 16px 36px rgba(0,0,0,0.5);
}
.tile-media {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #141518;
  overflow: hidden;
}
.tile-media img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  display: block !important;
}
.tile-card:hover .tile-media img {
  transform: scale(1.06);
}
.tile-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(15, 16, 18, 0.88);
  border: 1px solid var(--color-border);
  color: var(--color-gold);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  padding: 4px 10px;
  border-radius: 2px;
  font-family: var(--font-trajan);
  font-weight: 700;
}
.tile-body {
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  gap: 12px;
  background: linear-gradient(180deg, rgba(24,25,28,0.7) 0%, rgba(20,21,24,1) 100%);
}
.tile-label {
  font-size: 1rem;
  color: #ffffff !important;
  line-height: 1.35;
  transition: color 0.25s ease;
}
.tile-card:hover .tile-label {
  color: var(--color-gold) !important;
}
.tile-caption {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}
.tile-price {
  font-family: var(--font-trajan);
  font-size: 1.05rem;
  color: var(--color-gold);
  font-weight: 700;
}
.tile-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.tile-action-link {
  font-family: var(--font-trajan);
  font-size: 0.78rem;
  color: var(--color-gold);
  letter-spacing: 0.12em;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: gap 0.25s ease;
}
.tile-card:hover .tile-action-link {
  gap: 10px;
  color: var(--color-gold-hover);
}

/* VALUE PILLARS GRID */
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

@media (max-width: 1100px) {
  .tiles-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .trust-grid { grid-template-columns: repeat(2, 1fr) !important; }
}
@media (max-width: 650px) {
  .tiles-grid { grid-template-columns: 1fr !important; }
  .trust-grid { grid-template-columns: 1fr !important; }
}
`;

function buildHomeHtml() {
  const headerHtml = getHeaderHtml('home');
  const footerHtml = getFooterHtml();

  return `<!-- wp:html -->
<style id="trending-era-styles">
${HOME_CSS}
</style>
<div class="te-staging-page">
  ${headerHtml}

  <!-- =========================================================================
       CYCLE 1: HERO BANNER -> 4-COLUMN REAL VENETIAN GRID
       ========================================================================= -->
  <section id="cycle-1" class="banner-section" style="background-image: url('https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/generat-an-led-luxurious-mirror.webp');">
    <div class="banner-overlay"></div>
    <div class="banner-content">
      <span class="banner-badge">AUTHENTIC ARCHITECTURAL GLASS &amp; MIRRORS</span>
      <h1 class="banner-heading">ELEVATE YOUR SPACE WITH BESPOKE MIRRORS</h1>
      <p class="banner-desc">
        Handcrafted Venetian statement pieces, diamond-beveled mirrors, and bespoke architectural glass precision-engineered to transform fine residential and commercial interiors.
      </p>
      <div class="banner-cta-group">
        <a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1" class="cta-btn-primary">EXPLORE 7 REAL PIECES</a>
        <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="cta-btn-secondary">BOOK ON-SITE SURVEY</a>
      </div>
    </div>
  </section>

  <!-- GRID 1: 4 Real Venetian Mirrors (All With "Book Now" Logic) -->
  <section id="grid-1" class="grid-section">
    <div class="grid-container">
      <div class="section-header">
        <span class="section-tagline">HERITAGE VENETIAN COLLECTION</span>
        <h2 class="section-heading">HAND-ENGRAVED STATEMENT PIECES</h2>
        <p class="section-desc">Masterpieces featuring diamond-wheel floral engraving and multi-step beveled borders. Preserving the exact "Book Now" reservation flow.</p>
      </div>
      
      <div class="tiles-grid">
        <!-- Tile 1: Antique Venetian Cushion (1132) -->
        <article class="tile-card">
          <div class="tile-media">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/1771694577552-2.webp" alt="Antique Venetian Cushion">
            <span class="tile-badge">VENETIAN &bull; BOOK NOW</span>
          </div>
          <div class="tile-body">
            <div>
              <h3 class="tile-label">ANTIQUE VENETIAN CUSHION</h3>
              <p class="tile-caption">Cushion-profile tiered mirror adorned with intricate botanical scrolls.</p>
            </div>
            <div>
              <div class="tile-price">&#8377; 31,500.00</div>
              <div class="tile-footer">
                <a href="https://reflectionelite.ataanalytiq.com/staging-checkout/?add-to-cart=1132&book_now=1&demo=1" class="tile-action-link">BOOK NOW &rarr;</a>
              </div>
            </div>
          </div>
        </article>

        <!-- Tile 2: Modern Victorian (1127) -->
        <article class="tile-card">
          <div class="tile-media">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260222_002716.jpg" alt="Modern Victorian">
            <span class="tile-badge">VENETIAN &bull; BOOK NOW</span>
          </div>
          <div class="tile-body">
            <div>
              <h3 class="tile-label">MODERN VICTORIAN</h3>
              <p class="tile-caption">Architectural Victorian silhouette refined with crisp contemporary beveling.</p>
            </div>
            <div>
              <div class="tile-price">&#8377; 58,787.00</div>
              <div class="tile-footer">
                <a href="https://reflectionelite.ataanalytiq.com/staging-checkout/?add-to-cart=1127&book_now=1&demo=1" class="tile-action-link">BOOK NOW &rarr;</a>
              </div>
            </div>
          </div>
        </article>

        <!-- Tile 3: Rococo Floral (1121) -->
        <article class="tile-card">
          <div class="tile-media">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260222_092621-1.webp" alt="Rococo Floral">
            <span class="tile-badge">VENETIAN &bull; BOOK NOW</span>
          </div>
          <div class="tile-body">
            <div>
              <h3 class="tile-label">ROCOCO FLORAL</h3>
              <p class="tile-caption">Baroque-inspired hand-carved glass crown with delicate leaf flourishes.</p>
            </div>
            <div>
              <div class="tile-price">&#8377; 14,000.00</div>
              <div class="tile-footer">
                <a href="https://reflectionelite.ataanalytiq.com/staging-checkout/?add-to-cart=1121&book_now=1&demo=1" class="tile-action-link">BOOK NOW &rarr;</a>
              </div>
            </div>
          </div>
        </article>

        <!-- Tile 4: Silver Crown Framed (1115) -->
        <article class="tile-card">
          <div class="tile-media">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260221_235950-1.webp" alt="Silver Crown Framed">
            <span class="tile-badge">VENETIAN &bull; BOOK NOW</span>
          </div>
          <div class="tile-body">
            <div>
              <h3 class="tile-label">SILVER CROWN FRAMED</h3>
              <p class="tile-caption">Regal crown crest with multi-faceted diamond-cut glass borders.</p>
            </div>
            <div>
              <div class="tile-price">&#8377; 28,175.00</div>
              <div class="tile-footer">
                <a href="https://reflectionelite.ataanalytiq.com/staging-checkout/?add-to-cart=1115&book_now=1&demo=1" class="tile-action-link">BOOK NOW &rarr;</a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- =========================================================================
       CYCLE 2: FEATURED BANNER -> SECOND 4-COLUMN REAL PIECES GRID
       ========================================================================= -->
  <section id="cycle-2" class="banner-section" style="background-image: url('https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/05/23952812_master.jpg');">
    <div class="banner-overlay"></div>
    <div class="banner-content">
      <span class="banner-badge">FLAGSHIP MASTERPIECE</span>
      <h2 class="banner-heading">MURANA STATEMENT MIRROR</h2>
      <p class="banner-desc">
        Reflection Elite's crown jewel. Handcrafted multi-step beveled glass borders, archival anti-tarnish silvering, and diamond-engraved rosettes. Available for instant delivery or bespoke custom sizing.
      </p>
      <div class="banner-cta-group">
        <a href="https://reflectionelite.ataanalytiq.com/staging-product/?demo=1" class="cta-btn-primary">VIEW MURANA SHOWCASE</a>
        <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?add-to-cart=1794&demo=1" class="cta-btn-secondary">ADD TO CART &bull; &#8377; 160,000</a>
      </div>
    </div>
  </section>

  <!-- GRID 2: Real Catalog Suite & Glass Solutions -->
  <section id="grid-2" class="grid-section" style="background: #121316;">
    <div class="grid-container">
      <div class="section-header">
        <span class="section-tagline">ATELIER CATALOG &bull; REAL LIVE PRODUCTS</span>
        <h2 class="section-heading">CURATED MIRROR &amp; GLASS SOLUTIONS</h2>
        <p class="section-desc">Every piece is verified in the live WooCommerce database with real pricing, dimensions, and craftsmanship standards.</p>
      </div>
      
      <div class="tiles-grid">
        <!-- Tile 1: Murana Mirror (1794) -->
        <article class="tile-card">
          <div class="tile-media">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/05/23952812_master.jpg" alt="Murana Statement Mirror">
            <span class="tile-badge">FLAGSHIP PIECE</span>
          </div>
          <div class="tile-body">
            <div>
              <h3 class="tile-label">MURANA MIRROR</h3>
              <p class="tile-caption">Live Product #1794. Low-iron silvered glass with diamond rosettes.</p>
            </div>
            <div>
              <div class="tile-price">&#8377; 160,000.00</div>
              <div class="tile-footer">
                <a href="https://reflectionelite.ataanalytiq.com/staging-product/?demo=1" class="tile-action-link">VIEW SHOWCASE &rarr;</a>
              </div>
            </div>
          </div>
        </article>

        <!-- Tile 2: Mosaic Mirror Art (451) -->
        <article class="tile-card">
          <div class="tile-media">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260305_220825.webp" alt="Mosaic Mirror Art">
            <span class="tile-badge">DIY GLASS &bull; TUKDI</span>
          </div>
          <div class="tile-body">
            <div>
              <h3 class="tile-label">MOSAIC MIRROR ART</h3>
              <p class="tile-caption">Live Product #451. Geometric handcrafted tukdi facets.</p>
            </div>
            <div>
              <div class="tile-price">&#8377; 2,500.00</div>
              <div class="tile-footer">
                <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?add-to-cart=451&demo=1" class="tile-action-link">ADD TO CART &rarr;</a>
              </div>
            </div>
          </div>
        </article>

        <!-- Tile 3: Rococo Floral Classic (586) -->
        <article class="tile-card">
          <div class="tile-media">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260222_092621-scaled.webp" alt="Rococo Floral Classic">
            <span class="tile-badge">CLASSIC VARIANT</span>
          </div>
          <div class="tile-body">
            <div>
              <h3 class="tile-label">ROCOCO FLORAL (CLASSIC)</h3>
              <p class="tile-caption">Live Product #586. Traditional leaf crown etching.</p>
            </div>
            <div>
              <div class="tile-price">&#8377; 14,000.00</div>
              <div class="tile-footer">
                <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?add-to-cart=586&demo=1" class="tile-action-link">ADD TO CART &rarr;</a>
              </div>
            </div>
          </div>
        </article>

        <!-- Tile 4: Smart LED Illuminated Mirrors -->
        <article class="tile-card">
          <div class="tile-media">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/generat-an-led-luxurious-mirror-600x900.webp" alt="Custom LED Mirrors">
            <span class="tile-badge">SMART ILLUMINATION</span>
          </div>
          <div class="tile-body">
            <div>
              <h3 class="tile-label">SMART LED MIRRORS</h3>
              <p class="tile-caption">Dual-tone CCT touch controls, defogger pads, and high CRI LEDs.</p>
            </div>
            <div>
              <div class="tile-price">BESPOKE SIZING</div>
              <div class="tile-footer">
                <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="tile-action-link">CUSTOM QUOTE &rarr;</a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- =========================================================================
       CYCLE 3: THIRD FEATURED BANNER -> THIRD 4-COLUMN GRID
       ========================================================================= -->
  <section id="cycle-3" class="banner-section" style="background-image: url('https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260221_235950-1024x878.webp');">
    <div class="banner-overlay"></div>
    <div class="banner-content">
      <span class="banner-badge">DECORATIVE EXPERTISE</span>
      <h2 class="banner-heading">ARTISANAL TEXTURES &amp; TUKDI INLAYS</h2>
      <p class="banner-desc">
        Combining centuries of Venetian beveling traditions with contemporary architectural precision to craft landmark interior focal points.
      </p>
      <div class="banner-cta-group">
        <a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1" class="cta-btn-primary">VIEW ALL COLLECTIONS</a>
        <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="cta-btn-secondary">CONSULT WITH DESIGNER</a>
      </div>
    </div>
  </section>

  <!-- GRID 3: Specialized Finishes -->
  <section id="grid-3" class="grid-section">
    <div class="grid-container">
      <div class="section-header">
        <span class="section-tagline">ARTISAN FINISHES</span>
        <h2 class="section-heading">CURATED ARCHITECTURAL TEXTURES</h2>
        <p class="section-desc">Specialized treatments engineered for luxury master suites, boutique powder rooms, and landmark hospitality lounges.</p>
      </div>
      
      <div class="tiles-grid">
        <article class="tile-card">
          <div class="tile-media">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/cut-piece-tukdi-mirror_430x.webp" alt="Tukdi Cut-Piece Art">
            <span class="tile-badge">HANDICRAFT</span>
          </div>
          <div class="tile-body">
            <div>
              <h3 class="tile-label">TUKDI CUT-PIECE ART</h3>
              <p class="tile-caption">Intricate geometric facets reflecting kaleidoscope light across feature walls.</p>
            </div>
            <div class="tile-footer">
              <a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1" class="tile-action-link">VIEW PIECES &rarr;</a>
            </div>
          </div>
        </article>

        <article class="tile-card">
          <div class="tile-media">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260222_092831-1.webp" alt="Smoked Bronze Mirrors">
            <span class="tile-badge">TINTED FINISH</span>
          </div>
          <div class="tile-body">
            <div>
              <h3 class="tile-label">SMOKED BRONZE MIRRORS</h3>
              <p class="tile-caption">Warm antique bronze and champagne tones creating inviting mood reflection.</p>
            </div>
            <div class="tile-footer">
              <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="tile-action-link">GET SAMPLES &rarr;</a>
            </div>
          </div>
        </article>

        <article class="tile-card">
          <div class="tile-media">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/frame-mirror.webp" alt="Framed Wall Mirrors">
            <span class="tile-badge">TIMELESS</span>
          </div>
          <div class="tile-body">
            <div>
              <h3 class="tile-label">FRAME MIRROR ART</h3>
              <p class="tile-caption">Sleek minimalist metal frames with corrosion-resistant moisture seals.</p>
            </div>
            <div class="tile-footer">
              <a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1" class="tile-action-link">VIEW STYLES &rarr;</a>
            </div>
          </div>
        </article>

        <article class="tile-card">
          <div class="tile-media">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/bg-03.png" alt="Precision Beveled Mirrors">
            <span class="tile-badge">ENGINEERED</span>
          </div>
          <div class="tile-body">
            <div>
              <h3 class="tile-label">PRECISION BEVELED EDGES</h3>
              <p class="tile-caption">Diamond-wheel beveled borders from 10mm to 35mm multi-step angles.</p>
            </div>
            <div class="tile-footer">
              <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="tile-action-link">REQUEST SURVEY &rarr;</a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- =========================================================================
       CYCLE 4: CLOSING BANNER -> VALUE PILLARS
       ========================================================================= -->
  <section id="cycle-4" class="banner-section" style="background-image: url('https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/bg-07.png');">
    <div class="banner-overlay"></div>
    <div class="banner-content">
      <span class="banner-badge">PERFECT FIT GUARANTEE</span>
      <h2 class="banner-heading">CUSTOM DIMENSIONS IN EVERY PERSPECTIVE</h2>
      <p class="banner-desc">
        No compromise on fit or finish. Every mirror is custom measured on-site, CNC diamond cut, and installed by white-glove glazier specialists.
      </p>
      <div class="banner-cta-group">
        <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="cta-btn-primary">SCHEDULE MEASUREMENT SURVEY</a>
        <a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1" class="cta-btn-secondary">VIEW CATALOG (7 PIECES)</a>
      </div>
    </div>
  </section>

  <!-- 4 VALUE PILLARS -->
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

  ${footerHtml}
</div>
<!-- /wp:html -->`;
}

async function run() {
  const nonce = await getFreshNonce();
  const homeHtml = buildHomeHtml();
  await updatePage(1984, 'Home — Staging Preview (Trending Era)', 'staging-home', homeHtml, nonce);
}

run().catch(console.error);
