import fs from 'fs';

const html = fs.readFileSync('reflectionelite_com_shop.html', 'utf8');
console.log('Includes Antique Venetian Cushion:', html.includes('Antique Venetian Cushion') || html.includes('ANTIQUE VENETIAN CUSHION'));
console.log('Includes 81,500:', html.includes('81,500'));
console.log('Includes 58,787:', html.includes('58,787'));
console.log('Includes 35,900:', html.includes('35,900'));
console.log('Includes CUSTOMISED MIRROR:', html.includes('CUSTOMISED MIRROR') || html.includes('Customised Mirror'));
console.log('Includes PREMIUM UPHOLSTERED FRAME:', html.includes('PREMIUM UPHOLSTERED FRAME') || html.includes('Premium Upholstered Frame'));

const matches = [...html.matchAll(/class="[^"]*(?:woocommerce-loop-product__title|product_title|woocommerce-Price-amount)[^"]*"[^>]*>([\s\S]*?)<\/(?:h2|h3|span)>/gi)];
console.log('Extracted matches count:', matches.length);
for (let i = 0; i < Math.min(25, matches.length); i++) {
  console.log(matches[i][1].replace(/<[^>]+>/g, '').trim());
}
