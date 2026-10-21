import https from 'https';
import querystring from 'querystring';

async function queryGateways() {
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

  // Fetch wp-admin to extract fresh nonce
  const adminHtml = await new Promise((resolve, reject) => {
    const req = https.get('https://reflectionelite.ataanalytiq.com/wp-admin/', {
      headers: { 'Cookie': cookies }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => resolve(b));
    });
    req.on('error', reject);
  });

  const nonceMatch = adminHtml.match(/"nonce":"([a-f0-9]+)"/) || adminHtml.match(/wpApiSettings\s*=\s*\{[^}]*"nonce":"([a-f0-9]+)"/);
  const freshNonce = nonceMatch ? nonceMatch[1] : null;
  console.log('Fresh Nonce extracted from wp-admin:', freshNonce);

  // Query /wp-json/wc/v3/payment_gateways with fresh nonce
  const res = await new Promise((resolve, reject) => {
    const req = https.get('https://reflectionelite.ataanalytiq.com/wp-json/wc/v3/payment_gateways', {
      headers: {
        'Cookie': cookies,
        'X-WP-Nonce': freshNonce
      }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => resolve({ status: res.statusCode, body: b }));
    });
    req.on('error', reject);
  });

  console.log('Payment Gateways REST status:', res.status);
  try {
    const data = JSON.parse(res.body);
    if (Array.isArray(data)) {
      console.log(`Payment Gateways count: ${data.length}`);
      data.forEach(g => {
        console.log(`- ID: ${g.id} | Title: "${g.title}" | Enabled: ${g.enabled} | Method Title: "${g.method_title}"`);
      });
    } else {
      console.log('Response:', data);
    }
  } catch(e) {
    console.log('Body snippet:', res.body.slice(0, 300));
  }
}

queryGateways().catch(console.error);
