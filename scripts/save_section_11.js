import fs from 'fs';

const html = fs.readFileSync('shopify_live_homepage.html', 'utf8');
const id = 'template--21609896640601__section_F9fMc4';
const start = html.indexOf(`id="shopify-section-${id}"`);
const next = html.indexOf('shopify-section', start + 100);
const snippet = html.substring(start, next !== -1 ? next : start + 10000);

fs.writeFileSync('section_11_split.html', snippet);
console.log('Saved section_11_split.html, length:', snippet.length);

const imgs = [...snippet.matchAll(/<img[^>]+src="([^">]+)"/g)].map(m => m[1]);
console.log('Images in section 11:', imgs);
