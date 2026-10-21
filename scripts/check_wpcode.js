import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function checkWPCode() {
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`);
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });
  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');

  const res3 = await fetch(`${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await res3.text();
  const headerMatch = html.match(/<textarea[^>]*id="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  const footerMatch = html.match(/<textarea[^>]*id="ihaf_insert_footer"[^>]*>([\s\S]*?)<\/textarea>/i);
  
  const headerVal = headerMatch ? headerMatch[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&') : '';
  const footerVal = footerMatch ? footerMatch[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&') : '';
  
  console.log('Header length:', headerVal.length);
  console.log('Header has re-cart-drawer:', headerVal.includes('re-cart-drawer'));
  console.log('Footer length:', footerVal.length);
  console.log('Footer has re-cart-drawer:', footerVal.includes('re-cart-drawer'));
  
  fs.writeFileSync('current_live_header.txt', headerVal);
  fs.writeFileSync('current_live_footer.txt', footerVal);
  console.log('Saved current_live_header.txt and current_live_footer.txt');
}

checkWPCode().catch(console.error);
