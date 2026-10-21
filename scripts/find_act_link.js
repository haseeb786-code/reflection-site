import fs from 'fs';

const html = fs.readFileSync('new_upload_result.html', 'utf8');
const links = [...html.matchAll(/href="([^"]*activate[^"]*)"/gi)];
for (const l of links) {
  console.log('Found link in new_upload_result.html:', l[1]);
}
