import { getFreshNonce, updatePage, COMMON_CSS, getHeaderHtml, getFooterHtml } from './staging_real_data_helper.js';

const CART_CSS = `
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

.cart-section {
  padding: 60px 24px 90px;
}
.cart-container {
  max-width: var(--site-max-width);
  margin: 0 auto;
}
.cart-header-title {
  font-size: clamp(1.8rem, 3.2vw, 2.5rem);
  color: #ffffff;
  margin-bottom: 8px;
}
.cart-subtitle {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  margin-bottom: 36px;
}

.cart-grid {
  display: grid;
  grid-template-columns: 2fr 1.1fr;
  gap: 40px;
  align-items: start;
}
.cart-table-card {
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
.cart-row {
  border-bottom: 1px solid var(--color-border);
}
.cart-row td {
  padding: 22px 0;
  vertical-align: middle;
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

/* SUMMARY CARD */
.summary-card {
  background: var(--color-surface-dark);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 28px;
}
.summary-title {
  font-family: var(--font-trajan);
  font-size: 1.1rem;
  color: #ffffff;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 20px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
  font-size: 0.88rem;
  color: var(--color-text-muted);
}
.summary-total-row {
  display: flex;
  justify-content: space-between;
  padding-top: 18px;
  margin-top: 18px;
  border-top: 1px solid var(--color-border);
  font-family: var(--font-trajan);
  font-size: 1.25rem;
  color: #ffffff;
  font-weight: 700;
}
.summary-total-val {
  color: var(--color-gold);
}
.btn-checkout {
  display: block;
  background: var(--color-gold);
  color: #0f1012 !important;
  font-family: var(--font-trajan);
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  padding: 16px;
  border-radius: 2px;
  text-align: center;
  margin-top: 24px;
  transition: all 0.25s ease;
}
.btn-checkout:hover {
  background: var(--color-gold-hover);
  transform: translateY(-2px);
}

@media (max-width: 900px) {
  .cart-grid { grid-template-columns: 1fr; }
}
`;

function buildCartHtml() {
  const headerHtml = getHeaderHtml('cart');
  const footerHtml = getFooterHtml();

  return `<!-- wp:html -->
<style id="te-cart-styles">
${CART_CSS}
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
      <span class="breadcrumb-current">SHOPPING CART</span>
    </div>
  </div>

  <section class="cart-section">
    <div class="cart-container">
      <h1 class="cart-header-title">COMMISSION SHOPPING CART</h1>
      <p class="cart-subtitle">Review your selected pieces and preview online settlement discount tiers.</p>

      <div class="cart-grid">

        <!-- CART ITEMS TABLE -->
        <div class="cart-table-card">
          <table class="cart-table">
            <thead>
              <tr>
                <th>PIECE DETAILS</th>
                <th>PRICE</th>
                <th>QTY</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <!-- Item 1: Murana Mirror (1794) -->
              <tr class="cart-row">
                <td>
                  <div class="cart-prod-flex">
                    <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/05/23952812_master.jpg" alt="Murana Mirror" class="cart-prod-thumb">
                    <div>
                      <h4 class="cart-prod-name">MURANA MIRROR</h4>
                      <p class="cart-prod-meta">Live Product #1794 &bull; Venetian Masterpiece</p>
                    </div>
                  </div>
                </td>
                <td class="cart-price">&#8377; 160,000.00</td>
                <td style="color:#ffffff; font-weight:600;">1</td>
                <td class="cart-price">&#8377; 160,000.00</td>
              </tr>

              <!-- Item 2: Antique Venetian Cushion (1132) -->
              <tr class="cart-row">
                <td>
                  <div class="cart-prod-flex">
                    <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/1771694577552-2.webp" alt="Antique Venetian Cushion" class="cart-prod-thumb">
                    <div>
                      <h4 class="cart-prod-name">ANTIQUE VENETIAN CUSHION</h4>
                      <p class="cart-prod-meta">Live Product #1132 &bull; Venetian Mirror (Book Now)</p>
                    </div>
                  </div>
                </td>
                <td class="cart-price">&#8377; 31,500.00</td>
                <td style="color:#ffffff; font-weight:600;">1</td>
                <td class="cart-price">&#8377; 31,500.00</td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top:24px; padding:16px; background:rgba(197,168,128,0.08); border:1px solid var(--color-border-gold); border-radius:3px; font-size:0.85rem; color:#e4e4e7;">
            <strong style="color:var(--color-gold); font-family:var(--font-trajan);">ATELIER POLICY NOTE:</strong><br>
            Venetian Mirror items in cart automatically enable our specialized <strong>50% advance deposit</strong> option and require white-glove insured crated dispatch.
          </div>
        </div>

        <!-- SUMMARY CARD -->
        <div class="summary-card">
          <h2 class="summary-title">CART SUMMARY</h2>
          
          <div class="summary-row">
            <span>PIECES SUBTOTAL</span>
            <span style="color:#ffffff; font-weight:600;">&#8377; 191,500.00</span>
          </div>
          <div class="summary-row">
            <span>FULL PAYMENT DISCOUNT (5%)</span>
            <span style="color:var(--color-gold); font-weight:600;">- &#8377; 9,575.00</span>
          </div>
          <div class="summary-row">
            <span>INSURED CRATED LOGISTICS</span>
            <span style="color:var(--color-gold); font-weight:600;">COMPLIMENTARY</span>
          </div>
          <div class="summary-row">
            <span>ESTIMATED GST</span>
            <span style="color:#ffffff; font-weight:600;">INCLUDED</span>
          </div>

          <div class="summary-total-row">
            <span>TOTAL DUE (IF 100% ONLINE)</span>
            <span class="summary-total-val">&#8377; 181,925.00</span>
          </div>

          <div style="font-size:0.8rem; color:var(--color-text-muted); margin-top:10px; line-height:1.5;">
            * Or select <strong>50% Advance Booking Deposit (3% discount)</strong> at checkout to pay &#8377; 92,877.50 now.
          </div>

          <a href="https://reflectionelite.ataanalytiq.com/staging-checkout/?demo=1" class="btn-checkout">
            PROCEED TO CHECKOUT &rarr;
          </a>
        </div>

      </div>
    </div>
  </section>

  ${footerHtml}
</div>
<!-- /wp:html -->`;
}

// CHECKOUT CSS
const CHECKOUT_CSS = `
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

.checkout-section {
  padding: 60px 24px 90px;
}
.checkout-container {
  max-width: var(--site-max-width);
  margin: 0 auto;
}
.checkout-header-title {
  font-size: clamp(1.8rem, 3.2vw, 2.5rem);
  color: #ffffff;
  margin-bottom: 8px;
}
.checkout-subtitle {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  margin-bottom: 36px;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 40px;
  align-items: start;
}
.checkout-form-card {
  background: var(--color-surface-dark);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 32px;
}
.checkout-review-card {
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
  transition: border-color 0.25s ease;
}
.form-control:focus {
  border-color: var(--color-gold);
}
textarea.form-control {
  min-height: 90px;
  resize: vertical;
}

/* PAYMENT OPTIONS */
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

.order-item-mini {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border);
}
.order-item-thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 2px;
}
.order-item-info {
  flex-grow: 1;
}
.order-item-info h4 {
  font-size: 0.88rem;
  color: #ffffff;
  margin-bottom: 3px;
}
.order-item-info p {
  font-size: 0.78rem;
  color: var(--color-text-muted);
}
.order-item-price {
  font-family: var(--font-trajan);
  font-size: 0.95rem;
  color: var(--color-gold);
  font-weight: 700;
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
  font-size: 0.92rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  padding: 16px;
  border: 1px solid var(--color-gold);
  border-radius: 2px;
  text-align: center;
  cursor: pointer;
  margin-top: 24px;
  transition: all 0.25s ease;
}
.btn-place-order:hover {
  background: var(--color-gold-hover);
  transform: translateY(-2px);
}

@media (max-width: 900px) {
  .checkout-grid { grid-template-columns: 1fr; }
  .form-grid-2 { grid-template-columns: 1fr; }
}
`;

function buildCheckoutHtml() {
  const headerHtml = getHeaderHtml('checkout');
  const footerHtml = getFooterHtml();

  return `<!-- wp:html -->
<style id="te-checkout-styles">
${CHECKOUT_CSS}
</style>
<div class="te-staging-page">
  ${headerHtml}

  <!-- BREADCRUMBS -->
  <div class="breadcrumb-bar">
    <div class="breadcrumb-inner">
      <a href="https://reflectionelite.ataanalytiq.com/staging-home/?demo=1">HOME</a>
      <span>/</span>
      <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?demo=1">CART</a>
      <span>/</span>
      <span class="breadcrumb-current">SECURE CHECKOUT</span>
    </div>
  </div>

  <section class="checkout-section">
    <div class="checkout-container">
      <h1 class="checkout-header-title">SECURE CHECKOUT &bull; VERIFIED PAYMENT LOGIC</h1>
      <p class="checkout-subtitle">Preserving Reflection Elite's 3 real payment paths: Razorpay Full Online Discount, 50% Advance Booking Deposit, and Bitcoin.</p>

      <div class="checkout-grid">

        <!-- CLIENT DETAILS FORM -->
        <div class="checkout-form-card">
          <h2 class="card-section-title">1. CLIENT &amp; INSTALLATION PREMISES</h2>

          <form id="stagingCheckoutForm" onsubmit="event.preventDefault(); document.getElementById('checkoutOrderSuccess').style.display='block'; document.getElementById('checkoutOrderSuccess').scrollIntoView({behavior:'smooth'});">
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label" for="bFirstName">FIRST NAME *</label>
                <input type="text" id="bFirstName" class="form-control" placeholder="e.g. Vikram" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="bLastName">LAST NAME *</label>
                <input type="text" id="bLastName" class="form-control" placeholder="e.g. Malhotra" required>
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label" for="bPhone">DIRECT PHONE NUMBER *</label>
                <input type="tel" id="bPhone" class="form-control" placeholder="+91 98765 00000" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="bEmail">EMAIL ADDRESS *</label>
                <input type="email" id="bEmail" class="form-control" placeholder="vikram@example.com" required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="bAddress">DELIVERY / INSTALLATION ADDRESS *</label>
              <input type="text" id="bAddress" class="form-control" placeholder="Villa 12, Golden Palms Boulevard" required>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label" for="bCity">CITY *</label>
                <input type="text" id="bCity" class="form-control" placeholder="Mumbai / Delhi / Bengaluru" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="bPostcode">PIN CODE *</label>
                <input type="text" id="bPostcode" class="form-control" placeholder="400001" required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="bNotes">ON-SITE INSTALLATION NOTES</label>
              <textarea id="bNotes" class="form-control" placeholder="Elevator accessibility, specific wall substrate (brick, drywall), preferred consultation time, etc."></textarea>
            </div>

            <button type="submit" class="btn-place-order">
              CONFIRM &amp; PLACE ORDER &rarr;
            </button>

            <div id="checkoutOrderSuccess" style="display:none; margin-top:24px; padding:20px; background:rgba(197,168,128,0.14); border:1px solid var(--color-gold); border-radius:2px; text-align:center;">
              <strong style="color:var(--color-gold); font-family:var(--font-trajan); font-size:1.1rem; display:block; margin-bottom:8px;">STAGING TEST COMMISSION ORDER RECEIVED</strong>
              <p style="color:#ffffff; font-size:0.9rem; line-height:1.6;">
                Thank you! Your staging checkout verification test was recorded successfully.<br>
                In production, this routes seamlessly through the verified Razorpay gateway or Bitcoin wallet.
              </p>
            </div>
          </form>
        </div>

        <!-- REVIEW & REAL PAYMENT PATHS -->
        <div class="checkout-review-card">
          <h2 class="card-section-title">2. PIECE &amp; PAYMENT SELECTION</h2>

          <div class="order-item-mini">
            <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/05/23952812_master.jpg" alt="Murana Mirror" class="order-item-thumb">
            <div class="order-item-info">
              <h4>MURANA MIRROR (ID #1794)</h4>
              <p>Qty: 1 &bull; Hand-Beveled Venetian Masterpiece</p>
            </div>
            <div class="order-item-price">&#8377; 160,000.00</div>
          </div>

          <div class="summary-row">
            <span>PIECE SUB-TOTAL</span>
            <span style="color:#ffffff; font-weight:600;">&#8377; 160,000.00</span>
          </div>
          <div class="summary-row">
            <span>INSURED CRATED LOGISTICS</span>
            <span style="color:var(--color-gold); font-weight:600;">COMPLIMENTARY</span>
          </div>

          <!-- THE 3 VERIFIED PAYMENT PATHS -->
          <div style="margin:24px 0 16px;">
            <label class="form-label">SELECT PAYMENT SETTLEMENT PATH</label>

            <!-- Option 1: Full Payment via Razorpay (5% Discount) -->
            <div class="payment-method-option selected" id="optA" onclick="document.getElementById('radA').checked=true; document.getElementById('optA').classList.add('selected'); document.getElementById('optB').classList.remove('selected'); document.getElementById('optC').classList.remove('selected'); document.getElementById('discRow').style.display='flex'; document.getElementById('totalDueText').innerText='₹ 152,000.00'; document.getElementById('depositNote').style.display='none';">
              <div class="radio-header">
                <input type="radio" name="payPath" id="radA" checked>
                <label for="radA">FULL ONLINE PAYMENT (RAZORPAY) <span class="discount-pill">5% OFF</span></label>
              </div>
              <div class="radio-desc">
                Pay 100% online at checkout via Razorpay (UPI, Credit/Debit Cards, NetBanking). Receive an instant <strong>5% discount</strong> (Save &#8377; 8,000.00).
              </div>
            </div>

            <!-- Option 2: 50% Advance Booking Deposit (3% Discount) -->
            <div class="payment-method-option" id="optB" onclick="document.getElementById('radB').checked=true; document.getElementById('optB').classList.add('selected'); document.getElementById('optA').classList.remove('selected'); document.getElementById('optC').classList.remove('selected'); document.getElementById('discRow').style.display='none'; document.getElementById('totalDueText').innerText='₹ 77,600.00'; document.getElementById('depositNote').style.display='block';">
              <div class="radio-header">
                <input type="radio" name="payPath" id="radB">
                <label for="radB">50% ADVANCE BOOKING DEPOSIT <span class="discount-pill">3% OFF</span></label>
              </div>
              <div class="radio-desc">
                Pay a 50% advance deposit (with 3% discount = &#8377; 77,600.00) to begin master fabrication. The remaining &#8377; 80,000.00 balance is payable upon white-glove installation.
              </div>
            </div>

            <!-- Option 3: Bitcoin Gateway -->
            <div class="payment-method-option" id="optC" onclick="document.getElementById('radC').checked=true; document.getElementById('optC').classList.add('selected'); document.getElementById('optA').classList.remove('selected'); document.getElementById('optB').classList.remove('selected'); document.getElementById('discRow').style.display='none'; document.getElementById('totalDueText').innerText='₹ 160,000.00 (BTC)'; document.getElementById('depositNote').style.display='none';">
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
            <span style="color:var(--color-gold); font-weight:600;">- &#8377; 8,000.00</span>
          </div>

          <div class="summary-row total-row">
            <span>TOTAL PAYABLE NOW</span>
            <span class="total-val" id="totalDueText">&#8377; 152,000.00</span>
          </div>

          <div id="depositNote" style="display:none; margin-top:8px; font-size:0.8rem; color:var(--color-gold);">
            Remaining balance: &#8377; 80,000.00 due upon completion/installation.
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

async function run() {
  const nonce = await getFreshNonce();
  
  // Deploy Cart (1994)
  const cartHtml = buildCartHtml();
  await updatePage(1994, 'Shopping Cart — Staging Preview (Trending Era)', 'staging-cart', cartHtml, nonce);

  // Deploy Checkout (1995)
  const checkoutHtml = buildCheckoutHtml();
  await updatePage(1995, 'Secure Checkout — Staging Preview (Trending Era)', 'staging-checkout', checkoutHtml, nonce);
}

run().catch(console.error);
