import fs from 'fs';

const html = fs.readFileSync('shopify_live_homepage.html', 'utf8');
const id = 'template--21609896640601__blocks_39crAY';
const start = html.indexOf(`id="shopify-section-${id}"`);
const next = html.indexOf('shopify-section', start + 100);
const snippet = html.substring(start, next !== -1 ? next : start + 8000);

fs.writeFileSync('section_10_features.html', snippet);
console.log('Saved section 10 snippet, size:', snippet.length);

// Extract text and images
const imgs = [...snippet.matchAll(/<img[^>]+src="([^">]+)"/g)].map(m => m[1]);
console.log('Images in section 10:', imgs);

const text = snippet.replace(/<style[\s\S]*?<\/style>/gi, '')
                    .replace(/<script[\s\S]*?<\/script>/gi, '')
                    .replace(/<[^>]+>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
console.log('Text in section 10:', text.substring(0, 600));
