import fs from 'fs';

const html = fs.readFileSync('shopify_live_homepage.html', 'utf8');
const id = 'template--21609896640601__blocks_HWj63e';
const start = html.indexOf(`id="shopify-section-${id}"`);
const next = html.indexOf('shopify-section', start + 100);
const snippet = html.substring(start, next !== -1 ? next : start + 6000);

fs.writeFileSync('section_9_discount_banner.html', snippet);
console.log('Saved section 9 snippet, size:', snippet.length);
