async function main() {
  const res = await fetch('https://reflectionelite.com/?s=venetian&post_type=product');
  const html = await res.text();
  console.log('Includes <ul class="products":', html.includes('class="products'));
  const ulMatch = html.match(/<ul[^>]*class="[^"]*products[^"]*"[\s\S]*?<\/ul>/i);
  if (ulMatch) {
    console.log('Found ul.products HTML (length ' + ulMatch[0].length + '):');
    console.log(ulMatch[0].slice(0, 1000));
  } else {
    console.log('No ul.products in HTML.');
  }
}

main().catch(console.error);
