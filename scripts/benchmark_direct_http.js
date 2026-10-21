import https from 'https';
import querystring from 'querystring';

async function testDirectHttp() {
  console.log('=== BENCHMARKING DIRECT HTTP WITHOUT PUPPETEER ===\n');

  // 1. Direct POST to wp-login.php
  const postData = querystring.stringify({
    log: 'reflectionelite',
    pwd: 'process.env.PROD_WP_PASS || ""',
    'wp-submit': 'Log In',
    redirect_to: 'https://reflectionelite.ataanalytiq.com/wp-admin/',
    testcookie: '1'
  });

  const tLoginStart = Date.now();
  const cookies = await new Promise((resolve, reject) => {
    const req = https.request('https://reflectionelite.ataanalytiq.com/wp-login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'Cookie': 'wordpress_test_cookie=WP%20Cookie%20check'
      }
    }, (res) => {
      const duration = Date.now() - tLoginStart;
      console.log(`[1] Direct POST wp-login.php: Status ${res.statusCode} in ${duration}ms (Location: ${res.headers.location})`);
      const setCookies = res.headers['set-cookie'] || [];
      const cookieHeader = setCookies.map(c => c.split(';')[0]).join('; ');
      res.resume();
      resolve(cookieHeader);
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });

  // 2. Direct GET to wp-admin/plugins.php with authenticated session
  const tPluginsStart = Date.now();
  await new Promise((resolve, reject) => {
    const req = https.get('https://reflectionelite.ataanalytiq.com/wp-admin/plugins.php', {
      headers: { 'Cookie': cookies }
    }, (res) => {
      let ttfb = Date.now() - tPluginsStart;
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const total = Date.now() - tPluginsStart;
        console.log(`[2] Direct GET wp-admin/plugins.php: Status ${res.statusCode} | TTFB: ${ttfb}ms | Total: ${total}ms | Length: ${body.length}`);
        console.log(`    Contains plugins table: ${body.includes('id="the-list"')}`);
        resolve();
      });
    });
    req.on('error', reject);
  });

  // 3. Direct GET to WooCommerce Settings Checkout tab
  const tWcStart = Date.now();
  await new Promise((resolve, reject) => {
    const req = https.get('https://reflectionelite.ataanalytiq.com/wp-admin/admin.php?page=wc-settings&tab=checkout', {
      headers: { 'Cookie': cookies }
    }, (res) => {
      let ttfb = Date.now() - tWcStart;
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const total = Date.now() - tWcStart;
        console.log(`[3] Direct GET WooCommerce Checkout Settings: Status ${res.statusCode} | TTFB: ${ttfb}ms | Total: ${total}ms | Length: ${body.length}`);
        resolve();
      });
    });
    req.on('error', reject);
  });

  // 4. Direct GET to live public Homepage
  const tHomeStart = Date.now();
  await new Promise((resolve, reject) => {
    const req = https.get('https://reflectionelite.ataanalytiq.com/', (res) => {
      let ttfb = Date.now() - tHomeStart;
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const total = Date.now() - tHomeStart;
        console.log(`[4] Direct GET Live Homepage: Status ${res.statusCode} | TTFB: ${ttfb}ms | Total: ${total}ms | Length: ${body.length} | Cache: ${res.headers['x-litespeed-cache']}`);
        resolve();
      });
    });
    req.on('error', reject);
  });

  // 5. Direct GET to live public Shop
  const tShopStart = Date.now();
  await new Promise((resolve, reject) => {
    const req = https.get('https://reflectionelite.ataanalytiq.com/shop/', (res) => {
      let ttfb = Date.now() - tShopStart;
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const total = Date.now() - tShopStart;
        console.log(`[5] Direct GET Live Shop: Status ${res.statusCode} | TTFB: ${ttfb}ms | Total: ${total}ms | Length: ${body.length} | Cache: ${res.headers['x-litespeed-cache']}`);
        resolve();
      });
    });
    req.on('error', reject);
  });
}

testDirectHttp().catch(console.error);
