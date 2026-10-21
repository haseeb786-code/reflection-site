import { getProdAuth } from './prod_auth_helper.js';
import fs from 'fs';

async function main() {
  const auth = await getProdAuth();
  
  // Try edit.php?post_type=wpcode
  const res1 = await fetch(`${auth.siteUrl}/wp-admin/edit.php?post_type=wpcode`, {
    headers: { 'Cookie': auth.cookies }
  });
  console.log('edit.php?post_type=wpcode status:', res1.status);
  const html1 = await res1.text();
  fs.writeFileSync('wpcode_list.html', html1);
  const titles1 = [...html1.matchAll(/class="row-title"[^>]*>([^<]+)<\/a>/g)].map(m => m[1]);
  const links1 = [...html1.matchAll(/href="([^"]*snippet_id=\d+[^"]*)"/g)].map(m => m[1]);
  console.log('Snippet titles from edit.php:', titles1);
  console.log('Snippet links from edit.php:', links1);

  // Try admin.php?page=wpcode
  const res2 = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode`, {
    headers: { 'Cookie': auth.cookies }
  });
  console.log('admin.php?page=wpcode status:', res2.status);
  const html2 = await res2.text();
  const titles2 = [...html2.matchAll(/class="row-title"[^>]*>([^<]+)<\/a>/g)].map(m => m[1]);
  const links2 = [...html2.matchAll(/href="([^"]*snippet_id=\d+[^"]*)"/g)].map(m => m[1]);
  console.log('Snippet titles from admin.php?page=wpcode:', titles2);
  console.log('Snippet links from admin.php?page=wpcode:', links2);

  // Check how custom snippets are created
  const res3 = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-snippet-manager&custom=1`, {
    headers: { 'Cookie': auth.cookies }
  });
  console.log('custom snippet form status:', res3.status);
  const html3 = await res3.text();
  fs.writeFileSync('wpcode_new_custom.html', html3);
  console.log('Saved wpcode_new_custom.html');
}

main().catch(console.error);
