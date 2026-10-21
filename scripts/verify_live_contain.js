import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  const auth = await getProdAuth();
  const res = await fetch(`${auth.siteUrl}/?nocache=${Date.now()}`);
  const html = await res.text();
  console.log('Public HTML has object-fit:contain:', html.includes('object-fit:contain !important'));
  console.log('Public HTML has background:#ffffff:', html.includes('background:#ffffff !important'));
}

main().catch(console.error);
