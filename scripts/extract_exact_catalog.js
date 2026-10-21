import fs from 'fs';

const html = fs.readFileSync('reflectionelite_com_shop.html', 'utf8');
const match = html.match(/var catalogProducts = (\[[\s\S]*?\]);/);
if (match) {
  console.log('Found catalogProducts!');
  fs.writeFileSync('exact_real_catalog_products.js', 'export const catalogProducts = ' + match[1] + ';');
  console.log(match[1]);
} else {
  console.log('No catalogProducts array matched.');
}
