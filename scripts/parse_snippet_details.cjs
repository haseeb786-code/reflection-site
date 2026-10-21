const fs = require('fs');

for (const id of [77, 78]) {
  const html = fs.readFileSync(`snippet_${id}.html`, 'utf8');
  const title = html.match(/id="title"[^>]*value="([^"]*)"/) || html.match(/name="wpcode_snippet_title"[^>]*value="([^"]*)"/) || html.match(/<input[^>]*id="title"[^>]*value="([^"]*)"/);
  const code = html.match(/<textarea[^>]*id="wpcode_snippet_code"[^>]*>([\s\S]*?)<\/textarea>/) || html.match(/<textarea[^>]*name="wpcode_snippet_code"[^>]*>([\s\S]*?)<\/textarea>/);
  console.log(`Snippet ${id} Title:`, title ? title[1] : 'not found');
  console.log(`Snippet ${id} Code preview:`, code ? code[1].slice(0, 300) : 'not found');
}
