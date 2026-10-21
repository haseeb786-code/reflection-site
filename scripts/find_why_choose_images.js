import fs from 'fs';

const html = fs.readFileSync('shopify_live_homepage.html', 'utf8');

// Search for "EXPERT CRAFTSMANSHIP" or "Why Choose" in the full html
const idx = html.indexOf('EXPERT CRAFTSMANSHIP');
if (idx !== -1) {
  console.log('Found EXPERT CRAFTSMANSHIP at:', idx);
  console.log(html.substring(idx - 600, idx + 1500));
} else {
  console.log('EXPERT CRAFTSMANSHIP not found verbatim, searching images near collection_list...');
  const idx2 = html.indexOf('collection_list_rqG3qq');
  console.log(html.substring(idx2 - 200, idx2 + 3000));
}
