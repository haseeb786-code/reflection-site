import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function testCartFlow() {
  console.log('1. Starting guest session and adding product 51 (Antique venetian cushion)...');
  const addRes = await fetch(`${WP_URL}/shop/?add-to-cart=51`, {
    redirect: 'manual'
  });
  const cookies = (addRes.headers.getSetCookie ? addRes.headers.getSetCookie() : []).map(c => c.split(';')[0]).join('; ');
  console.log('Received Cookies:', cookies);

  console.log('\n2. Fetching refreshed fragments with session cookies...');
  const fragRes = await fetch(`${WP_URL}/?wc-ajax=get_refreshed_fragments`, {
    method: 'POST',
    headers: { 'Cookie': cookies }
  });
  const fragData = await fragRes.json();
  console.log('Cart Hash:', fragData.cart_hash);
  console.log('widget_shopping_cart_content:\n', fragData.fragments['div.widget_shopping_cart_content']);
  console.log('a.cart-container:\n', fragData.fragments['a.cart-container']);

  console.log('\n3. Fetching /wp-json/wc/store/v1/cart with session cookies...');
  const storeRes = await fetch(`${WP_URL}/wp-json/wc/store/v1/cart`, {
    headers: { 'Cookie': cookies }
  });
  const storeData = await storeRes.json();
  console.log('Store items count:', storeData.items ? storeData.items.length : 0);
  if (storeData.items) {
    storeData.items.forEach(item => {
      console.log(` - ${item.name} x ${item.quantity} = ₹${(parseInt(item.prices.price) / 100).toLocaleString('en-IN')}`);
    });
  }
}

testCartFlow().catch(console.error);
