import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'process.env.PROD_WP_APP_PASS || "[REDACTED]"';
const auth = {
  Authorization: 'Basic ' + Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64'),
  'Content-Type': 'application/json'
};

async function getAdminCookies() {
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/`);
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const postCookies = res2.headers.getSetCookie();
  return [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');
}

// -------------------------------------------------------------
// FIX 1: PERMANENTLY REMOVE RAW CSS FROM WPCODE HEADER & FOOTER
// -------------------------------------------------------------
async function fixWpCode(allCookies) {
  console.log('\n--- 1. CLEANING WPCODE: REMOVING RAW UNWRAPPED CSS & ENTITIES ---');

  const res = await fetch(`${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await res.text();
  const nonceMatch = html.match(/id="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i) 
                  || html.match(/name="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i);
  if (!nonceMatch) throw new Error('Could not find WPCode nonce');
  const nonce = nonceMatch[1];

  const headerMatch = html.match(/<textarea[^>]*id="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  const footerMatch = html.match(/<textarea[^>]*id="ihaf_insert_footer"[^>]*>([\s\S]*?)<\/textarea>/i);

  let rawHeader = headerMatch ? headerMatch[1] : '';
  let rawFooter = footerMatch ? footerMatch[1] : '';

  // Decode textarea html entities to get actual stored text
  function decodeEntities(str) {
    return str
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, '&');
  }

  let cleanHeader = decodeEntities(rawHeader);
  let cleanFooter = decodeEntities(rawFooter);

  // 1. Remove ANY unwrapped or duplicate RE-LUXURY-CART-SYSTEM CSS
  cleanHeader = cleanHeader.replace(/\/\* === RE-LUXURY-CART-SYSTEM-START === \*\/[\s\S]*?\/\* === RE-LUXURY-CART-SYSTEM-END === \*\//g, '').trim();
  cleanHeader = cleanHeader.replace(/<style id="re-luxury-cart-styles">[\s\S]*?<\/style>/g, '').trim();
  cleanHeader = cleanHeader.replace(/<style id="re-luxury-cart-checkout-styles">[\s\S]*?<\/style>/g, '').trim();

  // 2. Cart & Checkout Dark Luxury Styling - PROPERLY WRAPPED INSIDE <style> TAGS
  const properlyWrappedCartCss = `
<style id="re-luxury-cart-checkout-styles">
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

#customer_details .col-1, #customer_details .col-2, #order_review_heading, #order_review {
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
</style>
`;

  cleanHeader = cleanHeader + '\n' + properlyWrappedCartCss.trim();

  // 3. Clean Footer: remove the buggy fixRazorpayButtons script that had entity quotes
  cleanFooter = cleanFooter.replace(/<script id="re-fix-razorpay-buttons">[\s\S]*?<\/script>/gi, '').trim();

  // Save WPCode
  const wpcodePayload = new URLSearchParams();
  wpcodePayload.append('insert-headers-and-footers_nonce', nonce);
  wpcodePayload.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-headers-footers');
  wpcodePayload.append('ihaf_insert_header', cleanHeader);
  wpcodePayload.append('ihaf_insert_body', '');
  wpcodePayload.append('ihaf_insert_footer', cleanFooter);
  wpcodePayload.append('submit', 'Save');

  const saveRes = await fetch(`${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': allCookies },
    body: wpcodePayload.toString()
  });

  console.log('WPCode saved successfully! HTTP status:', saveRes.status);
}

// -------------------------------------------------------------
// FIX 2: PURGE LITESPEED CACHE
// -------------------------------------------------------------
async function purgeLiteSpeedCache(allCookies) {
  console.log('\n--- 2. PURGING LITESPEED CACHE ACROSS ENTIRE STORE ---');
  const dashRes = await fetch(`${WP_URL}/wp-admin/`, { headers: { 'Cookie': allCookies } });
  const html = await dashRes.text();
  const purgeMatch = html.match(/href="([^"]*litespeed-purge-all[^"]*)"/i) || html.match(/href="([^"]*purge_all[^"]*)"/i);
  if (purgeMatch) {
    const rawPurge = purgeMatch[1].replace(/&amp;/g, '&');
    const purgeUrl = rawPurge.startsWith('http') ? rawPurge : `${WP_URL}/wp-admin/${rawPurge}`;
    const pRes = await fetch(purgeUrl, { headers: { 'Cookie': allCookies } });
    console.log('LiteSpeed Cache purged! Status:', pRes.status);
  } else {
    console.log('No purge link found in dashboard.');
  }
}

// -------------------------------------------------------------
// FIX 3: PERMANENTLY REMOVE "PARTIAL PAYMENT" PRODUCT
// -------------------------------------------------------------
async function removePartialPayment() {
  console.log('\n--- 3. REMOVING "PARTIAL PAYMENT" PRODUCT PERMANENTLY ---');
  const searchRes = await fetch(`${WP_URL}/wp-json/wc/v3/products?search=Partial`, {
    headers: auth
  });
  const products = await searchRes.json();
  const partial = products.find(p => p.slug === 'partial-payment' || p.name.toLowerCase().includes('partial payment'));

  if (partial) {
    console.log(`Found Partial Payment product (ID: ${partial.id}). Deleting permanently...`);
    const delRes = await fetch(`${WP_URL}/wp-json/wc/v3/products/${partial.id}?force=true`, {
      method: 'DELETE',
      headers: auth
    });
    console.log('Product deleted status:', delRes.status);
    const delData = await delRes.json();
    console.log(`Successfully deleted product ID ${delData.id} (${delData.name}).`);
  } else {
    console.log('Partial Payment product already removed or not found.');
  }
}

// -------------------------------------------------------------
// FIX 4: ENABLE CASH ON DELIVERY (COD)
// -------------------------------------------------------------
async function enableCashOnDelivery() {
  console.log('\n--- 4. ENABLING CASH ON DELIVERY (COD) GATEWAY ---');
  const codRes = await fetch(`${WP_URL}/wp-json/wc/v3/payment_gateways/cod`, {
    method: 'PUT',
    headers: auth,
    body: JSON.stringify({
      enabled: true,
      title: 'Cash on Delivery (COD)',
      description: 'Pay securely with cash upon delivery of your luxury mirror.'
    })
  });
  console.log('COD gateway updated. Status:', codRes.status);
  const codData = await codRes.json();
  console.log('COD Enabled state:', codData.enabled);
}

// -------------------------------------------------------------
// FIX 5: CREATE AND PUBLISH MISSING POLICY PAGES (404 FIX)
// -------------------------------------------------------------
async function createPolicyPages() {
  console.log('\n--- 5. CREATING AND PUBLISHING MISSING POLICY PAGES ---');
  const pagesRes = await fetch(`${WP_URL}/wp-json/wp/v2/pages?per_page=50`, { headers: auth });
  const pages = await pagesRes.json();

  // 1. Privacy Policy
  const privPage = pages.find(p => p.slug === 'privacy-policy');
  if (!privPage) {
    console.log('Creating Privacy Policy page (/privacy-policy/)...');
    const pRes = await fetch(`${WP_URL}/wp-json/wp/v2/pages`, {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        status: 'publish',
        content: `
<div style="max-width: 860px; margin: 40px auto; color: #cbd5e1; font-family: 'Montserrat', sans-serif; line-height: 1.8;">
  <h1 style="font-family: 'Cinzel', serif; color: #ffffff; font-size: 36px; border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 16px; margin-bottom: 24px;">Privacy Policy</h1>
  <p><strong>Reflection Elite</strong> ("we", "our", or "us") is dedicated to safeguarding the privacy and confidentiality of our esteemed patrons. This Privacy Policy outlines how your personal information is collected, used, and protected when you visit or make a purchase from <a href="https://reflectionelite.com" style="color: #d4af37;">reflectionelite.com</a>.</p>
  
  <h2 style="font-family: 'Cinzel', serif; color: #f5e7a9; font-size: 22px; margin-top: 30px;">Information We Collect</h2>
  <p>When you place an order or commission a bespoke mirror, we collect necessary billing and dispatch details including your full name, shipping address, 6-digit Indian PIN code, mobile contact number, and email address. Payment credentials processed via Razorpay or UPI are encrypted and processed securely by authorized banking partners; we do not store raw card numbers or UPI PINs.</p>

  <h2 style="font-family: 'Cinzel', serif; color: #f5e7a9; font-size: 22px; margin-top: 30px;">How We Use Your Information</h2>
  <ul style="padding-left: 20px;">
    <li>To fabricate, package, and safely dispatch your bespoke mirror in reinforced wooden crates.</li>
    <li>To send insured transit tracking notifications and direct WhatsApp delivery updates.</li>
    <li>To provide responsive customer service and concierge consultation for custom architectural dimensions.</li>
  </ul>

  <h2 style="font-family: 'Cinzel', serif; color: #f5e7a9; font-size: 22px; margin-top: 30px;">Atelier Concierge Contact</h2>
  <p>For questions regarding your data or our practices, contact our atelier lead at:<br />
  <strong>Reflection Elite (KGN GLASS)</strong><br />
  Saligaon Road, Parra, Goa – 403510, India<br />
  Email: <a href="mailto:reflectionelite.com@gmail.com" style="color: #d4af37;">reflectionelite.com@gmail.com</a><br />
  WhatsApp Support: <a href="https://wa.me/917387463103" style="color: #25D366;">+91 7387463103</a></p>
</div>
        `
      })
    });
    console.log('Privacy Policy created. Status:', pRes.status);
  } else {
    console.log('Privacy Policy page already exists (ID:', privPage.id, ')');
  }

  // 2. Refund and Returns Policy (/refund_returns/ and /refund-returns/)
  const refundPage = pages.find(p => p.slug === 'refund_returns' || p.slug === 'refund-returns');
  if (!refundPage) {
    console.log('Creating Refund & Returns Policy page (/refund_returns/)...');
    const rRes = await fetch(`${WP_URL}/wp-json/wp/v2/pages`, {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({
        title: 'Refund & Returns Policy',
        slug: 'refund_returns',
        status: 'publish',
        content: `
<div style="max-width: 860px; margin: 40px auto; color: #cbd5e1; font-family: 'Montserrat', sans-serif; line-height: 1.8;">
  <h1 style="font-family: 'Cinzel', serif; color: #ffffff; font-size: 36px; border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 16px; margin-bottom: 24px;">Refund &amp; Returns Policy</h1>
  <p>At <strong>Reflection Elite</strong>, every luxury Venetian mirror and bespoke glass creation is crafted to the highest standards of architectural excellence and encased in reinforced wooden crates designed to withstand transit across India.</p>
  
  <h2 style="font-family: 'Cinzel', serif; color: #f5e7a9; font-size: 22px; margin-top: 30px;">100% Zero-Breakage Transit Guarantee</h2>
  <p>Every shipment is fully insured. In the unlikely event that your mirror arrives with glass damage or transit fractures:</p>
  <ul style="padding-left: 20px;">
    <li>Please inspect the crate upon delivery and record an unboxing video or take high-resolution photographs of the damage.</li>
    <li>Notify our workshop concierge via WhatsApp at <a href="https://wa.me/917387463103" style="color: #25D366;"><strong>+91 7387463103</strong></a> or email <a href="mailto:reflectionelite.com@gmail.com" style="color: #d4af37;">reflectionelite.com@gmail.com</a> within <strong>48 hours</strong> of receipt.</li>
    <li>We will fabricate and dispatch an immediate brand-new replacement at zero additional charge to you, or issue a 100% full refund.</li>
  </ul>

  <h2 style="font-family: 'Cinzel', serif; color: #f5e7a9; font-size: 22px; margin-top: 30px;">Bespoke &amp; Custom Orders</h2>
  <p>Because each made-to-measure mirror is custom carved to your exact millimetric requirements, change-of-mind cancellations cannot be accepted once glass cutting has commenced. However, our 100% quality and transit replacement guarantee applies unconditionally to all custom commissions.</p>
</div>
        `
      })
    });
    console.log('Refund Policy created. Status:', rRes.status);
  } else {
    console.log('Refund Policy page already exists (ID:', refundPage.id, ')');
  }
}

// -------------------------------------------------------------
// FIX 6: SEO 301 REDIRECTS FOR VENETIAN MIRROR
// -------------------------------------------------------------
function fixHtaccess() {
  console.log('\n--- 6. UPDATING SEO .htaccess REDIRECT RULES ---');
  let htaccess = fs.readFileSync('seo_redirects.htaccess', 'utf8');
  htaccess = htaccess.replace(
    'Redirect 301 /products/venetian-mirror /product/venetian-mirror/',
    'Redirect 301 /products/venetian-mirror /product/rococo-floral/\nRedirect 301 /product/venetian-mirror/ /product/rococo-floral/'
  );
  fs.writeFileSync('seo_redirects.htaccess', htaccess, 'utf8');
  console.log('seo_redirects.htaccess successfully updated!');
}

// -------------------------------------------------------------
// MAIN EXECUTION
// -------------------------------------------------------------
async function runAllFixes() {
  console.log('========================================================');
  console.log('   REFLECTION ELITE: PERMANENT SYSTEM FIX MASTER SUITE   ');
  console.log('========================================================');

  const cookies = await getAdminCookies();

  await fixWpCode(cookies);
  await purgeLiteSpeedCache(cookies);
  await removePartialPayment();
  await enableCashOnDelivery();
  await createPolicyPages();
  fixHtaccess();

  // Final cache purge to ensure zero stale pages remain
  await purgeLiteSpeedCache(cookies);

  console.log('\n========================================================');
  console.log('   ALL FIXES EXECUTED CLEANLY AND PERMANENTLY!          ');
  console.log('========================================================');
}

runAllFixes().catch(console.error);
