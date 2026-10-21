import fs from 'fs';

const html = fs.readFileSync('shopify_live_homepage.html', 'utf8');
const id = 'template--21609896640601__blocks_QQHpmz';
const start = html.indexOf(`id="shopify-section-${id}"`);
const next = html.indexOf('shopify-section', start + 100);
const sectionHtml = html.substring(start, next);

fs.writeFileSync('section_8_blocks.html', sectionHtml);
console.log('Saved section_8_blocks.html, length:', sectionHtml.length);
