import { cookieHeader } from './staging_real_data_helper.js';

async function checkPurgeForm() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/admin.php?page=litespeed-toolbox', {
    headers: { 'Cookie': cookieHeader }
  });
  const html = await res.text();
  const forms = [...html.matchAll(/<form[^>]*>([\s\S]*?)<\/form>/gi)].map(m => m[0]);
  console.log(`Found ${forms.length} forms on litespeed-toolbox page.`);
  for (const f of forms) {
    if (f.includes('purge') || f.includes('url')) {
      console.log('Form snippet:', f.slice(0, 400).replace(/\n/g, ' '));
    }
  }
}

checkPurgeForm().catch(console.error);
