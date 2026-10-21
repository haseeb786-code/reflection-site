import fs from 'fs';

const html = fs.readFileSync('reflectionelite_com_shop.html', 'utf8');

// Search for product card structures
const idx = html.indexOf('ANTIQUE VENETIAN CUSHION');
if (idx !== -1) {
  console.log('Snippet around ANTIQUE VENETIAN CUSHION:');
  console.log(html.slice(Math.max(0, idx - 400), idx + 800));
} else {
  const idx2 = html.indexOf('Antique venetian cushion');
  if (idx2 !== -1) {
    console.log('Snippet around Antique venetian cushion:');
    console.log(html.slice(Math.max(0, idx2 - 400), idx2 + 800));
  }
}
