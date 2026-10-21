import { cookieHeader } from './staging_real_data_helper.js';

async function checkWprOptions() {
  // Let's inspect options via admin
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/admin.php?page=wpr-theme-builder', {
    headers: { 'Cookie': cookieHeader }
  });
  const html = await res.text();
  // Find where 1398 appears in wpr-theme-builder html
  const idx = html.indexOf('1398');
  console.log('1398 in wpr-theme-builder page index:', idx);
  if (idx !== -1) {
    console.log('Snippet around 1398:');
    console.log(html.slice(Math.max(0, idx - 200), idx + 400));
  }
}

checkWprOptions().catch(console.error);
