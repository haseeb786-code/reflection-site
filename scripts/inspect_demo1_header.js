import fs from 'fs';

const html = fs.readFileSync('staging_home_demo1.html', 'utf8');
const marqueeIdx = html.indexOf('id="marqueeBar"');
const headerIdx = html.indexOf('class="site-header"');
console.log('Distance between marqueeBar and site-header:', headerIdx - marqueeIdx);
console.log(html.slice(marqueeIdx, headerIdx));
