import fs from 'fs';

const files = fs.readdirSync('backups').filter(f => f.endsWith('.html'));
for (const f of files) {
  const html = fs.readFileSync(`backups/${f}`, 'utf8');
  console.log(`=== ${f} (len: ${html.length}) ===`);
  const sections = html.match(/id="re-[^"]+"/g);
  console.log('Sections:', sections);
}
