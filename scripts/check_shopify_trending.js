import fs from 'fs';

const html = fs.readFileSync('shopify_live_homepage.html', 'utf8');
const id = 'template--21609896640601__product_list_UwRqN4';
const start = html.indexOf(`id="shopify-section-${id}"`);
const next = html.indexOf('shopify-section', start + 100);
const snippet = html.substring(start, next !== -1 ? next : start + 12000);

fs.writeFileSync('shopify_trending_era.html', snippet);
console.log('Saved shopify_trending_era.html, size:', snippet.length);

const imgs = [...snippet.matchAll(/<img[^>]+src="([^">]+)"/g)].map(m => m[1]);
console.log('Images in Shopify Trending Era:', imgs);
