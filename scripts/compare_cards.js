import fs from 'fs';

const home = fs.readFileSync('raw_page_68_home.html', 'utf8');
const shop = fs.readFileSync('raw_page_6_shop.html', 'utf8');

function findProductCard(html, label) {
  console.log('================ ' + label + ' ================');
  const cardMatch = html.match(/<article[\s\S]*?<\/article>/i) || html.match(/<div class="luxury-card"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i);
  if (cardMatch) {
    console.log(cardMatch[0]);
  } else {
    // let's look for luxury-card
    const idx = html.indexOf('luxury-card');
    if (idx !== -1) {
      console.log(html.substring(idx - 50, idx + 1200));
    } else {
      console.log('No luxury-card found!');
    }
  }
}

findProductCard(home, 'HOME');
findProductCard(shop, 'SHOP');
