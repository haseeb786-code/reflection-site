import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

async function checkToolbox() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/admin.php?page=litespeed-toolbox', {
    headers: { 'Cookie': cookieHeader }
  });
  console.log('Toolbox status:', res.status);
  const html = await res.text();
  fs.writeFileSync('litespeed_toolbox.html', html);
  const purgeLinks = [...html.matchAll(/href="([^"]*(?:purge|clean|litespeed)[^"]*)"/gi)].map(m => m[1]);
  console.log('Purge links in toolbox:', purgeLinks);
}

checkToolbox().catch(console.error);
