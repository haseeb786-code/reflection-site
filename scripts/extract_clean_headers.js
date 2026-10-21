import fs from 'fs';

const home = fs.readFileSync('temp_live_home.html', 'utf8');
const shop = fs.readFileSync('temp_live_shop.html', 'utf8');

function extractReHeader(html) {
  const match = html.match(/<header\s+class="re-unified-header-container"[\s\S]*?<\/header>/i);
  return match ? match[0] : null;
}

const hHome = extractReHeader(home);
const hShop = extractReHeader(shop);

fs.writeFileSync('header_home_clean.html', hHome || '');
fs.writeFileSync('header_shop_clean.html', hShop || '');

console.log('Home header extracted length:', hHome ? hHome.length : 0);
console.log('Shop header extracted length:', hShop ? hShop.length : 0);
console.log('Identical?:', hHome === hShop);
