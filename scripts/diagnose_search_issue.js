async function testRawSearchUrl() {
  console.log('=== 1. TESTING RAW SEARCH URL DIRECTLY ===');
  const url = 'https://reflectionelite.com/?s=venetian&post_type=product';
  console.log('Fetching:', url);
  const res = await fetch(url);
  const html = await res.text();

  console.log('HTTP Status:', res.status);
  console.log('HTML Length:', html.length);
  
  // Check if is_shop suppression affected it
  const has0Products = html.includes('post__in');
  console.log('Contains post__in debug:', has0Products);

  // Extract products found in search
  const productMatches = [...html.matchAll(/<li[^>]*class="[^"]*product[^"]*"[\s\S]*?<h2[^>]*class="[^"]*woocommerce-loop-product__title[^"]*">([^<]+)<\/h2>/gi)];
  console.log(`Products returned in raw search (${productMatches.length}):`);
  productMatches.forEach((m, i) => console.log(`  ${i + 1}. ${m[1].trim()}`));

  const resultCountMatch = html.match(/class="woocommerce-result-count">([^<]+)<\/p>/i);
  console.log('Result count text:', resultCountMatch ? resultCountMatch[1].trim() : 'None');

  const noProducts = html.includes('woocommerce-info') && html.includes('No products were found');
  console.log('No products found message present:', noProducts);

  console.log('\n=== 2. TESTING DIFFERENT SEARCH TERMS ===');
  for (const term of ['mirror', 'victorian', 'cushion', 'crown', 'rococo', 'mosaic', 'upholstered', 'xyznonexistent']) {
    const tUrl = `https://reflectionelite.com/?s=${term}&post_type=product`;
    const tRes = await fetch(tUrl);
    const tHtml = await tRes.text();
    const tMatches = [...tHtml.matchAll(/<h2[^>]*class="[^"]*woocommerce-loop-product__title[^"]*">([^<]+)<\/h2>/gi)];
    console.log(`Term "${term}": ${tMatches.length} products found [${tMatches.map(m => m[1].trim()).join(', ')}]`);
  }
}

testRawSearchUrl().catch(console.error);
