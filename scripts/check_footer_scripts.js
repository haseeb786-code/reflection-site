import fs from 'fs';

const rawFooter = fs.readFileSync('debug_footer.txt', 'utf8');

function decodeHtml(str) {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&');
}

let decodedFooter = decodeHtml(rawFooter);

console.log('--- Scripts in footer ---');
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
while ((match = scriptRegex.exec(decodedFooter)) !== null) {
  count++;
  console.log(`Script #${count}:`, match[0].substring(0, 100));
}
