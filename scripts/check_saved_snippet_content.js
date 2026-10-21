import fs from 'fs';

const html = fs.readFileSync('snippet_197_full.html', 'utf8');
const match = html.match(/<textarea[^>]*id="wpcode_snippet_code"[^>]*>([\s\S]*?)<\/textarea>/i);
if (match) {
  console.log('--- FOUND TEXTAREA CODE (first 500 chars) ---');
  console.log(match[1].slice(0, 500));
  console.log('--- CHECK FOR 1100px ---');
  const has1100 = match[1].includes('1100px');
  console.log('Has 1100px:', has1100);
  if (has1100) {
    const lines = match[1].split('\n');
    lines.forEach((l, idx) => {
      if (l.includes('1100px') || l.includes('CHANGE 2')) console.log(`Line ${idx}: ${l}`);
    });
  }
} else {
  console.log('Textarea not matched!');
}
