import fs from 'fs';

const html = fs.readFileSync('fresh_staging.html', 'utf8');
const h1Match = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/i);
console.log('h1 HTML:', h1Match ? h1Match[0] : 'no h1');

const fontFaceMatches = [...html.matchAll(/@font-face\s*\{[^}]+\}/gi)].map(m => m[0]);
console.log('Font face declarations in page:', fontFaceMatches);
