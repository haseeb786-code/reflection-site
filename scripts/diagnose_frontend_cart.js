import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function diagnose() {
  console.log('=== DIAGNOSING CART ON FRONTEND ===');
  const shopRes = await fetch(`${WP_URL}/shop/`);
  const html = await shopRes.text();

  // Find links to cart
  const cartMatches = html.match(/href="[^"]*cart[^"]*"/gi) || [];
  console.log('Cart href occurrences in /shop/:', cartMatches);

  // Check if there is any cart icon or widget in the header
  const headerMatch = html.match(/<header[\s\S]*?<\/header>/i);
  if (headerMatch) {
    const hasCartInHeader = /cart/i.test(headerMatch[0]);
    console.log('Is "cart" mentioned in <header>?', hasCartInHeader);
  }

  // Check WooCommerce settings: Is cart redirect on add enabled?
  const WP_USER = 'admin';
  const WP_APP_PASS = 'process.env.PROD_WP_APP_PASS || "[REDACTED]"';
  const auth = { Authorization: 'Basic ' + Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64') };

  const settingsRes = await fetch(`${WP_URL}/wp-json/wc/v3/settings/products`, { headers: auth });
  if (settingsRes.ok) {
    const settings = await settingsRes.json();
    const cartRedirect = settings.find(s => s.id === 'woocommerce_cart_redirect_after_add');
    const ajaxCart = settings.find(s => s.id === 'woocommerce_enable_ajax_add_to_cart');
    console.log('woocommerce_cart_redirect_after_add:', cartRedirect ? cartRedirect.value : 'unknown');
    console.log('woocommerce_enable_ajax_add_to_cart:', ajaxCart ? ajaxCart.value : 'unknown');
  }

  // Check a single product page
  const prodRes = await fetch(`${WP_URL}/product/antique-venetian-cushion/`);
  const prodHtml = await prodRes.text();
  const prodCartMatches = prodHtml.match(/href="[^"]*cart[^"]*"/gi) || [];
  console.log('Cart href occurrences in single product page:', prodCartMatches);
}

diagnose().catch(console.error);
