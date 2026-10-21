import { cookieHeader } from './staging_real_data_helper.js';

async function checkRow1398() {
  const res = await fetch(`https://reflectionelite.ataanalytiq.com/wp-admin/edit.php?post_type=wpr_templates`, {
    headers: { 'Cookie': cookieHeader }
  });
  const html = await res.text();
  const match = html.match(/<tr\s+id="post-1398"[^>]*>([\s\S]*?)<\/tr>/i);
  if (match) {
    console.log('Row 1398 HTML:\n', match[0]);
  } else {
    console.log('Could not find row post-1398');
  }
}

checkRow1398().catch(console.error);
