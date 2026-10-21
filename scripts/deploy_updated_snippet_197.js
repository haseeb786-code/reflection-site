import { getProdAuth } from './prod_auth_helper.js';
import fs from 'fs';

async function deploySnippet197() {
  const auth = await getProdAuth();
  console.log('1. Authenticated to:', auth.siteUrl);

  // 1. Fetch current edit page for snippet 197 to get latest nonce
  console.log('2. Fetching fresh edit page for snippet 197...');
  const editPageRes = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-snippet-manager&snippet_id=197`, {
    headers: { 'Cookie': auth.cookies }
  });
  const editPageHtml = await editPageRes.text();

  const nonceMatch = editPageHtml.match(/name="wpcode-save-snippet-nonce"[^>]*value="([^"]+)"/i);
  if (!nonceMatch) {
    throw new Error('Could not find wpcode-save-snippet-nonce');
  }
  const nonce = nonceMatch[1];
  console.log('✓ Found fresh nonce:', nonce);

  // 2. Read new snippet code
  const newCode = fs.readFileSync('snippet_te_hero_ticker_slider_v2.html', 'utf8');

  // 3. Build post form parameters
  const params = new URLSearchParams();
  params.append('wpcode_snippet_title', 'te-hero-ticker-slider-v2');
  params.append('wpcode_active', '1');
  params.append('wpcode_snippet_type', 'html');
  params.append('wpcode_snippet_code', newCode);
  params.append('wpcode_auto_insert', '1');
  params.append('wpcode_auto_insert_location', 'site_wide_footer');
  params.append('wpcode_priority', '10');
  params.append('id', '197');
  params.append('wpcode-save-snippet-nonce', nonce);
  params.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-snippet-manager&snippet_id=197');

  console.log('3. Sending POST update to snippet 197...');
  const saveRes = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-snippet-manager&snippet_id=197`, {
    method: 'POST',
    headers: {
      'Cookie': auth.cookies,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString(),
    redirect: 'manual'
  });

  console.log('Save response status:', saveRes.status);
  const redirectLoc = saveRes.headers.get('location');
  console.log('Redirect location:', redirectLoc);

  // 4. Verify snippet 197 is updated on admin
  console.log('4. Verifying snippet 197 on admin...');
  const verifyRes = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-snippet-manager&snippet_id=197`, {
    headers: { 'Cookie': auth.cookies }
  });
  const verifyHtml = await verifyRes.text();
  const hasTimeless = verifyHtml.includes('WITH TIMELESS LUXURY');
  const hasParagraph = verifyHtml.includes('SANCTUARY OF REFINED BEAUTY');
  console.log('Admin snippet has "WITH TIMELESS LUXURY"?', hasTimeless);
  console.log('Admin snippet has paragraph text?', hasParagraph);

  if (!hasTimeless || !hasParagraph) {
    throw new Error('Verification failed: Updated text not found in snippet 197 on admin!');
  }
  console.log('✓ Snippet 197 verified updated in database!');

  // 5. Purge Hostinger CDN and server cache
  console.log('5. Purging Hostinger CDN & server cache...');
  const purgeRes = await fetch(`${auth.siteUrl}/wp-json/hostinger-tools-plugin/v1/clear-cache`, {
    method: 'DELETE',
    headers: {
      'Cookie': auth.cookies,
      'X-WP-Nonce': auth.nonce
    }
  });
  console.log('✓ Cache purge HTTP status:', purgeRes.status);
}

deploySnippet197().catch(err => {
  console.error('DEPLOYMENT FAILED:', err);
  process.exit(1);
});
