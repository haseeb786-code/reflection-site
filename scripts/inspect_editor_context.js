import fs from 'fs';

const html = fs.readFileSync('elementor_editor_frame.html', 'utf8');
const idx = html.indexOf("editor_post_id: '1984'");
console.log(html.slice(idx - 300, idx + 600));
