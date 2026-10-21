import https from 'https';

async function testLoginAndCreateAppPassword() {
  const loginUrl = 'https://mediumpurple-salamander-731288.hostingersite.com/wp-login.php';
  
  // 1. GET login page to get initial cookies
  const res1 = await fetch(loginUrl);
  let cookies = [];
  if (res1.headers.getSetCookie) {
    cookies = res1.headers.getSetCookie();
  } else if (res1.headers.get('set-cookie')) {
    cookies = [res1.headers.get('set-cookie')];
  }

  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  // 2. POST credentials
  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', 'https://mediumpurple-salamander-731288.hostingersite.com/wp-admin/profile.php');
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookieHeader
    },
    body: params.toString(),
    redirect: 'manual'
  });

  console.log('Login POST status:', res2.status);
  const postCookies = res2.headers.getSetCookie ? res2.headers.getSetCookie() : [res2.headers.get('set-cookie')];
  
  // Combine all cookies
  const allCookies = [...cookies, ...postCookies];
  const authCookieHeader = allCookies.map(c => (c ? c.split(';')[0] : '')).filter(Boolean).join('; ');
  console.log('Logged in cookies count:', allCookies.length);

  // 3. GET profile.php to extract the application password nonce
  const res3 = await fetch('https://mediumpurple-salamander-731288.hostingersite.com/wp-admin/profile.php', {
    headers: {
      'Cookie': authCookieHeader
    }
  });

  const profileHtml = await res3.text();
  console.log('Profile page loaded, status:', res3.status, 'HTML length:', profileHtml.length);
  
  // Look for nonce in profileHtml
  // Usually wp_rest nonce or new_application_password nonce:
  // name="_wpnonce" value="..." inside #create-application-password
  const nonceMatch = profileHtml.match(/name="_wpnonce"\s+value="([a-f0-9]+)"/i) || profileHtml.match(/"nonce":"([a-f0-9]+)"/i);
  console.log('Nonce match:', nonceMatch ? nonceMatch[1] : 'none');

  // Let's also check for REST nonce: wpApiSettings = {"root":"...","nonce":"..."}
  const restNonceMatch = profileHtml.match(/"nonce":"([a-f0-9]+)"/i) || profileHtml.match(/wpApiSettings\s*=\s*{[^}]*"nonce":"([a-f0-9]+)"/i);
  console.log('REST Nonce:', restNonceMatch ? restNonceMatch[1] : 'none');

  // Try creating application password via REST API using REST nonce
  if (restNonceMatch) {
    const appPassRes = await fetch('https://mediumpurple-salamander-731288.hostingersite.com/wp-json/wp/v2/users/me/application-passwords', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': authCookieHeader,
        'X-WP-Nonce': restNonceMatch[1]
      },
      body: JSON.stringify({
        name: 'Antigravity Workspace Migration'
      })
    });
    console.log('App Password REST status:', appPassRes.status);
    const appPassData = await appPassRes.json();
    console.log('App Password result:', appPassData);
  }
}

testLoginAndCreateAppPassword().catch(console.error);
