import fs from 'fs';
import http from 'https';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
const nonce = 'f5b146aecd';

const IMGS = {
  logo: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/Logo-Reflection-e1777369196767-1024x186.png',
  cartItem: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/05/23952812_master.jpg'
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

body, .te-cart-page {
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

/* CART SECTION */
.cart-section {
  padding: 60px 24px 90px;
}
.cart-container {
  max-width: var(--site-max-width);
  margin: 0 auto;
}
.cart-header-title {
  font-size: clamp(2rem, 3.2vw, 2.6rem);
  color: #ffffff;
  margin-bottom: 8px;
}
.cart-subtitle {
  color: var(--color-text-muted);
  margin-bottom: 40px;
  font-size: 0.95rem;
}

.cart-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  align-items: flex-start;
}

/* CART TABLE CARD */
.cart-items-card {
  background: var(--color-card-dark);
  border: 1px solid var(--color-border);
  border-radius: 3px;
  overflow: hidden;
}
.cart-table {
  width: 100%;
  border-collapse: collapse;
}
.cart-table th {
  background: #111215;
  font-family: var(--font-trajan);
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  color: var(--color-gold);
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}
.cart-table td {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  vertical-align: middle;
}
.cart-item-row:last-child td {
  border-bottom: none;
}
.item-flex {
  display: flex;
  align-items: center;
  gap: 18px;
}
.item-thumb {
  width: 80px;
  height: 95px;
  object-fit: cover;
  border: 1px solid var(--color-border-gold);
  border-radius: 2px;
  background: #000;
}
.item-title {
  font-size: 1.02rem;
  color: #ffffff;
  margin-bottom: 4px;
}
.item-spec {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  line-height: 1.4;
}
.item-price {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-gold);
}
.item-qty {
  display: inline-flex;
  align-items: center;
  background: #111215;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 2px;
}
.item-qty button {
  background: transparent;
  color: #fff;
  border: none;
  width: 32px;
  height: 34px;
  cursor: pointer;
  font-size: 1.1rem;
}
.item-qty input {
  width: 38px;
  background: transparent;
  border: none;
  color: #fff;
  text-align: center;
  font-size: 0.95rem;
}
.item-total {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
}
.item-remove {
  color: #71717a;
  cursor: pointer;
  transition: color 0.2s;
  font-size: 1.2rem;
}
.item-remove:hover {
  color: #ef4444;
}

/* COUPON & SHOPPING ACTIONS */
.cart-actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: #121316;
  border-top: 1px solid var(--color-border);
  flex-wrap: wrap;
  gap: 18px;
}
.coupon-box {
  display: flex;
  gap: 10px;
}
.coupon-input {
  background: #18191d;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  padding: 10px 14px;
  border-radius: 2px;
  font-size: 0.85rem;
  outline: none;
  letter-spacing: 0.05em;
}
.coupon-input:focus {
  border-color: var(--color-gold);
}
.btn-apply-coupon {
  background: transparent;
  color: var(--color-gold);
  border: 1px solid var(--color-gold);
  font-family: var(--font-trajan);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  padding: 10px 18px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-apply-coupon:hover {
  background: var(--color-gold);
  color: #000;
}
.btn-continue-shopping {
  color: var(--color-text-muted);
  font-family: var(--font-trajan);
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  transition: color 0.2s;
}
.btn-continue-shopping:hover {
  color: var(--color-gold);
}

/* ORDER SUMMARY CARD */
.cart-summary-card {
  background: var(--color-card-dark);
  border: 1px solid var(--color-border-gold);
  padding: 32px 28px;
  border-radius: 3px;
  box-shadow: 0 16px 36px rgba(0,0,0,0.4);
}
.summary-title {
  font-size: 1.25rem;
  color: #ffffff;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 20px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
  font-size: 0.92rem;
  color: var(--color-text-muted);
}
.summary-row.total-row {
  font-size: 1.25rem;
  color: #ffffff;
  font-weight: 700;
  padding-top: 18px;
  margin-top: 18px;
  border-top: 1px solid var(--color-border);
}
.summary-row.total-row .total-val {
  color: var(--color-gold);
  font-family: var(--font-trajan);
}

.btn-proceed-checkout {
  display: block;
  width: 100%;
  background: var(--color-gold);
  color: #0f1012 !important;
  font-family: var(--font-trajan);
  font-weight: 700;
  font-size: 0.92rem;
  letter-spacing: 0.14em;
  padding: 18px 20px;
  border-radius: 2px;
  text-align: center;
  border: 1px solid var(--color-gold);
  margin-top: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-proceed-checkout:hover {
  background: var(--color-gold-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(197, 168, 128, 0.3);
}

.trust-badges-mini {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.8rem;
  color: var(--color-text-muted);
  line-height: 1.6;
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
  .cart-layout {
    grid-template-columns: 1fr;
  }
  .footer-inner {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 768px) {
  .site-header { padding: 12px 16px !important; }
  .header-logo img { height: 32px !important; }
  .main-nav { display: none; }
  .cart-table th:nth-child(2), .cart-table td:nth-child(2),
  .cart-table th:nth-child(4), .cart-table td:nth-child(4) {
    display: none;
  }
  .cart-actions-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .coupon-box {
    flex-direction: column;
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
      <a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1" class="nav-link">SHOP &amp; COLLECTIONS</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-product/?demo=1" class="nav-link">SINGLE PRODUCT</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-about-us/?demo=1" class="nav-link">ABOUT US</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="nav-link">CONTACT</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-policies/?demo=1" class="nav-link">POLICIES</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?demo=1" class="nav-link active">CART</a>
    </nav>
    <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="header-quote-btn">BOOK SURVEY</a>
  </div>
</header>

<!-- BREADCRUMBS -->
<div class="breadcrumb-bar">
  <div class="breadcrumb-inner">
    <a href="https://reflectionelite.ataanalytiq.com/staging-home/?demo=1">HOME</a>
    <span>/</span>
    <span class="breadcrumb-current">SHOPPING CART</span>
  </div>
</div>

<!-- CART SECTION -->
<section class="cart-section">
  <div class="cart-container">
    <h1 class="cart-header-title">YOUR SHOPPING CART</h1>
    <p class="cart-subtitle">Review your bespoke glass pieces and architectural commissions before proceeding to secure checkout.</p>

    <div class="cart-layout">

      <!-- LEFT: CART ITEMS -->
      <div class="cart-items-card">
        <table class="cart-table">
          <thead>
            <tr>
              <th>COMMISSION PIECE</th>
              <th>PRICE</th>
              <th>QUANTITY</th>
              <th>TOTAL</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr class="cart-item-row" id="cartItem1">
              <td>
                <div class="item-flex">
                  <img src="${IMGS.cartItem}" alt="Murana Statement Mirror" class="item-thumb">
                  <div>
                    <h3 class="item-title">MURANA STATEMENT MIRROR</h3>
                    <p class="item-spec">Bespoke 48&quot; x 36&quot; &bull; Hand-Beveled Venetian &bull; Low-Iron Glass</p>
                  </div>
                </div>
              </td>
              <td class="item-price">&#8377; 160,000.00</td>
              <td>
                <div class="item-qty">
                  <button type="button" onclick="let q=document.getElementById('cQty'); if(parseInt(q.value)>1){ q.value=parseInt(q.value)-1; updateTotals(); }">-</button>
                  <input type="text" id="cQty" value="1" readonly>
                  <button type="button" onclick="let q=document.getElementById('cQty'); q.value=parseInt(q.value)+1; updateTotals();">+</button>
                </div>
              </td>
              <td class="item-total" id="cItemTotal">&#8377; 160,000.00</td>
              <td>
                <span class="item-remove" onclick="document.getElementById('cartItem1').style.display='none'; document.getElementById('cEmptyNotice').style.display='block'; document.getElementById('cSubtotal').innerText='₹ 0.00'; document.getElementById('cGrandTotal').innerText='₹ 0.00';">&times;</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div id="cEmptyNotice" style="display:none; padding:40px; text-align:center; color:var(--color-text-muted);">
          <p style="font-size:1.1rem; margin-bottom:16px;">Your cart is currently empty.</p>
          <a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1" style="color:var(--color-gold); font-family:var(--font-trajan);">EXPLORE THE ARTISAN COLLECTION &rarr;</a>
        </div>

        <div class="cart-actions-bar">
          <div class="coupon-box">
            <input type="text" class="coupon-input" placeholder="PROMO / TRADE CODE">
            <button type="button" class="btn-apply-coupon" onclick="alert('Trade code applied: 10% complimentary architectural discount active.');">APPLY CODE</button>
          </div>
          <a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1" class="btn-continue-shopping">&larr; CONTINUE EXPLORING PIECES</a>
        </div>
      </div>

      <!-- RIGHT: ORDER SUMMARY -->
      <div class="cart-summary-card">
        <h2 class="summary-title">COMMISSION SUMMARY</h2>

        <div class="summary-row">
          <span>PIECES SUBTOTAL</span>
          <span id="cSubtotal" style="color:#ffffff; font-weight:600;">&#8377; 160,000.00</span>
        </div>
        <div class="summary-row">
          <span>WHITE-GLOVE PACKAGING</span>
          <span style="color:var(--color-gold); font-weight:600;">COMPLIMENTARY</span>
        </div>
        <div class="summary-row">
          <span>INSURED CRATED FREIGHT</span>
          <span style="color:var(--color-gold); font-weight:600;">FREE</span>
        </div>
        <div class="summary-row">
          <span>DIGITAL LASER TEMPLATING</span>
          <span style="color:var(--color-gold); font-weight:600;">INCLUDED</span>
        </div>

        <div class="summary-row total-row">
          <span>TOTAL INVESTMENT</span>
          <span class="total-val" id="cGrandTotal">&#8377; 160,000.00</span>
        </div>

        <a href="https://reflectionelite.ataanalytiq.com/staging-checkout/?demo=1" class="btn-proceed-checkout">
          PROCEED TO SECURE CHECKOUT &rarr;
        </a>

        <div class="trust-badges-mini">
          &bull; <strong>100% Secure Checkout:</strong> 256-Bit SSL encryption.<br>
          &bull; <strong>10-Year Warranty:</strong> Archival anti-desilvering guarantee.<br>
          &bull; <strong>Concierge Verification:</strong> An architectural specialist confirms all specifications before production begins.
        </div>
      </div>

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

<script>
function updateTotals() {
  const q = parseInt(document.getElementById('cQty').value) || 1;
  const unit = 160000;
  const tot = q * unit;
  const fmt = '₹ ' + tot.toLocaleString('en-IN') + '.00';
  document.getElementById('cItemTotal').innerText = fmt;
  document.getElementById('cSubtotal').innerText = fmt;
  document.getElementById('cGrandTotal').innerText = fmt;
}
</script>
`;

const fullGutenbergPayload = `<!-- wp:html -->
<style id="te-cart-styles">
${cleanCss}
</style>
<div class="te-cart-page">
${bodyHtml}
</div>
<!-- /wp:html -->`;

async function deployCart() {
  console.log('Deploying Staging Cart page...');
  
  // Check if staging-cart already exists
  const checkReq = http.get('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages?slug=staging-cart', {
    headers: { 'Cookie': cookieHeader }
  }, res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
      const existing = JSON.parse(body);
      const targetId = existing.length > 0 ? existing[0].id : null;
      
      const payload = JSON.stringify({
        title: 'Shopping Cart — Staging Preview (Trending Era)',
        slug: 'staging-cart',
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
            console.log('Staging Cart Page ID:', result.id, '| Link:', result.link);
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

deployCart();
