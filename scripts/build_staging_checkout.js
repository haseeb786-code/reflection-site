import fs from 'fs';
import http from 'https';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
const nonce = 'f5b146aecd';

const IMGS = {
  logo: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/Logo-Reflection-e1777369196767-1024x186.png',
  checkoutItem: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/05/23952812_master.jpg'
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

body, .te-checkout-page {
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

/* CHECKOUT SECTION */
.checkout-section {
  padding: 60px 24px 90px;
}
.checkout-container {
  max-width: var(--site-max-width);
  margin: 0 auto;
}
.checkout-header-title {
  font-size: clamp(2rem, 3.2vw, 2.6rem);
  color: #ffffff;
  margin-bottom: 8px;
}
.checkout-subtitle {
  color: var(--color-text-muted);
  margin-bottom: 40px;
  font-size: 0.95rem;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 40px;
  align-items: flex-start;
}

/* FORM CARD */
.checkout-form-card {
  background: var(--color-card-dark);
  border: 1px solid var(--color-border);
  padding: 36px 32px;
  border-radius: 3px;
}
.card-section-title {
  font-size: 1.15rem;
  color: #ffffff;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 24px;
}
.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}
.form-group {
  margin-bottom: 16px;
}
.form-label {
  display: block;
  font-family: var(--font-trajan);
  font-size: 0.76rem;
  letter-spacing: 0.1em;
  color: #d1d5db;
  margin-bottom: 6px;
}
.form-control {
  width: 100%;
  background: #111215;
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #ffffff;
  padding: 12px 14px;
  border-radius: 2px;
  font-family: var(--font-body);
  font-size: 0.92rem;
  transition: all 0.25s ease;
  outline: none;
}
.form-control:focus {
  border-color: var(--color-gold);
}

/* REVIEW & PAYMENT CARD */
.checkout-review-card {
  background: var(--color-card-dark);
  border: 1px solid var(--color-border-gold);
  padding: 36px 32px;
  border-radius: 3px;
  box-shadow: 0 16px 36px rgba(0,0,0,0.4);
}
.order-item-mini {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 20px;
}
.order-item-thumb {
  width: 64px;
  height: 76px;
  object-fit: cover;
  border: 1px solid var(--color-border-gold);
  border-radius: 2px;
}
.order-item-info h4 {
  font-size: 0.95rem;
  color: #ffffff;
  margin-bottom: 4px;
}
.order-item-info p {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
.order-item-price {
  margin-left: auto;
  font-weight: 700;
  color: var(--color-gold);
  font-size: 1.05rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}
.summary-row.total-row {
  font-size: 1.25rem;
  color: #ffffff;
  font-weight: 700;
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid var(--color-border);
  margin-bottom: 24px;
}
.summary-row.total-row .total-val {
  color: var(--color-gold);
  font-family: var(--font-trajan);
}

/* PAYMENT GATEWAY RADIOS */
.payment-methods-box {
  margin-top: 24px;
  border-top: 1px solid var(--color-border);
  padding-top: 20px;
}
.payment-method-option {
  background: #121316;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 14px 16px;
  border-radius: 2px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.payment-method-option:hover, .payment-method-option.selected {
  border-color: var(--color-gold);
  background: rgba(197, 168, 128, 0.06);
}
.radio-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: #ffffff;
  font-weight: 600;
}
.radio-header input[type="radio"] {
  accent-color: var(--color-gold);
}
.radio-desc {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-top: 6px;
  padding-left: 24px;
  line-height: 1.45;
}

.btn-place-order {
  display: block;
  width: 100%;
  background: var(--color-gold);
  color: #0f1012 !important;
  font-family: var(--font-trajan);
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.14em;
  padding: 18px 20px;
  border-radius: 2px;
  text-align: center;
  border: 1px solid var(--color-gold);
  margin-top: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-place-order:hover {
  background: var(--color-gold-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(197, 168, 128, 0.3);
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
  .checkout-grid {
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
  .form-grid-2 { grid-template-columns: 1fr; }
  .checkout-form-card, .checkout-review-card { padding: 24px 18px; }
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
    <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?demo=1">SHOPPING CART</a>
    <span>/</span>
    <span class="breadcrumb-current">SECURE CHECKOUT</span>
  </div>
</div>

<!-- CHECKOUT SECTION -->
<section class="checkout-section">
  <div class="checkout-container">
    <h1 class="checkout-header-title">SECURE COMMISSION CHECKOUT</h1>
    <p class="checkout-subtitle">Enter your installation site specifications and select your preferred payment settlement method.</p>

    <div class="checkout-grid">

      <!-- LEFT: CLIENT & SITE DETAILS FORM -->
      <div class="checkout-form-card">
        <h2 class="card-section-title">1. CLIENT &amp; INSTALLATION PREMISES</h2>

        <form id="stagingCheckoutForm" onsubmit="event.preventDefault(); document.getElementById('checkoutOrderSuccess').style.display='block'; document.getElementById('checkoutOrderSuccess').scrollIntoView({behavior:'smooth'});">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label" for="bFirstName">FIRST NAME *</label>
              <input type="text" id="bFirstName" class="form-control" placeholder="e.g. Eleanor" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="bLastName">LAST NAME *</label>
              <input type="text" id="bLastName" class="form-control" placeholder="e.g. Vance" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="bCompany">ARCHITECTURAL FIRM / COMPANY (OPTIONAL)</label>
            <input type="text" id="bCompany" class="form-control" placeholder="e.g. Vance Interior Architecture Ltd.">
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label" for="bPhone">DIRECT PHONE NUMBER *</label>
              <input type="tel" id="bPhone" class="form-control" placeholder="+91 98765 00000" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="bEmail">EMAIL ADDRESS *</label>
              <input type="email" id="bEmail" class="form-control" placeholder="eleanor@domain.com" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="bAddress">STREET ADDRESS / BUILDING *</label>
            <input type="text" id="bAddress" class="form-control" placeholder="Penthouse 4B, Emerald Horizon Towers" required>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label" for="bCity">TOWN / CITY *</label>
              <input type="text" id="bCity" class="form-control" placeholder="Mumbai / Delhi / Bangalore" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="bPostcode">POSTAL PIN CODE *</label>
              <input type="text" id="bPostcode" class="form-control" placeholder="400001" required>
            </div>
          </div>

          <div class="form-group" style="margin-top:24px;">
            <label class="form-label" for="bNotes">SITE ACCESS &amp; INSTALLATION NOTES</label>
            <textarea id="bNotes" class="form-control" placeholder="Service elevator dimensions, preferred installation survey days, wall construction type (solid brick, reinforced stud), etc."></textarea>
          </div>

          <div id="checkoutOrderSuccess" style="display:none; margin-top:24px; padding:20px; background:rgba(197,168,128,0.14); border:1px solid var(--color-gold); border-radius:2px; text-align:center;">
            <strong style="color:var(--color-gold); font-family:var(--font-trajan); font-size:1.1rem; display:block; margin-bottom:8px;">COMMISSION ORDER #RE-8941 RECEIVED</strong>
            <p style="color:#ffffff; font-size:0.92rem; line-height:1.6;">
              Thank you, Eleanor! Your order has been registered in the Reflection Elite concierge system.<br>
              An architectural glazing project manager will contact you within 2 hours to confirm laser survey scheduling and payment settlement.
            </p>
          </div>
        </form>
      </div>

      <!-- RIGHT: ORDER SUMMARY & PAYMENT GATEWAYS -->
      <div class="checkout-review-card">
        <h2 class="card-section-title">2. COMMISSION SUMMARY &amp; PAYMENT</h2>

        <div class="order-item-mini">
          <img src="${IMGS.checkoutItem}" alt="Murana Statement Mirror" class="order-item-thumb">
          <div class="order-item-info">
            <h4>MURANA STATEMENT MIRROR</h4>
            <p>Qty: 1 &bull; Hand-Beveled Venetian &bull; 48&quot; x 36&quot;</p>
          </div>
          <div class="order-item-price">&#8377; 160,000.00</div>
        </div>

        <div class="summary-row">
          <span>PIECES SUBTOTAL</span>
          <span style="color:#ffffff; font-weight:600;">&#8377; 160,000.00</span>
        </div>
        <div class="summary-row">
          <span>WHITE-GLOVE CRATED DELIVERY</span>
          <span style="color:var(--color-gold); font-weight:600;">COMPLIMENTARY</span>
        </div>
        <div class="summary-row">
          <span>ON-SITE DIGITAL TEMPLATING</span>
          <span style="color:var(--color-gold); font-weight:600;">INCLUDED</span>
        </div>
        <div class="summary-row">
          <span>APPLICABLE GST</span>
          <span style="color:#ffffff; font-weight:600;">INCLUDED</span>
        </div>

        <div class="summary-row total-row">
          <span>TOTAL SETTLEMENT</span>
          <span class="total-val">&#8377; 160,000.00</span>
        </div>

        <!-- PAYMENT METHOD OPTIONS -->
        <div class="payment-methods-box">
          <label class="form-label" style="margin-bottom:12px;">SELECT SETTLEMENT METHOD</label>

          <div class="payment-method-option selected">
            <div class="radio-header">
              <input type="radio" name="payMethod" id="payBank" checked>
              <label for="payBank">DIRECT ARCHITECTURAL BANK TRANSFER (NEFT / RTGS)</label>
            </div>
            <div class="radio-desc">
              Make your payment directly into our corporate bank account. Our atelier account details will be shared upon order submission, and production commences immediately upon receipt.
            </div>
          </div>

          <div class="payment-method-option">
            <div class="radio-header">
              <input type="radio" name="payMethod" id="payCards">
              <label for="payCards">CREDIT / DEBIT CARDS &amp; NET BANKING (256-BIT SSL)</label>
            </div>
            <div class="radio-desc">
              Instant secure online payment via Visa, MasterCard, RuPay, American Express, or major net banking institutions.
            </div>
          </div>

          <div class="payment-method-option">
            <div class="radio-header">
              <input type="radio" name="payMethod" id="payCod">
              <label for="payCod">PROJECT DEPOSIT (50% ON SURVEY &bull; 50% ON INSTALL)</label>
            </div>
            <div class="radio-desc">
              Pay a 50% deposit following your digital laser survey verification, and the remaining 50% upon white-glove installation completion.
            </div>
          </div>
        </div>

        <button type="submit" form="stagingCheckoutForm" class="btn-place-order">
          PLACE COMMISSION ORDER &bull; &#8377; 160,000.00 &rarr;
        </button>

        <div style="font-size:0.8rem; color:var(--color-text-muted); line-height:1.6; margin-top:20px; text-align:center;">
          &bull; <strong>Bank-Grade Security:</strong> 256-bit SSL encrypted settlement.<br>
          &bull; <strong>10-Year Warranty:</strong> All silvering and hardware guaranteed.<br>
          &bull; <strong>Concierge Dedicated Support:</strong> +91 98765 43210
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
`;

const fullGutenbergPayload = `<!-- wp:html -->
<style id="te-checkout-styles">
${cleanCss}
</style>
<div class="te-checkout-page">
${bodyHtml}
</div>
<!-- /wp:html -->`;

async function deployCheckout() {
  console.log('Deploying Staging Checkout page...');
  
  // Check if staging-checkout already exists
  const checkReq = http.get('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages?slug=staging-checkout', {
    headers: { 'Cookie': cookieHeader }
  }, res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
      const existing = JSON.parse(body);
      const targetId = existing.length > 0 ? existing[0].id : null;
      
      const payload = JSON.stringify({
        title: 'Secure Checkout — Staging Preview (Trending Era)',
        slug: 'staging-checkout',
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
            console.log('Staging Checkout Page ID:', result.id, '| Link:', result.link);
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

deployCheckout();
