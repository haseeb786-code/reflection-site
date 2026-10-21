import fs from 'fs';

const html = fs.readFileSync('plugins_page.html', 'utf8');
const regex = /<tr[^>]*data-plugin="([^"]*reflection[^"]*)"[^>]*>([\s\S]*?)<\/tr>/g;
let m;
while ((m = regex.exec(html)) !== null) {
  console.log('PLUGIN:', m[1]);
  const actionMatch = m[2].match(/<span class="activate">([\s\S]*?)<\/span>/i);
  if (actionMatch) {
    console.log('Activate link HTML:', actionMatch[1]);
  }
  const deleteMatch = m[2].match(/<span class="delete">([\s\S]*?)<\/span>/i);
  if (deleteMatch) {
    console.log('Delete link HTML:', deleteMatch[1]);
  }
  console.log('-------------------------');
}
