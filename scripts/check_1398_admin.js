import { cookieHeader } from './staging_real_data_helper.js';

async function checkPost1398Admin() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/post.php?post=1398&action=edit', {
    headers: { 'Cookie': cookieHeader }
  });
  const html = await res.text();
  const title = html.match(/<title>([^<]+)<\/title>/i);
  console.log('Admin Title:', title ? title[1] : 'none');
  const postType = html.match(/name="post_type"\s+value="([^"]+)"/i) || html.match(/post_type=([^&"'\s]+)/i);
  console.log('Post Type:', postType ? postType[1] : 'none');
  const postTitle = html.match(/id="title"\s+value="([^"]+)"/i);
  console.log('Post Title Value:', postTitle ? postTitle[1] : 'none');
}

checkPost1398Admin().catch(console.error);
