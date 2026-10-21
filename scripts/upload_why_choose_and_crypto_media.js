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
  const url1 = await uploadFile('why_choose_craftsmanship.webp', 'image/webp');
  const url2 = await uploadFile('why_choose_materials.webp', 'image/webp');
  const url3 = await uploadFile('why_choose_custom.webp', 'image/webp');
  const url4 = await uploadFile('crypto_accepted_badge.png', 'image/png');

  const result = {
    craftsmanship: url1,
    materials: url2,
    custom: url3,
    crypto: url4
  };
  fs.writeFileSync('why_choose_media_urls.json', JSON.stringify(result, null, 2));
  console.log('Saved media URLs to why_choose_media_urls.json:', result);
}

main().catch(err => {
  console.error('Error uploading:', err);
  process.exit(1);
});
