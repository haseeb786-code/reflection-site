import { getProdAuth } from './prod_auth_helper.js';

async function run() {
  const auth = await getProdAuth();
  const res = await fetch('https://reflectionelite.com/wp-json/wp/v2/pages/9?context=edit', {
    headers: {
      'Cookie': auth.cookies,
      'X-WP-Nonce': auth.nonce
    }
  });
  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Title:', data.title?.raw);
  console.log('Content raw length:', data.content?.raw?.length);
  console.log('Content raw:', data.content?.raw);
}
run();
