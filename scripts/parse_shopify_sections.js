import fs from 'fs';

const html = fs.readFileSync('shopify_live_homepage.html', 'utf8');

// Match sections
const sectionRegex = /<div id="shopify-section-([^"]+)" class="shopify-section([^"]*)"/g;
let match;
const sections = [];
while ((match = sectionRegex.exec(html)) !== null) {
  sections.push({ id: match[1], classes: match[2].trim() });
}

console.log(`Found ${sections.length} Shopify sections in total:`);
sections.forEach((s, idx) => {
  // Extract h1, h2, h3, or section titles if possible
  const start = html.indexOf(`id="shopify-section-${s.id}"`);
  const snippet = html.substring(start, start + 2500);
  const headingMatch = snippet.match(/<(?:h1|h2|h3)[^>]*>(.*?)<\/(?:h1|h2|h3)>/is);
  const heading = headingMatch ? headingMatch[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ') : '(no heading found)';
  console.log(`${idx + 1}. [${s.id}] -> Heading: "${heading}"`);
});
