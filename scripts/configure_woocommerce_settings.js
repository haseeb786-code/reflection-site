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

async function updateSetting(group, id, value) {
  const url = `${WP_URL}/wp-json/wc/v3/settings/${group}/${id}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ value })
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`Failed to update ${id}:`, err);
    return;
  }
  const data = await res.json();
  console.log(`Updated ${id} -> ${data.value}`);
}

async function configurePaymentGateway(id, settings) {
  const url = `${WP_URL}/wp-json/wc/v3/payment_gateways/${id}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(settings)
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`Failed to update gateway ${id}:`, err);
    return;
  }
  const data = await res.json();
  console.log(`Updated payment gateway ${id}: enabled=${data.enabled}`);
}

async function run() {
  console.log('Configuring WooCommerce Settings on Hostinger...');
  
  // 1. General settings
  await updateSetting('general', 'woocommerce_currency', 'INR');
  await updateSetting('general', 'woocommerce_default_country', 'IN');
  await updateSetting('general', 'woocommerce_currency_pos', 'left');
  await updateSetting('general', 'woocommerce_price_thousand_sep', ',');
  await updateSetting('general', 'woocommerce_price_decimal_sep', '.');
  await updateSetting('general', 'woocommerce_price_num_decimals', 2);

  // 2. Enable Cash on Delivery
  await configurePaymentGateway('cod', {
    enabled: true,
    title: 'Cash on Delivery (COD)',
    description: 'Pay with cash upon delivery of your handcrafted mirror.'
  });

  // 3. Check Razorpay gateway
  const gatewaysRes = await fetch(`${WP_URL}/wp-json/wc/v3/payment_gateways`, { headers: authHeader });
  const gateways = await gatewaysRes.json();
  console.log('Available payment gateways:');
  gateways.forEach(g => console.log(` - ${g.id} (${g.title}): enabled=${g.enabled}`));

  console.log('WooCommerce Settings Configured Successfully!');
}

run().catch(console.error);
