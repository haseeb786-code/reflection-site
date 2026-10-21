import fs from 'fs';

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';

async function cleanup() {
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });
  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');

  const listRes = await fetch(`${WP_URL}/wp-admin/plugins.php`, { headers: { Cookie: allCookies } });
  const listHtml = await listRes.text();
  
  const delMatch = listHtml.match(/href="([^"]*action=delete-selected[^"]*bitcoin[^"]*)"/i);
  if (delMatch) {
    const rawUrl = delMatch[1].replaceAll('&amp;', '&');
    const delUrl = rawUrl.startsWith('http') ? rawUrl : `${WP_URL}/wp-admin/${rawUrl}`;
    console.log('Navigating to delete confirmation:', delUrl);
    
    // First GET to get delete-action nonce
    const confRes = await fetch(delUrl, { headers: { Cookie: allCookies } });
    const confHtml = await confRes.text();
    
    const confNonceMatch = confHtml.match(/name="_wpnonce"\s+value="([a-f0-9]+)"/i);
    if (confNonceMatch) {
      const confNonce = confNonceMatch[1];
      console.log('Delete confirm nonce:', confNonce);
      const postDel = new URLSearchParams();
      postDel.append('_wpnonce', confNonce);
      postDel.append('action', 'delete-selected');
      postDel.append('verify-delete', '1');
      postDel.append('checked[]', 'reflection-elite-bitcoin/reflection-elite-bitcoin/reflection-elite-bitcoin.php');
      
      const doDelRes = await fetch(`${WP_URL}/wp-admin/plugins.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Cookie: allCookies },
        body: postDel.toString()
      });
      console.log('Delete executed, status:', doDelRes.status);
    }
  } else {
    console.log('No delete link found.');
  }
}

cleanup().catch(console.error);
