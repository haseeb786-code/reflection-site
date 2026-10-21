import { getProdAuth } from './prod_auth_helper.js';
import fs from 'fs';

async function deploySnippet197() {
  const auth = await getProdAuth();
  console.log('1. Authenticated to:', auth.siteUrl);

  console.log('2. Fetching fresh edit page for snippet 197...');
  const editPageRes = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-snippet-manager&snippet_id=197`, {
    headers: { 'Cookie': auth.cookies },
    signal: AbortSignal.timeout(20000)
  });
  const editPageHtml = await editPageRes.text();

  const nonceMatch = editPageHtml.match(/name="wpcode-save-snippet-nonce"[^>]*value="([^"]+)"/i);
  if (!nonceMatch) {
    throw new Error('Could not find wpcode-save-snippet-nonce');
  }
  const nonce = nonceMatch[1];
  console.log('✓ Found fresh nonce:', nonce);

  const newCode = fs.readFileSync('snippet_te_hero_ticker_slider_v2.html', 'utf8');

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
    redirect: 'manual',
    signal: AbortSignal.timeout(30000)
  });

  console.log('Save response status:', saveRes.status);

  console.log('4. Verifying snippet 197 on admin...');
  const verifyRes = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-snippet-manager&snippet_id=197`, {
    headers: { 'Cookie': auth.cookies },
    signal: AbortSignal.timeout(45000)
  });
  const verifyHtml = await verifyRes.text();
  const hasTargetText = /we cover the heavy duty cost on every mirror/i.test(verifyHtml);
  console.log('Admin snippet has target text?', hasTargetText);

  if (!hasTargetText) {
    throw new Error('Verification failed: Updated text not found in snippet 197 on admin!');
  }
  console.log('✓ Snippet 197 successfully updated with new marquee wording!');
}

deploySnippet197().catch(err => {
  console.error('DEPLOYMENT FAILED:', err);
  process.exit(1);
});
