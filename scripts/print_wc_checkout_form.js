import https from 'https';
import querystring from 'querystring';

async function printForm() {
  const postData = querystring.stringify({
    log: 'reflectionelite',
    pwd: 'process.env.PROD_WP_PASS || ""',
    'wp-submit': 'Log In',
    redirect_to: 'https://reflectionelite.ataanalytiq.com/wp-admin/',
    testcookie: '1'
  });

  const cookies = await new Promise((resolve, reject) => {
    const req = https.request('https://reflectionelite.ataanalytiq.com/wp-login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'Cookie': 'wordpress_test_cookie=WP%20Cookie%20check'
      }
    }, res => {
      const setCookies = res.headers['set-cookie'] || [];
      const cookieHeader = setCookies.map(c => c.split(';')[0]).join('; ');
      res.resume();
      resolve(cookieHeader);
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });

  const html = await new Promise((resolve, reject) => {
    const req = https.get('https://reflectionelite.ataanalytiq.com/wp-admin/admin.php?page=wc-settings&tab=checkout', {
      headers: { 'Cookie': cookies }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => resolve(b));
    });
    req.on('error', reject);
  });

  const idx = html.indexOf('<form');
  if (idx !== -1) {
    const formSnippet = html.slice(idx, idx + 2500);
    console.log('Form snippet:');
    console.log(formSnippet.replace(/<[^>]+>/g, '\n').replace(/\n\s*\n/g, '\n').slice(0, 1500));
  } else {
    console.log('No form found');
  }
}

printForm().catch(console.error);
