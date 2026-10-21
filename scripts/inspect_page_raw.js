import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

async function checkPage() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/52', {
    headers: { Cookie: cookieHeader }
  });
  const data = await res.json();
  const raw = data.content?.raw || data.content?.rendered || '';
  
  const bodyIdx = raw.indexOf('<div class="te-live-page">');
  console.log('--- Body starting at te-live-page ---');
  console.log(raw.slice(bodyIdx, bodyIdx + 2000));
}

checkPage().catch(console.error);
