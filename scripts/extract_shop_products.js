async function run() {
  const res = await fetch('https://reflectionelite.com/shop/');
  const html = await res.text();
  const cardRegex = /<div class="luxury-card">([\s\S]*?)<\/div>\s*<\/p><\/div>/g;
  let match;
  const products = [];
  while ((match = cardRegex.exec(html)) !== null) {
    const chunk = match[1];
    const img = chunk.match(/<img[^>]*src="([^"]+)"/)?.[1];
    const cat = chunk.match(/class="card-category">([^<]+)<\/div>/)?.[1];
    const title = chunk.match(/class="card-title">([^<]+)<\/div>/)?.[1];
    const price = chunk.match(/class="card-price">([^<]+)<\/div>/)?.[1];
    const link = chunk.match(/href="([^"]+)"[^>]*class="btn-view"/)?.[1];
    products.push({ title, cat, price, link, img });
  }
  console.log('Extracted products count:', products.length);
  console.log(JSON.stringify(products, null, 2));
}
run();
