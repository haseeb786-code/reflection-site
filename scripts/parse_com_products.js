import fs from 'fs';

const html = fs.readFileSync('reflectionelite_com_shop.html', 'utf8');

// Parse products
const productBlocks = html.split('<li class="product').slice(1);
console.log('Found product blocks on reflectionelite.com:', productBlocks.length);

const prods = productBlocks.map((block, idx) => {
  const titleMatch = block.match(/<h[23][^>]*class="[^"]*(?:woocommerce-loop-product__title|title)[^"]*"[^>]*>([\s\S]*?)<\/h[23]>/i)
    || block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'Unknown';

  const priceMatch = block.match(/<span class="price">([\s\S]*?)<\/span>/i);
  const price = priceMatch ? priceMatch[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : 'No price';

  const imgMatch = block.match(/<img[^>]*src="([^"]+)"/i);
  const img = imgMatch ? imgMatch[1] : 'No image';

  const linkMatch = block.match(/<a[^>]*href="([^"]+)"/i);
  const link = linkMatch ? linkMatch[1] : 'No link';

  const catMatch = block.match(/class="posted_in">([\s\S]*?)<\/span>/i)
    || block.match(/category-([a-z0-9-]+)/i);
  const cat = catMatch ? catMatch[1].replace(/<[^>]+>/g, '').trim() : '';

  return { idx: idx + 1, title, price, img, link, cat };
});

console.log(JSON.stringify(prods, null, 2));
fs.writeFileSync('production_com_products.json', JSON.stringify(prods, null, 2));
