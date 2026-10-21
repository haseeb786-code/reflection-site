import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function loadEnv() {
  const envPath = path.join(rootDir, '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
      }
    }
  }
  return env;
}

const env = loadEnv();
const WP_URL = (env.WORDPRESS_URL || env.WP_SITE_URL || 'https://mediumpurple-salamander-731288.hostingersite.com').replace(/\/+$/, '');
const WP_USER = env.WORDPRESS_USER || env.WP_USERNAME || 'admin';
const WP_PASS = (env.WORDPRESS_APP_PASSWORD || env.WP_APPLICATION_PASSWORD || 'oOei QLY7 j1mC Wb6U Gndx qYFg').replace(/\s+/g, '');
const RAZORPAY_KEY_ID = env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag';
const RAZORPAY_KEY_SECRET = env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_1234567890';

const authHeader = {
  Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64')}`
};

async function getGatewaySettings() {
  const res = await fetch(`${WP_URL}/wp-json/wc/v3/payment_gateways/razorpay`, {
    headers: { ...authHeader, 'Accept': 'application/json' }
  });
  if (!res.ok) {
    throw new Error(`Failed to get razorpay gateway: ${res.status} ${await res.text()}`);
  }
  return await res.json();
}

async function updateGatewaySettings(keyId, keySecret) {
  const payload = {
    enabled: true,
    title: 'UPI, Cards, NetBanking',
    description: 'Pay securely using UPI, Credit/Debit Cards, NetBanking, or Wallets.',
    settings: {
      key_id: keyId,
      key_secret: keySecret
    }
  };

  const res = await fetch(`${WP_URL}/wp-json/wc/v3/payment_gateways/razorpay`, {
    method: 'PUT',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`Failed to update razorpay gateway: ${res.status} ${await res.text()}`);
  }

  return await res.json();
}

async function verifyCheckoutPage() {
  // Add product to cart to establish active session
  const addRes = await fetch(`${WP_URL}/?add-to-cart=23`, { redirect: 'manual' });
  let cookies = '';
  if (addRes.headers.getSetCookie) {
    cookies = addRes.headers.getSetCookie().map(c => c.split(';')[0]).join('; ');
  } else if (addRes.headers.get('set-cookie')) {
    cookies = addRes.headers.get('set-cookie').split(';')[0];
  }

  const chkRes = await fetch(`${WP_URL}/checkout/`, {
    headers: { Cookie: cookies }
  });

  if (!chkRes.ok) {
    throw new Error(`Checkout page returned HTTP ${chkRes.status}`);
  }

  const html = await chkRes.text();
  const hasCheckoutJs = html.includes('checkout.razorpay.com/v1/checkout.js');
  const hasBlocksJs = html.includes('razorpay-blocks-integration-js');
  const hasRazorpayGeneral = html.toLowerCase().includes('razorpay');

  return {
    status: chkRes.status,
    url: chkRes.url,
    hasCheckoutJs,
    hasBlocksJs,
    hasRazorpayGeneral
  };
}

async function main() {
  console.log('======================================================================');
  console.log('💳 CONFIGURING & VERIFYING RAZORPAY TEST CREDENTIALS ON HOSTINGER');
  console.log(`   Hostinger URL: ${WP_URL}`);
  console.log(`   Key ID:        ${RAZORPAY_KEY_ID}`);
  console.log('======================================================================\n');

  console.log('Step 1: Inspecting current Razorpay gateway configuration...');
  const current = await getGatewaySettings();
  console.log(`Current status: enabled=${current.enabled}, key_id="${current.settings?.key_id?.value || ''}"`);

  console.log('\nStep 2: Updating Razorpay gateway with test credentials via REST API...');
  const updated = await updateGatewaySettings(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET);
  console.log(`Update result: enabled=${updated.enabled}`);
  console.log(`Key ID set to: "${updated.settings?.key_id?.value}"`);
  console.log(`Key Secret set: ${Boolean(updated.settings?.key_secret?.value)}`);

  console.log('\nStep 3: Verifying Razorpay gateway status via GET...');
  const verified = await getGatewaySettings();
  const keyIdMatch = verified.settings?.key_id?.value === RAZORPAY_KEY_ID;
  const isEnabled = verified.enabled === true;

  if (keyIdMatch && isEnabled) {
    console.log(`[PASS] Razorpay gateway is enabled and key_id matches: ${verified.settings.key_id.value}`);
  } else {
    console.error(`[FAIL] Gateway verification failed: enabled=${isEnabled}, key_id=${verified.settings?.key_id?.value}`);
    process.exit(1);
  }

  console.log('\nStep 4: Verifying Razorpay frontend assets on /checkout/ with active cart...');
  const checkoutResult = await verifyCheckoutPage();
  console.log(` - Checkout Status:  HTTP ${checkoutResult.status} (${checkoutResult.url})`);
  console.log(` - Razorpay JS SDK:  ${checkoutResult.hasCheckoutJs ? '✅ Loaded (checkout.razorpay.com)' : '❌ Missing'}`);
  console.log(` - Blocks Adapter:   ${checkoutResult.hasBlocksJs ? '✅ Loaded (razorpay-blocks-integration-js)' : '❌ Missing'}`);

  if (checkoutResult.hasCheckoutJs && checkoutResult.hasBlocksJs) {
    console.log('\n[PASS] Razorpay frontend modal integration is active on /checkout/!');
  } else {
    console.error('\n[FAIL] Razorpay scripts were not detected on /checkout/');
    process.exit(1);
  }

  console.log('\n======================================================================');
  console.log('✅ RAZORPAY TEST CREDENTIALS REMEDIATION COMPLETE & VERIFIED');
  console.log('======================================================================');
}

main().catch(err => {
  console.error('Fatal configuration error:', err);
  process.exit(1);
});
