import { getProdAuth } from './prod_auth_helper.js';
import fs from 'fs';

async function createSnippetDirect() {
  const auth = await getProdAuth();
  
  // 1. Get the Add Snippet page to extract nonces and default hidden inputs
  console.log('Fetching WPCode Add Snippet page...');
  const res = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-snippet-manager&custom=1`, {
    headers: { 'Cookie': auth.cookies }
  });
  const html = await res.text();

  const nonceMatch = html.match(/name="wpcode-save-snippet-nonce"[^>]*value="([^"]+)"/);
  if (!nonceMatch) {
    throw new Error('Failed to extract wpcode-save-snippet-nonce');
  }
  const nonce = nonceMatch[1];
  console.log('✓ Found wpcode-save-snippet-nonce:', nonce);

  // Read our snippet code
  const snippetCode = fs.readFileSync('snippet_te_hero_ticker_slider_v2.html', 'utf8');

  // Build form params
  const params = new URLSearchParams();
  params.append('wpcode_snippet_title', 'te-hero-ticker-slider-v2');
  params.append('wpcode_active', '1');
  params.append('wpcode_snippet_type', 'html');
  params.append('wpcode_snippet_code', snippetCode);
  params.append('wpcode_auto_insert', '1');
  params.append('wpcode_auto_insert_location', 'site_wide_footer');
  params.append('wpcode_priority', '10');
  params.append('wpcode-save-snippet-nonce', nonce);
  params.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-snippet-manager&custom=1');

  console.log('Submitting snippet te-hero-ticker-slider-v2...');
  const postRes = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-snippet-manager`, {
    method: 'POST',
    headers: {
      'Cookie': auth.cookies,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString(),
    redirect: 'manual'
  });

  console.log('Post status:', postRes.status);
  const location = postRes.headers.get('location');
  console.log('Redirect location:', location);

  // Verify snippet was created in snippets list
  const listRes = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode`, {
    headers: { 'Cookie': auth.cookies }
  });
  const listHtml = await listRes.text();
  const hasV2 = listHtml.includes('te-hero-ticker-slider-v2');
  console.log('Snippet te-hero-ticker-slider-v2 in snippets list:', hasV2);
}

createSnippetDirect().catch(console.error);
