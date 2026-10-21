import fs from 'fs';

const html = fs.readFileSync('shopify_live_homepage.html', 'utf8');
const allImgs = [...html.matchAll(/(?:https?:)?\/\/[^"'\s)]+\.(?:png|jpg|jpeg|webp)[^"'\s)]*/gi)].map(m => m[0]);
const uniqueImgs = [...new Set(allImgs)];
console.log('Total unique images in Shopify HTML:', uniqueImgs.length);
uniqueImgs.forEach(img => console.log(img));
