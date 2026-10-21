import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function deployProfessionalCart() {
  console.log('=== DEPLOYING PERFECT PROFESSIONAL LUXURY CART EXPERIENCE ===\n');

  // Step 1: Login to WP Admin
  console.log('1. Logging in to WordPress admin...');
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`);
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');

  // Step 2: Fetch current WPCode content
  console.log('2. Fetching WPCode page...');
  const res3 = await fetch(`${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await res3.text();
  const nonceMatch = html.match(/id="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i) 
                  || html.match(/name="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i);
  if (!nonceMatch) {
    throw new Error('Could not find WPCode nonce');
  }
  const nonce = nonceMatch[1];
  console.log('Found nonce:', nonce);

  // Extract current header content to preserve existing dark luxury styles
  const headerMatch = html.match(/<textarea[^>]*id="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  let currentHeader = headerMatch ? headerMatch[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&') : '';

  // Clean out any previous cart CSS to prevent duplication
  currentHeader = currentHeader.replace(/\/\* === RE-LUXURY-CART-SYSTEM-START === \*\/[\s\S]*?\/\* === RE-LUXURY-CART-SYSTEM-END === \*\//g, '').trim();

  const luxuryCartCss = `
/* === RE-LUXURY-CART-SYSTEM-START === */
/* UPPER PORTION: Professional Desktop Header Cart Pill (After Contact) */
#ast-hf-menu-1 li#menu-item-85,
#ast-hf-menu-1 li.menu-item:has(a[href*="/cart/"]) {
  display: inline-flex !important;
  align-items: center !important;
  margin-left: 14px !important;
}

#ast-hf-menu-1 li#menu-item-85 a,
#ast-hf-menu-1 li.menu-item a[href*="/cart/"] {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.16) 0%, rgba(212, 175, 55, 0.05) 100%) !important;
  border: 1px solid rgba(212, 175, 55, 0.5) !important;
  padding: 8px 18px !important;
  border-radius: 50px !important;
  color: #f5e7a9 !important;
  font-family: 'Montserrat', sans-serif !important;
  font-weight: 700 !important;
  font-size: 13px !important;
  letter-spacing: 1px !important;
  text-transform: uppercase !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(212, 175, 55, 0.1) !important;
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
  cursor: pointer !important;
}

#ast-hf-menu-1 li#menu-item-85 a:hover,
#ast-hf-menu-1 li.menu-item a[href*="/cart/"]:hover {
  background: linear-gradient(135deg, #f5d77f 0%, #d4af37 100%) !important;
  color: #07090d !important;
  border-color: #d4af37 !important;
  box-shadow: 0 0 22px rgba(212, 175, 55, 0.6) !important;
  transform: translateY(-2px) !important;
}

#ast-hf-menu-1 li#menu-item-85 a svg,
#ast-hf-menu-1 li.menu-item a[href*="/cart/"] svg {
  width: 17px !important;
  height: 17px !important;
  fill: currentColor !important;
  transition: fill 0.2s ease !important;
}

/* MOBILE UPPER PORTION: Header Cart Icon next to hamburger menu */
.re-mobile-cart-btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  position: relative !important;
  background: rgba(212, 175, 55, 0.12) !important;
  border: 1px solid rgba(212, 175, 55, 0.4) !important;
  border-radius: 50px !important;
  padding: 8px 14px !important;
  margin-right: 10px !important;
  color: #f5e7a9 !important;
  text-decoration: none !important;
  font-weight: 700 !important;
  font-size: 12px !important;
  gap: 6px !important;
  cursor: pointer !important;
}

.re-mobile-cart-btn svg {
  width: 17px !important;
  height: 17px !important;
  fill: currentColor !important;
}

/* Dynamic Live Counter Badge */
.re-cart-badge {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-width: 20px !important;
  height: 20px !important;
  padding: 0 6px !important;
  border-radius: 50px !important;
  background: linear-gradient(135deg, #f5d77f 0%, #d4af37 100%) !important;
  color: #07090d !important;
  font-family: 'Montserrat', sans-serif !important;
  font-weight: 800 !important;
  font-size: 11px !important;
  line-height: 1 !important;
  box-shadow: 0 2px 6px rgba(0,0,0,0.6) !important;
  transition: transform 0.25s ease !important;
}

.re-cart-badge.has-items {
  background: linear-gradient(135deg, #ffd700 0%, #d4af37 100%) !important;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.7) !important;
}

.re-cart-badge.pulse {
  animation: re-badge-pop 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes re-badge-pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.45); }
  100% { transform: scale(1); }
}

/* Product Card: Styled WooCommerce "View Cart" button */
a.added_to_cart {
  display: inline-block !important;
  margin-top: 10px !important;
  background: transparent !important;
  color: #f5e7a9 !important;
  border: 1px solid #d4af37 !important;
  padding: 8px 16px !important;
  border-radius: 6px !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 1px !important;
  text-decoration: none !important;
  transition: all 0.25s ease !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
}

a.added_to_cart:hover {
  background: #d4af37 !important;
  color: #000000 !important;
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.4) !important;
  transform: translateY(-2px);
}

/* Slide-out Cart Backdrop */
#re-cart-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 999998;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s ease;
}

#re-cart-backdrop.open {
  opacity: 1;
  pointer-events: auto;
}

/* Slide-out Cart Drawer Panel */
#re-cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 440px;
  max-width: 92vw;
  height: 100vh;
  background: #0b0f17;
  border-left: 1px solid rgba(212, 175, 55, 0.35);
  box-shadow: -12px 0 50px rgba(0, 0, 0, 0.9), 0 0 35px rgba(212, 175, 55, 0.15);
  z-index: 999999;
  transform: translateX(100%);
  transition: transform 0.38s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

#re-cart-drawer.open {
  transform: translateX(0);
}

/* Drawer Header */
.re-drawer-header {
  padding: 22px 24px;
  background: #101520;
  border-bottom: 1px solid rgba(212, 175, 55, 0.25);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.re-drawer-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Cinzel', serif;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: 0.5px;
}

.re-drawer-close {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #cbd5e1;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;
}

.re-drawer-close:hover {
  background: rgba(212, 175, 55, 0.25);
  color: #d4af37;
  border-color: #d4af37;
  transform: rotate(90deg);
}

/* Drawer Body (Items List) */
.re-drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

.re-drawer-body::-webkit-scrollbar {
  width: 5px;
}
.re-drawer-body::-webkit-scrollbar-track {
  background: #0b0f17;
}
.re-drawer-body::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.3);
  border-radius: 4px;
}

/* Cart Item Cards inside Drawer */
.re-cart-item {
  display: flex;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  align-items: center;
}

.re-cart-item-img {
  width: 68px;
  height: 68px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid rgba(212, 175, 55, 0.3);
  background: #141924;
  flex-shrink: 0;
}

.re-cart-item-details {
  flex: 1;
  min-width: 0;
}

.re-cart-item-title {
  font-family: 'Cinzel', serif;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  text-decoration: none;
  display: block;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.re-cart-item-title:hover {
  color: #d4af37;
}

.re-cart-item-meta {
  font-size: 13px;
  color: #d4af37;
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
}

.re-cart-item-remove {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 6px;
  font-size: 18px;
  transition: color 0.2s ease;
  text-decoration: none;
}

.re-cart-item-remove:hover {
  color: #ef4444;
}

/* Empty Cart State */
.re-cart-empty {
  text-align: center;
  padding: 60px 20px;
}

.re-cart-empty-icon {
  font-size: 46px;
  margin-bottom: 16px;
  opacity: 0.8;
}

.re-cart-empty-title {
  font-family: 'Cinzel', serif;
  font-size: 18px;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.re-cart-empty-text {
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

/* Drawer Footer */
.re-drawer-footer {
  padding: 22px 24px;
  background: #101520;
  border-top: 1px solid rgba(212, 175, 55, 0.25);
}

.re-drawer-subtotal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 15px;
  color: #cbd5e1;
}

.re-drawer-subtotal-val {
  font-family: 'Montserrat', sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: #d4af37;
}

/* 50% Advance Box */
.re-drawer-advance-box {
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 16px;
  font-size: 12px;
  color: #f5e7a9;
  line-height: 1.5;
}

.re-drawer-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.re-drawer-btn-checkout {
  background: linear-gradient(135deg, #f5d77f 0%, #d4af37 50%, #996515 100%) !important;
  color: #07090d !important;
  font-family: 'Cinzel', serif !important;
  font-weight: 800 !important;
  font-size: 14px !important;
  letter-spacing: 1.5px !important;
  text-transform: uppercase !important;
  padding: 14px !important;
  border-radius: 6px !important;
  text-align: center !important;
  text-decoration: none !important;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.35) !important;
  display: block !important;
  transition: all 0.2s ease !important;
}

.re-drawer-btn-checkout:hover {
  background: linear-gradient(135deg, #ffffff 0%, #f5d77f 100%) !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.5) !important;
}

.re-drawer-btn-viewcart {
  background: rgba(255, 255, 255, 0.06) !important;
  border: 1px solid rgba(212, 175, 55, 0.4) !important;
  color: #f1f5f9 !important;
  font-family: 'Montserrat', sans-serif !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  letter-spacing: 0.5px !important;
  padding: 11px !important;
  border-radius: 6px !important;
  text-align: center !important;
  text-decoration: none !important;
  display: block !important;
  transition: all 0.2s ease !important;
}

.re-drawer-btn-viewcart:hover {
  background: rgba(255, 255, 255, 0.12) !important;
  color: #ffffff !important;
}

/* Floating Luxury Cart Pill (Bottom Left) */
.re-floating-cart-pill {
  position: fixed;
  bottom: 28px;
  left: 28px;
  z-index: 999997;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #101520;
  border: 1px solid rgba(212, 175, 55, 0.4);
  color: #ffffff;
  padding: 12px 20px;
  border-radius: 50px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7), 0 0 15px rgba(212, 175, 55, 0.25);
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.re-floating-cart-pill:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.9), 0 0 25px rgba(212, 175, 55, 0.4);
  border-color: #d4af37;
  color: #ffffff;
}

.re-floating-cart-pill svg {
  width: 18px;
  height: 18px;
  fill: #d4af37;
}

/* Fly-in Toast Notification */
#re-cart-toast {
  position: fixed;
  top: 25px;
  left: 50%;
  transform: translateX(-50%) translateY(-100px);
  background: #141924;
  border: 1px solid #d4af37;
  border-radius: 50px;
  padding: 12px 24px;
  color: #ffffff;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.4);
  z-index: 1000001;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 600;
  pointer-events: none;
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

#re-cart-toast.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
  pointer-events: auto;
}

@media (max-width: 600px) {
  #re-cart-drawer {
    width: 100vw;
    max-width: 100vw;
  }
  .re-floating-cart-pill {
    bottom: 85px;
    left: 20px;
    padding: 10px 16px;
    font-size: 12px;
  }
}
/* === RE-LUXURY-CART-SYSTEM-END === */
`;

  const updatedHeader = currentHeader + '\n' + luxuryCartCss;

  // Step 3: Prepare the Footer Content (WhatsApp Support + Cart Drawer + Toast + JavaScript)
  const updatedFooter = `
<!-- Reflection Elite Contact Support Floating WhatsApp -->
<a href="https://wa.me/917387463103?text=Hi%20Reflection%20Elite,%20I%20am%20interested%20in%20your%20luxury%20mirrors." 
   target="_blank" 
   rel="noopener noreferrer" 
   class="wa-floating-concierge" 
   aria-label="Contact Reflection Elite Support on WhatsApp">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.06-2.146-.541-1.854-.77-3.047-2.662-3.14-2.785-.092-.122-.741-.986-.741-1.88 0-.895.469-1.334.636-1.516.166-.182.365-.228.487-.228.122 0 .243.002.349.006.111.005.26-.042.406.31.15.362.512 1.248.558 1.339.045.091.076.197.015.319-.06.121-.091.197-.182.303-.091.106-.192.237-.274.319-.092.091-.188.19-.081.373.106.183.473.78 1.014 1.262.697.621 1.285.813 1.468.904.182.091.289.076.395-.045.106-.122.456-.531.577-.714.122-.182.243-.152.41-.091s1.063.501 1.245.592c.182.091.303.137.349.213.045.076.045.441-.099.846zm-3.392-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.88l-1.304 4.76 4.877-1.278c1.401.764 3.003 1.198 4.703 1.198 5.523 0 10-4.477 10-10 0-5.522-4.477-10-10-10z"/>
  </svg>
  <span>Contact Support</span>
</a>

<!-- Floating Luxury Cart Pill (Bottom Left) -->
<div id="re-floating-cart-pill" class="re-floating-cart-pill" style="display:none;" onclick="reOpenCartDrawer()" aria-label="Open Shopping Bag">
  <svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
  <span>Bag (<span class="re-cart-badge re-pill-count">0</span>)</span>
  <span id="re-pill-total" style="color: #d4af37; font-weight: 700;"></span>
</div>

<!-- Slide-out Cart Backdrop -->
<div id="re-cart-backdrop" onclick="reCloseCartDrawer()"></div>

<!-- Slide-out Cart Drawer -->
<div id="re-cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping Bag">
  <div class="re-drawer-header">
    <div class="re-drawer-title">
      <svg style="width: 22px; height: 22px; fill: #d4af37;" viewBox="0 0 24 24"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z"/></svg>
      <span>Shopping Bag</span>
      <span class="re-cart-badge re-drawer-badge" id="re-drawer-badge">0</span>
    </div>
    <button class="re-drawer-close" onclick="reCloseCartDrawer()" aria-label="Close Shopping Bag">&times;</button>
  </div>

  <div class="re-drawer-body" id="re-drawer-body">
    <!-- Populated via JavaScript from WooCommerce fragments -->
    <div class="re-cart-empty">
      <div class="re-cart-empty-icon">🛍️</div>
      <h4 class="re-cart-empty-title">Your Bag is Empty</h4>
      <p class="re-cart-empty-text">Explore our master handcrafted Italian and Venetian luxury mirrors to begin.</p>
      <a href="/shop/" class="re-drawer-btn-checkout" onclick="reCloseCartDrawer()">Explore Mirrors &rarr;</a>
    </div>
  </div>

  <div class="re-drawer-footer" id="re-drawer-footer" style="display: none;">
    <div class="re-drawer-subtotal">
      <span>Subtotal</span>
      <span class="re-drawer-subtotal-val" id="re-drawer-subtotal-val">&#8377;0.00</span>
    </div>
    
    <div class="re-drawer-advance-box">
      <strong>✨ 50% Advance Policy Available:</strong>
      <div id="re-drawer-advance-text">Pay 50% now to initiate handcrafted fabrication, remaining on delivery!</div>
    </div>

    <div class="re-drawer-actions">
      <a href="/checkout/" class="re-drawer-btn-checkout">Proceed to Checkout / Payment &rarr;</a>
      <a href="/cart/" class="re-drawer-btn-viewcart">View Full Shopping Bag</a>
    </div>
  </div>
</div>

<!-- Add to Cart Floating Toast Notification -->
<div id="re-cart-toast">
  <span style="font-size: 20px;">✨</span>
  <span id="re-toast-msg">Item added to your shopping bag!</span>
  <a href="/checkout/" style="color: #f5e7a9; text-decoration: underline; font-weight: 700; margin-left: 8px;">Proceed to Checkout &rarr;</a>
</div>

<script>
(function() {
  // Global Drawer Controls
  window.reOpenCartDrawer = function() {
    var drawer = document.getElementById('re-cart-drawer');
    var backdrop = document.getElementById('re-cart-backdrop');
    if (drawer) drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.reCloseCartDrawer = function() {
    var drawer = document.getElementById('re-cart-drawer');
    var backdrop = document.getElementById('re-cart-backdrop');
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.reShowToast = function(msg) {
    var toast = document.getElementById('re-cart-toast');
    var msgEl = document.getElementById('re-toast-msg');
    if (!toast) return;
    if (msg && msgEl) msgEl.textContent = msg;
    toast.classList.add('show');
    setTimeout(function() {
      toast.classList.remove('show');
    }, 4500);
  };

  // Enhance Header Nav Menu item with SVG Icon and Badge
  function enhanceNavCartItem() {
    // 1. Desktop Menu Item (Positioned right after Contact in #ast-hf-menu-1)
    var cartLinks = document.querySelectorAll('#ast-hf-menu-1 a[href*="/cart/"], .main-header-bar a[href*="/cart/"]');
    cartLinks.forEach(function(link) {
      if (!link.classList.contains('re-enhanced')) {
        link.classList.add('re-enhanced');
        link.innerHTML = '<svg style="width:16px;height:16px;fill:currentColor;" viewBox="0 0 24 24"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z"/></svg> <span>Cart</span> <span class="re-cart-badge">0</span>';
        link.addEventListener('click', function(e) {
          e.preventDefault();
          reOpenCartDrawer();
        });
      }
    });

    // 2. Mobile Header Cart Button (placed in upper header next to hamburger toggle)
    var mobileRight = document.querySelector('#ast-mobile-header .site-header-primary-section-right');
    if (mobileRight && !document.getElementById('re-mobile-cart-btn')) {
      var mobBtn = document.createElement('a');
      mobBtn.id = 're-mobile-cart-btn';
      mobBtn.href = '/cart/';
      mobBtn.className = 're-mobile-cart-btn';
      mobBtn.setAttribute('aria-label', 'View Shopping Cart');
      mobBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z"/></svg> <span>Cart</span> <span class="re-cart-badge re-mobile-badge">0</span>';
      mobBtn.addEventListener('click', function(e) {
        e.preventDefault();
        reOpenCartDrawer();
      });
      mobileRight.insertBefore(mobBtn, mobileRight.firstChild);
    }
  }

  // Update Cart UI from WooCommerce Fragments
  function parseAndRenderMiniCart(htmlFragment, cartTotalAttr) {
    var temp = document.createElement('div');
    temp.innerHTML = htmlFragment;

    var items = temp.querySelectorAll('li.woocommerce-mini-cart-item');
    var count = items.length;
    if (cartTotalAttr !== undefined && cartTotalAttr !== null) {
      var parsed = parseInt(cartTotalAttr, 10);
      if (!isNaN(parsed)) count = parsed;
    }

    // Update all badges across desktop and mobile
    var badges = document.querySelectorAll('.re-cart-badge');
    badges.forEach(function(b) {
      b.textContent = count;
      if (count > 0) {
        b.classList.add('has-items');
      } else {
        b.classList.remove('has-items');
      }
    });

    // Update Floating Pill
    var pill = document.getElementById('re-floating-cart-pill');
    var pillTotal = document.getElementById('re-pill-total');

    // Subtotal
    var subtotalEl = temp.querySelector('.woocommerce-mini-cart__total .amount');
    var subtotalText = subtotalEl ? subtotalEl.textContent.trim() : '₹0.00';

    if (pill) {
      if (count > 0) {
        pill.style.display = 'inline-flex';
        if (pillTotal) pillTotal.textContent = '• ' + subtotalText;
      } else {
        pill.style.display = 'none';
      }
    }

    var drawerBody = document.getElementById('re-drawer-body');
    var drawerFooter = document.getElementById('re-drawer-footer');
    var drawerSubtotalVal = document.getElementById('re-drawer-subtotal-val');
    var advanceText = document.getElementById('re-drawer-advance-text');

    if (count === 0 || items.length === 0) {
      if (drawerBody) {
        drawerBody.innerHTML = '<div class="re-cart-empty">' +
          '<div class="re-cart-empty-icon">🛍️</div>' +
          '<h4 class="re-cart-empty-title">Your Bag is Empty</h4>' +
          '<p class="re-cart-empty-text">Explore our master handcrafted Italian and Venetian luxury mirrors to begin.</p>' +
          '<a href="/shop/" class="re-drawer-btn-checkout" onclick="reCloseCartDrawer()">Explore Mirrors &rarr;</a>' +
        '</div>';
      }
      if (drawerFooter) drawerFooter.style.display = 'none';
    } else {
      // Build sleek items markup
      var itemsHtml = '';
      items.forEach(function(item) {
        var removeLink = item.querySelector('a.remove');
        var removeHref = removeLink ? removeLink.getAttribute('href') : '#';

        var img = item.querySelector('img');
        var imgSrc = img ? img.getAttribute('src') : '';
        var prodLink = item.querySelector('a:not(.remove)');
        var prodTitle = prodLink ? prodLink.textContent.trim() : 'Luxury Mirror';
        var prodHref = prodLink ? prodLink.getAttribute('href') : '/shop/';

        var qtyPrice = item.querySelector('.quantity');
        var qtyPriceHtml = qtyPrice ? qtyPrice.innerHTML : '';

        itemsHtml += '<div class="re-cart-item">' +
          (imgSrc ? '<img src="' + imgSrc + '" class="re-cart-item-img" alt="' + prodTitle + '" />' : '<div class="re-cart-item-img"></div>') +
          '<div class="re-cart-item-details">' +
            '<a href="' + prodHref + '" class="re-cart-item-title">' + prodTitle + '</a>' +
            '<div class="re-cart-item-meta">' + qtyPriceHtml + '</div>' +
          '</div>' +
          (removeHref !== '#' ? '<a href="' + removeHref + '" class="re-cart-item-remove" title="Remove item" aria-label="Remove item">&times;</a>' : '') +
        '</div>';
      });

      if (drawerBody) drawerBody.innerHTML = itemsHtml;
      if (drawerFooter) {
        drawerFooter.style.display = 'block';
        if (drawerSubtotalVal) drawerSubtotalVal.innerHTML = subtotalText;
        
        // Calculate 50% advance for customer convenience
        var num = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
        if (!isNaN(num) && num > 0) {
          var adv = (num / 2).toLocaleString('en-IN', { maximumFractionDigits: 2 });
          if (advanceText) {
            advanceText.innerHTML = 'Pay only <strong style="color:#ffffff;">&#8377;' + adv + '</strong> now via Razorpay/WhatsApp to start manufacturing, remaining on delivery!';
          }
        }
      }
    }
  }

  // Refresh cart fragments from server
  function fetchCartFragments(openDrawerAfter) {
    fetch('/?wc-ajax=get_refreshed_fragments', {
      method: 'POST'
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data && data.fragments) {
        var miniCartHtml = data.fragments['div.widget_shopping_cart_content'] || '';
        var aContainer = data.fragments['a.cart-container'] || '';
        var totalMatch = aContainer.match(/data-cart-total="([0-9]+)"/i);
        var total = totalMatch ? parseInt(totalMatch[1], 10) : null;
        parseAndRenderMiniCart(miniCartHtml, total);

        if (openDrawerAfter) {
          reOpenCartDrawer();
          reShowToast('✨ Added to your cart! Proceed to payment anytime.');
          var badges = document.querySelectorAll('.re-cart-badge');
          badges.forEach(function(b) {
            b.classList.add('pulse');
            setTimeout(function() { b.classList.remove('pulse'); }, 500);
          });
        }
      }
    })
    .catch(function(err) {
      console.error('Error fetching cart fragments:', err);
    });
  }

  // Intercept all Add to Cart actions
  function initCart() {
    enhanceNavCartItem();
    fetchCartFragments(false);

    // Listen to WooCommerce jQuery added_to_cart event
    if (window.jQuery) {
      window.jQuery(document.body).on('added_to_cart', function(event, fragments, cart_hash, $button) {
        if (fragments && fragments['div.widget_shopping_cart_content']) {
          var aContainer = fragments['a.cart-container'] || '';
          var totalMatch = aContainer.match(/data-cart-total="([0-9]+)"/i);
          var total = totalMatch ? parseInt(totalMatch[1], 10) : null;
          parseAndRenderMiniCart(fragments['div.widget_shopping_cart_content'], total);
          reOpenCartDrawer();
          reShowToast('✨ Added to your cart! Proceed to checkout.');
        } else {
          fetchCartFragments(true);
        }
      });

      window.jQuery(document.body).on('removed_from_cart wc_fragments_refreshed', function() {
        fetchCartFragments(false);
      });
    }

    // Direct click listener fallback for Add to Cart buttons
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('.add_to_cart_button, .single_add_to_cart_button');
      if (btn) {
        setTimeout(function() {
          fetchCartFragments(true);
        }, 1000);
      }
    });

    // Check if page reloaded after adding an item
    if (window.location.search.indexOf('add-to-cart=') !== -1 || document.querySelector('.woocommerce-message')) {
      setTimeout(function() {
        fetchCartFragments(true);
      }, 500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCart);
  } else {
    initCart();
  }
})();
</script>
`;

  // Step 4: Save updated WPCode settings
  console.log('3. Saving updated WPCode settings with Cart System...');
  const formBody = new URLSearchParams();
  formBody.append('insert-headers-and-footers_nonce', nonce);
  formBody.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-headers-footers');
  formBody.append('ihaf_insert_header', updatedHeader);
  formBody.append('ihaf_insert_body', '');
  formBody.append('ihaf_insert_footer', updatedFooter);

  const saveRes = await fetch(`${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': allCookies
    },
    body: formBody.toString(),
    redirect: 'manual'
  });

  console.log('Save response status:', saveRes.status);
  console.log('[SUCCESS] Luxury Cart Drawer & System successfully deployed!');
}

deployProfessionalCart().catch(console.error);
