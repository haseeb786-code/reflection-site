import fs from 'fs';

const home = fs.readFileSync('raw_page_68_home.html', 'utf8');
const liveHome = fs.readFileSync('temp_live_home.html', 'utf8');

console.log('ANTIQUE in raw:', home.includes('ANTIQUE VENETIAN'));
console.log('ANTIQUE in live:', liveHome.includes('ANTIQUE VENETIAN'));

if (home.includes('ANTIQUE VENETIAN')) {
  const idx = home.indexOf('ANTIQUE VENETIAN');
  console.log('RAW Home product section:');
  console.log(home.substring(idx - 200, idx + 400));
}

if (!liveHome.includes('ANTIQUE VENETIAN')) {
  console.log('WARNING: ANTIQUE VENETIAN is in raw_page_68, but NOT in temp_live_home.html!');
  console.log('Let us see where raw_page_68 content is cut off or why it is missing from live!');
}
