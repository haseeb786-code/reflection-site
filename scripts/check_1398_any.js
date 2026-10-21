import { getFreshNonce, cookieHeader } from './staging_real_data_helper.js';

async function check1398AnyStatus() {
  const nonce = await getFreshNonce();
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages?status=any&include=1398', {
    headers: { 'Cookie': cookieHeader, 'X-WP-Nonce': nonce }
  });
  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Result:', data);
}

check1398AnyStatus().catch(console.error);
