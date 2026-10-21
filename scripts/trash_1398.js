import { cookieHeader } from './staging_real_data_helper.js';

async function testTrash1398() {
  console.log('Fetching fresh trash link for post 1398...');
  const res = await fetch(`https://reflectionelite.ataanalytiq.com/wp-admin/edit.php?post_type=wpr_templates`, {
    headers: { 'Cookie': cookieHeader }
  });
  const html = await res.text();
  const match = html.match(/href="([^"]*post\.php\?post=1398&amp;action=trash[^"]*)"/i);
  if (!match) {
    console.log('No trash link found for 1398');
    return;
  }
  const trashUrl = match[1].replace(/&amp;/g, '&');
  console.log('Trash URL:', trashUrl);
  const trashRes = await fetch(trashUrl, {
    headers: { 'Cookie': cookieHeader }
  });
  console.log('Trash request status:', trashRes.status);
}

testTrash1398().catch(console.error);
