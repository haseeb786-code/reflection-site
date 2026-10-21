import https from 'https';
import querystring from 'querystring';

async function inspectWc() {
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

  // Fetch wc-settings
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

  console.log('HTML length:', html.length);
  
  // Find nav-tab links
  const navTabs = html.match(/<a[^>]*class="[^"]*nav-tab[^"]*"[^>]*>[\s\S]*?<\/a>/g);
  if (navTabs) {
    navTabs.forEach(t => console.log('Tab link:', t));
  }

  // Look for sections or payment links
  const links = html.match(/href="([^"]*tab=checkout[^"]*)"/g);
  console.log('Checkout links found:', links);

  // Check what payment methods are mentioned
  const methods = ['razorpay', 'bacs', 'cheque', 'cod', 'stripe', 'paypal', 'crypto', 'bitcoin', 'btc'];
  methods.forEach(m => {
    const regex = new RegExp(m, 'gi');
    const count = (html.match(regex) || []).length;
    console.log(`Keyword "${m}": ${count} occurrences`);
  });
}

inspectWc().catch(console.error);
