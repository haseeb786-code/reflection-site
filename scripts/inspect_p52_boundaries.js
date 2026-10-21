import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

async function inspectStructure() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/52', {
    headers: { Cookie: cookieHeader }
  });
  const data = await res.json();
  const raw = data.content?.raw || data.content?.rendered || '';

  // Look for where headers start and end
  console.log('--- Searching for header tags ---');
  let searchPos = 0;
  while ((searchPos = raw.indexOf('<header', searchPos)) !== -1) {
    const endPos = raw.indexOf('</header>', searchPos);
    console.log(`Header found at [${searchPos}, ${endPos}]:`);
    console.log(raw.slice(searchPos, searchPos + 150));
    console.log('...');
    console.log(raw.slice(endPos - 50, endPos + 9));
    searchPos = endPos + 9;
  }

  // Look for announcement-bar
  let annPos = 0;
  while ((annPos = raw.indexOf('class="announcement-bar"', annPos)) !== -1) {
    console.log(`announcement-bar found at pos ${annPos}:`);
    console.log(raw.slice(annPos - 20, annPos + 200));
    annPos += 30;
  }
}

inspectStructure().catch(console.error);
