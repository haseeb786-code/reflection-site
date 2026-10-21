import https from 'https';
import querystring from 'querystring';

async function auditViaDirectHttp() {
  console.log('=== PERFORMING DIRECT HTTP AUDIT (NO BROWSER / CHALLENGE OVERHEAD) ===\n');

  // 1. Authenticate via direct POST to wp-login.php
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
  console.log('1. Direct Authentication: SUCCESS (Received session cookies)');

  // 2. Fetch and parse wp-admin/plugins.php
  console.log('2. Fetching wp-admin/plugins.php ...');
  const pluginsHtml = await new Promise((resolve, reject) => {
    const req = https.get('https://reflectionelite.ataanalytiq.com/wp-admin/plugins.php', {
      headers: { 'Cookie': cookies }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
  });

  // Extract active plugins from HTML
  const activePluginRegex = /<tr[^>]*class="[^"]*active[^"]*"[^>]*data-plugin="([^"]+)"[\s\S]*?<strong[^>]*>([^<]+)<\/strong>/g;
  let match;
  const activePlugins = [];
  while ((match = activePluginRegex.exec(pluginsHtml)) !== null) {
    activePlugins.push({ file: match[1], name: match[2] });
  }
  console.log(`\n--- ACTIVE PLUGINS (${activePlugins.length} found) ---`);
  activePlugins.forEach(p => console.log(`  * ${p.name} (${p.file})`));

  // 3. Fetch and parse WooCommerce Payment Gateways (wc-settings&tab=checkout)
  console.log('\n3. Fetching WooCommerce Payment Gateways (wc-settings&tab=checkout) ...');
  const checkoutSettingsHtml = await new Promise((resolve, reject) => {
    const req = https.get('https://reflectionelite.ataanalytiq.com/wp-admin/admin.php?page=wc-settings&tab=checkout', {
      headers: { 'Cookie': cookies }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
  });

  // Extract payment gateway rows
  const gatewayRegex = /<tr\s+data-gateway_id="([^"]+)"[\s\S]*?<td class="name[^"]*">[\s\S]*?<a[^>]*>([^<]+)<\/a>[\s\S]*?<span class="woocommerce-input-toggle\s+woocommerce-input-toggle--([^"]+)"/g;
  let gMatch;
  const paymentGateways = [];
  while ((gMatch = gatewayRegex.exec(checkoutSettingsHtml)) !== null) {
    paymentGateways.push({
      id: gMatch[1],
      name: gMatch[2].trim(),
      status: gMatch[3] === 'enabled' ? 'ENABLED' : 'DISABLED'
    });
  }
  console.log(`\n--- WOOCOMMERCE PAYMENT GATEWAYS (${paymentGateways.length} found) ---`);
  paymentGateways.forEach(g => console.log(`  [${g.status}] ${g.name} (ID: ${g.id})`));

  // Check for Razorpay, Crypto/BTC, Partial Payments mentions in settings
  console.log('\n--- PAYMENT & CHECKOUT KEYWORD AUDIT ---');
  console.log('Has Razorpay in settings/plugins:', pluginsHtml.includes('razorpay') || pluginsHtml.includes('Razorpay') || checkoutSettingsHtml.includes('razorpay') || checkoutSettingsHtml.includes('Razorpay'));
  console.log('Has Crypto/Bitcoin/BTC in settings/plugins:', pluginsHtml.includes('crypto') || pluginsHtml.includes('Crypto') || pluginsHtml.includes('bitcoin') || pluginsHtml.includes('Bitcoin') || pluginsHtml.includes('btc') || checkoutSettingsHtml.includes('crypto') || checkoutSettingsHtml.includes('bitcoin'));
  console.log('Has Partial Payment/Deposits in settings/plugins:', pluginsHtml.includes('deposit') || pluginsHtml.includes('Deposit') || pluginsHtml.includes('partial') || pluginsHtml.includes('Partial') || checkoutSettingsHtml.includes('deposit') || checkoutSettingsHtml.includes('partial'));
  console.log('Has Booking/Book Now in settings/plugins:', pluginsHtml.includes('booking') || pluginsHtml.includes('Booking') || pluginsHtml.includes('book-now'));

  // 4. Fetch Products List from wp-admin/edit.php?post_type=product
  console.log('\n4. Fetching Products from wp-admin/edit.php?post_type=product ...');
  const productsHtml = await new Promise((resolve, reject) => {
    const req = https.get('https://reflectionelite.ataanalytiq.com/wp-admin/edit.php?post_type=product', {
      headers: { 'Cookie': cookies }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
  });

  const productRowRegex = /<tr\s+id="post-(\d+)"[\s\S]*?<a class="row-title"[^>]*>([^<]+)<\/a>[\s\S]*?<td class="price[^"]*">([\s\S]*?)<\/td>[\s\S]*?<td class="product_cat[^"]*">([\s\S]*?)<\/td>/g;
  let pMatch;
  const adminProducts = [];
  while ((pMatch = productRowRegex.exec(productsHtml)) !== null) {
    const priceClean = pMatch[3].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const catClean = pMatch[4].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    adminProducts.push({
      id: pMatch[1],
      title: pMatch[2].trim(),
      price: priceClean,
      categories: catClean
    });
  }
  console.log(`\n--- ALL PRODUCTS IN WP-ADMIN (${adminProducts.length} found) ---`);
  adminProducts.forEach(p => console.log(`  #${p.id} | ${p.title} | Price: ${p.price} | Categories: ${p.categories}`));
}

auditViaDirectHttp().catch(console.error);
