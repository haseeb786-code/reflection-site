import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

async function checkTheme() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/theme-editor.php', {
    headers: { Cookie: cookieHeader }
  });
  const html = await res.text();
  const themeMatch = html.match(/Theme:\s*<strong>([^<]+)<\/strong>/i) || html.match(/Editing\s*<strong>([^<]+)<\/strong>/i);
  console.log('Active theme:', themeMatch ? themeMatch[1] : 'Unknown');

  // Check if functions.php can be read
  const resFns = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/theme-editor.php?file=functions.php', {
    headers: { Cookie: cookieHeader }
  });
  const htmlFns = await resFns.text();
  const contentMatch = htmlFns.match(/<textarea[^>]*id="newcontent"[^>]*>([\s\S]*?)<\/textarea>/i);
  console.log('functions.php length:', contentMatch ? contentMatch[1].length : 'Not found');
  if (contentMatch) {
    fs.writeFileSync('staging_theme_functions.php', contentMatch[1]);
  }
}

checkTheme().catch(console.error);
