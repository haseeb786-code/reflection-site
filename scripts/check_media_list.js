import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'process.env.PROD_WP_APP_PASS || "[REDACTED]"';
const auth = { Authorization: 'Basic ' + Buffer.from(WP_USER + ':' + WP_APP_PASS).toString('base64') };

async function checkMedia() {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/media?per_page=50`, { headers: auth });
  const media = await res.json();
  console.log(`Found ${media.length} media items:`);
  media.forEach(m => {
    console.log(`ID: ${m.id} | Slug: ${m.slug} | URL: ${m.source_url}`);
  });
}

checkMedia().catch(console.error);
