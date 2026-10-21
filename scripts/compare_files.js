import fs from 'fs';

// Check if test_wp_card1.jpg and test_wp_card4.jpg have white borders or if the mirror touches the edges
// Let's inspect test_wp_card1.jpg file info
const stat1 = fs.statSync('test_wp_card1.jpg');
const stat4 = fs.statSync('test_wp_card4.jpg');
const statSp1 = fs.statSync('shopify_card1.webp');
const statSp4 = fs.statSync('shopify_card4.jpg');

console.log('WP card 1 size:', stat1.size);
console.log('Shopify card 1 size:', statSp1.size);
console.log('WP card 4 size:', stat4.size);
console.log('Shopify card 4 size:', statSp4.size);
