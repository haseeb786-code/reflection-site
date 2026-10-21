import fs from 'fs';

const html = fs.readFileSync('plugins.html', 'utf8');
const match = html.match(/wpApiSettings\s*=\s*(\{[^}]+\})/);
console.log('wpApiSettings:', match ? match[1] : 'not found');
