import fs from 'fs';
import { getProdAuth } from './prod_auth_helper.js';

async function uploadArchedMirror() {
  const auth = await getProdAuth();
  console.log('1. Authenticated to:', auth.siteUrl);

  const fileBuffer = fs.readFileSync('temp_test_led.png');
  const filename = 'arched-led-contemporary-mirror.png';

  console.log('2. Uploading arched LED mirror image to WordPress media library...');
  const res = await fetch(`${auth.siteUrl}/wp-json/wp/v2/media`, {
    method: 'POST',
    headers: {
      'Cookie': auth.cookies,
      'X-WP-Nonce': auth.nonce,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': 'image/png'
    },
    body: fileBuffer
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Media upload failed (${res.status}): ${errText}`);
  }

  const mediaData = await res.json();
  const url = mediaData.source_url || mediaData.guid?.rendered;
  console.log('✓ Successfully uploaded image!');
  console.log('  Media ID:', mediaData.id);
  console.log('  Media URL:', url);
  console.log('  Dimensions:', mediaData.media_details?.width, 'x', mediaData.media_details?.height);

  // Save info locally
  fs.writeFileSync('scripts/arched_led_mirror_url.json', JSON.stringify({
    id: mediaData.id,
    url: url,
    width: mediaData.media_details?.width,
    height: mediaData.media_details?.height
  }, null, 2));
}

uploadArchedMirror().catch(err => {
  console.error('UPLOAD FAILED:', err);
  process.exit(1);
});
