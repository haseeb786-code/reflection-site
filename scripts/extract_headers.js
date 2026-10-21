import fs from 'fs';

const home = fs.readFileSync('temp_live_home.html', 'utf8');
const shop = fs.readFileSync('temp_live_shop.html', 'utf8');

function getHeader(html) {
  const start = html.indexOf('re-unified-header-container');
  if (start === -1) return '';
  const headerStart = html.lastIndexOf('<header', start);
  const end = html.indexOf('</header>', start);
  return html.substring(headerStart, end + 9);
}

const hHome = getHeader(home);
const hShop = getHeader(shop);

fs.writeFileSync('header_home_exact.html', hHome);
fs.writeFileSync('header_shop_exact.html', hShop);

console.log('Home header length:', hHome.length);
console.log('Shop header length:', hShop.length);
console.log('Match?:', hHome === hShop);
