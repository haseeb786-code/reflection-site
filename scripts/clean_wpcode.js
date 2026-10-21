import fs from 'fs';

const rawHeader = fs.readFileSync('debug_header.txt', 'utf8');
const rawFooter = fs.readFileSync('debug_footer.txt', 'utf8');

console.log('Original rawHeader length:', rawHeader.length);
console.log('Original rawFooter length:', rawFooter.length);

// Decode entities
function decodeHtml(str) {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&');
}

let decodedHeader = decodeHtml(rawHeader);
let decodedFooter = decodeHtml(rawFooter);

console.log('Decoded header length:', decodedHeader.length);
console.log('Decoded footer length:', decodedFooter.length);

// Check what naked text exists in decodedHeader
let testHeader = decodedHeader;
testHeader = testHeader.replace(/<!--[\s\S]*?-->/g, '');
testHeader = testHeader.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
testHeader = testHeader.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
testHeader = testHeader.replace(/<link\b[^>]*>/gi, '');
testHeader = testHeader.replace(/<meta\b[^>]*>/gi, '');
testHeader = testHeader.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, '');

console.log('Naked text remaining in header (length:', testHeader.trim().length, '):');
console.log('--- START NAKED TEXT ---');
console.log(testHeader.trim().substring(0, 800));
console.log('--- END NAKED TEXT ---');
