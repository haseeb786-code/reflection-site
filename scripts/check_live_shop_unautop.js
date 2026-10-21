import { execFileSync } from 'child_process';
import fs from 'fs';

const html = execFileSync('curl.exe', ['-s', '-L', 'https://reflectionelite.com/shop/?nocache=' + Date.now()], { encoding: 'utf8' });
fs.writeFileSync('temp_live_shop_after_unautop.html', html);

const noStyle = html.replace(/<style[\s\S]*?<\/style>/gi, '');
const idx = noStyle.indexOf('re-header-row-inner');
console.log('HTML around re-header-row-inner in live Shop:');
console.log(noStyle.substring(idx - 30, idx + 1800));
