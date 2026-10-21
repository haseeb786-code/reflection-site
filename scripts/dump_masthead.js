import fs from 'fs';

async function checkMasthead() {
  const res = await fetch('https://reflectionelite.com/');
  const html = await res.text();
  const mStart = html.indexOf('id="masthead"');
  const mEnd = html.indexOf('</header>', mStart);
  const snippet = html.substring(mStart, mEnd + 9);
  fs.writeFileSync('masthead_dump.html', snippet);
  console.log('Saved masthead_dump.html, length:', snippet.length);
}
checkMasthead().catch(console.error);
