import fs from 'fs';

const files = fs.readdirSync('.').filter(f => f.startsWith('del_res_'));
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  console.log('===', file, '===');
  const errorMatch = html.match(/class="error[^"]*"[^>]*>([\s\S]*?)<\/div>/i) || html.match(/id="message"[^>]*>([\s\S]*?)<\/div>/i);
  if (errorMatch) {
    console.log('Notice:', errorMatch[1].replace(/<[^>]+>/g, '').trim());
  } else {
    console.log('No notice found. Title:', html.match(/<title>([^<]*)<\/title>/i)?.[1]);
  }
}
