import fs from 'fs';

const html = fs.readFileSync('shopify_live_homepage.html', 'utf8');
const id = 'template--21609896640601__collection_list_rqG3qq';
const start = html.indexOf(`id="shopify-section-${id}"`);
const next = html.indexOf('shopify-section', start + 100);
const snippet = html.substring(start, next !== -1 ? next : start + 10000);

fs.writeFileSync('section_12_why_choose.html', snippet);
console.log('Saved section 12 snippet, size:', snippet.length);

const imgs = [...snippet.matchAll(/<img[^>]+src="([^">]+)"/g)].map(m => m[1]);
console.log('Images in section 12:', imgs);
