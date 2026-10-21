async function run() {
  const res = await fetch('https://reflectionelite.com/?s=venetian&post_type=product');
  const html = await res.text();
  console.log('Includes THE ARTISAN COLLECTION:', html.includes('THE ARTISAN COLLECTION'));
  console.log('Includes search-results:', html.includes('search-results'));
  const bodyMatch = html.match(/<body[^>]*class="([^"]*)"/);
  console.log('Body classes:', bodyMatch ? bodyMatch[1] : 'none');
  
  // Find where search query or results might be
  const sMatches = [...html.matchAll(/venetian/gi)];
  console.log('Occurrences of venetian:', sMatches.length);
  
  // Check if native search loop is output or hidden
  console.log('Has products list:', html.includes('<ul class="products'));
  console.log('Has woocommerce-result-count:', html.includes('woocommerce-result-count'));
}
run();
