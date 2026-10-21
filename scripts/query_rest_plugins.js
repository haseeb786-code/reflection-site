import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'oOei QLY7 j1mC Wb6U Gndx qYFg';
const authHeader = { Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64')}` };

async function listPlugins() {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/plugins`, { headers: authHeader });
  console.log('HTTP Status:', res.status);
  const data = await res.json();
  if (Array.isArray(data)) {
    for (const p of data) {
      console.log(`Plugin: ${p.plugin} | Status: ${p.status} | Name: ${p.name}`);
    }
  } else {
    console.log('Response:', data);
  }
}

listPlugins().catch(console.error);
