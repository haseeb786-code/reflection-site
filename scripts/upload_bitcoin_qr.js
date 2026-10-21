import fs from 'fs';
import path from 'path';

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'process.env.PROD_WP_APP_PASS || "[REDACTED]"';
const auth = { Authorization: 'Basic ' + Buffer.from(WP_USER + ':' + WP_APP_PASS).toString('base64') };

const imgPath = 'C:/Users/haseeb/.gemini/antigravity/brain/6cdc1f30-04c8-4252-ab71-b699ef15f04f/.user_uploaded/media_1792143435529_24e4e7a1.jpg';

async function upload() {
  if (!fs.existsSync(imgPath)) {
    console.error('Image file does not exist at:', imgPath);
    return;
  }
  const fileBuffer = fs.readFileSync(imgPath);
  console.log(`Uploading ${fileBuffer.length} bytes to ${WP_URL}/wp-json/wp/v2/media...`);

  const res = await fetch(`${WP_URL}/wp-json/wp/v2/media`, {
    method: 'POST',
    headers: {
      ...auth,
      'Content-Disposition': 'attachment; filename="bitcoin-qr-reflection-elite.jpg"',
      'Content-Type': 'image/jpeg'
    },
    body: fileBuffer
  });

  console.log('Upload status:', res.status);
  const data = await res.json();
  if (res.ok) {
    console.log('Uploaded image URL:', data.source_url || data.guid?.rendered);
    fs.writeFileSync('scripts/uploaded_qr_url.txt', data.source_url || data.guid?.rendered);
  } else {
    console.error('Upload error:', data);
  }
}

upload().catch(console.error);
