import fs from 'fs';

const html = fs.readFileSync('shop_live_rendered.html', 'utf8');
console.log('Includes 1385:', html.includes('1385'));
console.log('Includes 1331:', html.includes('1331'));
console.log('Includes 1398:', html.includes('1398'));
console.log('Includes 383:', html.includes('383'));

// Search for product links
const productLinks = [...html.matchAll(/href="([^"]*\/product\/[^"]*)"/g)].map(m => m[1]);
console.log('Unique product links in shop_live:', [...new Set(productLinks)]);

// Search for headings
const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => m[1].trim().replace(/\n/g, ' '));
console.log('H2 headings in shop_live:', h2s);
