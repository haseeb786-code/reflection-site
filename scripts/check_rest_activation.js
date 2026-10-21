const WP_URL = 'https://reflectionelite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'oOei QLY7 j1mC Wb6U Gndx qYFg';
const authHeader = { Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64')}` };

async function checkRest() {
  const pRes = await fetch(`${WP_URL}/wp-json/wp/v2/plugins/re-gateway-discounts/re-gateway-discounts`, {
    headers: authHeader
  });
  console.log('Get Plugin Status:', pRes.status);
  const pData = await pRes.json();
  console.log('Plugin data:', pData);

  if (pData.status !== 'active') {
    console.log('Attempting POST to activate...');
    const actRes = await fetch(`${WP_URL}/wp-json/wp/v2/plugins/re-gateway-discounts/re-gateway-discounts`, {
      method: 'POST',
      headers: { ...authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'active' })
    });
    console.log('POST Status:', actRes.status);
    const actText = await actRes.text();
    console.log('POST Response Body:\n', actText);
  }
}

checkRest().catch(console.error);
