import { getFreshNonce, updatePage, COMMON_CSS, getHeaderHtml, getFooterHtml } from './staging_real_data_helper.js';

const PRODUCT_CSS = `
${COMMON_CSS}

/* BREADCRUMB */
.breadcrumb-bar {
  background: var(--color-surface-dark);
  border-bottom: 1px solid var(--color-border);
  padding: 12px 24px;
}
.breadcrumb-inner {
  max-width: var(--site-max-width);
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.78rem;
  color: var(--color-text-muted);
}
.breadcrumb-inner a {
  color: var(--color-text-muted);
  transition: color 0.2s;
}
.breadcrumb-inner a:hover {
  color: var(--color-gold);
}
.breadcrumb-current {
  color: var(--color-gold);
}

/* PRODUCT MAIN DETAIL */
.product-detail-section {
  padding: 60px 24px 80px;
}
.product-detail-container {
  max-width: var(--site-max-width);
  margin: 0 auto;
}
.product-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
}

/* GALLERY */
.gallery-column {
  position: sticky;
  top: 90px;
}
.main-image-wrap {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #141518;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
}
.main-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.thumb-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.thumb-item {
  aspect-ratio: 1 / 1;
  border: 1px solid var(--color-border);
  border-radius: 2px;
  overflow: hidden;
  cursor: pointer;
  background: #141518;
  opacity: 0.65;
  transition: all 0.25s ease;
}
.thumb-item:hover, .thumb-item.active {
  opacity: 1;
  border-color: var(--color-gold);
}
.thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* INFO COLUMN */
.prod-badge {
  display: inline-block;
  color: var(--color-gold);
  font-family: var(--font-trajan);
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  padding: 4px 12px;
  border: 1px solid var(--color-border-gold);
  background: rgba(197, 168, 128, 0.08);
  border-radius: 2px;
  margin-bottom: 12px;
}
.prod-title {
  font-size: clamp(1.8rem, 3.2vw, 2.6rem);
  color: #ffffff;
  line-height: 1.2;
  margin-bottom: 10px;
}
.rating-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
.stars {
  color: var(--color-gold);
  font-size: 1rem;
}
.rating-count {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}
.prod-price-box {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 16px 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 20px;
}
.prod-price-current {
  font-size: 2rem;
  color: var(--color-gold);
  font-weight: 700;
  font-family: var(--font-trajan);
}
.prod-price-original {
  font-size: 1.15rem;
  color: #71717a;
  text-decoration: line-through;
}
.prod-save-pill {
  background: rgba(197, 168, 128, 0.15);
  border: 1px solid var(--color-border-gold);
  color: var(--color-gold);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 2px;
  font-family: var(--font-trajan);
}

/* PAYMENT INCENTIVE CALLOUT */
.payment-incentives-card {
  background: rgba(197, 168, 128, 0.06);
  border: 1px solid var(--color-border-gold);
  border-radius: 4px;
  padding: 18px 20px;
  margin-bottom: 24px;
}
.incentive-title {
  font-family: var(--font-trajan);
  font-size: 0.88rem;
  color: var(--color-gold);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.incentive-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.88rem;
  color: #e4e4e7;
}
.incentive-list li {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.incentive-list strong {
  color: #ffffff;
}

.prod-excerpt {
  font-size: 0.95rem;
  color: #d4d4d8;
  line-height: 1.7;
  margin-bottom: 24px;
}

.specs-quick-list {
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid var(--color-border);
  border-radius: 3px;
  margin-bottom: 28px;
  background: var(--color-surface-dark);
}
.specs-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.84rem;
}
.specs-item:last-child {
  border-bottom: none;
}
.specs-key {
  color: var(--color-text-muted);
  font-family: var(--font-trajan);
}
.specs-val {
  color: #ffffff;
  font-weight: 600;
}

/* PURCHASE ACTIONS */
.purchase-box {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 24px;
}
.qty-btn-group {
  display: flex;
  gap: 12px;
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
  text-align: center;
  transition: all 0.3s ease;
  display: inline-block;
}
.btn-add-to-cart:hover {
  background: var(--color-gold-hover);
  transform: translateY(-2px);
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
  transition: all 0.25s ease;
  display: inline-block;
}
.btn-custom-quote:hover {
  background: var(--color-gold);
  color: #000 !important;
}

/* RELATED SECTION */
.related-section {
  padding: 70px 24px;
  background: var(--color-surface-dark);
  border-top: 1px solid var(--color-border);
}
.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 36px;
}

@media (max-width: 1024px) {
  .product-split { grid-template-columns: 1fr; gap: 40px; }
  .gallery-column { position: static; }
  .related-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 650px) {
  .related-grid { grid-template-columns: 1fr; }
  .qty-btn-group { flex-direction: column; }
}
`;

function buildProductHtml() {
  const headerHtml = getHeaderHtml('product');
  const footerHtml = getFooterHtml();

  return `<!-- wp:html -->
<style id="te-product-styles">
${PRODUCT_CSS}
</style>
<div class="te-staging-page">
  ${headerHtml}

  <!-- BREADCRUMBS -->
  <div class="breadcrumb-bar">
    <div class="breadcrumb-inner">
      <a href="https://reflectionelite.ataanalytiq.com/staging-home/?demo=1">HOME</a>
      <span>/</span>
      <a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1">COLLECTIONS</a>
      <span>/</span>
      <span>VENETIAN MIRRORS</span>
      <span>/</span>
      <span class="breadcrumb-current">MURANA MIRROR</span>
    </div>
  </div>

  <!-- MAIN PRODUCT DETAIL -->
  <section class="product-detail-section">
    <div class="product-detail-container">
      <div class="product-split">

        <!-- LEFT: GALLERY -->
        <div class="gallery-column">
          <div class="main-image-wrap">
            <img id="mainProdView" src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/05/23952812_master.jpg" alt="Murana Mirror">
          </div>
          <div class="thumb-strip">
            <div class="thumb-item active" onclick="document.getElementById('mainProdView').src='https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/05/23952812_master.jpg';">
              <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/05/23952812_master.jpg" alt="Front Profile">
            </div>
            <div class="thumb-item" onclick="document.getElementById('mainProdView').src='https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/1771694577552-2.webp';">
              <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/1771694577552-2.webp" alt="Bevel Profile">
            </div>
            <div class="thumb-item" onclick="document.getElementById('mainProdView').src='https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260222_002716.jpg';">
              <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260222_002716.jpg" alt="Victorian Silhouette">
            </div>
            <div class="thumb-item" onclick="document.getElementById('mainProdView').src='https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260221_235950-1.webp';">
              <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260221_235950-1.webp" alt="Crown Detail">
            </div>
          </div>
        </div>

        <!-- RIGHT: DETAILS & INCENTIVES -->
        <div class="info-column">
          <span class="prod-badge">AUTHENTIC LIVE PRODUCT &bull; ID #1794</span>
          <h1 class="prod-title">MURANA MIRROR</h1>
          
          <div class="rating-bar">
            <span class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <span class="rating-count">5.0 (Architectural Review Verified)</span>
          </div>

          <div class="prod-price-box">
            <span class="prod-price-current">&#8377; 160,000.00</span>
            <span class="prod-price-original">&#8377; 180,000.00</span>
            <span class="prod-save-pill">SAVE &#8377; 20,000</span>
          </div>

          <!-- REAL PAYMENT LOGIC CALLOUT -->
          <div class="payment-incentives-card">
            <div class="incentive-title">
              <span>&#10003;</span> VERIFIED LIVE PAYMENT OPTIONS
            </div>
            <ul class="incentive-list">
              <li>
                <span>&bull;</span>
                <div><strong>Full Online Payment (5% Discount):</strong> Pay &#8377; 152,000.00 via Razorpay (Instant NetBanking / Cards / UPI).</div>
              </li>
              <li>
                <span>&bull;</span>
                <div><strong>50% Advance Booking Deposit (3% Discount):</strong> Pay &#8377; 77,600.00 now to initiate master fabrication; balance due prior to dispatch.</div>
              </li>
              <li>
                <span>&bull;</span>
                <div><strong>Cryptocurrency Settlement:</strong> Direct Bitcoin (BTC) to verified atelier wallet.</div>
              </li>
            </ul>
          </div>

          <p class="prod-excerpt">
            The Murana Mirror is Reflection Elite's flagship Venetian statement piece. Crafted with multi-layered hand-beveled glass borders, diamond-wheel engraved floral crests, and archival anti-corrosion silvering. Each piece is custom-inspected and delivered in reinforced white-glove crates.
          </p>

          <div class="specs-quick-list">
            <div class="specs-item">
              <span class="specs-key">CATALOG ITEM ID</span>
              <span class="specs-val">#1794 (Live Store)</span>
            </div>
            <div class="specs-item">
              <span class="specs-key">DIMENSIONS</span>
              <span class="specs-val">48&quot; Height x 36&quot; Width x 1.5&quot; Depth</span>
            </div>
            <div class="specs-item">
              <span class="specs-key">GLASS PURITY</span>
              <span class="specs-val">Ultra-Clear Low-Iron Silvered Glass</span>
            </div>
            <div class="specs-item">
              <span class="specs-key">CRAFTSMANSHIP</span>
              <span class="specs-val">Hand-Polished Diamond Beveled Border</span>
            </div>
          </div>

          <!-- ACTIONS -->
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

          <div style="font-size:0.84rem; color:var(--color-text-muted); line-height:1.6; border-top:1px solid var(--color-border); padding-top:14px;">
            &bull; <strong>Complimentary Laser Survey:</strong> Available across major metropolitan areas.<br>
            &bull; <strong>10-Year Guarantee:</strong> Complete coverage against silver oxidation and hardware tarnishing.
          </div>

        </div>

      </div>
    </div>
  </section>

  <!-- YOU MAY ALSO ADMIRE (REAL VENETIAN PRODUCTS WITH "BOOK NOW") -->
  <section class="related-section">
    <div class="product-detail-container">
      <div style="text-align:center;">
        <span class="prod-badge">AUTHENTIC VENETIAN SUITE</span>
        <h2 style="font-size:clamp(1.7rem, 2.6vw, 2.2rem); color:#ffffff; margin-top:6px;">YOU MAY ALSO ADMIRE</h2>
      </div>

      <div class="related-grid">
        <!-- Item 1: Antique Venetian Cushion (1132) -->
        <article class="product-card" style="background:var(--color-card-dark); border:1px solid var(--color-border); border-radius:3px; overflow:hidden;">
          <div style="position:relative; width:100%; aspect-ratio:1/1;">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/1771694577552-2.webp" alt="Antique Venetian Cushion" style="width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="padding:16px;">
            <h3 style="font-size:0.95rem; color:#fff; margin-bottom:6px;">ANTIQUE VENETIAN CUSHION</h3>
            <div style="color:var(--color-gold); font-weight:700; margin-bottom:12px;">&#8377; 31,500.00</div>
            <a href="https://reflectionelite.ataanalytiq.com/staging-checkout/?add-to-cart=1132&book_now=1&demo=1" style="display:block; text-align:center; background:#c5a880; color:#000; font-family:var(--font-trajan); font-size:0.75rem; font-weight:800; padding:10px; border-radius:2px;">BOOK NOW</a>
          </div>
        </article>

        <!-- Item 2: Modern Victorian (1127) -->
        <article class="product-card" style="background:var(--color-card-dark); border:1px solid var(--color-border); border-radius:3px; overflow:hidden;">
          <div style="position:relative; width:100%; aspect-ratio:1/1;">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260222_002716.jpg" alt="Modern Victorian" style="width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="padding:16px;">
            <h3 style="font-size:0.95rem; color:#fff; margin-bottom:6px;">MODERN VICTORIAN</h3>
            <div style="color:var(--color-gold); font-weight:700; margin-bottom:12px;">&#8377; 58,787.00</div>
            <a href="https://reflectionelite.ataanalytiq.com/staging-checkout/?add-to-cart=1127&book_now=1&demo=1" style="display:block; text-align:center; background:#c5a880; color:#000; font-family:var(--font-trajan); font-size:0.75rem; font-weight:800; padding:10px; border-radius:2px;">BOOK NOW</a>
          </div>
        </article>

        <!-- Item 3: Rococo Floral (1121) -->
        <article class="product-card" style="background:var(--color-card-dark); border:1px solid var(--color-border); border-radius:3px; overflow:hidden;">
          <div style="position:relative; width:100%; aspect-ratio:1/1;">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260222_092621-1.webp" alt="Rococo Floral" style="width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="padding:16px;">
            <h3 style="font-size:0.95rem; color:#fff; margin-bottom:6px;">ROCOCO FLORAL</h3>
            <div style="color:var(--color-gold); font-weight:700; margin-bottom:12px;">&#8377; 14,000.00</div>
            <a href="https://reflectionelite.ataanalytiq.com/staging-checkout/?add-to-cart=1121&book_now=1&demo=1" style="display:block; text-align:center; background:#c5a880; color:#000; font-family:var(--font-trajan); font-size:0.75rem; font-weight:800; padding:10px; border-radius:2px;">BOOK NOW</a>
          </div>
        </article>

        <!-- Item 4: Silver Crown Framed (1115) -->
        <article class="product-card" style="background:var(--color-card-dark); border:1px solid var(--color-border); border-radius:3px; overflow:hidden;">
          <div style="position:relative; width:100%; aspect-ratio:1/1;">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260221_235950-1.webp" alt="Silver Crown Framed" style="width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="padding:16px;">
            <h3 style="font-size:0.95rem; color:#fff; margin-bottom:6px;">SILVER CROWN FRAMED</h3>
            <div style="color:var(--color-gold); font-weight:700; margin-bottom:12px;">&#8377; 28,175.00</div>
            <a href="https://reflectionelite.ataanalytiq.com/staging-checkout/?add-to-cart=1115&book_now=1&demo=1" style="display:block; text-align:center; background:#c5a880; color:#000; font-family:var(--font-trajan); font-size:0.75rem; font-weight:800; padding:10px; border-radius:2px;">BOOK NOW</a>
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
  const html = buildProductHtml();
  await updatePage(1993, 'Single Product — Staging Preview (Trending Era)', 'staging-product', html, nonce);
}

run().catch(console.error);
