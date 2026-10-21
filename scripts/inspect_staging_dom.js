import fs from 'fs';

const html = fs.readFileSync('staging_current.html', 'utf8');

// Find all headings
const headings = [...html.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
console.log('Headings in staging_current.html:', headings.slice(0, 15));

// Check if our fullHtml is inside post_content
const postContentMatch = html.match(/class="[^"]*elementor-1984[^"]*"[\s\S]*?<\/main>/i);
console.log('elementor-1984 container found?', !!postContentMatch);
if (postContentMatch) {
  console.log('Snippet of elementor-1984 content:', postContentMatch[0].slice(0, 500));
} else {
  console.log('No elementor-1984 match, let us search for 1984 in html:');
  const occurrences = [...html.matchAll(/1984/g)].length;
  console.log('Occurrences of 1984:', occurrences);
}
