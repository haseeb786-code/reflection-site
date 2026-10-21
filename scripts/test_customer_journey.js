import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const WP_URL = 'https://reflectionelite.com';
const SCREENSHOTS_DIR = path.resolve('audit_evidence', 'screenshots');

async function testCustomerJourney() {
  console.log('=== STARTING INTERACTIVE CUSTOMER JOURNEY AUDIT ===\n');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1440, height: 900 });

  const journeyLog = [];
  function logStep(step, status, details = '') {
    console.log(`[${status}] ${step} ${details ? ': ' + details : ''}`);
    journeyLog.push({ step, status, details });
  }

  try {
    // Step 1: Browse Shop
    console.log('--- STEP 1: BROWSE SHOP ---');
    await page.goto(`${WP_URL}/shop/`, { waitUntil: 'networkidle2' });
    const productCount = await page.$$eval('.product', els => els.length);
    logStep('Shop Catalog Grid', productCount > 0 ? 'PASS' : 'FAIL', `Found ${productCount} products on shop page`);

    // Check Sorting Dropdown
    const hasSort = await page.$('select.orderby');
    if (hasSort) {
      logStep('Shop Sorting Filter', 'PASS', 'Found orderby select dropdown');
      await page.select('select.orderby', 'price');
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      logStep('Shop Sort Execution (price: low to high)', 'PASS', `Navigated to ${page.url()}`);
    } else {
      logStep('Shop Sorting Filter', 'FAIL', 'No select.orderby dropdown found');
    }

    // Step 2: Open Variable Product
    console.log('\n--- STEP 2: OPEN VARIABLE PRODUCT ---');
    await page.goto(`${WP_URL}/product/modern-victorian/`, { waitUntil: 'networkidle2' });
    const pTitle = await page.$eval('h1.product_title', el => el.textContent.trim()).catch(() => 'Not found');
    logStep('Product Page Load', pTitle.includes('Modern victorian') ? 'PASS' : 'FAIL', `Title: ${pTitle}`);

    // Check Variants
    const variationSelects = await page.$$('select[name^="attribute_"]');
    logStep('Variation Selects Found', variationSelects.length > 0 ? 'PASS' : 'FAIL', `Count: ${variationSelects.length}`);

    if (variationSelects.length > 0) {
      for (const sel of variationSelects) {
        const name = await sel.evaluate(el => el.name);
        const options = await sel.$$eval('option', opts => opts.map(o => ({ val: o.value, text: o.text })).filter(o => o.val));
        logStep(`Options for ${name}`, 'INFO', options.map(o => o.text).join(', '));
        if (options.length > 0) {
          await page.select(`select[name="${name}"]`, options[0].val);
          logStep(`Selected variant option`, 'PASS', options[0].text);
        }
      }
      await new Promise(r => setTimeout(r, 1000));
    }

    // Screenshot after selecting variant
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'journey_1_product_variant_selected.png') });

    // Step 3: Add to Cart
    console.log('\n--- STEP 3: ADD TO CART ---');
    const addToCartBtn = await page.$('.single_add_to_cart_button');
    if (addToCartBtn) {
      const isDisabled = await addToCartBtn.evaluate(b => b.disabled || b.classList.contains('disabled'));
      logStep('Add to Cart Button State', !isDisabled ? 'READY' : 'DISABLED', `Disabled = ${isDisabled}`);
      
      await addToCartBtn.click();
      logStep('Clicked Add to Cart', 'DONE');
      await new Promise(r => setTimeout(r, 2500));
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'journey_2_after_add_to_cart.png') });
    } else {
      logStep('Add to Cart Button', 'FAIL', 'Could not locate .single_add_to_cart_button');
    }

    // Step 4: Check Slide-out Drawer / Cart state
    console.log('\n--- STEP 4: CART DRAWER / HEADER CART INSPECTION ---');
    const drawerOpen = await page.$eval('#re-cart-drawer', el => el.classList.contains('open')).catch(() => false);
    logStep('Luxury Drawer Open on Add', drawerOpen ? 'PASS' : 'WARN', `Drawer open class: ${drawerOpen}`);

    const pillCount = await page.$eval('.re-cart-badge', el => el.textContent.trim()).catch(() => '0');
    logStep('Cart Badge Count', pillCount !== '0' ? 'PASS' : 'WARN', `Count: ${pillCount}`);

    // Step 5: Direct Cart Page Visit
    console.log('\n--- STEP 5: VIEW CART PAGE ---');
    await page.goto(`${WP_URL}/cart/`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'journey_3_cart_page_with_item.png') });

    const cartHtml = await page.content();
    const hasCartTable = cartHtml.includes('woocommerce-cart-form') || cartHtml.includes('wc-block-cart');
    logStep('Cart Page Rendered Content', hasCartTable ? 'PASS' : 'FAIL', hasCartTable ? 'Standard WooCommerce cart UI present' : 'Page is empty / missing cart form table');

    // Step 6: Checkout Page Visit
    console.log('\n--- STEP 6: VIEW CHECKOUT PAGE ---');
    await page.goto(`${WP_URL}/checkout/`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'journey_4_checkout_page.png') });

    const checkoutUrl = page.url();
    logStep('Checkout URL after navigation', checkoutUrl.includes('checkout') ? 'PASS' : 'REDIRECTED', checkoutUrl);

    const hasCheckoutForm = await page.$('form.woocommerce-checkout, .wc-block-checkout');
    logStep('Checkout Form Element Present', hasCheckoutForm ? 'PASS' : 'FAIL', hasCheckoutForm ? 'Checkout form found' : 'No checkout form rendered on page');

    // Check payment options rendered
    const paymentMethods = await page.$$eval('input[name="payment_method"]', inputs => inputs.map(i => ({ id: i.id, val: i.value, checked: i.checked })));
    logStep('Payment Methods on Checkout', paymentMethods.length > 0 ? 'PASS' : 'FAIL', JSON.stringify(paymentMethods));

    // Check shipping methods rendered
    const shippingMethods = await page.$$eval('input[name^="shipping_method"]', inputs => inputs.map(i => ({ id: i.id, val: i.value, checked: i.checked })));
    logStep('Shipping Methods on Checkout', shippingMethods.length > 0 ? 'PASS' : 'FAIL', JSON.stringify(shippingMethods));

    // Fill sample billing info to test Place Order / Razorpay launch
    if (hasCheckoutForm) {
      console.log('\n--- STEP 7: FILL SAMPLE CHECKOUT DETAILS ---');
      await page.type('#billing_first_name', 'AuditTest', { delay: 20 }).catch(() => {});
      await page.type('#billing_last_name', 'Customer', { delay: 20 }).catch(() => {});
      await page.type('#billing_address_1', '123 Luxury Avenue, Bandra West', { delay: 20 }).catch(() => {});
      await page.type('#billing_city', 'Mumbai', { delay: 20 }).catch(() => {});
      await page.type('#billing_postcode', '400050', { delay: 20 }).catch(() => {});
      await page.type('#billing_phone', '9876543210', { delay: 20 }).catch(() => {});
      await page.type('#billing_email', 'audittest@example.com', { delay: 20 }).catch(() => {});

      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'journey_5_checkout_filled.png') });
      logStep('Filled Checkout Fields', 'DONE');

      // Check Place order button
      const placeOrderBtn = await page.$('#place_order, button[type="submit"].wc-block-components-checkout-place-order-button');
      if (placeOrderBtn) {
        logStep('Place Order Button', 'PASS', 'Button present on checkout page');
      } else {
        logStep('Place Order Button', 'FAIL', 'Place Order button not found');
      }
    }

  } catch (err) {
    console.error('Customer Journey Error:', err);
    logStep('Journey Execution', 'ERROR', err.message);
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'journey_log.json'), JSON.stringify(journeyLog, null, 2), 'utf8');
  }
}

testCustomerJourney().catch(console.error);
