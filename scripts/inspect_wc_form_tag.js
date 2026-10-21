import { getProdAuth } from './prod_auth_helper.js';

async function run() {
  const auth = await getProdAuth();
  const res = await fetch('https://reflectionelite.com/wp-admin/admin.php?page=wc-settings&tab=account', {
    headers: { 'Cookie': auth.cookies }
  });
  const html = await res.text();
  const formMatch = html.match(/<form[^>]*method="post"[^>]*>([\s\S]*?)<\/form>/i);
  if (formMatch) {
    const formOpening = html.match(/<form[^>]*method="post"[^>]*>/i)[0];
    console.log('Form opening:', formOpening);
    
    // Check submit button name
    const submitBtn = html.match(/<button[^>]*type="submit"[^>]*>([\s\S]*?)<\/button>/i)
                   || html.match(/<input[^>]*type="submit"[^>]*>/i);
    console.log('Submit button:', submitBtn ? submitBtn[0] : 'not found');
  }
}
run();
