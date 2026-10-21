import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
const nonce = 'f5b146aecd';

async function getMedia() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/media?per_page=100', {
    headers: {
      'Cookie': cookieHeader,
      'X-WP-Nonce': nonce
    }
  });

  console.log('Media API Status:', res.status);
  const items = await res.json();
  console.log(`Found ${items.length} media items in library:`);
  const mediaSummary = items.map(m => ({
    id: m.id,
    title: m.title?.rendered,
    source_url: m.source_url,
    media_details: {
      width: m.media_details?.width,
      height: m.media_details?.height
    }
  }));
  fs.writeFileSync('media_library.json', JSON.stringify(mediaSummary, null, 2));
  mediaSummary.forEach((m, idx) => {
    console.log(`${idx + 1}. [ID: ${m.id}] ${m.title} -> ${m.source_url}`);
  });
}

getMedia().catch(console.error);
