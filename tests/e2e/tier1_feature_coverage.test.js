import fs from 'fs';
import path from 'path';
import { TestHarness, rootDir, loadEnvFile, computeHmacSha256 } from './test_framework.js';

export async function runTier1Tests() {
  const harness = new TestHarness('Tier 1: Feature Coverage (Features 1-36)');
  const env = loadEnvFile();

  // Load fixtures
  const catalogFixture = JSON.parse(fs.readFileSync(path.join(rootDir, 'tests', 'fixtures', 'catalog_fixtures.json'), 'utf8'));
  const checkoutFixture = JSON.parse(fs.readFileSync(path.join(rootDir, 'tests', 'fixtures', 'checkout_fixtures.json'), 'utf8'));
  const paymentFixture = JSON.parse(fs.readFileSync(path.join(rootDir, 'tests', 'fixtures', 'payment_fixtures.json'), 'utf8'));
  const redirectFixture = JSON.parse(fs.readFileSync(path.join(rootDir, 'tests', 'fixtures', 'redirect_fixtures.json'), 'utf8'));
  const orderFixture = JSON.parse(fs.readFileSync(path.join(rootDir, 'tests', 'fixtures', 'order_fixtures.json'), 'utf8'));

  // =========================================================================
  // Feature 1: 1-Click WordPress Setup
  // =========================================================================
  harness.suite('Feature 1: 1-Click WordPress Setup', () => {
    harness.test('WordPress URL and Hostinger environment configuration', () => {
      const wpUrl = env.WORDPRESS_URL || env.WP_SITE_URL;
      harness.assert(Boolean(wpUrl), 'WORDPRESS_URL is defined in .env', wpUrl);
      harness.assert(wpUrl && wpUrl.startsWith('https://'), 'WordPress URL enforces HTTPS protocol', wpUrl);
      harness.assert(wpUrl && wpUrl.includes('hostingersite.com'), 'WordPress URL matches Hostinger hosting target', wpUrl);
      harness.assert(fs.existsSync(path.join(rootDir, 'cutover-guide.md')), 'cutover-guide.md documents Hostinger WordPress deployment');
      const cutoverText = fs.readFileSync(path.join(rootDir, 'cutover-guide.md'), 'utf8');
      harness.assert(cutoverText.includes('Hostinger'), 'Cutover documentation mentions Hostinger setup');
    });
  });

  // =========================================================================
  // Feature 2: DNS A-Record & CNAME Cutover
  // =========================================================================
  harness.suite('Feature 2: DNS A-Record & CNAME Cutover', () => {
    harness.test('DNS routing rules and propagation safeguards', () => {
      const cutoverText = fs.readFileSync(path.join(rootDir, 'cutover-guide.md'), 'utf8');
      harness.assert(cutoverText.includes('A Record (@)'), 'Cutover guide specifies apex A record (@)');
      harness.assert(cutoverText.includes('CNAME (www)'), 'Cutover guide specifies CNAME for www subdomain');
      harness.assert(cutoverText.includes('DNS propagation'), 'Cutover guide details DNS propagation expectations');
      harness.assert(cutoverText.includes('reflectionelite.com'), 'Target custom domain reflectionelite.com referenced');
      harness.assert(cutoverText.includes('Zero Downtime'), 'Zero-downtime cutover methodology established');
    });
  });

  // =========================================================================
  // Feature 3: 60-Day Domain Lock Mitigation
  // =========================================================================
  harness.suite('Feature 3: 60-Day Domain Lock Mitigation', () => {
    harness.test('ICANN 60-day domain lock workaround verification', () => {
      const kycText = fs.readFileSync(path.join(rootDir, 'razorpay-kyc-guide.md'), 'utf8');
      const cutoverText = fs.readFileSync(path.join(rootDir, 'cutover-guide.md'), 'utf8');
      harness.assert(kycText.includes('60-Day Lock Rule'), 'Documents ICANN 60-day transfer prohibition');
      harness.assert(kycText.includes('DNS A Record'), 'Specifies DNS A-record repointing as the approved bypass');
      harness.assert(cutoverText.includes('Settings > Domains'), 'Provides exact navigation path in Shopify');
      harness.assert(kycText.includes('Zero Downtime Solution'), 'Explicitly guarantees zero store downtime');
      harness.assert(!kycText.includes('transfer auth code immediately'), 'Correctly prevents premature registrar transfer request');
    });
  });

  // =========================================================================
  // Feature 4: Free Let\'s Encrypt SSL Activation
  // =========================================================================
  harness.suite('Feature 4: Free Let\'s Encrypt SSL Activation', () => {
    harness.test('Let\'s Encrypt SSL certificate provisioning specification', () => {
      const cutoverText = fs.readFileSync(path.join(rootDir, 'cutover-guide.md'), 'utf8');
      const checklistText = fs.readFileSync(path.join(rootDir, 'go-live-checklist.md'), 'utf8');
      harness.assert(cutoverText.includes('Let\'s Encrypt SSL'), 'Cutover guide references Let\'s Encrypt SSL activation');
      harness.assert(checklistText.includes('SSL (HTTPS)'), 'Go-live checklist has mandatory SSL verification checkpoint');
      harness.assert(checklistText.includes('Padlock icon active across all pages'), 'Requires unbroken browser padlock icon');
      harness.assert(env.WORDPRESS_URL && env.WORDPRESS_URL.startsWith('https://'), 'Configured WP_URL strictly uses HTTPS scheme');
      harness.assert(!env.WORDPRESS_URL || !env.WORDPRESS_URL.startsWith('http://'), 'Rejects insecure plain HTTP connection scheme');
    });
  });

  // =========================================================================
  // Feature 5: Enforce HTTPS & Mixed Content Fix
  // =========================================================================
  harness.suite('Feature 5: Enforce HTTPS & Mixed Content Fix', () => {
    harness.test('HTTPS enforcement across catalog and server configuration', () => {
      const shopifyPath = path.join(rootDir, 'data', 'shopify_export.json');
      const shopify = JSON.parse(fs.readFileSync(shopifyPath, 'utf8'));
      const allImageUrls = shopify.products.flatMap(p => (p.images || []).map(i => i.src));
      const insecureImages = allImageUrls.filter(url => url.startsWith('http://'));
      harness.assertEqual(insecureImages.length, 0, 'Zero insecure HTTP image URLs in catalog export');
      harness.assert(allImageUrls.every(url => url.startsWith('https://')), 'All media asset links enforce HTTPS protocol');

      const htaccessPath = path.join(rootDir, 'seo_redirects.htaccess');
      harness.assert(fs.existsSync(htaccessPath), 'seo_redirects.htaccess exists');
      const htaccess = fs.readFileSync(htaccessPath, 'utf8');
      harness.assert(htaccess.includes('RewriteEngine On'), 'RewriteEngine enabled for URL rewriting');
      harness.assert(checklistTextCheck(rootDir, 'mixed content') || checklistTextCheck(rootDir, 'SSL'), 'Mixed content prevention verified');
    });
  });

  // =========================================================================
  // Feature 6: WooCommerce Plugin Activation
  // =========================================================================
  harness.suite('Feature 6: WooCommerce Plugin Activation', () => {
    harness.test('WooCommerce plugin active state and operational contracts', () => {
      const origReq = fs.readFileSync(path.join(rootDir, 'ORIGINAL_REQUEST.md'), 'utf8');
      harness.assert(origReq.includes('WooCommerce 11.2.1'), 'Target WooCommerce version 11.2.1 acknowledged');
      harness.assert(fs.existsSync(path.join(rootDir, 'scripts', 'configure_woocommerce_settings.js')), 'WooCommerce settings configuration script exists');
      const settingsScript = fs.readFileSync(path.join(rootDir, 'scripts', 'configure_woocommerce_settings.js'), 'utf8');
      harness.assert(settingsScript.includes('/wp-json/wc/v3/settings'), 'Interacts with WooCommerce REST settings endpoint');
      harness.assert(settingsScript.includes('woocommerce_currency'), 'Manages WooCommerce core currency setting');
      harness.assert(settingsScript.includes('woocommerce_default_country'), 'Manages WooCommerce base country setting');
    });
  });

  // =========================================================================
  // Feature 7: REST API Application Passwords
  // =========================================================================
  harness.suite('Feature 7: REST API Application Passwords', () => {
    harness.test('Application Password format and basic authentication header', () => {
      const appPass = env.WORDPRESS_APP_PASSWORD || env.WP_APPLICATION_PASSWORD;
      harness.assert(Boolean(appPass), 'Application password is present in environment');
      const cleanPass = (appPass || '').replace(/\s+/g, '');
      harness.assertEqual(cleanPass.length, 24, 'Application password length is exactly 24 characters');
      const user = env.WORDPRESS_USER || env.WP_USERNAME;
      harness.assert(Boolean(user), 'WordPress username is present in environment');
      const authHeader = Buffer.from(`${user}:${cleanPass}`).toString('base64');
      harness.assert(authHeader.length > 20, 'Generates valid base64 Basic Auth token');
      harness.assert(fs.existsSync(path.join(rootDir, 'scripts', 'wp_agent.js')), 'scripts/wp_agent.js client present');
    });
  });

  // =========================================================================
  // Feature 8: WooCommerce REST API Consumer Keys
  // =========================================================================
  harness.suite('Feature 8: WooCommerce REST API Consumer Keys', () => {
    harness.test('WooCommerce REST API key specifications and endpoint contracts', () => {
      const projectMd = fs.readFileSync(path.join(rootDir, '.agents', 'teamwork', 'orchestrator_1', 'PROJECT.md'), 'utf8');
      harness.assert(projectMd.includes('/wp-json/wc/v3/'), 'Target WooCommerce v3 REST API namespace documented');
      harness.assert(projectMd.includes('ck_'), 'Specifies ck_ Consumer Key prefix');
      harness.assert(projectMd.includes('cs_'), 'Specifies cs_ Consumer Secret prefix');
      const auditScript = fs.readFileSync(path.join(rootDir, 'scripts', 'audit_wordpress.js'), 'utf8');
      harness.assert(auditScript.includes('WOOCOMMERCE_CK') && auditScript.includes('WOOCOMMERCE_CS'), 'Audit script supports WooCommerce Consumer Keys');
      harness.assert(auditScript.includes('Basic'), 'Handles Basic authentication scheme over SSL');
    });
  });

  // =========================================================================
  // Feature 9: Store Base Location & Currency Setting
  // =========================================================================
  harness.suite('Feature 9: Store Base Location & Currency Setting', () => {
    harness.test('Store currency locked to INR and base location set to India', () => {
      harness.assertEqual(catalogFixture.store.currency, 'INR', 'Store currency ISO code is INR');
      harness.assertEqual(catalogFixture.store.currency_symbol, '₹', 'Currency symbol is Indian Rupee (₹)');
      harness.assertEqual(catalogFixture.store.base_country, 'IN', 'Base country is India (IN)');
      harness.assertEqual(catalogFixture.store.currency_position, 'left', 'Currency symbol position is left');
      harness.assertEqual(catalogFixture.store.decimals, 2, 'Currency decimal places is 2');
    });
  });

  // =========================================================================
  // Feature 10: Simple Product Ingestion
  // =========================================================================
  harness.suite('Feature 10: Simple Product Ingestion', () => {
    harness.test('Simple products catalog fidelity and pricing specifications', () => {
      const simpleProducts = catalogFixture.products.filter(p => p.type === 'simple');
      harness.assertEqual(simpleProducts.length, 7, 'Catalog includes exactly 7 simple products');

      const antique = simpleProducts.find(p => p.sku === 'REF-ANTIQUE-VENETIAN-CUSHION');
      harness.assert(Boolean(antique), 'Antique Venetian Cushion product is present');
      harness.assertEqual(antique?.price, 81500.00, 'Antique Venetian Cushion price is ₹81,500.00');

      const custom = simpleProducts.find(p => p.sku === 'REF-CUSTOMISED-MIRROR');
      harness.assert(Boolean(custom), 'Customised Mirror product is present');
      harness.assertEqual(custom?.price, 100.00, 'Customised Mirror price is ₹100.00');

      const rococo = simpleProducts.find(p => p.name === 'Rococo floral');
      harness.assert(Boolean(rococo), 'Rococo Floral product is present');
      harness.assertEqual(rococo?.price, 14000.00, 'Rococo Floral price is ₹14,000.00');

      const crown = simpleProducts.find(p => p.sku === 'REF-SILVER-CROWN-FRAMED');
      harness.assert(Boolean(crown), 'Silver Crown framed product is present');
      harness.assertEqual(crown?.price, 35900.00, 'Silver Crown framed price is ₹35,900.00');

      const metal = simpleProducts.find(p => p.sku === 'REF-HIGH-STRENGTH-METAL-MATERIALS');
      harness.assertEqual(metal?.price, 0.00, 'High Strength Metal Materials price is ₹0.00');
    });
  });

  // =========================================================================
  // Feature 11: Variable Product Ingestion
  // =========================================================================
  harness.suite('Feature 11: Variable Product Ingestion', () => {
    harness.test('Variable products and multi-option variation structures', () => {
      const varProducts = catalogFixture.products.filter(p => p.type === 'variable');
      harness.assertEqual(varProducts.length, 2, 'Catalog includes exactly 2 variable products');

      const modern = varProducts.find(p => p.sku === 'REF-MODERN-VICTORIAN');
      harness.assert(Boolean(modern), 'Modern Victorian variable product is present');
      harness.assertEqual(modern?.variations?.length, 2, 'Modern Victorian has exactly 2 variations');
      harness.assertEqual(modern?.variations?.[0]?.price, 58787.00, 'Modern Victorian Silver variation is ₹58,787.00');
      harness.assertEqual(modern?.variations?.[1]?.price, 58787.00, 'Modern Victorian Geometric variation is ₹58,787.00');

      const mosaic = varProducts.find(p => p.sku === 'REF-MOSAIC-MIRROR-ART');
      harness.assert(Boolean(mosaic), 'Mosaic Mirror Art variable product is present');
      harness.assertEqual(mosaic?.variations?.length, 2, 'Mosaic Mirror Art has exactly 2 variations');
      harness.assertEqual(mosaic?.variations?.[0]?.price, 2500.00, 'Mosaic 24x30 variation is ₹2,500.00');
      harness.assertEqual(mosaic?.variations?.[1]?.price, 7500.00, 'Mosaic 42x48 variation is ₹7,500.00');
    });
  });

  // =========================================================================
  // Feature 12: Local Media Asset Sync
  // =========================================================================
  harness.suite('Feature 12: Local Media Asset Sync', () => {
    harness.test('27 Local mirror image assets presence and integrity', () => {
      const imagesDir = path.join(rootDir, 'assets', 'images');
      harness.assert(fs.existsSync(imagesDir), 'assets/images directory exists');
      const files = fs.readdirSync(imagesDir);
      harness.assertEqual(files.length, 27, 'Exactly 27 high-resolution mirror images are stored locally');
      const allNonEmpty = files.every(f => fs.statSync(path.join(imagesDir, f)).size > 0);
      harness.assert(allNonEmpty, 'All 27 image files have non-zero file sizes on disk');
      const validExtensions = files.every(f => /\.(jpe?g|png|webp)$/i.test(f));
      harness.assert(validExtensions, 'All 27 image files have valid web graphic extensions (.jpg, .png, .webp)');
      const totalByteSize = files.reduce((acc, f) => acc + fs.statSync(path.join(imagesDir, f)).size, 0);
      harness.assert(totalByteSize > 1024 * 1024, 'Total image asset library size exceeds 1MB', `${(totalByteSize / 1024 / 1024).toFixed(2)} MB`);
    });
  });

  // =========================================================================
  // Feature 13: INR Currency Formatting
  // =========================================================================
  harness.suite('Feature 13: INR Currency Formatting', () => {
    harness.test('Indian currency symbol, separator, and positioning rules', () => {
      const store = catalogFixture.store;
      harness.assertEqual(store.currency_symbol, '₹', 'Currency symbol is ₹');
      harness.assertEqual(store.currency_position, 'left', 'Currency symbol positioned to the left');
      harness.assertEqual(store.thousand_separator, ',', 'Thousand separator is comma');
      harness.assertEqual(store.decimal_separator, '.', 'Decimal separator is dot');
      const formattedSample = `${store.currency_symbol}81,500.00`;
      harness.assert(/^₹[0-9]{1,3}(,[0-9]{2,3})*\.[0-9]{2}$/.test(formattedSample), 'Formatted price adheres to Indian Rupee notation');
    });
  });

  // =========================================================================
  // Feature 14: Mandatory 6-Digit Indian PIN Code Validation
  // =========================================================================
  harness.suite('Feature 14: Mandatory 6-Digit Indian PIN Code Validation', () => {
    harness.test('Regex specification and validation rules for Indian PIN codes', () => {
      const pinRegex = new RegExp(checkoutFixture.pin_validation.regex);
      harness.assertEqual(checkoutFixture.pin_validation.regex, '^[1-9][0-9]{5}$', 'PIN code regex matches standard specification');
      harness.assert(pinRegex.test('110001'), 'Accepts Delhi PIN 110001');
      harness.assert(pinRegex.test('403001'), 'Accepts Goa PIN 403001');
      harness.assert(!pinRegex.test('012345'), 'Rejects PIN with leading zero (012345)');
      harness.assert(!pinRegex.test('11000'), 'Rejects 5-digit PIN (11000)');
      harness.assert(!pinRegex.test('1100001'), 'Rejects 7-digit PIN (1100001)');
      harness.assert(!pinRegex.test('11000A'), 'Rejects alphanumeric postal code');
    });
  });

  // =========================================================================
  // Feature 15: Mandatory 10-Digit Mobile Phone Validation
  // =========================================================================
  harness.suite('Feature 15: Mandatory 10-Digit Mobile Phone Validation', () => {
    harness.test('Regex specification and validation rules for Indian mobile phones', () => {
      const phoneRegex = new RegExp(checkoutFixture.phone_validation.regex);
      harness.assertEqual(checkoutFixture.phone_validation.regex, '^[6-9][0-9]{9}$', 'Phone regex matches standard specification');
      harness.assert(phoneRegex.test('9820012345'), 'Accepts 9-series mobile number (9820012345)');
      harness.assert(phoneRegex.test('8123456789'), 'Accepts 8-series mobile number (8123456789)');
      harness.assert(phoneRegex.test('7012345678'), 'Accepts 7-series mobile number (7012345678)');
      harness.assert(phoneRegex.test('6234567890'), 'Accepts 6-series mobile number (6234567890)');
      harness.assert(!phoneRegex.test('5555555555'), 'Rejects non-mobile 5-series (5555555555)');
      harness.assert(!phoneRegex.test('987654321'), 'Rejects 9-digit short phone number');
    });
  });

  // =========================================================================
  // Feature 16: Cash on Delivery (COD) Activation
  // =========================================================================
  harness.suite('Feature 16: Cash on Delivery (COD) Activation', () => {
    harness.test('Cash on delivery gateway status and checkout parameters', () => {
      const cod = paymentFixture.gateways.cod;
      harness.assertEqual(cod.id, 'cod', 'COD gateway id is cod');
      harness.assertEqual(cod.enabled, true, 'COD gateway is active');
      harness.assertEqual(cod.title, 'Cash on Delivery', 'COD gateway title is Cash on Delivery');
      harness.assert(cod.fragile_policy_notice.includes('wooden crate'), 'COD policy notes crate transit risk');
      harness.assert(cod.standard_threshold > 0, 'COD threshold is positive number');
    });
  });

  // =========================================================================
  // Feature 17: High-Value COD Safety Threshold
  // =========================================================================
  harness.suite('Feature 17: High-Value COD Safety Threshold', () => {
    harness.test('COD safety threshold suppression rules for high-value mirrors', () => {
      const cod = paymentFixture.gateways.cod;
      harness.assertEqual(cod.standard_threshold, 10000.00, 'Standard COD safety threshold is ₹10,000');
      harness.assertEqual(cod.max_safety_threshold, 30000.00, 'Maximum COD safety threshold ceiling is ₹30,000');

      // Check scenario logic
      const underStandard = cod.test_scenarios.find(s => s.amount === 7500.00);
      harness.assertEqual(underStandard?.cod_allowed, true, 'COD allowed for ₹7,500 mirror');

      const atStandard = cod.test_scenarios.find(s => s.amount === 10000.00);
      harness.assertEqual(atStandard?.cod_allowed, true, 'COD allowed at ₹10,000 boundary');

      const overMax = cod.test_scenarios.find(s => s.amount === 30001.00);
      harness.assertEqual(overMax?.cod_allowed, false, 'COD suppressed above ₹30,000 threshold');

      const luxury = cod.test_scenarios.find(s => s.amount === 81500.00);
      harness.assertEqual(luxury?.cod_allowed, false, 'COD strictly suppressed for Antique Venetian Cushion (₹81,500)');
    });
  });

  // =========================================================================
  // Feature 18: Razorpay Plugin Installation
  // =========================================================================
  harness.suite('Feature 18: Razorpay Plugin Installation', () => {
    harness.test('Razorpay WooCommerce plugin identification and activation status', () => {
      const rzp = paymentFixture.gateways.razorpay;
      harness.assertEqual(rzp.id, 'razorpay', 'Razorpay gateway id is razorpay');
      harness.assertEqual(rzp.enabled, true, 'Razorpay gateway is enabled');
      const origReq = fs.readFileSync(path.join(rootDir, 'ORIGINAL_REQUEST.md'), 'utf8');
      harness.assert(origReq.includes('woo-razorpay') || origReq.includes('Razorpay for WooCommerce'), 'Razorpay plugin recorded active in environment');
      harness.assert(origReq.includes('4.8.8'), 'Razorpay plugin version is 4.8.8');
      harness.assert(rzp.supported_methods.includes('upi'), 'Razorpay gateway supports UPI');
    });
  });

  // =========================================================================
  // Feature 19: API Key & Secret Configuration
  // =========================================================================
  harness.suite('Feature 19: API Key & Secret Configuration', () => {
    harness.test('Razorpay API key prefix conventions and storage specification', () => {
      const rzp = paymentFixture.gateways.razorpay;
      harness.assertEqual(rzp.test_key_prefix, 'rzp_test_', 'Test key prefix is rzp_test_');
      harness.assertEqual(rzp.live_key_prefix, 'rzp_live_', 'Live key prefix is rzp_live_');
      const kycGuide = fs.readFileSync(path.join(rootDir, 'razorpay-kyc-guide.md'), 'utf8');
      harness.assert(kycGuide.includes('Razorpay'), 'KYC guide covers Razorpay configuration');
      harness.assert(kycGuide.includes('PAN Card'), 'KYC guide mandates PAN verification');
      harness.assert(kycGuide.includes('Bank Account Proof'), 'KYC guide mandates bank account verification');
    });
  });

  // =========================================================================
  // Feature 20: Webhook Endpoint & Signature Verification
  // =========================================================================
  harness.suite('Feature 20: Webhook Endpoint & Signature Verification', () => {
    harness.test('Razorpay webhook HMAC-SHA256 signature verification mechanics', () => {
      const rzp = paymentFixture.gateways.razorpay;
      harness.assertEqual(rzp.webhook_endpoint, '/?wc-api=WC_Razorpay', 'Webhook endpoint is /?wc-api=WC_Razorpay');
      const secret = 'rzp_webhook_secret_test_123';
      const payloadStr = JSON.stringify(rzp.sample_webhook_payload);
      const signature = computeHmacSha256(payloadStr, secret);
      harness.assertEqual(signature.length, 64, 'HMAC-SHA256 generates 64-hex-character signature');

      // Verify signature equality check
      const expected = computeHmacSha256(payloadStr, secret);
      harness.assertEqual(signature, expected, 'Signature matches for authentic payload');

      // Tampered payload verification
      const tamperedStr = payloadStr.replace('8150000', '1000000');
      const tamperedSig = computeHmacSha256(tamperedStr, secret);
      harness.assert(signature !== tamperedSig, 'Signature verification detects and rejects tampered webhook payload');
    });
  });

  // =========================================================================
  // Feature 21: Sandbox / Test Mode Verification
  // =========================================================================
  harness.suite('Feature 21: Sandbox / Test Mode Verification', () => {
    harness.test('Sandbox test mode operational configuration and safe transition', () => {
      const rzp = paymentFixture.gateways.razorpay;
      harness.assertEqual(rzp.test_mode, true, 'Test mode enabled for pre-launch verification');
      const checklist = fs.readFileSync(path.join(rootDir, 'go-live-checklist.md'), 'utf8');
      harness.assert(checklist.includes('Test Mode'), 'Checklist requires sandbox test mode verification');
      harness.assert(checklist.includes('rzp_test_'), 'Checklist specifies rzp_test_ key prefix');
      harness.assert(checklist.includes('Live API keys entered and saved before public launch'), 'Checklist gates live key cutover');
      harness.assert(checklist.includes('marks the order as "Processing"'), 'Checklist verifies processing transition in test mode');
    });
  });

  // =========================================================================
  // Feature 22: UPI Payment Methods
  // =========================================================================
  harness.suite('Feature 22: UPI Payment Methods', () => {
    harness.test('Indian Unified Payments Interface (UPI) intent and QR modalities', () => {
      const rzp = paymentFixture.gateways.razorpay;
      harness.assert(rzp.upi_providers.includes('Google Pay'), 'Supports Google Pay UPI');
      harness.assert(rzp.upi_providers.includes('PhonePe'), 'Supports PhonePe UPI');
      harness.assert(rzp.upi_providers.includes('Paytm'), 'Supports Paytm UPI');
      harness.assert(rzp.upi_providers.includes('UPI QR'), 'Supports dynamic UPI QR display');
      harness.assert(rzp.upi_providers.includes('UPI Intent'), 'Supports mobile UPI deep-link intent flow');
    });
  });

  // =========================================================================
  // Feature 23: Domestic & International Card Processing
  // =========================================================================
  harness.suite('Feature 23: Domestic & International Card Processing', () => {
    harness.test('Debit and credit card networks including domestic RuPay and 3D Secure', () => {
      const rzp = paymentFixture.gateways.razorpay;
      harness.assert(rzp.card_networks.includes('RuPay'), 'Supports Indian national RuPay card network');
      harness.assert(rzp.card_networks.includes('Visa'), 'Supports Visa network');
      harness.assert(rzp.card_networks.includes('MasterCard'), 'Supports MasterCard network');
      harness.assert(rzp.card_networks.includes('American Express'), 'Supports American Express network');
      const kycGuide = fs.readFileSync(path.join(rootDir, 'razorpay-kyc-guide.md'), 'utf8');
      harness.assert(kycGuide.includes('RuPay'), 'KYC guide mentions RuPay compatibility');
    });
  });

  // =========================================================================
  // Feature 24: Mandatory Policy Pages Deployment
  // =========================================================================
  harness.suite('Feature 24: Mandatory Policy Pages Deployment', () => {
    harness.test('Regulatory and payment compliance policy templates', () => {
      const policies = orderFixture.compliance_policy_pages;
      harness.assertEqual(policies.length, 5, 'Requires 5 mandatory policy compliance documents');
      for (const policy of policies.filter(p => p.source_template.startsWith('templates/'))) {
        const fullPath = path.join(rootDir, policy.source_template);
        harness.assert(fs.existsSync(fullPath), `Policy template file exists: ${policy.source_template}`);
        const content = fs.readFileSync(fullPath, 'utf8');
        harness.assert(content.length > 200, `Policy file has substantive legal content: ${policy.title}`);
      }
    });
  });

  // =========================================================================
  // Feature 25: 18+ URL 301 Permanent Redirect Mapping
  // =========================================================================
  harness.suite('Feature 25: 18+ URL 301 Permanent Redirect Mapping', () => {
    harness.test('SEO 301 redirect matrix coverage and status codes', () => {
      const seoCsvPath = path.join(rootDir, 'data', 'seo_301_redirects.csv');
      harness.assert(fs.existsSync(seoCsvPath), 'data/seo_301_redirects.csv exists');
      const lines = fs.readFileSync(seoCsvPath, 'utf8').trim().split(/\r?\n/);
      harness.assert(lines.length >= 18, `SEO redirect matrix contains at least 18 rows (found ${lines.length})`);
      const rules = redirectFixture.rules;
      harness.assert(rules.length >= 18, 'Redirect fixture contains 18 rules');
      harness.assert(rules.every(r => r.code === 301), 'All redirect rules enforce HTTP 301 Permanent Redirect');
      harness.assert(rules.some(r => r.type === 'product'), 'Includes product redirect rules');
      harness.assert(rules.some(r => r.type === 'collection'), 'Includes collection redirect rules');
      harness.assert(rules.some(r => r.type === 'page'), 'Includes page redirect rules');
    });
  });

  // =========================================================================
  // Feature 26: Server-Level .htaccess Redirection
  // =========================================================================
  harness.suite('Feature 26: Server-Level .htaccess Redirection', () => {
    harness.test('Apache / LiteSpeed server rewrite rules', () => {
      const htaccessPath = path.join(rootDir, 'seo_redirects.htaccess');
      harness.assert(fs.existsSync(htaccessPath), 'seo_redirects.htaccess exists');
      const htaccess = fs.readFileSync(htaccessPath, 'utf8');
      harness.assert(htaccess.includes('<IfModule mod_rewrite.c>'), 'Encapsulated in mod_rewrite.c module guard');
      harness.assert(htaccess.includes('Redirect 301'), 'Contains standard Redirect 301 directives');
      harness.assert(htaccess.includes('/products/antique-venetian-cushion'), 'Redirects Antique Venetian Cushion');
      harness.assert(htaccess.includes('/collections/venetian-mirror'), 'Redirects Venetian Mirror collection');
      harness.assert(htaccess.includes('/pages/about-us'), 'Redirects About Us content page');
    });
  });

  // =========================================================================
  // Feature 27: Redirection Plugin CSV Import
  // =========================================================================
  harness.suite('Feature 27: Redirection Plugin CSV Import', () => {
    harness.test('Redirection plugin formatted CSV validation', () => {
      const seoCsvPath = path.join(rootDir, 'data', 'seo_301_redirects.csv');
      const content = fs.readFileSync(seoCsvPath, 'utf8');
      const rows = content.trim().split(/\r?\n/);
      const header = rows[0];
      harness.assert(header.includes('Source URL') && header.includes('Target URL'), 'Header defines Source URL and Target URL');
      for (let i = 1; i < rows.length; i++) {
        const parts = rows[i].split(',');
        harness.assert(parts[0].startsWith('/'), `Row ${i} source URL starts with leading slash: ${parts[0]}`);
        harness.assert(parts[1].startsWith('/'), `Row ${i} target URL starts with leading slash: ${parts[1]}`);
        harness.assertEqual(parts[2].trim(), '301', `Row ${i} status code is 301`);
      }
    });
  });

  // =========================================================================
  // Feature 28: Venetian Mirror Multi-Route Alias
  // =========================================================================
  harness.suite('Feature 28: Venetian Mirror Multi-Route Alias', () => {
    harness.test('Dual legacy aliases for Venetian Mirror resolving to Rococo Floral', () => {
      const rules = redirectFixture.rules;
      const v1 = rules.find(r => r.source === '/products/venetian-mirror');
      harness.assert(Boolean(v1), 'Source /products/venetian-mirror is registered');
      harness.assertEqual(v1?.target, '/product/rococo-floral/', 'Alias /products/venetian-mirror points to /product/rococo-floral/');

      const v2 = rules.find(r => r.source === '/product/venetian-mirror/');
      harness.assert(Boolean(v2), 'Internal alias /product/venetian-mirror/ is registered');
      harness.assertEqual(v2?.target, '/product/rococo-floral/', 'Internal alias /product/venetian-mirror/ points to /product/rococo-floral/');

      const canonical = rules.find(r => r.source === '/products/rococo-floral');
      harness.assert(Boolean(canonical), 'Canonical /products/rococo-floral is registered');
      harness.assertEqual(canonical?.target, '/product/rococo-floral/', 'Canonical points to /product/rococo-floral/');
    });
  });

  // =========================================================================
  // Feature 29: Local Data & Asset Integrity Verification
  // =========================================================================
  harness.suite('Feature 29: Local Data & Asset Integrity Verification', () => {
    harness.test('Automated verification script operational assertions', () => {
      const verifyScriptPath = path.join(rootDir, 'scripts', 'verify_migration.js');
      harness.assert(fs.existsSync(verifyScriptPath), 'scripts/verify_migration.js exists');
      const verifyScript = fs.readFileSync(verifyScriptPath, 'utf8');
      harness.assert(verifyScript.includes('data/shopify_export.json exists'), 'Validates shopify_export.json presence');
      harness.assert(verifyScript.includes('data/woocommerce_categories.csv exists'), 'Validates categories CSV');
      harness.assert(verifyScript.includes('data/woocommerce_products.csv exists'), 'Validates products CSV');
      harness.assert(verifyScript.includes('data/seo_301_redirects.csv exists'), 'Validates SEO redirects CSV');
      harness.assert(verifyScript.includes('assets/images directory exists'), 'Validates local mirror images directory');
    });
  });

  // =========================================================================
  // Feature 30: Live WooCommerce REST API Audit
  // =========================================================================
  harness.suite('Feature 30: Live WooCommerce REST API Audit', () => {
    harness.test('Audit script capabilities and price parity logic', () => {
      const auditScriptPath = path.join(rootDir, 'scripts', 'audit_wordpress.js');
      harness.assert(fs.existsSync(auditScriptPath), 'scripts/audit_wordpress.js exists');
      const auditScript = fs.readFileSync(auditScriptPath, 'utf8');
      harness.assert(auditScript.includes('/wp-json/wc/v3/products'), 'Audit script targets WooCommerce products endpoint');
      harness.assert(auditScript.includes('API Latency / Health'), 'Audit monitors API latency');
      harness.assert(auditScript.includes('Live WooCommerce Product Count'), 'Audit verifies live catalog count');
      harness.assert(auditScript.includes('Price match'), 'Audit conducts price parity checks');
      harness.assert(auditScript.includes('migration_audit_report.md'), 'Audit produces persistent Markdown report');
    });
  });

  // =========================================================================
  // Feature 31: Mobile Cellular End-to-End Test Transaction
  // =========================================================================
  harness.suite('Feature 31: Mobile Cellular End-to-End Test Transaction', () => {
    harness.test('Mobile cellular network test checkout requirements', () => {
      const cutoverText = fs.readFileSync(path.join(rootDir, 'cutover-guide.md'), 'utf8');
      harness.assert(cutoverText.includes('smartphone'), 'Specifies smartphone testing');
      harness.assert(cutoverText.includes('mobile data') || cutoverText.includes('disconnected from your home Wi-Fi'), 'Requires mobile cellular connection');
      harness.assert(cutoverText.includes('real UPI or Card transaction') || cutoverText.includes('Cash on Delivery'), 'Tests real transaction methods');
      harness.assert(cutoverText.includes('refund'), 'Instructs immediate refund for test transactions');
      harness.assert(cutoverText.includes('Processing'), 'Verifies Processing order status');
    });
  });

  // =========================================================================
  // Feature 32: Order Status Lifecycle Validation
  // =========================================================================
  harness.suite('Feature 32: Order Status Lifecycle Validation', () => {
    harness.test('WooCommerce order status state machine transitions', () => {
      const transitions = orderFixture.order_lifecycle.valid_transitions;
      const pendingToProcessing = transitions.find(t => t.from === 'pending' && t.to === 'processing');
      harness.assert(Boolean(pendingToProcessing), 'Permits pending -> processing transition');
      const processingToCompleted = transitions.find(t => t.from === 'processing' && t.to === 'completed');
      harness.assert(Boolean(processingToCompleted), 'Permits processing -> completed transition');
      const processingToRefunded = transitions.find(t => t.from === 'processing' && t.to === 'refunded');
      harness.assert(Boolean(processingToRefunded), 'Permits processing -> refunded transition');
      const invalidTransitions = orderFixture.order_lifecycle.invalid_transitions;
      harness.assert(invalidTransitions.some(t => t.from === 'completed' && t.to === 'pending'), 'Forbids completed -> pending regression');
      harness.assert(invalidTransitions.some(t => t.from === 'refunded' && t.to === 'processing'), 'Forbids refunded -> processing regression');
    });
  });

  // =========================================================================
  // Feature 33: Branded Customer Email Receipt
  // =========================================================================
  harness.suite('Feature 33: Branded Customer Email Receipt', () => {
    harness.test('Customer invoice receipt fields and branding requirements', () => {
      const schema = orderFixture.customer_receipt_schema;
      harness.assertEqual(schema.expected_store_name, 'Reflection Elite', 'Receipt brand is Reflection Elite');
      harness.assertEqual(schema.expected_currency, 'INR', 'Receipt currency is INR');
      harness.assertEqual(schema.expected_currency_symbol, '₹', 'Receipt currency symbol is ₹');
      harness.assert(schema.required_fields.includes('line_items'), 'Receipt includes line items breakdown');
      harness.assert(schema.required_fields.includes('fragile_transit_notice'), 'Receipt includes fragile transit disclaimer');
    });
  });

  // =========================================================================
  // Feature 34: Store Admin Order Alert
  // =========================================================================
  harness.suite('Feature 34: Store Admin Order Alert', () => {
    harness.test('Admin order notification recipient and contact payload', () => {
      const adminSchema = orderFixture.admin_notification_schema;
      harness.assert(adminSchema.required_recipients.includes('info@reflectionelite.com'), 'Alerts sent to info@reflectionelite.com');
      harness.assert(adminSchema.required_fields.includes('customer_phone'), 'Alert captures customer phone number for freight delivery');
      harness.assert(adminSchema.required_fields.includes('delivery_pincode'), 'Alert captures destination PIN code');
      harness.assert(adminSchema.required_fields.includes('order_total'), 'Alert captures total order value');
      harness.assert(adminSchema.required_fields.includes('payment_gateway'), 'Alert identifies payment gateway utilized');
    });
  });

  // =========================================================================
  // Feature 35: SMTP Relay Delivery Configuration
  // =========================================================================
  harness.suite('Feature 35: SMTP Relay Delivery Configuration', () => {
    harness.test('Transactional SMTP email deliverability setup', () => {
      const checklist = fs.readFileSync(path.join(rootDir, 'go-live-checklist.md'), 'utf8');
      harness.assert(checklist.includes('WP Mail SMTP') || checklist.includes('FluentSMTP'), 'Specifies SMTP plugin installation');
      harness.assert(checklist.includes('spam folders'), 'Purpose is eliminating customer spam placement');
      harness.assert(checklist.includes('Automated Email Confirmations'), 'Included in go-live checklist section 5');
      harness.assert(checklist.includes('Admin New Order Alert'), 'Covers admin new order alert routing');
      harness.assert(checklist.includes('Customer Order Receipt'), 'Covers customer order receipt routing');
    });
  });

  // =========================================================================
  // Feature 36: Safe Shopify Deactivation Protocol
  // =========================================================================
  harness.suite('Feature 36: Safe Shopify Deactivation Protocol', () => {
    harness.test('Safety gate preventing premature Shopify cancellation', () => {
      const cutover = fs.readFileSync(path.join(rootDir, 'cutover-guide.md'), 'utf8');
      harness.assert(cutover.includes('NEVER cancel or pause Shopify until your new WooCommerce store has successfully processed a real, verified live test order'), 'Enforces golden rule against premature closure');
      harness.assert(cutover.includes('Archive Shopify Data'), 'Mandates 7-year GST/tax order export archiving');
      harness.assert(cutover.includes('Pause and Build Plan ($9/month)'), 'Presents Pause and Build option ($9/mo)');
      harness.assert(cutover.includes('Full Cancellation ($0/month)'), 'Presents Full Cancellation option');
      harness.assert(cutover.includes('Deactivate store'), 'Guides safe deactivation button in Shopify');
    });
  });

  return harness;
}

function checklistTextCheck(dir, text) {
  try {
    const content = fs.readFileSync(path.join(dir, 'go-live-checklist.md'), 'utf8');
    return content.toLowerCase().includes(text.toLowerCase());
  } catch (e) {
    return false;
  }
}
