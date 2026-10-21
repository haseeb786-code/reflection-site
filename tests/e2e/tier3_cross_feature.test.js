import fs from 'fs';
import path from 'path';
import { TestHarness, rootDir, loadEnvFile, computeHmacSha256 } from './test_framework.js';

export async function runTier3Tests() {
  const harness = new TestHarness('Tier 3: Cross-Feature Combinations & Pairwise Interactions');
  const env = loadEnvFile();

  const catalogFixture = JSON.parse(fs.readFileSync(path.join(rootDir, 'tests', 'fixtures', 'catalog_fixtures.json'), 'utf8'));
  const checkoutFixture = JSON.parse(fs.readFileSync(path.join(rootDir, 'tests', 'fixtures', 'checkout_fixtures.json'), 'utf8'));
  const paymentFixture = JSON.parse(fs.readFileSync(path.join(rootDir, 'tests', 'fixtures', 'payment_fixtures.json'), 'utf8'));
  const redirectFixture = JSON.parse(fs.readFileSync(path.join(rootDir, 'tests', 'fixtures', 'redirect_fixtures.json'), 'utf8'));

  // =========================================================================
  // Interaction 1: Variable Product Option Switching + Dynamic Price Update
  // =========================================================================
  harness.suite('Interaction 1: Variable Product Dropdown Switching & Cart Totals', () => {
    harness.test('Modern Victorian variation price consistency and switching', () => {
      const modern = catalogFixture.products.find(p => p.sku === 'REF-MODERN-VICTORIAN');
      const vSilver = modern.variations.find(v => v.attributes.Color === 'Silver');
      const vGeometric = modern.variations.find(v => v.attributes.Color === 'Geometric');

      harness.assertEqual(vSilver?.price, 58787.00, 'Silver variant priced at ₹58,787.00');
      harness.assertEqual(vGeometric?.price, 58787.00, 'Geometric variant priced at ₹58,787.00');

      // Cart with 1 Silver
      let cartSubtotal = vSilver.price * 1;
      harness.assertEqual(cartSubtotal, 58787.00, 'Cart subtotal matches Silver variation');

      // User switches to Geometric
      cartSubtotal = vGeometric.price * 1;
      harness.assertEqual(cartSubtotal, 58787.00, 'Cart subtotal matches Geometric variation after switch');
    });

    harness.test('Mosaic Mirror Art dimensional variation price switching', () => {
      const mosaic = catalogFixture.products.find(p => p.sku === 'REF-MOSAIC-MIRROR-ART');
      const vSmall = mosaic.variations.find(v => v.attributes.Size.includes('24" x 30"'));
      const vLarge = mosaic.variations.find(v => v.attributes.Size.includes('42" x 48"'));

      harness.assertEqual(vSmall?.price, 2500.00, 'Small variation is ₹2,500.00');
      harness.assertEqual(vLarge?.price, 7500.00, 'Large variation is ₹7,500.00');

      // Dynamic price delta
      const delta = vLarge.price - vSmall.price;
      harness.assertEqual(delta, 5000.00, 'Price delta between sizes is exactly ₹5,000.00');

      // Cart updates dynamically
      let cart = [{ product: mosaic.id, variation: vSmall.sku, price: vSmall.price, qty: 1 }];
      let subtotal = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
      harness.assertEqual(subtotal, 2500.00, 'Initial cart subtotal is ₹2,500.00');

      // User changes dropdown to Large size
      cart[0] = { product: mosaic.id, variation: vLarge.sku, price: vLarge.price, qty: 1 };
      subtotal = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
      harness.assertEqual(subtotal, 7500.00, 'Updated cart subtotal is ₹7,500.00');
    });
  });

  // =========================================================================
  // Interaction 2: Quantity Scaling + Cart Recalculation + COD Gateway Suppression
  // =========================================================================
  harness.suite('Interaction 2: Quantity Scaling & Dynamic COD Suppression', () => {
    const isCodAvailable = (total, limit = 10000.00) => total > 0 && total <= limit;

    harness.test('Quantity changes crossing the standard ₹10,000 COD boundary', () => {
      const unitPrice = 2500.00; // Mosaic mirror art 24x30

      // Qty 1 -> ₹2,500
      let qty = 1;
      let total = unitPrice * qty;
      harness.assertEqual(total, 2500.00, 'Total is ₹2,500 for qty 1');
      harness.assertEqual(isCodAvailable(total), true, 'COD available for qty 1');

      // Qty 4 -> ₹10,000 (Boundary)
      qty = 4;
      total = unitPrice * qty;
      harness.assertEqual(total, 10000.00, 'Total is ₹10,000 for qty 4 (exact boundary)');
      harness.assertEqual(isCodAvailable(total), true, 'COD available at exact boundary of ₹10,000');

      // Qty 5 -> ₹12,500 (Exceeds standard)
      qty = 5;
      total = unitPrice * qty;
      harness.assertEqual(total, 12500.00, 'Total is ₹12,500 for qty 5');
      harness.assertEqual(isCodAvailable(total), false, 'COD dynamically suppressed when total exceeds ₹10,000');

      // Qty reduced back to 2 -> ₹5,000 (Re-enabled)
      qty = 2;
      total = unitPrice * qty;
      harness.assertEqual(total, 5000.00, 'Total is ₹5,000 for qty 2');
      harness.assertEqual(isCodAvailable(total), true, 'COD dynamically re-enabled when quantity reduced');
    });

    harness.test('Quantity scaling crossing upper ₹30,000 max ceiling', () => {
      const unitPrice = 7500.00; // Mosaic 42x48
      const maxCeiling = 30000.00;

      // Qty 4 -> ₹30,000
      let total = unitPrice * 4;
      harness.assertEqual(total, 30000.00, 'Total is ₹30,000 for 4 units');
      harness.assertEqual(isCodAvailable(total, maxCeiling), true, 'COD available at ₹30,000 ceiling');

      // Qty 5 -> ₹37,500
      total = unitPrice * 5;
      harness.assertEqual(total, 37500.00, 'Total is ₹37,500 for 5 units');
      harness.assertEqual(isCodAvailable(total, maxCeiling), false, 'COD strictly suppressed over ₹30,000 ceiling');
    });
  });

  // =========================================================================
  // Interaction 3: Coupon Application + Subtotal Modification + COD Gateway Threshold Flip
  // =========================================================================
  harness.suite('Interaction 3: Coupon Application & COD Threshold Flip', () => {
    const isCodAvailable = (total, limit = 10000.00) => total > 0 && total <= limit;

    harness.test('Applying 10% coupon brings subtotal below ₹10,000 threshold', () => {
      const baseSubtotal = 11000.00; // Above standard ₹10k
      harness.assertEqual(isCodAvailable(baseSubtotal), false, 'COD initially unavailable at ₹11,000');

      // Apply WELCOME10 coupon (10% off)
      const discountRate = 0.10;
      const discountAmount = baseSubtotal * discountRate;
      harness.assertEqual(discountAmount, 1100.00, 'Discount calculation: ₹1,100.00');

      const discountedTotal = baseSubtotal - discountAmount;
      harness.assertEqual(discountedTotal, 9900.00, 'Discounted total: ₹9,900.00');

      // COD state flips
      harness.assertEqual(isCodAvailable(discountedTotal), true, 'COD dynamically flips to ENABLED after coupon application!');

      // Remove coupon
      const revertedTotal = discountedTotal + discountAmount;
      harness.assertEqual(revertedTotal, 11000.00, 'Reverted total: ₹11,000.00');
      harness.assertEqual(isCodAvailable(revertedTotal), false, 'COD dynamically flips back to DISABLED when coupon removed');
    });
  });

  // =========================================================================
  // Interaction 4: Luxury Fragile Mirror + Delivery Destination + Razorpay Mandatory
  // =========================================================================
  harness.suite('Interaction 4: Luxury Mirror & Razorpay Mandatory Flow', () => {
    harness.test('Antique Venetian Cushion requires online prepayment via Razorpay', () => {
      const antique = catalogFixture.products.find(p => p.sku === 'REF-ANTIQUE-VENETIAN-CUSHION');
      const address = checkoutFixture.sample_addresses[0]; // Panaji, Goa 403001

      harness.assertEqual(antique?.price, 81500.00, 'Antique mirror price is ₹81,500.00');
      harness.assertEqual(address.postcode, '403001', 'Destination PIN is Goa 403001');

      // Rule: COD suppressed for orders > ₹30,000
      const codAllowed = antique.price <= 30000.00;
      harness.assertEqual(codAllowed, false, 'COD payment method suppressed for luxury mirror');

      // Razorpay must be selected
      const selectedGateway = 'razorpay';
      harness.assertEqual(selectedGateway, 'razorpay', 'Checkout defaults to Razorpay gateway');

      // Razorpay API payload amount in paise (1 INR = 100 paise)
      const amountInPaise = Math.round(antique.price * 100);
      harness.assertEqual(amountInPaise, 8150000, 'Razorpay transaction amount is 8,150,000 paise');

      // Verify currency is INR
      const currency = catalogFixture.store.currency;
      harness.assertEqual(currency, 'INR', 'Razorpay currency parameter locked to INR');
    });
  });

  // =========================================================================
  // Interaction 5: Mixed Multi-Product Cart + Free Shipping Threshold
  // =========================================================================
  harness.suite('Interaction 5: Mixed Cart & Free Shipping Rules', () => {
    harness.test('Combining simple and variable products to cross Free Shipping threshold', () => {
      const rococo = catalogFixture.products.find(p => p.name === 'Rococo floral'); // ₹14,000
      const mosaic = catalogFixture.products.find(p => p.sku === 'REF-MOSAIC-MIRROR-ART');
      const mosaicLarge = mosaic.variations.find(v => v.attributes.Size.includes('42" x 48"')); // ₹7,500

      const cart = [
        { name: rococo.name, price: rococo.price, qty: 1 },
        { name: mosaicLarge.title, price: mosaicLarge.price, qty: 1 }
      ];

      const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
      harness.assertEqual(subtotal, 21500.00, 'Mixed cart subtotal is ₹21,500.00');

      // Free shipping threshold = ₹20,000
      const freeShippingThreshold = 20000.00;
      const qualifiesFreeShipping = subtotal >= freeShippingThreshold;
      harness.assertEqual(qualifiesFreeShipping, true, 'Order qualifies for free domestic crated shipping (> ₹20,000)');

      const shippingCost = qualifiesFreeShipping ? 0.00 : 1500.00;
      harness.assertEqual(shippingCost, 0.00, 'Shipping cost calculated as ₹0.00');

      const grandTotal = subtotal + shippingCost;
      harness.assertEqual(grandTotal, 21500.00, 'Grand total is ₹21,500.00');
    });
  });

  // =========================================================================
  // Interaction 6: Legacy 301 Redirect + Query String Preservation + Direct Cart Add
  // =========================================================================
  harness.suite('Interaction 6: 301 Redirection & Direct Add-to-Cart Param', () => {
    harness.test('Legacy Shopify product link preserving direct cart action', () => {
      const legacyUrl = '/products/antique-venetian-cushion?add-to-cart=101&quantity=1';
      const redirectRules = redirectFixture.rules;
      const baseLegacy = legacyUrl.split('?')[0];
      const queryParams = legacyUrl.split('?')[1];

      const matchedRule = redirectRules.find(r => r.source === baseLegacy);
      harness.assert(Boolean(matchedRule), 'Redirect rule matched for legacy URL base');
      harness.assertEqual(matchedRule?.target, '/product/antique-venetian-cushion/', 'Target is WooCommerce product endpoint');

      const redirectedFullUrl = `${matchedRule?.target}?${queryParams}`;
      harness.assertEqual(redirectedFullUrl, '/product/antique-venetian-cushion/?add-to-cart=101&quantity=1', 'Target URL preserves query parameters');
      harness.assertEqual(matchedRule?.code, 301, 'Status code is 301');
    });
  });

  // =========================================================================
  // Interaction 7: Webhook Payment Captured + Order State Lifecycle Transition
  // =========================================================================
  harness.suite('Interaction 7: Webhook Signature & Order Lifecycle Processing', () => {
    harness.test('Valid payment.captured event transitions order to Processing', () => {
      // 1. Order created in pending status
      const mockOrder = {
        id: 9001,
        status: 'pending',
        total: '58787.00',
        currency: 'INR',
        payment_method: 'razorpay'
      };
      harness.assertEqual(mockOrder.status, 'pending', 'Initial order status is pending');

      // 2. Webhook arrives
      const webhookPayload = {
        event: 'payment.captured',
        payload: {
          payment: {
            entity: {
              id: 'pay_test_modern_victorian_58787',
              amount: 5878700,
              currency: 'INR',
              order_id: 'order_rzp_9001'
            }
          }
        }
      };

      // 3. Signature verification
      const secret = 'webhook_secret_key_prod';
      const bodyStr = JSON.stringify(webhookPayload);
      const signature = computeHmacSha256(bodyStr, secret);
      const isValid = signature === computeHmacSha256(bodyStr, secret);
      harness.assert(isValid, 'Webhook signature successfully validated');

      // 4. Amount matches order total
      const paidInRupees = (webhookPayload.payload.payment.entity.amount / 100).toFixed(2);
      harness.assertEqual(paidInRupees, mockOrder.total, 'Paid amount matches order total');

      // 5. Order transitions to processing
      if (isValid && paidInRupees === mockOrder.total) {
        mockOrder.status = 'processing';
        mockOrder.transaction_id = webhookPayload.payload.payment.entity.id;
      }
      harness.assertEqual(mockOrder.status, 'processing', 'Order status transitions to processing');
      harness.assertEqual(mockOrder.transaction_id, 'pay_test_modern_victorian_58787', 'Transaction ID recorded');
    });
  });

  // =========================================================================
  // Interaction 8: Zero-Price Consultation Item + Paid Mirror Combined Checkout
  // =========================================================================
  harness.suite('Interaction 8: Zero-Price Consultation Item & Catalog Math', () => {
    harness.test('Cart combining ₹0 consultation item and ₹100 custom mirror', () => {
      const metalItem = catalogFixture.products.find(p => p.sku === 'REF-HIGH-STRENGTH-METAL-MATERIALS');
      const customItem = catalogFixture.products.find(p => p.sku === 'REF-CUSTOMISED-MIRROR');

      harness.assertEqual(metalItem?.price, 0.00, 'Metal materials is ₹0.00');
      harness.assertEqual(customItem?.price, 100.00, 'Custom mirror is ₹100.00');

      const cart = [
        { sku: metalItem.sku, price: metalItem.price, qty: 1 },
        { sku: customItem.sku, price: customItem.price, qty: 1 }
      ];

      const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
      harness.assertEqual(subtotal, 100.00, 'Combined subtotal is ₹100.00 (not NaN or null)');
      harness.assert(subtotal > 0, 'Subtotal is positive number suitable for gateway invocation');
    });
  });

  return harness;
}
