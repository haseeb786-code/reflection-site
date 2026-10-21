import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

async function check() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages?per_page=100', {
    headers: { 'Cookie': cookieHeader }
  });
  const pages = await res.json();
  console.log(`Total Pages: ${pages.length}`);
  pages.forEach(p => {
    console.log(`ID: ${p.id} | Slug: ${p.slug.padEnd(25)} | Status: ${p.status.padEnd(8)} | Title: ${p.title.rendered}`);
  });
}
check().catch(console.error);
