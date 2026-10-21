import fs from 'fs';

const html = fs.readFileSync('wpcode_current_list.html', 'utf8');
const regex = /class="row-title"[^>]*>([^<]+)<\/a>/g;
let m;
const list = [];
while ((m = regex.exec(html)) !== null) {
  list.push(m[1]);
}
console.log('WPCode Snippets:', list);
