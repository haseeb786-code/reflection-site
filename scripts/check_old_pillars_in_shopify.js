import fs from 'fs';

const html = fs.readFileSync('shopify_live_homepage.html', 'utf8');
console.log('Contains HANDCRAFTED HERITAGE?', html.includes('HANDCRAFTED HERITAGE'));
console.log('Contains PRECISION TEMPLATING?', html.includes('PRECISION TEMPLATING'));
