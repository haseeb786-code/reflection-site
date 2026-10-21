import fs from 'fs';

const html = fs.readFileSync('gw_act_result.html', 'utf8');
const idx = html.indexOf('Plugin could not be activated');
if (idx !== -1) {
  console.log(html.substring(idx - 100, idx + 1000));
} else {
  console.log('Not found');
}
