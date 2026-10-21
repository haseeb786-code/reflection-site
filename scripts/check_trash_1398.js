import { cookieHeader } from './staging_real_data_helper.js';

async function checkTrash() {
  const res = await fetch(`https://reflectionelite.ataanalytiq.com/wp-admin/edit.php?post_type=wpr_templates&post_status=trash`, {
    headers: { 'Cookie': cookieHeader }
  });
  const html = await res.text();
  console.log('Is 1398 in trash?', html.includes('post-1398'));
}

checkTrash().catch(console.error);
