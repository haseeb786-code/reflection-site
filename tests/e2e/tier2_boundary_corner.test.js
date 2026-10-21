import fs from 'fs';
import path from 'path';
import { TestHarness, rootDir, loadEnvFile, computeHmacSha256 } from './test_framework.js';

export async function runTier2Tests() {
  const harness = new TestHarness('Tier 2: Boundary Value Analysis & Corner Cases');
  const env = loadEnvFile();

  const checkoutFixture = JSON.parse(fs.readFileSync(path.join(rootDir, 'tests', 'fixtures', 'checkout_fixtures.json'), 'utf8'));
  const paymentFixture = JSON.parse(fs.readFileSync(path.join(rootDir, 'tests', 'fixtures', 'payment_fixtures.json'), 'utf8'));
  const redirectFixture = JSON.parse(fs.readFileSync(path.join(rootDir, 'tests', 'fixtures', 'redirect_fixtures.json'), 'utf8'));

  // =========================================================================
  // BVA Group 1: 6-Digit Indian PIN Code Boundaries
  // =========================================================================
  harness.suite('BVA 1: Postal PIN Code Boundary Values', () => {
    const pinRegex = new RegExp(checkoutFixture.pin_validation.regex);

    harness.test('Valid PIN code datasets', () => {
      for (const item of checkoutFixture.pin_validation.valid_cases) {
        harness.assert(pinRegex.test(item.code), `Valid PIN accepted: ${item.code} (${item.city})`);
      }
    });

    harness.test('Invalid PIN code corner cases and edge values', () => {
      for (const item of checkoutFixture.pin_validation.invalid_cases) {
        harness.assert(!pinRegex.test(item.code), `Invalid PIN rejected: "${item.code}" (${item.reason})`);
      }
    });

    harness.test('Length boundary sweep (1 to 10 characters)', () => {
      const lengths = [1, 2, 3, 4, 5, 7, 8, 9, 10, 15];
      for (const len of lengths) {
        const testCode = '1'.repeat(len);
        harness.assert(!pinRegex.test(testCode), `Length ${len} rejected (${testCode})`);
      }
    });

    harness.test('Leading digit boundary sweep (0 through 9)', () => {
      for (let digit = 0; digit <= 9; digit++) {
        const testCode = `${digit}23456`;
        if (digit === 0) {
          harness.assert(!pinRegex.test(testCode), `Leading digit 0 strictly rejected: ${testCode}`);
        } else {
          harness.assert(pinRegex.test(testCode), `Leading digit ${digit} accepted: ${testCode}`);
        }
      }
    });
  });

  // =========================================================================
  // BVA Group 2: 10-Digit Mobile Phone Number Boundaries
  // =========================================================================
  harness.suite('BVA 2: Mobile Phone Number Boundary Values', () => {
    const phoneRegex = new RegExp(checkoutFixture.phone_validation.regex);

    harness.test('Valid Indian mobile numbers', () => {
      for (const item of checkoutFixture.phone_validation.valid_cases) {
        harness.assert(phoneRegex.test(item.phone), `Valid mobile accepted: ${item.phone} (${item.provider})`);
      }
    });

    harness.test('Invalid mobile phone corner cases', () => {
      for (const item of checkoutFixture.phone_validation.invalid_cases) {
        harness.assert(!phoneRegex.test(item.phone), `Invalid mobile rejected: "${item.phone}" (${item.reason})`);
      }
    });

    harness.test('Leading digit boundary test for 10-digit strings (0 through 9)', () => {
      for (let d = 0; d <= 9; d++) {
        const samplePhone = `${d}987654321`;
        if (d >= 6) {
          harness.assert(phoneRegex.test(samplePhone), `Valid series ${d} accepted: ${samplePhone}`);
        } else {
          harness.assert(!phoneRegex.test(samplePhone), `Invalid series ${d} rejected: ${samplePhone}`);
        }
      }
    });

    harness.test('Length variations around 10 digits', () => {
      harness.assert(!phoneRegex.test('98765432'), '8 digits rejected');
      harness.assert(!phoneRegex.test('987654321'), '9 digits rejected');
      harness.assert(phoneRegex.test('9876543210'), '10 digits accepted');
      harness.assert(!phoneRegex.test('98765432100'), '11 digits rejected');
      harness.assert(!phoneRegex.test('987654321000'), '12 digits rejected');
    });
  });

  // =========================================================================
  // BVA Group 3: Product Pricing & Cart Quantity Boundaries
  // =========================================================================
  harness.suite('BVA 3: Pricing & Quantity Boundaries', () => {
    harness.test('Price rounding and fractional paise precision', () => {
      const roundPrice = (val) => Number(Math.round(Number(val + 'e+2')) + 'e-2').toFixed(2);
      harness.assertEqual(roundPrice(81500.005), '81500.01', 'Rounds half up to 81500.01');
      harness.assertEqual(roundPrice(81500.004), '81500.00', 'Rounds down to 81500.00');
      harness.assertEqual(roundPrice(0.001), '0.00', 'Sub-paise rounded down');
      harness.assertEqual(roundPrice(99.99), '99.99', 'Preserves exact paise 99.99');
      harness.assertEqual(roundPrice(58787), '58787.00', 'Formats integer price with .00');
      harness.assertEqual(roundPrice(2500.0), '2500.00', 'Formats single decimal price with .00');
    });

    harness.test('Negative price rejection and zero-price boundaries', () => {
      const validatePrice = (p) => typeof p === 'number' && !isNaN(p) && p >= 0;
      harness.assert(validatePrice(0.00), 'Accepts zero price for consultation/inquiry items');
      harness.assert(validatePrice(100.00), 'Accepts low price custom item');
      harness.assert(validatePrice(81500.00), 'Accepts luxury price');
      harness.assert(!validatePrice(-0.01), 'Rejects micro-negative price');
      harness.assert(!validatePrice(-100.00), 'Rejects negative hundred');
      harness.assert(!validatePrice(-81500.00), 'Rejects negative luxury price');
      harness.assert(!validatePrice(NaN), 'Rejects NaN');
    });

    harness.test('Cart item quantity boundaries', () => {
      const validateQty = (q) => Number.isInteger(q) && q > 0 && q <= 100;
      harness.assert(!validateQty(0), 'Rejects 0 quantity (must remove item or reject)');
      harness.assert(!validateQty(-1), 'Rejects negative quantity');
      harness.assert(!validateQty(-10), 'Rejects negative ten');
      harness.assert(validateQty(1), 'Accepts minimum purchase quantity 1');
      harness.assert(validateQty(2), 'Accepts quantity 2');
      harness.assert(validateQty(10), 'Accepts quantity 10');
      harness.assert(validateQty(100), 'Accepts upper threshold quantity 100');
      harness.assert(!validateQty(101), 'Rejects quantity exceeding maximum crated bulk shipment');
      harness.assert(!validateQty(9999), 'Rejects extreme quantity 9999');
    });
  });

  // =========================================================================
  // BVA Group 4: Cash on Delivery (COD) Threshold Boundaries
  // =========================================================================
  harness.suite('BVA 4: Cash on Delivery Threshold Boundaries', () => {
    const isCodEligible = (orderTotal, threshold = 10000.00) => {
      if (orderTotal <= 0) return false;
      return orderTotal <= threshold;
    };

    harness.test('Standard ₹10,000 threshold boundary values', () => {
      harness.assert(!isCodEligible(0.00, 10000), 'Order total ₹0: COD disabled');
      harness.assert(isCodEligible(1.00, 10000), 'Order total ₹1: COD enabled');
      harness.assert(isCodEligible(2500.00, 10000), 'Order total ₹2,500: COD enabled');
      harness.assert(isCodEligible(7500.00, 10000), 'Order total ₹7,500: COD enabled');
      harness.assert(isCodEligible(9999.99, 10000), 'Order total ₹9,999.99: COD enabled');
      harness.assert(isCodEligible(10000.00, 10000), 'Order total ₹10,000.00: COD enabled (at boundary)');
      harness.assert(!isCodEligible(10000.01, 10000), 'Order total ₹10,000.01: COD disabled (exceeds threshold)');
      harness.assert(!isCodEligible(14000.00, 10000), 'Order total ₹14,000.00: COD disabled');
    });

    harness.test('Extended ₹30,000 ceiling threshold boundary values', () => {
      const extendedCeiling = 30000.00;
      harness.assert(isCodEligible(29999.99, extendedCeiling), 'Order total ₹29,999.99: COD enabled');
      harness.assert(isCodEligible(30000.00, extendedCeiling), 'Order total ₹30,000.00: COD enabled (at ceiling)');
      harness.assert(!isCodEligible(30000.01, extendedCeiling), 'Order total ₹30,000.01: COD disabled (above ceiling)');
      harness.assert(!isCodEligible(35900.00, extendedCeiling), 'Silver Crown (₹35,900): COD strictly disabled');
      harness.assert(!isCodEligible(58787.00, extendedCeiling), 'Modern Victorian (₹58,787): COD strictly disabled');
      harness.assert(!isCodEligible(81500.00, extendedCeiling), 'Antique Venetian Cushion (₹81,500): COD strictly disabled');
    });
  });

  // =========================================================================
  // BVA Group 5: Razorpay Webhook Signature Boundaries
  // =========================================================================
  harness.suite('BVA 5: Razorpay Webhook HMAC-SHA256 Signatures', () => {
    const secret = 'rzp_wh_secret_live_reflection_2026';
    const samplePayload = JSON.stringify(paymentFixture.gateways.razorpay.sample_webhook_payload);

    harness.test('Signature authenticity verification', () => {
      const validSig = computeHmacSha256(samplePayload, secret);
      harness.assertEqual(validSig.length, 64, 'HMAC signature is exactly 64 hexadecimal characters');
      harness.assert(/^[a-f0-9]{64}$/.test(validSig), 'Signature contains only lowercase hexadecimal characters');
      harness.assertEqual(validSig, computeHmacSha256(samplePayload, secret), 'Deterministic signature matches on identical inputs');
    });

    harness.test('Tampered payload detection (1-byte changes)', () => {
      const genuineSig = computeHmacSha256(samplePayload, secret);
      const tamperedAmount = samplePayload.replace('8150000', '8150001');
      harness.assert(genuineSig !== computeHmacSha256(tamperedAmount, secret), 'Detects 1 paise tampering in payment amount');

      const tamperedCurrency = samplePayload.replace('"INR"', '"USD"');
      harness.assert(genuineSig !== computeHmacSha256(tamperedCurrency, secret), 'Detects currency tampering from INR to USD');

      const tamperedOrder = samplePayload.replace('order_mock_12345', 'order_mock_12346');
      harness.assert(genuineSig !== computeHmacSha256(tamperedOrder, secret), 'Detects order ID tampering');

      const tamperedStatus = samplePayload.replace('"captured"', '"authorized"');
      harness.assert(genuineSig !== computeHmacSha256(tamperedStatus, secret), 'Detects event status tampering');
    });

    harness.test('Secret key variation boundaries', () => {
      const genuineSig = computeHmacSha256(samplePayload, secret);
      harness.assert(genuineSig !== computeHmacSha256(samplePayload, secret + 'x'), 'Wrong secret appended rejected');
      harness.assert(genuineSig !== computeHmacSha256(samplePayload, secret.toUpperCase()), 'Case variation in secret rejected');
      harness.assert(genuineSig !== computeHmacSha256(samplePayload, ''), 'Empty secret rejected');
    });
  });

  // =========================================================================
  // BVA Group 6: SEO 301 Redirect URL Boundaries & Query Preservation
  // =========================================================================
  harness.suite('BVA 6: SEO Redirect URL Boundaries & Normalization', () => {
    const normalizeUrl = (inputUrl) => {
      try {
        const u = new URL(inputUrl, 'https://reflectionelite.com');
        let pathname = u.pathname.toLowerCase();
        if (!pathname.endsWith('/')) {
          pathname += '/';
        }
        return { pathname, search: u.search };
      } catch (e) {
        return null;
      }
    };

    harness.test('Trailing slash idempotency', () => {
      const n1 = normalizeUrl('/products/antique-venetian-cushion');
      const n2 = normalizeUrl('/products/antique-venetian-cushion/');
      harness.assertEqual(n1?.pathname, '/products/antique-venetian-cushion/', 'Appends trailing slash cleanly');
      harness.assertEqual(n1?.pathname, n2?.pathname, 'Pathnames match regardless of source trailing slash');
    });

    harness.test('Case-insensitivity normalization', () => {
      const nUpper = normalizeUrl('/Products/Antique-Venetian-Cushion');
      harness.assertEqual(nUpper?.pathname, '/products/antique-venetian-cushion/', 'Normalizes uppercase URL to lowercase');
    });

    harness.test('Query parameter preservation across 301 redirection', () => {
      const queryCases = [
        '?variant=58787',
        '?utm_source=facebook&utm_campaign=diwali_sale',
        '?fbclid=IwAR3xyz',
        '?gclid=Cj0KCQjwmv',
        '?add-to-cart=100&quantity=1'
      ];
      for (const q of queryCases) {
        const res = normalizeUrl(`/products/modern-victorian${q}`);
        harness.assertEqual(res?.search, q, `Preserves query string intact: ${q}`);
      }
    });

    harness.test('Path traversal and metacharacter safety checks', () => {
      const suspiciousPaths = [
        '/products/../secret.txt',
        '/products/%2e%2e/wp-config.php',
        '/products/<script>alert(1)</script>'
      ];
      for (const sp of suspiciousPaths) {
        const res = normalizeUrl(sp);
        harness.assert(Boolean(res), `Handles unusual path safely without crashing: ${sp}`);
        harness.assert(!res?.pathname.includes('..'), `Path traversal tokens eliminated: ${sp}`);
      }
    });
  });

  // =========================================================================
  // BVA Group 7: Media Asset Magic Bytes & Size Boundaries (27 Images)
  // =========================================================================
  harness.suite('BVA 7: Media Asset Magic Bytes & Binary Boundaries', () => {
    const imagesDir = path.join(rootDir, 'assets', 'images');
    const imageFiles = fs.readdirSync(imagesDir);

    harness.test('File size upper and lower bounds for all 27 mirror images', () => {
      for (const f of imageFiles) {
        const fullPath = path.join(imagesDir, f);
        const stats = fs.statSync(fullPath);
        harness.assert(stats.size >= 1024, `Image is at least 1KB: ${f} (${stats.size} bytes)`);
        harness.assert(stats.size <= 15 * 1024 * 1024, `Image is below 15MB limit: ${f} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
      }
    });

    harness.test('Magic byte validation for image formats (JPEG, PNG, WEBP)', () => {
      for (const f of imageFiles) {
        const fullPath = path.join(imagesDir, f);
        const buffer = Buffer.alloc(12);
        const fd = fs.openSync(fullPath, 'r');
        fs.readSync(fd, buffer, 0, 12, 0);
        fs.closeSync(fd);

        let isValid = false;
        let format = 'unknown';

        // JPEG: FF D8 FF
        if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
          isValid = true;
          format = 'jpeg';
        }
        // PNG: 89 50 4E 47 0D 0A 1A 0A
        else if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
          isValid = true;
          format = 'png';
        }
        // WEBP: RIFF .... WEBP
        else if (
          buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
          buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
        ) {
          isValid = true;
          format = 'webp';
        }

        harness.assert(isValid, `Image ${f} has valid magic bytes signature (Detected: ${format})`);
      }
    });
  });

  // =========================================================================
  // BVA Group 8: Transport Security & Network Port Boundaries
  // =========================================================================
  harness.suite('BVA 8: Transport Security & Header Boundaries', () => {
    harness.test('SSL protocol and port conventions', () => {
      const parsedUrl = new URL(env.WORDPRESS_URL || 'https://reflectionelite.com');
      harness.assertEqual(parsedUrl.protocol, 'https:', 'Protocol is strictly https:');
      const port = parsedUrl.port || (parsedUrl.protocol === 'https:' ? '443' : '80');
      harness.assertEqual(port, '443', 'Default port is 443 for SSL');
      harness.assert(!parsedUrl.href.includes(':80/'), 'Port 80 HTTP strictly absent from store endpoint');
      harness.assert(parsedUrl.hostname.length > 3, 'Valid hostname defined');
    });
  });

  return harness;
}
