import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'process.env.PROD_WP_APP_PASS || "[REDACTED]"';
const auth = { 
  Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64')}`,
  'Content-Type': 'application/json' 
};

async function verifyAll() {
  console.log('=== VERIFYING GATEWAYS ===');
  const gwRes = await fetch(`${WP_URL}/wp-json/wc/v3/payment_gateways`, { headers: auth });
  const gws = await gwRes.json();
  const activeGws = gws.filter(g => g.enabled);
  console.log('Active Gateways count:', activeGws.length);
  activeGws.forEach(g => {
    console.log(` - ID: ${g.id} | Title: ${g.title}`);
  });

  console.log('\n=== VERIFYING FRONTEND TEXT ON HOMEPAGE ===');
  const hpRes = await fetch(`${WP_URL}/`);
  const html = await hpRes.text();
  console.log('Contains "Contact Support":', html.includes('Contact Support'));
  console.log('Contains "Concierge Support":', html.includes('Concierge Support'));
  console.log('Contains "Concierge":', html.includes('Concierge'));

  // Extract the exact floating button html
  const btnMatch = html.match(/<a[^>]*class="wa-floating-concierge"[^>]*>([\s\S]*?)<\/a>/i);
  if (btnMatch) {
    console.log('Floating button markup:', btnMatch[0].trim());
  }

  console.log('\n=== VERIFYING CHECKOUT PAGE ===');
  const chkRes = await fetch(`${WP_URL}/checkout/`);
  const chkHtml = await chkRes.text();
  console.log('Checkout page status:', chkRes.status);
  console.log('Checkout has Razorpay title:', chkHtml.includes('Razorpay'));
  console.log('Checkout has COD option:', chkHtml.includes('Cash on Delivery (COD)'));
}

verifyAll().catch(console.error);
