import fs from 'fs';

function decodeHtmlEntities(str) {
  let s = str;
  for (let i = 0; i < 3; i++) {
    s = s
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&');
  }
  return s;
}

const html = fs.readFileSync('snippet_197_full.html', 'utf8');
const codeMatch = html.match(/<textarea[^>]*id="wpcode_snippet_code"[^>]*>([\s\S]*?)<\/textarea>/i);
if (codeMatch) {
  const code = decodeHtmlEntities(codeMatch[1]);
  if (!fs.existsSync('backups')) {
    fs.mkdirSync('backups', { recursive: true });
  }
  fs.writeFileSync('snippet_197_current_live.html', code);
  fs.writeFileSync('backups/snippet_197_before_overlay_update.html', code);
  console.log('Successfully backed up snippet 197! Length:', code.length);
} else {
  console.error('No snippet code match found');
}
