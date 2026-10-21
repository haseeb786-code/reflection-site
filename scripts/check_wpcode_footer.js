import { getProdAuth } from './prod_auth_helper.js';

async function run() {
  const auth = await getProdAuth();
  const res = await fetch('https://reflectionelite.com/wp-admin/admin.php?page=wpcode-headers-footers', {
    headers: { 'Cookie': auth.cookies }
  });
  const html = await res.text();
  const footerMatch = html.match(/<textarea[^>]*id="ihaf_insert_footer"[^>]*>([\s\S]*?)<\/textarea>/i);
  console.log('Has re-live-instant-search-engine:', footerMatch ? footerMatch[1].includes('re-live-instant-search-engine') : false);
  if (footerMatch) {
    console.log('Footer length:', footerMatch[1].length);
    console.log('Footer end:', footerMatch[1].substring(footerMatch[1].length - 400));
  }
}
run();
