import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

async function checkPage() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/52', {
    headers: { Cookie: cookieHeader }
  });
  const data = await res.json();
  const raw = data.content?.raw || data.content?.rendered || '';
  
  // Find all <header tags
  const headerMatches = [...raw.matchAll(/<header[\s\S]*?<\/header>/gi)];
  console.log(`Found ${headerMatches.length} <header> tags in Page 52:`);
  headerMatches.forEach((m, i) => {
    console.log(`\n--- Header ${i + 1} (length ${m[0].length}) ---`);
    console.log(m[0].slice(0, 300));
  });

  // Find all announcement bar occurrences
  const annMatches = [...raw.matchAll(/announcement[\s\S]*?<\/div>/gi)];
  console.log(`\nFound ${annMatches.length} announcement matches`);

  // Check if Gutenberg blocks are used
  console.log('\nHas wp:html block:', raw.includes('<!-- wp:html -->'));
}

checkPage().catch(console.error);
