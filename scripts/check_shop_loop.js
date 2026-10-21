import fs from 'fs';

const html = fs.readFileSync('scripts/diagnostic_shop.html', 'utf8');
const idx = html.indexOf('Showing all');
console.log('--- Context around Showing all ---');
console.log(html.substring(Math.max(0, idx - 600), Math.min(html.length, idx + 1400)));
