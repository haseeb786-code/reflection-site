import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'process.env.PROD_WP_APP_PASS || "[REDACTED]"';
const authHeader = { Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64')}` };

async function deployBitcoinPlugin() {
  console.log('=== 1. LOGGING IN TO WORDPRESS ADMIN ===');
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/plugin-install.php?tab=upload`);
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');
  console.log('Login successful! Fetching upload nonce...');

  const pageRes = await fetch(`${WP_URL}/wp-admin/plugin-install.php?tab=upload`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await pageRes.text();
  const nonceMatch = html.match(/name="_wpnonce"\s+value="([a-f0-9]+)"/i);
  if (!nonceMatch) {
    throw new Error('Could not find upload nonce');
  }
  const uploadNonce = nonceMatch[1];
  console.log('Found Upload Nonce:', uploadNonce);

  console.log('=== 2. UPLOADING PLUGIN ZIP ===');
  const zipPath = path.join(rootDir, 'reflection-elite-bitcoin.zip');
  const zipBuffer = fs.readFileSync(zipPath);
  console.log(`Uploading ${zipPath} (${zipBuffer.length} bytes)...`);

  const formData = new FormData();
  formData.append('_wpnonce', uploadNonce);
  formData.append('_wp_http_referer', '/wp-admin/plugin-install.php?tab=upload');
  formData.append('pluginzip', new Blob([zipBuffer], { type: 'application/zip' }), 'reflection-elite-bitcoin.zip');
  formData.append('install-plugin-submit', 'Install Now');

  const uploadRes = await fetch(`${WP_URL}/wp-admin/update.php?action=upload-plugin`, {
    method: 'POST',
    headers: { 'Cookie': allCookies },
    body: formData
  });

  const uploadHtml = await uploadRes.text();
  console.log('Upload response received (length: ' + uploadHtml.length + ')');

  // Look for activation link:
  const actMatch = uploadHtml.match(/href="([^"]*action=activate[^"]*plugin=reflection-elite-bitcoin[^"]*)"/i) ||
                   uploadHtml.match(/href="([^"]*action=activate[^"]*)"/i);

  if (actMatch) {
    const rawUrl = actMatch[1].replace(/&amp;/g, '&');
    const actUrl = rawUrl.startsWith('http') ? rawUrl : `${WP_URL}/wp-admin/${rawUrl}`;
    console.log('Activating plugin via upload response link:', actUrl);
    const actRes = await fetch(actUrl, { headers: { 'Cookie': allCookies } });
    console.log('Activation Status:', actRes.status);
  }

  // Fallback: Check REST API plugins endpoint to activate if inactive
  console.log('=== 3. CHECKING & ACTIVATING VIA REST API ===');
  const pluginsRes = await fetch(`${WP_URL}/wp-json/wp/v2/plugins`, { headers: authHeader });
  const plugins = await pluginsRes.json();
  const btcPlugin = plugins.find(p => p.plugin.includes('bitcoin'));
  if (btcPlugin) {
    console.log(`Found plugin: ${btcPlugin.plugin} (Status: ${btcPlugin.status})`);
    if (btcPlugin.status !== 'active') {
      console.log('Activating via REST API...');
      const activateRes = await fetch(`${WP_URL}/wp-json/wp/v2/plugins/${encodeURIComponent(btcPlugin.plugin)}`, {
        method: 'POST',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' })
      });
      const activateData = await activateRes.json();
      console.log('REST API activation result:', activateData.status);
    }
  } else {
    console.log('Plugin not found in wp/v2/plugins, checking plugins.php...');
  }

  // Verify through WooCommerce REST API
  console.log('\n=== 4. VERIFYING BITCOIN GATEWAY IN WOOCOMMERCE ===');
  const gwRes = await fetch(`${WP_URL}/wp-json/wc/v3/payment_gateways`, { headers: authHeader });
  const gateways = await gwRes.json();
  let btcGateway = null;
  for (const g of gateways) {
    console.log(` - [${g.enabled ? 'ENABLED' : 'DISABLED'}] ID: ${g.id} | Title: ${g.title}`);
    if (g.id === 're_bitcoin') {
      btcGateway = g;
    }
  }

  if (btcGateway) {
    console.log('\n[SUCCESS] Bitcoin Gateway is registered in WooCommerce!');
    if (!btcGateway.enabled) {
      console.log('Enabling re_bitcoin gateway via REST API...');
      const enableRes = await fetch(`${WP_URL}/wp-json/wc/v3/payment_gateways/re_bitcoin`, {
        method: 'PUT',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled: true,
          settings: {
            enabled: 'yes',
            btc_address: 'bc1q2thh6pmgxlwzjhmh4k4e5tdsz8hwqdwqe40xwg',
            qr_code_url: 'https://mediumpurple-salamander-731288.hostingersite.com/wp-content/uploads/2026/10/bitcoin-qr-reflection-elite.jpg'
          }
        })
      });
      const enableData = await enableRes.json();
      console.log('re_bitcoin gateway enabled status:', enableData.enabled);
    }
  } else {
    console.error('\n[WARNING] re_bitcoin gateway was not found in gateways list.');
  }
}

deployBitcoinPlugin().catch(console.error);
