import fs from 'fs';

const html = fs.readFileSync('shopify_trending_era.html', 'utf8');

// Find product card styling
const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let m;
while ((m = styleRegex.exec(html)) !== null) {
  if (m[1].includes('product-card') || m[1].includes('card__media') || m[1].includes('product-grid') || m[1].includes('media-fit')) {
    console.log('--- Style block ---');
    console.log(m[1].substring(0, 1000));
  }
}

// Check how <img> tag is rendered in first card
const firstCard = html.substring(html.indexOf('1771694577552') - 200, html.indexOf('1771694577552') + 400);
console.log('--- First card img tag ---');
console.log(firstCard);
