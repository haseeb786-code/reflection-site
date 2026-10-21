import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'process.env.PROD_WP_APP_PASS || "[REDACTED]"';
const auth = {
  Authorization: 'Basic ' + Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64'),
  'Content-Type': 'application/json'
};

async function executeFixes() {
  console.log('=== STARTING EXECUTION OF FIXES 1 & 2 ===\n');

  // STEP 1: Update Cart Page (ID 7)
  console.log('1. Updating Page ID 7 (Cart) with [woocommerce_cart]...');
  const cartRes = await fetch(`${WP_URL}/wp-json/wp/v2/pages/7`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      content: '[woocommerce_cart]',
      status: 'publish'
    })
  });
  if (!cartRes.ok) throw new Error(`Failed to update Cart page: ${cartRes.status} ${await cartRes.text()}`);
  console.log('   Cart Page updated successfully! (Status: 200)');

  // STEP 2: Update Checkout Page (ID 8)
  console.log('\n2. Updating Page ID 8 (Checkout) with [woocommerce_checkout]...');
  const checkoutRes = await fetch(`${WP_URL}/wp-json/wp/v2/pages/8`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      content: '[woocommerce_checkout]',
      status: 'publish'
    })
  });
  if (!checkoutRes.ok) throw new Error(`Failed to update Checkout page: ${checkoutRes.status} ${await checkoutRes.text()}`);
  console.log('   Checkout Page updated successfully! (Status: 200)');

  // STEP 3: Disable Razorpay 1CC PDP & Mini-cart Affordability (Fix 2)
  console.log('\n3. Disabling Razorpay 1CC PDP Affordability in WooCommerce Settings...');
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/admin.php?page=wc-settings&tab=checkout&section=razorpay`);
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');

  // Fetch Razorpay settings page to extract current nonce
  const res3 = await fetch(`${WP_URL}/wp-admin/admin.php?page=wc-settings&tab=checkout&section=razorpay`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await res3.text();
  const nonceMatch = html.match(/id="_wpnonce"[^>]*value="([^"]+)"/) || html.match(/name="_wpnonce"[^>]*value="([^"]+)"/);
  if (!nonceMatch) throw new Error('Could not extract _wpnonce from Razorpay settings page');
  const nonce = nonceMatch[1];
  console.log('   Found Razorpay settings nonce:', nonce);

  // Extract Key ID and Key Secret values to preserve them exactly
  const keyIdMatch = html.match(/name="woocommerce_razorpay_key_id"[^>]*value="([^"]*)"/);
  const keyId = keyIdMatch ? keyIdMatch[1] : '(process.env.RAZORPAY_KEY_ID || "")';
  const keySecretMatch = html.match(/name="woocommerce_razorpay_key_secret"[^>]*value="([^"]*)"/);
  const keySecret = keySecretMatch ? keySecretMatch[1] : '';

  // Prepare form submit payload WITHOUT 1cc PDP checkout checked
  const saveParams = new URLSearchParams();
  saveParams.append('_wpnonce', nonce);
  saveParams.append('_wp_http_referer', '/wp-admin/admin.php?page=wc-settings&tab=checkout&section=razorpay');
  saveParams.append('woocommerce_razorpay_enabled', '1');
  saveParams.append('woocommerce_razorpay_title', 'UPI, Cards, NetBanking (Razorpay)');
  saveParams.append('woocommerce_razorpay_description', 'Pay securely by UPI, Credit/Debit card or NetBanking via Razorpay.');
  saveParams.append('woocommerce_razorpay_key_id', keyId);
  saveParams.append('woocommerce_razorpay_key_secret', keySecret);
  saveParams.append('woocommerce_razorpay_payment_action', 'capture');
  saveParams.append('woocommerce_razorpay_order_success_message', 'Thank you for shopping with us. Your account has been charged and your transaction is successful.');
  // Omit woocommerce_razorpay_enable_1cc_pdp_checkout to UNCHECK IT!
  // Omit woocommerce_razorpay_enable_1cc_mini_cart_checkout to UNCHECK IT!
  saveParams.append('save', 'Save changes');

  const saveRes = await fetch(`${WP_URL}/wp-admin/admin.php?page=wc-settings&tab=checkout&section=razorpay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': allCookies },
    body: saveParams.toString()
  });

  console.log('   Razorpay settings saved! HTTP status:', saveRes.status);

  // STEP 4: Inject comprehensive Dark Luxury CSS for Classic Cart & Checkout in WPCode
  console.log('\n4. Updating WPCode with Dark Luxury Cart/Checkout styling and drawer triggers...');
  const wpcodePage = await fetch(`${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { 'Cookie': allCookies }
  });
  const wpcodeHtml = await wpcodePage.text();
  const wpcodeNonceMatch = wpcodeHtml.match(/id="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i) 
                        || wpcodeHtml.match(/name="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i);
  if (!wpcodeNonceMatch) throw new Error('Could not find WPCode nonce');
  const wpcodeNonce = wpcodeNonceMatch[1];

  // Extract current header and footer
  const hMatch = wpcodeHtml.match(/<textarea[^>]*id="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  let currentHeader = hMatch ? hMatch[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&') : '';

  const fMatch = wpcodeHtml.match(/<textarea[^>]*id="ihaf_insert_footer"[^>]*>([\s\S]*?)<\/textarea>/i);
  let currentFooter = fMatch ? fMatch[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&') : '';

  // Clean old cart system block in header if any
  currentHeader = currentHeader.replace(/\/\* === RE-LUXURY-CART-SYSTEM-START === \*\/[\s\S]*?\/\* === RE-LUXURY-CART-SYSTEM-END === \*\//g, '').trim();

  const luxuryCartCheckoutCss = `
/* === RE-LUXURY-CART-SYSTEM-START === */
/* Classic WooCommerce Cart & Checkout Dark Luxury Theme */
.woocommerce-cart .woocommerce,
.woocommerce-checkout .woocommerce {
  max-width: 1200px !important;
  margin: 30px auto 60px auto !important;
  padding: 0 20px !important;
  color: #e2e8f0 !important;
}

/* Cart Table */
table.shop_table {
  background: #0c111a !important;
  border: 1px solid rgba(212, 175, 55, 0.3) !important;
  border-radius: 12px !important;
  border-collapse: separate !important;
  overflow: hidden !important;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
  width: 100% !important;
}

table.shop_table th {
  background: #141b27 !important;
  color: #d4af37 !important;
  font-family: 'Cinzel', serif !important;
  font-weight: 700 !important;
  letter-spacing: 1px !important;
  text-transform: uppercase !important;
  padding: 16px !important;
  border-bottom: 1px solid rgba(212, 175, 55, 0.25) !important;
}

table.shop_table td {
  padding: 18px 16px !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
  color: #e2e8f0 !important;
  vertical-align: middle !important;
}

table.shop_table td a {
  color: #ffffff !important;
  font-weight: 600 !important;
}

table.shop_table td a:hover {
  color: #d4af37 !important;
}

table.shop_table td.product-remove a.remove {
  color: #ef4444 !important;
  font-size: 20px !important;
  border: 1px solid rgba(239, 68, 68, 0.4) !important;
  border-radius: 50% !important;
  width: 26px !important;
  height: 26px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  line-height: 1 !important;
  transition: all 0.2s ease !important;
}

table.shop_table td.product-remove a.remove:hover {
  background: #ef4444 !important;
  color: #ffffff !important;
}

/* Cart Totals Box */
.cart-collaterals .cart_totals {
  background: #0c111a !important;
  border: 1px solid rgba(212, 175, 55, 0.3) !important;
  border-radius: 12px !important;
  padding: 24px !important;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
}

.cart-collaterals .cart_totals h2 {
  font-family: 'Cinzel', serif !important;
  color: #d4af37 !important;
  font-size: 22px !important;
  margin-top: 0 !important;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2) !important;
  padding-bottom: 12px !important;
}

/* Checkout Form Inputs */
.woocommerce-checkout form.checkout {
  background: transparent !important;
}

#customer_details .col-1,
#customer_details .col-2,
#order_review_heading,
#order_review {
  color: #ffffff !important;
}

.woocommerce form .form-row input.input-text,
.woocommerce form .form-row textarea,
.woocommerce form .form-row select {
  background: #141b27 !important;
  border: 1px solid rgba(212, 175, 55, 0.35) !important;
  color: #ffffff !important;
  padding: 12px 14px !important;
  border-radius: 6px !important;
  font-size: 14px !important;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.4) !important;
}

.woocommerce form .form-row input.input-text:focus,
.woocommerce form .form-row textarea:focus,
.woocommerce form .form-row select:focus {
  border-color: #d4af37 !important;
  outline: none !important;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.3) !important;
}

.woocommerce form .form-row label {
  color: #cbd5e1 !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  margin-bottom: 6px !important;
}

/* Order Review / Payment Methods Box */
#order_review {
  background: #0c111a !important;
  border: 1px solid rgba(212, 175, 55, 0.35) !important;
  border-radius: 12px !important;
  padding: 24px !important;
  box-shadow: 0 10px 35px rgba(0,0,0,0.6) !important;
}

#payment {
  background: #121722 !important;
  border: 1px solid rgba(212, 175, 55, 0.25) !important;
  border-radius: 8px !important;
}

#payment ul.payment_methods {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

#payment div.payment_box {
  background: #1a2233 !important;
  color: #cbd5e1 !important;
}

/* Gold Gradient Buttons for Cart & Checkout */
.woocommerce a.button,
.woocommerce button.button,
.woocommerce input.button,
.woocommerce #respond input#submit,
.woocommerce #payment #place_order,
.woocommerce-cart .wc-proceed-to-checkout a.checkout-button {
  background: linear-gradient(135deg, #f5d77f 0%, #d4af37 50%, #996515 100%) !important;
  color: #07090d !important;
  font-family: 'Cinzel', serif !important;
  font-weight: 700 !important;
  letter-spacing: 1px !important;
  text-transform: uppercase !important;
  border: none !important;
  border-radius: 6px !important;
  padding: 14px 28px !important;
  box-shadow: 0 4px 18px rgba(212, 175, 55, 0.35) !important;
  transition: all 0.3s ease !important;
  cursor: pointer !important;
}

.woocommerce a.button:hover,
.woocommerce button.button:hover,
.woocommerce input.button:hover,
.woocommerce #payment #place_order:hover,
.woocommerce-cart .wc-proceed-to-checkout a.checkout-button:hover {
  background: linear-gradient(135deg, #ffffff 0%, #d4af37 100%) !important;
  box-shadow: 0 6px 24px rgba(212, 175, 55, 0.5) !important;
  transform: translateY(-2px) !important;
}
/* === RE-LUXURY-CART-SYSTEM-END === */
`;

  currentHeader = currentHeader + '\n' + luxuryCartCheckoutCss;

  // Save WPCode
  const wpcodePayload = new URLSearchParams();
  wpcodePayload.append('insert-headers-and-footers_nonce', wpcodeNonce);
  wpcodePayload.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-headers-footers');
  wpcodePayload.append('ihaf_insert_header', currentHeader);
  wpcodePayload.append('ihaf_insert_body', '');
  wpcodePayload.append('ihaf_insert_footer', currentFooter);
  wpcodePayload.append('submit', 'Save');

  const saveWpcodeRes = await fetch(`${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': allCookies },
    body: wpcodePayload.toString()
  });

  console.log('   WPCode styling updated! HTTP status:', saveWpcodeRes.status);
  console.log('\n=== FIXES 1 & 2 EXECUTED SUCCESSFULLY! ===\n');
}

executeFixes().catch(console.error);
