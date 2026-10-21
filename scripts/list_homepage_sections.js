import fs from 'fs';

const html = fs.readFileSync('home.html', 'utf8');

// Parse sections in elementor page 52
// Elementor container structure
// Find top level containers: class contains "elementor-element-..." and parent is .elementor-52
const containerRegex = /<div class="elementor-element elementor-element-([a-f0-9]+)[^"]*e-parent/g;
let match;
const sections = [];
while ((match = containerRegex.exec(html)) !== null) {
  sections.push({ id: match[1], index: match.index });
}

console.log(`Found ${sections.length} top-level containers in Elementor homepage:`);

for (let i = 0; i < sections.length; i++) {
  const start = sections[i].index;
  const end = (i + 1 < sections.length) ? sections[i+1].index : html.indexOf('</main>');
  const sectionHtml = html.slice(start, end);

  // Extract headings
  const headings = [...sectionHtml.matchAll(/<(h[1-6])[^>]*class="[^"]*elementor-heading-title[^"]*"[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map(m => `${m[1].toUpperCase()}: ${m[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ')}`);

  // Extract images
  const imgs = [...sectionHtml.matchAll(/<img[^>]+src="([^">]+)"[^>]*>/gi)]
    .map(m => m[1])
    .filter(src => !src.includes('svg'));

  // Extract buttons
  const buttons = [...sectionHtml.matchAll(/<a[^>]*class="[^"]*elementor-button[^"]*"[^>]*>([\s\S]*?)<\/a>/gi)]
    .map(m => m[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' '));

  console.log(`\n--- SECTION ${i + 1} (Elementor ID: ${sections[i].id}) ---`);
  console.log('Headings:', headings);
  console.log('Buttons:', buttons);
  console.log(`Images count: ${imgs.length}`);
  if (imgs.length > 0) console.log('Image samples:', imgs.slice(0, 3));
  // Snippet of text
  const cleanText = sectionHtml.replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  console.log('Text snippet:', cleanText.slice(0, 150));
}
