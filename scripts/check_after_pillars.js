import fs from 'fs';

const content = fs.readFileSync('page_68_current_live.html', 'utf8');
const pillarsStart = content.indexOf('<!-- 4 VALUE PILLARS -->');
if (pillarsStart !== -1) {
  const pillarsEnd = content.indexOf('</section>', pillarsStart) + '</section>'.length;
  console.log('Pillars section length:', pillarsEnd - pillarsStart);
  console.log('After pillars section (next 500 chars):');
  console.log(content.substring(pillarsEnd, pillarsEnd + 500));
}
