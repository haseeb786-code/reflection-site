async function checkComShop() {
  const res = await fetch('https://reflectionelite.com/shop/');
  const html = await res.text();
  const title = html.match(/<title>([^<]+)<\/title>/i);
  console.log('Com Shop Title:', title ? title[1] : 'none');
  
  const titles = [...html.matchAll(/woocommerce-loop-product__title[^>]*>([^<]+)<\//gi)].map(m => m[1]);
  console.log('Product titles on com shop:', titles);
  
  const elementorMatches = html.match(/elementor-(\d+)/g);
  console.log('Elementor IDs on com shop:', [...new Set(elementorMatches)]);
}

checkComShop().catch(console.error);
