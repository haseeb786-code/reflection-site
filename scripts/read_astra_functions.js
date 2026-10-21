import { getProdAuth } from './prod_auth_helper.js';

async function run() {
  const auth = await getProdAuth();
  const res = await fetch('https://reflectionelite.com/wp-admin/theme-editor.php?file=functions.php&theme=astra', {
    headers: { 'Cookie': auth.cookies }
  });
  const html = await res.text();
  const match = html.match(/<textarea[^>]*id="newcontent"[^>]*>([\s\S]*?)<\/textarea>/i);
  if (match) {
    console.log('functions.php content:\n', match[1]);
  } else {
    console.log('Not found, html length:', html.length);
  }
}
run();
