import fs from 'fs';

const html = fs.readFileSync('home.html', 'utf8');
const imgs = [...html.matchAll(/https:\/\/reflectionelite\.ataanalytiq\.com\/wp-content\/uploads\/[^\s"'()]+\.(?:jpg|jpeg|png|webp)/gi)].map(m => m[0]);
const unique = [...new Set(imgs)];
console.log(`Found ${unique.length} unique images in home.html:`);
unique.forEach((img, i) => console.log(`${i+1}. ${img}`));
