import fs from 'fs';
import path from 'path';
import { getProdAuth } from './prod_auth_helper.js';

async function uploadFile(filename, mimeType) {
  const filePath = path.resolve(filename);
  const buffer = fs.readFileSync(filePath);
  const auth = await getProdAuth();

  console.log(`Uploading ${filename} to ${auth.siteUrl}...`);
  const res = await fetch(`${auth.siteUrl}/wp-json/wp/v2/media`, {
    method: 'POST',
    headers: {
      'Cookie': auth.cookies,
      'X-WP-Nonce': auth.nonce,
      'Content-Disposition': `attachment; filename="${path.basename(filename)}"`,
      'Content-Type': mimeType
    },
    body: buffer
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Upload failed for ${filename}: HTTP ${res.status} - ${txt}`);
  }

  const data = await res.json();
  const url = data.source_url || data.guid?.rendered;
  console.log(`Uploaded ${filename} -> ${url}`);
  return url;
}

async function main() {
  const url = await uploadFile('luxury_discount_mirror.png', 'image/png');
  fs.writeFileSync('discount_mirror_media_url.json', JSON.stringify({ url }, null, 2));
  console.log('Saved media URL to discount_mirror_media_url.json:', url);
}

main().catch(err => {
  console.error('Error uploading:', err);
  process.exit(1);
});
