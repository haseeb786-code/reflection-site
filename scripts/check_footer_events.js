import { getProdAuth } from './prod_auth_helper.js';

async function run() {
  const auth = await getProdAuth();
  const res = await fetch('https://reflectionelite.com/wp-admin/admin.php?page=wpcode-headers-footers', {
    headers: { 'Cookie': auth.cookies }
  });
  const html = await res.text();
  const footerMatch = html.match(/<textarea[^>]*id="ihaf_insert_footer"[^>]*>([\s\S]*?)<\/textarea>/i);
  if (footerMatch) {
    const footer = footerMatch[1];
    console.log('Footer code length:', footer.length);
    // Find all occurrences of 'submit', 'search', 'preventDefault'
    const lines = footer.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('submit') || line.includes('preventDefault') || line.includes('re-search') || line.includes('reSearch')) {
        console.log(`Line ${idx + 1}: ${line}`);
      }
    });
  }
}
run();
