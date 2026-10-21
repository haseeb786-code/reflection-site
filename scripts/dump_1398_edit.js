import { cookieHeader } from './staging_real_data_helper.js';
import fs from 'fs';

async function dumpPost1398Edit() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/post.php?post=1398&action=edit', {
    headers: { 'Cookie': cookieHeader }
  });
  const html = await res.text();
  fs.writeFileSync('post_1398_edit.html', html, 'utf8');
  console.log('Saved post 1398 edit html. Length:', html.length);
  // find post_ID, post_type, etc.
  const postId = html.match(/name="post_ID"\s+value="([^"]+)"/i);
  const postType = html.match(/name="post_type"\s+value="([^"]+)"/i);
  const hiddenInputs = [...html.matchAll(/<input\s+type="hidden"\s+name="([^"]+)"\s+value="([^"]*)"/gi)].map(m => `${m[1]}=${m[2]}`);
  console.log('Hidden inputs:', hiddenInputs.slice(0, 15));
}

dumpPost1398Edit().catch(console.error);
