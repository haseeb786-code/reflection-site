import { cookieHeader } from './staging_real_data_helper.js';

async function checkHostingerPurge() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/admin.php?page=hostinger', {
    headers: { 'Cookie': cookieHeader }
  });
  const html = await res.text();
  console.log('Hostinger page title:', html.match(/<title>([^<]+)<\/title>/)?.[1]);
  // Look for purge links or buttons
  const purgeMatches = [...html.matchAll(/(purge|clear|flush)/gi)];
  console.log('Purge occurrences in hostinger page:', purgeMatches.length);
  const links = [...html.matchAll(/href="([^"]*purge[^"]*)"/gi)].map(m => m[1]);
  console.log('Hostinger purge links:', links);
  const ajaxActions = [...html.matchAll(/action['"]?\s*:\s*['"]([^'"]*purge[^'"]*)['"]/gi)].map(m => m[1]);
  console.log('Ajax purge actions:', ajaxActions);
}

checkHostingerPurge().catch(console.error);
