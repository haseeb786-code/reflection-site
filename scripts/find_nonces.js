import fs from 'fs';

const html = fs.readFileSync('elementor_editor_frame.html', 'utf8');
const nonces = [...html.matchAll(/"([a-zA-Z0-9_-]*nonce[a-zA-Z0-9_-]*)":\s*"([^"]+)"/gi)].map(m => `${m[1]}: ${m[2]}`);
console.log('Nonces found in frame:', [...new Set(nonces)]);

// Find elementorCommon
const commonMatch = html.match(/window\.elementorCommon\s*=\s*(\{[^;]+\});/);
if (commonMatch) {
  console.log('elementorCommon found!');
}

// Find document.elements or initial_document
const docMatch = html.match(/"initial_document":\s*(\{[^}]+\})/);
console.log('initial_document match:', docMatch ? docMatch[1].slice(0, 200) : 'none');
