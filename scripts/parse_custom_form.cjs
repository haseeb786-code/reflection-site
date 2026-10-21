const fs = require('fs');
const html = fs.readFileSync('wpcode_new_custom.html', 'utf8');

const nonces = [...html.matchAll(/name="([^"]*nonce[^"]*)"[^>]*value="([^"]*)"/gi)].map(m => ({ name: m[1], val: m[2] }));
console.log('Nonces:', nonces);

const action = html.match(/id="wpcode-snippet-form"[^>]*action="([^"]*)"/i);
console.log('Form action:', action ? action[1] : 'none');

const codeTypes = [...html.matchAll(/name="wpcode_snippet_type"[^>]*value="([^"]*)"/gi)].map(m => m[1]);
console.log('Snippet types:', codeTypes);

const codeTypeOptions = [...html.matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)<\/option>/gi)].map(m => ({ val: m[1], label: m[2] }));
console.log('All option values:', codeTypeOptions.slice(0, 20));
