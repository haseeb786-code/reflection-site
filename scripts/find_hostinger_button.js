import { cookieHeader } from './staging_real_data_helper.js';

async function findPurgeButton() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/admin.php?page=hostinger', {
    headers: { 'Cookie': cookieHeader }
  });
  const html = await res.text();
  const matches = [...html.matchAll(/.{0,50}(purge|flush|clear).{0,50}/gi)].map(m => m[0].trim());
  console.log('Matches:', matches.slice(0, 15));
}

findPurgeButton().catch(console.error);
