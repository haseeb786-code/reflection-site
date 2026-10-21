import fs from 'fs';

const html = fs.readFileSync('post_1398_edit.html', 'utf8');
// Find post_content or content textarea
const contentMatch = html.match(/<textarea[^>]*name="content"[^>]*>([\s\S]*?)<\/textarea>/i);
console.log('Content textarea found:', !!contentMatch);
if (contentMatch) {
  console.log('Content snippet:', contentMatch[1].slice(0, 300));
}
// Find all meta inputs
const metaInputs = [...html.matchAll(/name="(_[^"]+)"\s+value="([^"]*)"/g)].map(m => `${m[1]}=${m[2]}`);
console.log('Meta inputs:', metaInputs);
