import { getProdAuth } from './prod_auth_helper.js';

async function run() {
  const auth = await getProdAuth();
  const res = await fetch('https://reflectionelite.com/wp-admin/admin.php?page=wc-settings&tab=account', {
    headers: { 'Cookie': auth.cookies }
  });
  const html = await res.text();
  
  // Extract all input/select names inside form
  const inputMatches = [...html.matchAll(/<input[^>]*name="([^"]+)"[^>]*>/gi)];
  console.log('Found form inputs:');
  inputMatches.forEach(m => console.log('  ', m[0]));
}
run();
