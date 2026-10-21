import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => c.name + '=' + c.value).join('; ');

async function getInfo() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/plugins.php', {
    headers: { Cookie: cookieHeader }
  });
  const html = await res.text();
  const pluginMatches = [...html.matchAll(/data-plugin="([^"]+)"/g)].map(m => m[1]);
  console.log('Installed plugins on staging:');
  console.log(pluginMatches);

  // Check active theme
  const resTheme = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/themes.php', {
    headers: { Cookie: cookieHeader }
  });
  const htmlTheme = await resTheme.text();
  const themeMatch = htmlTheme.match(/class="theme active"[^>]*data-slug="([^"]+)"/);
  console.log('Active theme on staging:', themeMatch ? themeMatch[1] : 'Unknown');

  // Check custom plugin reflection-elite
  const resMu = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/plugins.php?plugin_status=mustuse', {
    headers: { Cookie: cookieHeader }
  });
  console.log('MU plugins status:', resMu.status);
}

getInfo().catch(console.error);
