import { cookieHeader } from './staging_real_data_helper.js';

async function checkPurgeOptions() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/admin.php?page=litespeed-toolbox', {
    headers: { 'Cookie': cookieHeader }
  });
  const html = await res.text();
  const purgeLinks = [...html.matchAll(/href="([^"]*LSCWP_CTRL=purge[^"]*)"/gi)].map(m => m[1].replace(/&amp;/g, '&'));
  console.log('Purge links found:');
  purgeLinks.forEach(l => console.log(' -', l));
}

checkPurgeOptions().catch(console.error);
