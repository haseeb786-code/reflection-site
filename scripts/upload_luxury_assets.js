import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'process.env.PROD_WP_APP_PASS || "[REDACTED]"';
const auth = { Authorization: 'Basic ' + Buffer.from(WP_USER + ':' + WP_APP_PASS).toString('base64') };

async function uploadFile(filePath, filename) {
  const buf = fs.readFileSync(filePath);
  console.log('Uploading', filename, buf.length, 'bytes...');
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/media`, {
    method: 'POST',
    headers: {
      ...auth,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': 'image/jpeg'
    },
    body: buf
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('Failed upload', filename, res.status, err);
    return null;
  }
  const data = await res.json();
  const url = data.source_url || data.guid?.rendered;
  console.log('Uploaded', filename, '->', url);
  return url;
}

async function uploadAll() {
  const existing = JSON.parse(fs.readFileSync('assets/luxury/uploaded_urls.json', 'utf8'));
  existing.collection_venetian = await uploadFile('assets/luxury/collection_venetian.jpg', 'collection-venetian-mirrors.jpg');
  existing.collection_led = await uploadFile('assets/luxury/collection_led.jpg', 'collection-led-contemporary.jpg');
  existing.collection_statement = await uploadFile('assets/luxury/collection_statement.jpg', 'collection-statement-pieces.jpg');
  fs.writeFileSync('assets/luxury/uploaded_urls.json', JSON.stringify(existing, null, 2));
  console.log('Finished uploading collection cards!');
}

uploadAll().catch(console.error);
