import { getProdAuth } from './prod_auth_helper.js';

async function run() {
  const auth = await getProdAuth();
  const res = await fetch('https://reflectionelite.com/wp-admin/admin.php?page=wpcode-snippet-manager', {
    headers: { 'Cookie': auth.cookies }
  });
  const html = await res.text();
  console.log('Snippet manager status:', res.status, 'HTML length:', html.length);
  // Match snippets
  const matches = [...html.matchAll(/class="row-title"[^>]*href="[^"]*snippet_id=(\d+)"[^>]*>([^<]+)/g)];
  for (const m of matches) {
    console.log(`Snippet ID: ${m[1]} - Title: ${m[2]}`);
  }
}
run();
