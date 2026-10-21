import fs from 'fs';

const html = fs.readFileSync('staging_current.html', 'utf8');
const bodyClass = (html.match(/<body[^>]*class="([^"]+)"/) || [])[1];
const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1];
const cacheNote = html.match(/<!--\s*Page cached by[\s\S]*?-->/);
const elementorPostClass = html.match(/elementor-(\d+)/);

console.log('Title:', title);
console.log('Body Class:', bodyClass);
console.log('Elementor Post Class:', elementorPostClass ? elementorPostClass[0] : 'none');
console.log('Cache Note:', cacheNote ? cacheNote[0] : 'no cache note');
