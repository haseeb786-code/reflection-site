import fs from 'fs';

const html = fs.readFileSync('gw_act_result.html', 'utf8');
const notices = [...html.matchAll(/<div[^>]*class="[^"]*notice[^"]*"[^>]*>([\s\S]*?)<\/div>/gi)];
for (const n of notices) {
  console.log('NOTICE:', n[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}
