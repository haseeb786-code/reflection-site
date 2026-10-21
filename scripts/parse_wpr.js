import fs from 'fs';

const html = fs.readFileSync('wpr_theme_builder.html', 'utf8');
const matches = [...html.matchAll(/data-id="([^"]+)"/g)].map(m => m[1]);
console.log('data-ids in wpr_theme_builder:', [...new Set(matches)]);

// Look for template cards or table rows
const titles = [...html.matchAll(/class="wpr-template-title"[^>]*>([\s\S]*?)<\//g)].map(m => m[1].trim());
console.log('wpr template titles:', titles);

const types = [...html.matchAll(/class="wpr-template-type"[^>]*>([\s\S]*?)<\//g)].map(m => m[1].trim());
console.log('wpr template types:', types);
