import fs from 'fs';

const html = fs.readFileSync('shopify_live_homepage.html', 'utf8');

// Find all CSS rules containing background-color: var(--color-background)
let pos = 0;
while ((pos = html.indexOf('--color-background', pos)) !== -1) {
  const start = html.lastIndexOf('{', pos);
  const selStart = html.lastIndexOf('}', start);
  const rule = html.substring(Math.max(0, selStart + 1), html.indexOf('}', pos) + 1);
  if (rule.includes('background-color') || rule.includes('background:')) {
    console.log('Rule with background:', rule.trim());
  }
  pos += 20;
}
