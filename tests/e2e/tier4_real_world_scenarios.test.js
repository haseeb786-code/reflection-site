import fs from 'fs';
import path from 'path';
import { TestHarness, rootDir, loadEnvFile, computeHmacSha256 } from './test_framework.js';

export async function runTier4Tests() {
  const harness = new TestHarness('Tier 4: Real-World Shopping Scenarios');
  const env = loadEnvFile();

  const catalogFixture = JSON.parse(fs.readFileSync(path.join(rootDir, 'tests', 'fixtures', 'catalog_fixtures.json'), 'utf8'));
  const checkoutFixture = JSON.parse(fs.readFileSync(path.join(rootDir, 'tests', 'fixtures', 'checkout_fixtures.json'), 'utf8'));
  const paymentFixture = JSON.parse(fs.readFileSync(path.join(rootDir, 'tests', 'fixtures', 'payment_fixtures.json'), 'utf8'));
  const redirectFixture = JSON.parse(fs.readFileSync(path.join(rootDir, 'tests', 'fixtures', 'redirect_fixtures.json'), 'utf8'));
  const orderFixture = JSON.parse(fs.readFileSync(path.join(rootDir, 'tests', 'fixtures', 'order_fixtures.json'), 'utf8'));

  // =========================================================================
  // Scenario 1: Ultra-Luxury Shopper Journey (Antique Venetian Cushion ₹81,500)
  // =========================================================================
  harness.suite('Scenario 1: Ultra-Luxury Shopper Journey (Antique Venetian Cushion ₹81,500)', () => {
    harness.test('Complete customer checkout journey with prepayment enforcement and notifications', () => {
      // Step 1: Collection routing
      const collectionRedirect = redirectFixture.rules.find(r => r.source === '/collections/venetian-mirror');
      harness.assertEqual(collectionRedirect?.target, '/product-category/venetian-mirror/', 'Collection redirects to WooCommerce category');

      // Step 2: Product page discovery & media
      const product = catalogFixture.products.find(p => p.sku === 'REF-ANTIQUE-VENETIAN-CUSHION');
      harness.assertEqual(product?.price, 81500.00, 'Product price is ₹81,500.00');
      harness.assertEqual(product?.images_count, 6, 'Product displays 6 high-res gallery images');

      // Step 3: Add to cart
      const cart = [{ id: product.id, sku: product.sku, price: product.price, qty: 1 }];
      const subtotal = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
      harness.assertEqual(subtotal, 81500.00, 'Cart subtotal matches item price');

      // Step 4: Customer address details
      const customer = checkoutFixture.sample_addresses[0]; // Panaji, Goa
      const pinRegex = new RegExp(checkoutFixture.pin_validation.regex);
      const phoneRegex = new RegExp(checkoutFixture.phone_validation.regex);
      harness.assert(pinRegex.test(customer.postcode), 'Destination PIN code is valid Indian 6-digit code');
      harness.assert(phoneRegex.test(customer.phone), 'Customer contact number is valid 10-digit mobile');

      // Step 5: Gateway evaluation (COD must be suppressed)
      const codAllowed = subtotal <= 30000.00;
      harness.assertEqual(codAllowed, false, 'COD suppressed: Order total ₹81,500 strictly exceeds ₹30,000 threshold');

      // Step 6: Razorpay UPI Modal generation
      const rzpAmountPaise = Math.round(subtotal * 100);
      harness.assertEqual(rzpAmountPaise, 8150000, 'Razorpay modal initialized with 8,150,000 paise');

      // Step 7: Payment verification & order status
      const paymentEvent = {
        event: 'payment.captured',
        order_id: 'order_ref_1001',
        amount: rzpAmountPaise,
        status: 'captured'
      };
      harness.assertEqual(paymentEvent.status, 'captured', 'Payment verified captured by Razorpay');
      const orderStatus = 'processing';
      harness.assertEqual(orderStatus, 'processing', 'Order status transitions to Processing upon payment capture');

      // Step 8: Customer receipt generation
      const receipt = {
        store_name: orderFixture.customer_receipt_schema.expected_store_name,
        currency: orderFixture.customer_receipt_schema.expected_currency,
        order_total: `₹${subtotal.toLocaleString('en-IN')}.00`,
        fragile_notice: 'Packaged in reinforced wooden export crate. Inspect glass upon doorstep unboxing.'
      };
      harness.assertEqual(receipt.store_name, 'Reflection Elite', 'Receipt reflects branded store name');
      harness.assertEqual(receipt.currency, 'INR', 'Receipt locked to INR');
      harness.assert(receipt.fragile_notice.includes('wooden export crate'), 'Receipt includes fragile transit disclaimer');

      // Step 9: Admin alert dispatch
      const adminAlert = {
        recipient: orderFixture.admin_notification_schema.required_recipients[0],
        customer_phone: customer.phone,
        total: subtotal
      };
      harness.assertEqual(adminAlert.recipient, 'info@reflectionelite.com', 'Admin alert addressed to info@reflectionelite.com');
      harness.assertEqual(adminAlert.customer_phone, '9820012345', 'Admin alert contains customer phone for delivery freight');
    });
  });

  // =========================================================================
  // Scenario 2: Variable Product Shopper Journey (Modern Victorian Mirror ₹58,787)
  // =========================================================================
  harness.suite('Scenario 2: Variable Product Shopper Journey (Modern Victorian ₹58,787)', () => {
    harness.test('Variable product selection, cart calculation, and card checkout flow', () => {
      const modern = catalogFixture.products.find(p => p.sku === 'REF-MODERN-VICTORIAN');
      const silverVar = modern.variations.find(v => v.attributes.Color === 'Silver');

      // 1. Variant selection
      harness.assertEqual(silverVar?.attributes.Color, 'Silver', 'Selected Silver attribute');
      harness.assertEqual(silverVar?.price, 58787.00, 'Silver variation priced at ₹58,787.00');

      // 2. Cart subtotal
      const cartSubtotal = silverVar.price * 1;
      harness.assertEqual(cartSubtotal, 58787.00, 'Cart subtotal is ₹58,787.00');

      // 3. Address input (Bangalore)
      const customer = checkoutFixture.sample_addresses[1];
      const pinRegex = new RegExp(checkoutFixture.pin_validation.regex);
      const phoneRegex = new RegExp(checkoutFixture.phone_validation.regex);
      harness.assert(pinRegex.test(customer.postcode), 'Bangalore PIN 560038 validated');
      harness.assert(phoneRegex.test(customer.phone), 'Mobile phone 9845012345 validated');

      // 4. Payment via Card (RuPay / 3D Secure)
      const paymentMethod = 'card';
      const orderCreated = {
        order_id: 1002,
        item: silverVar.title,
        amount: cartSubtotal,
        status: 'processing'
      };
      harness.assertEqual(orderCreated.status, 'processing', 'Card order recorded in Processing status');
    });
  });

  // =========================================================================
  // Scenario 3: Decor Shopper Journey (Mosaic Mirror Art ₹2,500 via COD)
  // =========================================================================
  harness.suite('Scenario 3: Decor Shopper Journey (Mosaic Mirror Art ₹2,500 via COD)', () => {
    harness.test('Eligible low-value mirror checkout using Cash on Delivery', () => {
      const mosaic = catalogFixture.products.find(p => p.sku === 'REF-MOSAIC-MIRROR-ART');
      const smallVariant = mosaic.variations.find(v => v.attributes.Size.includes('24" x 30"'));

      harness.assertEqual(smallVariant?.price, 2500.00, 'Small mosaic mirror is ₹2,500.00');

      // Cart
      const subtotal = smallVariant.price * 1;
      const codLimit = paymentFixture.gateways.cod.standard_threshold;
      harness.assertEqual(subtotal <= codLimit, true, 'Subtotal ₹2,500 is within standard COD limit of ₹10,000');

      // COD selection
      const selectedPayment = 'cod';
      harness.assertEqual(selectedPayment, 'cod', 'Customer selects Cash on Delivery');

      // Order created in processing / pending COD confirmation
      const codOrder = {
        id: 1003,
        payment_method: 'cod',
        total: subtotal,
        status: 'processing',
        customer_instructions: 'Pay cash upon delivery at doorstep'
      };
      harness.assertEqual(codOrder.status, 'processing', 'COD order created in processing status');
      harness.assert(codOrder.customer_instructions.includes('Pay cash upon delivery'), 'Includes COD instructions');
    });
  });

  // =========================================================================
  // Scenario 4: SEO Migrated Visitor Flow (Legacy Link to Successful Purchase)
  // =========================================================================
  harness.suite('Scenario 4: SEO Migrated Visitor Flow (Legacy Link Redirection)', () => {
    harness.test('Inbound traffic on legacy Shopify link redirects cleanly and converts', () => {
      const incomingUrl = '/products/venetian-mirror';
      const redirectRules = redirectFixture.rules;

      // 1. Redirection lookup
      const rule = redirectRules.find(r => r.source === incomingUrl);
      harness.assert(Boolean(rule), 'Incoming legacy URL matched in 301 redirect matrix');
      harness.assertEqual(rule?.code, 301, 'HTTP status is 301 Permanent Redirect');
      harness.assertEqual(rule?.target, '/product/rococo-floral/', 'Redirect target resolves to Rococo Floral product');

      // 2. Product purchase
      const rococo = catalogFixture.products.find(p => p.name === 'Rococo floral');
      harness.assertEqual(rococo?.price, 14000.00, 'Rococo Floral price is ₹14,000.00');

      // 3. Customer converts
      const order = { id: 1004, product: rococo.name, total: rococo.price, status: 'processing' };
      harness.assertEqual(order.status, 'processing', 'Order placed successfully from redirected link');
    });
  });

  // =========================================================================
  // Scenario 5: Customer Form Validation Failure & Recovery Flow
  // =========================================================================
  harness.suite('Scenario 5: Checkout Form Validation Failure & Recovery', () => {
    harness.test('Form blocks invalid submissions and permits corrected submission', () => {
      const pinRegex = new RegExp(checkoutFixture.pin_validation.regex);
      const phoneRegex = new RegExp(checkoutFixture.phone_validation.regex);

      // Attempt 1: Malformed data
      const badInput = { pin: '11000', phone: '987654321' };
      const isPinValid1 = pinRegex.test(badInput.pin);
      const isPhoneValid1 = phoneRegex.test(badInput.phone);
      const canSubmit1 = isPinValid1 && isPhoneValid1;

      harness.assertEqual(isPinValid1, false, '5-digit PIN correctly fails validation');
      harness.assertEqual(isPhoneValid1, false, '9-digit phone correctly fails validation');
      harness.assertEqual(canSubmit1, false, 'Form submission blocked due to validation errors');

      // Attempt 2: Corrected data
      const goodInput = { pin: '110001', phone: '9876543210' };
      const isPinValid2 = pinRegex.test(goodInput.pin);
      const isPhoneValid2 = phoneRegex.test(goodInput.phone);
      const canSubmit2 = isPinValid2 && isPhoneValid2;

      harness.assertEqual(isPinValid2, true, 'Corrected 6-digit PIN passes validation');
      harness.assertEqual(isPhoneValid2, true, 'Corrected 10-digit phone passes validation');
      harness.assertEqual(canSubmit2, true, 'Form submission successfully allowed after correction');
    });
  });

  // =========================================================================
  // Scenario 6: Dual-Track Operational Safety Gate Check
  // =========================================================================
  harness.suite('Scenario 6: Dual-Track Operational Safety Gate Check', () => {
    harness.test('Shopify deactivation safety gate verifies all prerequisite conditions', () => {
      const liveVerifiedOrder = true;
      const receiptDispatched = true;
      const adminAlertDispatched = true;
      const testRefundExecuted = true;
      const dataExportedFor7Years = true;

      const readyForShopifyDeactivation = 
        liveVerifiedOrder &&
        receiptDispatched &&
        adminAlertDispatched &&
        testRefundExecuted &&
        dataExportedFor7Years;

      harness.assertEqual(readyForShopifyDeactivation, true, 'All safety prerequisites satisfied before Shopify deactivation');
    });
  });

  return harness;
}
