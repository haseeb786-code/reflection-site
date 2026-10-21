import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

function loadEnv() {
  const envPath = path.resolve('.env');
  const envVars = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          envVars[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
        }
      }
    }
  }
  return envVars;
}

const PHP_SNIPPET = `
// ==========================================================================
// RE_TEMPLATE_LEVEL_SHOP_LOOP_SUPPRESSION_V2
// Completely suppress native WooCommerce archive product loop on /shop/
// ==========================================================================
add_action( 'init', 're_install_clean_shop_archive_template' );
function re_install_clean_shop_archive_template() {
    $woo_dir = get_template_directory() . '/woocommerce';
    $target_file = $woo_dir . '/archive-product.php';
    $expected_marker = 'RE_CLEAN_CURATED_SHOP_TEMPLATE_V2';
    if ( ! file_exists( $target_file ) || strpos( @file_get_contents( $target_file ), $expected_marker ) === false ) {
        if ( ! is_dir( $woo_dir ) ) {
            wp_mkdir_p( $woo_dir );
        }
        $template_code = "<?php\\n/**\\n * RE_CLEAN_CURATED_SHOP_TEMPLATE_V2\\n * Template override to completely eliminate native WooCommerce archive loop\\n */\\ndefined( 'ABSPATH' ) || exit;\\n\\nif ( is_shop() && ! is_product_category() && ! is_product_tag() ) {\\n    get_header( 'shop' );\\n    \\$shop_page_id = wc_get_page_id( 'shop' );\\n    \\$shop_page    = get_post( \\$shop_page_id );\\n    echo '<div id=\"primary\" class=\"content-area primary\">';\\n    echo '<main id=\"main\" class=\"site-main\">';\\n    echo '<div class=\"ast-container\">';\\n    if ( \\$shop_page ) {\\n        echo apply_filters( 'the_content', \\$shop_page->post_content );\\n    }\\n    echo '</div>';\\n    echo '</main>';\\n    echo '</div>';\\n    get_footer( 'shop' );\\n    return;\\n}\\n\\nget_header( 'shop' );\\ndo_action( 'woocommerce_before_main_content' );\\ndo_action( 'woocommerce_shop_loop_header' );\\nif ( woocommerce_product_loop() ) {\\n    do_action( 'woocommerce_before_shop_loop' );\\n    woocommerce_product_loop_start();\\n    if ( wc_get_loop_prop( 'total' ) ) {\\n        while ( have_posts() ) {\\n            the_post();\\n            do_action( 'woocommerce_shop_loop' );\\n            wc_get_template_part( 'content', 'product' );\\n        }\\n    }\\n    woocommerce_product_loop_end();\\n    do_action( 'woocommerce_after_shop_loop' );\\n} else {\\n    do_action( 'woocommerce_no_products_found' );\\n}\\ndo_action( 'woocommerce_after_main_content' );\\ndo_action( 'woocommerce_sidebar' );\\nget_footer( 'shop' );\\n";
        @file_put_contents( $target_file, $template_code );
    }
}

add_filter( 'template_include', 're_force_clean_shop_template', 999 );
function re_force_clean_shop_template( $template ) {
    if ( function_exists( 'is_shop' ) && is_shop() && ! is_product_category() && ! is_product_tag() ) {
        $custom_file = get_template_directory() . '/woocommerce/archive-product.php';
        if ( file_exists( $custom_file ) ) {
            return $custom_file;
        }
    }
    return $template;
}

add_filter( 'woocommerce_product_loop', 're_disable_shop_product_loop', 999 );
function re_disable_shop_product_loop( $is_loop ) {
    if ( function_exists( 'is_shop' ) && is_shop() && ! is_product_category() && ! is_product_tag() ) {
        return false;
    }
    return $is_loop;
}

add_action( 'woocommerce_before_shop_loop', 're_remove_shop_loop_chrome', 1 );
function re_remove_shop_loop_chrome() {
    if ( function_exists( 'is_shop' ) && is_shop() && ! is_product_category() && ! is_product_tag() ) {
        remove_action( 'woocommerce_before_shop_loop', 'woocommerce_result_count', 20 );
        remove_action( 'woocommerce_before_shop_loop', 'woocommerce_catalog_ordering', 30 );
    }
}

add_action( 'woocommerce_no_products_found', 're_remove_no_products_found_on_shop', 1 );
function re_remove_no_products_found_on_shop() {
    if ( function_exists( 'is_shop' ) && is_shop() && ! is_product_category() && ! is_product_tag() ) {
        remove_action( 'woocommerce_no_products_found', 'wc_no_products_found', 10 );
    }
}
`;

async function updateThemeEditorPuppeteer() {
  const env = loadEnv();
  const siteUrl = env.PROD_WP_URL || 'https://reflectionelite.com';
  const username = env.PROD_WP_USER;
  const password = env.PROD_WP_PASS;

  console.log('=== Launching Chrome to update functions.php via WP Admin ===');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  // 1. Log in
  console.log('Navigating to login page...');
  await page.goto(`${siteUrl}/wp-login.php`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => !document.body.innerText.includes('Checking your browser'), { timeout: 15000 }).catch(() => {});

  await page.waitForSelector('#user_login', { timeout: 10000 });
  await page.type('#user_login', username);
  await page.type('#user_pass', password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }),
    page.click('#wp-submit')
  ]);
  console.log('Logged in successfully. URL:', page.url());

  // 2. Navigate to theme-editor
  console.log('Navigating to theme-editor.php for Astra functions.php...');
  await page.goto(`${siteUrl}/wp-admin/theme-editor.php?file=functions.php&theme=astra`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // Wait for CodeMirror or textarea
  await new Promise(r => setTimeout(r, 2000));

  const statusBefore = await page.evaluate((snippetToAdd) => {
    let currentVal = '';
    if (window.wp && window.wp.themePluginEditor && window.wp.themePluginEditor.instance) {
      currentVal = window.wp.themePluginEditor.instance.codemirror.getValue();
    } else {
      currentVal = document.getElementById('newcontent').value;
    }

    const hasMarker = currentVal.includes('RE_TEMPLATE_LEVEL_SHOP_LOOP_SUPPRESSION_V2');
    if (hasMarker) {
      return { alreadyPresent: true, length: currentVal.length };
    }

    const updatedVal = currentVal + '\n\n' + snippetToAdd.trim() + '\n';
    if (window.wp && window.wp.themePluginEditor && window.wp.themePluginEditor.instance) {
      window.wp.themePluginEditor.instance.codemirror.setValue(updatedVal);
    }
    document.getElementById('newcontent').value = updatedVal;

    return { alreadyPresent: false, oldLen: currentVal.length, newLen: updatedVal.length };
  }, PHP_SNIPPET);

  console.log('Editor status before save:', statusBefore);

  if (!statusBefore.alreadyPresent) {
    console.log('Clicking #submit to save updated functions.php...');
    // Click submit
    await page.click('#submit');

    // Wait for AJAX or form response
    await page.waitForFunction(() => {
      const msg = document.querySelector('#message, .notice-success, .notice-error');
      return msg && (msg.innerText.includes('File edited successfully') || msg.innerText.includes('error'));
    }, { timeout: 15000 }).catch(() => {});

    await new Promise(r => setTimeout(r, 3000));
    const resultNotice = await page.evaluate(() => {
      const notices = Array.from(document.querySelectorAll('.notice, #message')).map(n => n.innerText);
      return notices.join(' | ');
    });
    console.log('Result notices:', resultNotice);
    await page.screenshot({ path: 'theme_editor_save_result.png' });
  } else {
    console.log('Snippet already active in functions.php!');
  }

  // 3. Ping site to run init hook
  console.log('Navigating to homepage to trigger init hook...');
  await page.goto(`${siteUrl}/?t=` + Date.now(), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => !document.body.innerText.includes('Checking your browser'), { timeout: 15000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 2000));

  await browser.close();
  console.log('=== Puppeteer update finished ===');
}

updateThemeEditorPuppeteer().catch(console.error);
