import { getProdAuth } from './prod_auth_helper.js';

function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'");
}

async function fixFooter() {
  const auth = await getProdAuth();
  console.log('1. Fetching WPCode settings...');
  const res = await fetch('https://reflectionelite.com/wp-admin/admin.php?page=wpcode-headers-footers', {
    headers: { 'Cookie': auth.cookies }
  });
  const html = await res.text();
  const nonceMatch = html.match(/name="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i)
                  || html.match(/id="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i);
  const nonce = nonceMatch[1];

  const headerMatch = html.match(/<textarea[^>]*id="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  const footerMatch = html.match(/<textarea[^>]*id="ihaf_insert_footer"[^>]*>([\s\S]*?)<\/textarea>/i);

  let currentHeader = decodeHtmlEntities(headerMatch ? headerMatch[1] : '');
  let currentFooter = decodeHtmlEntities(footerMatch ? footerMatch[1] : '');

  console.log('2. Saving properly decoded WPCode settings...');
  const formBody = new URLSearchParams();
  formBody.append('insert-headers-and-footers_nonce', nonce);
  formBody.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-headers-footers');
  formBody.append('ihaf_insert_header', currentHeader);
  formBody.append('ihaf_insert_body', '');
  formBody.append('ihaf_insert_footer', currentFooter);

  const saveRes = await fetch('https://reflectionelite.com/wp-admin/admin.php?page=wpcode-headers-footers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': auth.cookies
    },
    body: formBody.toString(),
    redirect: 'manual'
  });
  console.log('WPCode save status:', saveRes.status);

  console.log('3. Purging Hostinger CDN cache...');
  const cacheRes = await fetch('https://reflectionelite.com/wp-json/hostinger-tools-plugin/v1/clear-cache', {
    method: 'DELETE',
    headers: {
      'Cookie': auth.cookies,
      'X-WP-Nonce': auth.nonce
    }
  });
  console.log('Hostinger cache purge status:', cacheRes.status);
}

fixFooter().catch(err => {
  console.error(err);
  process.exit(1);
});
