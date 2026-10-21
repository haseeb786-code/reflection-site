import { getProdAuth } from './prod_auth_helper.js';

async function run() {
  const auth = await getProdAuth();
  const res = await fetch('https://reflectionelite.com/wp-json/wp/v2/pages/7?context=edit', {
    headers: {
      'Cookie': auth.cookies,
      'X-WP-Nonce': auth.nonce
    }
  });
  const data = await res.json();
  const raw = data.content.raw;
  // find [woocommerce_cart]
  const idx = raw.indexOf('[woocommerce_cart]');
  console.log('Before shortcode:\n', raw.substring(0, idx));
  console.log('After shortcode:\n', raw.substring(idx + '[woocommerce_cart]'.length));
}
run();
