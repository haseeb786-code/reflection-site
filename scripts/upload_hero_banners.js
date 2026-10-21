import fs from 'fs';
import path from 'path';
import { getProdAuth } from './prod_auth_helper.js';

const brainDir = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\de9ea39a-cece-46b8-8bfb-32a9c75ec2c5';

async function uploadImageWithRetry(filename, retries = 3) {
  const filePath = path.join(brainDir, filename);
  const buffer = fs.readFileSync(filePath);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Authenticating and uploading ${filename}...`);
      const auth = await getProdAuth();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);

      const res = await fetch(`${auth.siteUrl}/wp-json/wp/v2/media`, {
        method: 'POST',
        headers: {
          'Cookie': auth.cookies,
          'X-WP-Nonce': auth.nonce,
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Type': 'image/jpeg'
        },
        body: buffer,
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`HTTP ${res.status}: ${err}`);
      }

      const data = await res.json();
      const url = data.source_url || data.guid?.rendered;
      console.log(`✓ Uploaded ${filename} -> ${url}`);
      return url;
    } catch (err) {
      console.warn(`Attempt ${attempt} failed: ${err.message}`);
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 4000));
    }
  }
}

async function run() {
  const url1 = 'https://reflectionelite.com/wp-content/uploads/2026/10/banner_round_mirror.jpg';
  const url2 = await uploadImageWithRetry('banner_standing_mirror.jpg');

  const urls = { banner1: url1, banner2: url2 };
  fs.writeFileSync('scripts/hero_banner_urls.json', JSON.stringify(urls, null, 2));
  console.log('SUCCESS! Saved both URLs to scripts/hero_banner_urls.json:', urls);
}

run().catch(console.error);
