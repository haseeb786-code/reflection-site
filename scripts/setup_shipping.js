import fs from 'fs';

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'process.env.PROD_WP_APP_PASS || "[REDACTED]"';
const authHeader = { Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64')}` };

async function setupShipping() {
  console.log('Setting up India Shipping Zone...');
  
  // 1. Create Zone
  const zoneRes = await fetch(`${WP_URL}/wp-json/wc/v3/shipping/zones`, {
    method: 'POST',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: 'India' })
  });

  const zone = await zoneRes.json();
  console.log('Created Zone:', zone.id, zone.name);

  // 2. Set Zone Location to India (IN)
  await fetch(`${WP_URL}/wp-json/wc/v3/shipping/zones/${zone.id}/locations`, {
    method: 'PUT',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([
      { code: 'IN', type: 'country' }
    ])
  });
  console.log('Set Zone Location: India (IN)');

  // 3. Add Free Shipping method
  const freeRes = await fetch(`${WP_URL}/wp-json/wc/v3/shipping/zones/${zone.id}/methods`, {
    method: 'POST',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      method_id: 'free_shipping',
      enabled: true,
      settings: {
        title: 'Free Insured Glass Delivery (All India)'
      }
    })
  });
  const freeMethod = await freeRes.json();
  console.log('Added Free Shipping Method:', freeMethod.id);

  // 4. Add Flat Rate (Reinforced Wooden Crate Shipping)
  const flatRes = await fetch(`${WP_URL}/wp-json/wc/v3/shipping/zones/${zone.id}/methods`, {
    method: 'POST',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      method_id: 'flat_rate',
      enabled: true,
      settings: {
        title: 'Express Fragile Crated Delivery',
        cost: '500'
      }
    })
  });
  const flatMethod = await flatRes.json();
  console.log('Added Flat Rate Method:', flatMethod.id);
  console.log('Shipping setup complete!');
}

setupShipping().catch(console.error);
