import { cookieHeader } from './staging_real_data_helper.js';

async function printPurgeByForm() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/admin.php?page=litespeed-toolbox', {
    headers: { 'Cookie': cookieHeader }
  });
  const html = await res.text();
  const match = html.match(/<form[^>]*action="[^"]*litespeed-toolbox"[^>]*>([\s\S]*?)<\/form>/i);
  if (match) {
    console.log('PURGE_BY Form:\n', match[0]);
  }
}

printPurgeByForm().catch(console.error);
