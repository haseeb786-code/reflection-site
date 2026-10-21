import { cookieHeader } from './staging_real_data_helper.js';

async function purgeEverything() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/admin.php?page=litespeed-toolbox', {
    headers: { 'Cookie': cookieHeader }
  });
  const html = await res.text();
  const purgeLinks = [...html.matchAll(/href="([^"]*LSCWP_CTRL=purge[^"]*)"/gi)].map(m => m[1].replace(/&amp;/g, '&'));
  
  for (const link of purgeLinks) {
    if (link.includes('purge_all') || link.includes('purge_pages') || link.includes('PURGE_EMPTYCACHE')) {
      console.log('Calling purge link:', link);
      const r = await fetch(link, { headers: { 'Cookie': cookieHeader } });
      console.log('Result status:', r.status);
    }
  }
}

purgeEverything().catch(console.error);
