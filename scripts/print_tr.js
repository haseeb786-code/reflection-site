import fs from 'fs';

const html = fs.readFileSync('plugins_page.html', 'utf8');
const regex = /<tr[^>]*data-plugin="reflection-elite-payments\/reflection-elite-payments\/reflection-elite-payments\.php"[^>]*>([\s\S]*?)<\/tr>/i;
const m = html.match(regex);
if (m) {
  console.log('TR Content:');
  console.log(m[0]);
} else {
  console.log('Not found');
}
