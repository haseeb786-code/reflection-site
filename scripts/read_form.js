import fs from 'fs';

const html = fs.readFileSync('del_conf_actual.html', 'utf8');
const formMatch = html.match(/<form[^>]*action="([^"]*)"[^>]*>([\s\S]*?)<\/form>/i);
if (formMatch) {
  console.log('Action:', formMatch[1]);
  console.log('Form inner:', formMatch[2]);
} else {
  console.log('No form found in del_conf_actual.html');
}
