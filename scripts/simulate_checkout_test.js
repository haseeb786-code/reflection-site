import fs from 'fs';

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'process.env.PROD_WP_APP_PASS || "[REDACTED]"';
const authHeader = { Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64')}` };

async function testCheckoutOrder() {
  console.log('=== RUNNING LIVE CHECKOUT VERIFICATION ON HOSTINGER ===\n');

  // 1. Fetch Customised Mirror (ID: 23, Price ₹100.00)
  const productRes = await fetch(`${WP_URL}/wp-json/wc/v3/products/23`, { headers: authHeader });
  const product = await productRes.json();
  console.log(`Selected Test Product: "${product.name}" (ID: ${product.id}, Price: ₹${product.price})`);

  // 2. Create Test Order (Cash on Delivery simulation)
  const orderData = {
    payment_method: 'cod',
    payment_method_title: 'Cash on Delivery (COD)',
    set_paid: false,
    billing: {
      first_name: 'Haseeb',
      last_name: 'Testing',
      address_1: 'Elite Mirror Studio, MG Road',
      address_2: 'Suite 404',
      city: 'Mumbai',
      state: 'MH',
      postcode: '400001',
      country: 'IN',
      email: 'orders@reflectionelite.com',
      phone: '+919876543210'
    },
    shipping: {
      first_name: 'Haseeb',
      last_name: 'Testing',
      address_1: 'Elite Mirror Studio, MG Road',
      address_2: 'Suite 404',
      city: 'Mumbai',
      state: 'MH',
      postcode: '400001',
      country: 'IN'
    },
    line_items: [
      {
        product_id: product.id,
        quantity: 1
      }
    ],
    shipping_lines: [
      {
        method_id: 'free_shipping',
        method_title: 'Free Insured Glass Delivery (All India)',
        total: '0.00'
      }
    ]
  };

  console.log('\nSubmitting test order to WooCommerce...');
  const orderRes = await fetch(`${WP_URL}/wp-json/wc/v3/orders`, {
    method: 'POST',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  });

  if (!orderRes.ok) {
    const err = await orderRes.text();
    throw new Error(`Order placement failed: ${orderRes.status} ${err}`);
  }

  const order = await orderRes.json();
  console.log(`\n[✅ SUCCESS] Test Order Placed!`);
  console.log(` - Order ID: #${order.id}`);
  console.log(` - Order Status: ${order.status}`);
  console.log(` - Total: ${order.currency_symbol || '₹'}${order.total} (${order.currency})`);
  console.log(` - Payment Gateway: ${order.payment_method_title}`);
  console.log(` - Customer: ${order.billing.first_name} ${order.billing.last_name} (${order.billing.email})`);
  console.log(` - Shipping: ${order.shipping.city}, ${order.shipping.state} ${order.shipping.postcode}, ${order.shipping.country}`);

  // 3. Verify order exists in WooCommerce Admin orders
  const fetchOrderRes = await fetch(`${WP_URL}/wp-json/wc/v3/orders/${order.id}`, { headers: authHeader });
  const fetchedOrder = await fetchOrderRes.json();
  if (fetchedOrder && fetchedOrder.id === order.id) {
    console.log(`\n[✅ VERIFIED] Order #${order.id} confirmed active in WooCommerce database.`);
  }

  return order;
}

testCheckoutOrder().catch(console.error);
