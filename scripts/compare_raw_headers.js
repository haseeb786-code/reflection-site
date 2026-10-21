import fs from 'fs';

const home = fs.readFileSync('raw_page_68_home.html', 'utf8');
const shop = fs.readFileSync('raw_page_6_shop.html', 'utf8');

function getHeader(html) {
  const start = html.indexOf('<header class="re-unified-header-container"');
  if (start === -1) return '';
  const end = html.indexOf('</header>', start);
  return html.substring(start, end + 9);
}

const hHome = getHeader(home);
const hShop = getHeader(shop);

console.log('Raw Home Header len:', hHome.length);
console.log('Raw Shop Header len:', hShop.length);

fs.writeFileSync('raw_hHome.html', hHome);
fs.writeFileSync('raw_hShop.html', hShop);

console.log('Are raw headers identical?:', hHome === hShop);
