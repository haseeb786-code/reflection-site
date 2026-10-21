import fs from 'fs';

const html = fs.readFileSync('settings_page_verified.html', 'utf8');
const match = html.match(/<input[^>]*name="re_sandbox_mode"[^>]*>/i);
console.log('Sandbox input HTML:', match ? match[0] : 'not found');

const inputs = [...html.matchAll(/<input[^>]+name="(re_[^"]+)"[^>]*value="([^"]*)"[^>]*>/gi)];
for (const inp of inputs) {
  console.log(` - ${inp[1]} = ${inp[2]} | ${inp[0].includes('checked') ? 'CHECKED' : ''}`);
}
