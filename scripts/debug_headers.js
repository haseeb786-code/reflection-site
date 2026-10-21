const fs = require('fs');

const home = fs.readFileSync('temp_live_home.html', 'utf8');
const shop = fs.readFileSync('temp_live_shop.html', 'utf8');

function inspectPage(html, label) {
  console.log('================ ' + label + ' ================');
  const reHeaderIdx = html.indexOf('reUnifiedHeader');
  console.log('reUnifiedHeader idx:', reHeaderIdx);
  if (reHeaderIdx !== -1) {
    const endHeader = html.indexOf('</header>', reHeaderIdx);
    console.log('reUnifiedHeader found! Length:', endHeader - reHeaderIdx + 9);
    console.log(html.substring(reHeaderIdx - 50, reHeaderIdx + 800));
  } else {
    // Check for another header container
    const anyHeader = html.match(/<header[\s\S]*?<\/header>/gi);
    console.log('All headers:', anyHeader ? anyHeader.length : 0);
    if (anyHeader) {
      anyHeader.forEach((h, i) => console.log(`Header ${i}:`, h.substring(0, 150)));
    }
  }
}

inspectPage(home, 'HOME');
inspectPage(shop, 'SHOP');
