import { cookieHeader } from './staging_real_data_helper.js';

async function purgeShopUrl() {
  console.log('Fetching fresh nonce for PURGE_BY...');
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/admin.php?page=litespeed-toolbox', {
    headers: { 'Cookie': cookieHeader }
  });
  const html = await res.text();
  const nonceMatch = html.match(/name="LSCWP_NONCE"\s+value="([^"]+)"/);
  if (!nonceMatch) throw new Error('No LSCWP_NONCE found');
  const nonce = nonceMatch[1];
  console.log('Found nonce:', nonce);

  const params = new URLSearchParams();
  params.append('LSCWP_CTRL', 'PURGE_BY');
  params.append('LSCWP_NONCE', nonce);
  params.append('_wp_http_referer', '/wp-admin/admin.php?page=litespeed-toolbox');
  params.append('purgeby', '3'); // 3 = URL
  params.append('purgebylist', '/shop/\nhttps://reflectionelite.ataanalytiq.com/shop/');

  console.log('Submitting PURGE_BY for /shop/...');
  const postRes = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/admin.php?page=litespeed-toolbox', {
    method: 'POST',
    headers: {
      'Cookie': cookieHeader,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });
  console.log('PURGE_BY response status:', postRes.status);
}

purgeShopUrl().catch(console.error);
