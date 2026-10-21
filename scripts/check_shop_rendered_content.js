import fs from 'fs';

const html = fs.readFileSync('shop_live_rendered.html', 'utf8');
console.log('Includes te-live-page:', html.includes('te-live-page'));
console.log('Includes BESPOKE GLASS & LUXURY MIRRORS:', html.includes('BESPOKE GLASS & LUXURY MIRRORS'));

// Search for product titles / headings
const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].trim());
console.log('H1s:', h1s);

const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => m[1].trim());
console.log('H2s:', h2s);

// Check what template WooCommerce loaded
const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
if (main) {
  console.log('Main snippet:', main[0].slice(0, 400).replace(/\n/g, ' '));
} else {
  console.log('No <main> tag found');
}
