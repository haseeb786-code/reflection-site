import fs from 'fs';

const html = fs.readFileSync('shopify_live_homepage.html', 'utf8');
const target = 'template--21609896640601__slideshow_Xq6zkH';
const idx = html.indexOf(target);

// Let's search for styles or classes related to this slideshow
const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let match;
while ((match = styleRegex.exec(html)) !== null) {
  if (match[1].includes('slideshow_Xq6zkH') || match[1].includes('slideshow-') || match[1].includes('zoom')) {
    console.log('Found matching style block, length:', match[1].length);
    console.log(match[1].substring(0, 1000));
  }
}

// Let's also inspect how the image and slide are rendered
const snippet = html.substring(idx - 100, idx + 3500);
console.log('\n--- SLIDESHOW MARKUP SNIPPET ---');
console.log(snippet.substring(0, 1500));
