import fs from 'fs';

const html = fs.readFileSync('plugins.html', 'utf8');
const purgeLinks = [...html.matchAll(/href="([^"]*purge[^"]*)"/gi)].map(m => m[1]);
console.log('Purge links in plugins.html:', purgeLinks);

const litespeedLinks = [...html.matchAll(/href="([^"]*litespeed[^"]*)"/gi)].map(m => m[1]);
console.log('LiteSpeed links in plugins.html:', litespeedLinks);
