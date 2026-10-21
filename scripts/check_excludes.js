import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

async function checkExcludes() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/admin.php?page=litespeed-cache', {
    headers: { 'Cookie': cookieHeader }
  });
  const html = await res.text();
  fs.writeFileSync('litespeed_settings.html', html);
  console.log('Saved litespeed_settings.html, length:', html.length);
  const nonce = html.match(/name="_wpnonce"\s+value="([a-f0-9]+)"/);
  console.log('Nonce:', nonce ? nonce[1] : 'none');
}

checkExcludes().catch(console.error);
