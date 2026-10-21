const WP_URL = 'https://reflectionelite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'oOei QLY7 j1mC Wb6U Gndx qYFg';
const authHeader = { Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64')}` };

async function listLinks() {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/plugins`, { headers: authHeader });
  const plugins = await res.json();
  for (const p of plugins) {
    console.log(`Plugin: ${p.plugin} | Status: ${p.status} | Self Link: ${p._links?.self?.[0]?.href}`);
  }
}

listLinks().catch(console.error);
