import { cookieHeader } from './staging_real_data_helper.js';

async function trash1398Direct() {
  const res1 = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/edit.php?post_type=wpr_templates', {
    headers: { 'Cookie': cookieHeader }
  });
  const html = await res1.text();
  const match = html.match(/post\.php\?post=1398&amp;action=trash&amp;_wpnonce=([a-f0-9]+)/);
  if (!match) {
    console.log('No trash nonce found. Is 1398 in table?', html.includes('post-1398'));
    return;
  }
  const nonce = match[1];
  console.log('Found trash nonce:', nonce);
  const trashUrl = `https://reflectionelite.ataanalytiq.com/wp-admin/post.php?post=1398&action=trash&_wpnonce=${nonce}`;
  const res2 = await fetch(trashUrl, {
    headers: { 'Cookie': cookieHeader },
    redirect: 'manual'
  });
  console.log('Trash response status:', res2.status, 'Location:', res2.headers.get('location'));
}

trash1398Direct().catch(console.error);
