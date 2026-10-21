import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function fixHeaderCss() {
  console.log('=== FIXING HEADER CSS WRAPPER IMMEDIATELY ===\n');

  // Step 1: Login
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

  const headerMatch = html.match(/<textarea[^>]*id="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  let currentHeader = headerMatch ? headerMatch[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&') : '';

  const footerMatch = html.match(/<textarea[^>]*id="ihaf_insert_footer"[^>]*>([\s\S]*?)<\/textarea>/i);
  let currentFooter = footerMatch ? footerMatch[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&') : '';

  // Remove the unwrapped cart CSS block from header
  currentHeader = currentHeader.replace(/\/\* === RE-LUXURY-CART-SYSTEM-START === \*\/[\s\S]*?\/\* === RE-LUXURY-CART-SYSTEM-END === \*\//g, '');
  // Also remove any existing <style id="re-luxury-cart-styles">...</style> if any
  currentHeader = currentHeader.replace(/<style id="re-luxury-cart-styles">[\s\S]*?<\/style>/g, '');

  // Now properly wrap the cart CSS inside <style> tags!
  const properlyWrappedCartCss = `
<style id="re-luxury-cart-styles">
/* === RE-LUXURY-CART-SYSTEM-START === */
/* Navigation Header Cart Styling */
#ast-hf-menu-1 li.menu-item a[href*="/cart/"],
.main-header-menu a[href*="/cart/"] {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  background: rgba(212, 175, 55, 0.12) !important;
  border: 1px solid rgba(212, 175, 55, 0.35) !important;
  padding: 6px 14px !important;
  border-radius: 50px !important;
  color: #f5e7a9 !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  letter-spacing: 0.5px !important;
  transition: all 0.25s ease !important;
}

#ast-hf-menu-1 li.menu-item a[href*="/cart/"]:hover,
.main-header-menu a[href*="/cart/"]:hover {
  background: rgba(212, 175, 55, 0.25) !important;
  border-color: #d4af37 !important;
  color: #ffffff !important;
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.35) !important;
  transform: translateY(-1px) !important;
}

/* Dynamic Live Cart Counter Badge */
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
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.6) !important;
}

.re-cart-badge.pulse {
  animation: re-badge-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes re-badge-pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.4); }
  100% { transform: scale(1); }
}

/* Dedicated Header Bar Cart Pill */
.re-header-cart-btn {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  cursor: pointer !important;
  background: rgba(212, 175, 55, 0.12) !important;
  border: 1px solid rgba(212, 175, 55, 0.4) !important;
  color: #f5e7a9 !important;
  padding: 8px 16px !important;
  border-radius: 50px !important;
  font-family: 'Montserrat', sans-serif !important;
  font-weight: 700 !important;
  font-size: 13px !important;
  text-decoration: none !important;
  transition: all 0.25s ease !important;
  margin-left: 14px !important;
}

.re-header-cart-btn:hover {
  background: linear-gradient(135deg, #f5d77f 0%, #d4af37 100%) !important;
  color: #07090d !important;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.45) !important;
  transform: translateY(-1px) !important;
}

.re-header-cart-btn svg {
  width: 17px !important;
  height: 17px !important;
  fill: currentColor !important;
}

/* Slide-out Cart Backdrop */
#re-cart-backdrop {
  position: fixed !important;
  inset: 0 !important;
  background: rgba(0, 0, 0, 0.75) !important;
  backdrop-filter: blur(6px) !important;
  -webkit-backdrop-filter: blur(6px) !important;
  z-index: 999998 !important;
  opacity: 0 !important;
  pointer-events: none !important;
  transition: opacity 0.3s ease !important;
}

#re-cart-backdrop.open {
  opacity: 1 !important;
  pointer-events: auto !important;
}

/* Slide-out Cart Drawer Panel */
#re-cart-drawer {
  position: fixed !important;
  top: 0 !important;
  right: 0 !important;
  width: 440px !important;
  max-width: 92vw !important;
  height: 100vh !important;
  background: #0b0f17 !important;
  border-left: 1px solid rgba(212, 175, 55, 0.35) !important;
  box-shadow: -12px 0 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(212, 175, 55, 0.15) !important;
  z-index: 999999 !important;
  transform: translateX(100%) !important;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
  display: flex !important;
  flex-direction: column !important;
  box-sizing: border-box !important;
}

#re-cart-drawer.open {
  transform: translateX(0) !important;
}

/* Drawer Header */
.re-drawer-header {
  padding: 20px 24px !important;
  background: #101520 !important;
  border-bottom: 1px solid rgba(212, 175, 55, 0.25) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
}

.re-drawer-title {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  font-family: 'Cinzel', serif !important;
  font-size: 18px !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  margin: 0 !important;
  letter-spacing: 0.5px !important;
}

.re-drawer-close {
  background: rgba(255, 255, 255, 0.06) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  color: #cbd5e1 !important;
  width: 34px !important;
  height: 34px !important;
  border-radius: 50% !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 16px !important;
  transition: all 0.2s ease !important;
}

.re-drawer-close:hover {
  background: rgba(212, 175, 55, 0.2) !important;
  color: #d4af37 !important;
  border-color: #d4af37 !important;
  transform: rotate(90deg) !important;
}

/* Drawer Body (Items List) */
.re-drawer-body {
  flex: 1 !important;
  overflow-y: auto !important;
  padding: 20px 24px !important;
}

/* Custom Scrollbar for Drawer */
.re-drawer-body::-webkit-scrollbar {
  width: 5px !important;
}
.re-drawer-body::-webkit-scrollbar-track {
  background: #0b0f17 !important;
}
.re-drawer-body::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.3) !important;
  border-radius: 4px !important;
}

/* Cart Item Cards inside Drawer */
.re-cart-item {
  display: flex !important;
  gap: 14px !important;
  padding: 16px 0 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
  align-items: center !important;
}

.re-cart-item-img {
  width: 68px !important;
  height: 68px !important;
  border-radius: 8px !important;
  object-fit: cover !important;
  border: 1px solid rgba(212, 175, 55, 0.3) !important;
  background: #141924 !important;
  flex-shrink: 0 !important;
}

.re-cart-item-details {
  flex: 1 !important;
  min-width: 0 !important;
}

.re-cart-item-title {
  font-family: 'Cinzel', serif !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  text-decoration: none !important;
  display: block !important;
  margin-bottom: 4px !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.re-cart-item-title:hover {
  color: #d4af37 !important;
}

.re-cart-item-meta {
  font-size: 13px !important;
  color: #d4af37 !important;
  font-weight: 700 !important;
  font-family: 'Montserrat', sans-serif !important;
}

.re-cart-item-remove {
  background: none !important;
  border: none !important;
  color: #64748b !important;
  cursor: pointer !important;
  padding: 6px !important;
  font-size: 16px !important;
  transition: color 0.2s ease !important;
}

.re-cart-item-remove:hover {
  color: #ef4444 !important;
}

/* Empty Cart State */
.re-cart-empty {
  text-align: center !important;
  padding: 60px 20px !important;
}

.re-cart-empty-icon {
  font-size: 46px !important;
  margin-bottom: 16px !important;
  opacity: 0.8 !important;
}

.re-cart-empty-title {
  font-family: 'Cinzel', serif !important;
  font-size: 18px !important;
  color: #ffffff !important;
  margin: 0 0 8px 0 !important;
}

.re-cart-empty-text {
  font-size: 14px !important;
  color: #94a3b8 !important;
  line-height: 1.6 !important;
  margin: 0 0 24px 0 !important;
}

/* Drawer Footer */
.re-drawer-footer {
  padding: 20px 24px !important;
  background: #101520 !important;
  border-top: 1px solid rgba(212, 175, 55, 0.25) !important;
}

.re-drawer-subtotal {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  margin-bottom: 12px !important;
  font-size: 15px !important;
  color: #cbd5e1 !important;
}

.re-drawer-subtotal-val {
  font-family: 'Montserrat', sans-serif !important;
  font-size: 20px !important;
  font-weight: 800 !important;
  color: #d4af37 !important;
}

/* 50% Advance Box */
.re-drawer-advance-box {
  background: rgba(212, 175, 55, 0.1) !important;
  border: 1px solid rgba(212, 175, 55, 0.3) !important;
  border-radius: 8px !important;
  padding: 10px 14px !important;
  margin-bottom: 16px !important;
  font-size: 12px !important;
  color: #f5e7a9 !important;
  line-height: 1.5 !important;
}

.re-drawer-actions {
  display: flex !important;
  flex-direction: column !important;
  gap: 10px !important;
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
  transform: translateY(-2px) !important;
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
  position: fixed !important;
  bottom: 28px !important;
  left: 28px !important;
  z-index: 999997 !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 10px !important;
  background: #101520 !important;
  border: 1px solid rgba(212, 175, 55, 0.4) !important;
  color: #ffffff !important;
  padding: 12px 20px !important;
  border-radius: 50px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7), 0 0 15px rgba(212, 175, 55, 0.25) !important;
  font-family: 'Montserrat', sans-serif !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  cursor: pointer !important;
  text-decoration: none !important;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
}

.re-floating-cart-pill:hover {
  transform: translateY(-4px) scale(1.03) !important;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.9), 0 0 25px rgba(212, 175, 55, 0.4) !important;
  border-color: #d4af37 !important;
  color: #ffffff !important;
}

.re-floating-cart-pill svg {
  width: 18px !important;
  height: 18px !important;
  fill: #d4af37 !important;
}

/* Fly-in Toast Notification */
#re-cart-toast {
  position: fixed !important;
  top: 25px !important;
  left: 50% !important;
  transform: translateX(-50%) translateY(-100px) !important;
  background: #141924 !important;
  border: 1px solid #d4af37 !important;
  border-radius: 50px !important;
  padding: 12px 24px !important;
  color: #ffffff !important;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.4) !important;
  z-index: 1000001 !important;
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  font-family: 'Montserrat', sans-serif !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  pointer-events: none !important;
  opacity: 0 !important;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
}

#re-cart-toast.show {
  transform: translateX(-50%) translateY(0) !important;
  opacity: 1 !important;
  pointer-events: auto !important;
}

@media (max-width: 600px) {
  #re-cart-drawer {
    width: 100vw !important;
    max-width: 100vw !important;
  }
  .re-floating-cart-pill {
    bottom: 85px !important;
    left: 20px !important;
    padding: 10px 16px !important;
    font-size: 12px !important;
  }
}
/* === RE-LUXURY-CART-SYSTEM-END === */
</style>
`;

  const finalHeader = currentHeader.trim() + '\n' + properlyWrappedCartCss.trim();

  // Save back to WPCode
  console.log('Sending cleanly wrapped CSS to WPCode...');
  const formBody = new URLSearchParams();
  formBody.append('insert-headers-and-footers_nonce', nonce);
  formBody.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-headers-footers');
  formBody.append('ihaf_insert_header', finalHeader);
  formBody.append('ihaf_insert_body', '');
  formBody.append('ihaf_insert_footer', currentFooter);

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
  console.log('[SUCCESS] Header CSS properly wrapped inside <style> tags!');
}

fixHeaderCss().catch(console.error);
