import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  const auth = await getProdAuth();
  const res = await fetch(`${auth.siteUrl}/wp-json/wp/v2/pages/68`);
  const page = await res.json();
  const content = page.content.rendered;
  
  // Find where LED is mentioned
  const idx = content.indexOf('LED');
  if (idx !== -1) {
    console.log('--- FOUND SECTION AROUND "LED" ---');
    console.log(content.slice(Math.max(0, idx - 400), idx + 2000));
  } else {
    console.log('"LED" not found in page 68');
  }
}

main().catch(console.error);
