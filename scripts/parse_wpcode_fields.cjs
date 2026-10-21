const fs = require('fs');
const html = fs.readFileSync('wpcode_new_custom.html', 'utf8');
const formMatch = html.match(/<form[^>]*id="wpcode-snippet-manager-form"[^>]*>([\s\S]*?)<\/form>/);
if (formMatch) {
  const formHtml = formMatch[0];
  const fields = [...formHtml.matchAll(/name="([^"]+)"/g)].map(m => m[1]);
  console.log('Unique field names:', [...new Set(fields)]);
}
