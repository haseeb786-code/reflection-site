import fs from 'fs';

const html = fs.readFileSync('snippet_197_full.html', 'utf8');

const formMatch = html.match(/<form[^>]*id="wpcode-snippet-manager"[^>]*>/i);
console.log('Form tag:', formMatch ? formMatch[0] : 'not found');

const nonceMatch = html.match(/name="wpcode-save-snippet-nonce"[^>]*value="([^"]+)"/i);
console.log('Nonce:', nonceMatch ? nonceMatch[1] : 'not found');

const actionMatch = html.match(/action="([^"]+)"/i);
console.log('Action:', actionMatch ? actionMatch[1] : 'not found');

console.log('--- ALL HIDDEN INPUTS ---');
const hiddens = [...html.matchAll(/<input[^>]*type=["']hidden["'][^>]*>/gi)];
for (const h of hiddens) {
  console.log(h[0]);
}

