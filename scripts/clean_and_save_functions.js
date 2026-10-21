import { getProdAuth } from './prod_auth_helper.js';

function decodeAllHtmlEntities(str) {
  let s = str;
  for (let i = 0; i < 3; i++) {
    s = s
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&');
  }
  return s;
}

async function main() {
  const { siteUrl, cookies, nonce: wpNonce } = await getProdAuth();
  console.log('Fetching functions.php...');
  const res = await fetch(`${siteUrl}/wp-admin/theme-editor.php?file=functions.php&theme=astra`, {
    headers: {
      Cookie: cookies,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      Referer: `${siteUrl}/wp-admin/theme-editor.php`
    }
  });
  const html = await res.text();
  const nonce = (html.match(/id="nonce"\s+name="nonce"\s+value="([^"]+)"/i) || html.match(/name="nonce"\s+value="([^"]+)"/i))[1];
  const rawText = html.match(/<textarea[^>]*id="newcontent"[^>]*>([\s\S]*?)<\/textarea>/i)[1];
  
  let decoded = decodeAllHtmlEntities(rawText);

  // Strip all previous suppression markers
  decoded = decoded.replace(/\/\/ RE_TEMPLATE_LEVEL_SHOP_LOOP_SUPPRESSION[\s\S]*$/, '').trim();

  // Bulletproof query-level suppression of the native loop on /shop/
  const cleanSnippet = `

// RE_TEMPLATE_LEVEL_SHOP_LOOP_SUPPRESSION_V6
add_action( 'pre_get_posts', 're_suppress_shop_native_loop', 999 );
function re_suppress_shop_native_loop( $query ) {
    if ( ! is_admin() && $query->is_main_query() && function_exists( 'is_shop' ) && is_shop() && ! is_search() && ! is_product_category() && ! is_product_tag() ) {
        $query->set( 'post__in', array( 0 ) );
    }
}

add_action( 'woocommerce_before_shop_loop', 're_remove_shop_loop_chrome', 1 );
function re_remove_shop_loop_chrome() {
    if ( function_exists( 'is_shop' ) && is_shop() && ! is_search() && ! is_product_category() && ! is_product_tag() ) {
        remove_action( 'woocommerce_before_shop_loop', 'woocommerce_result_count', 20 );
        remove_action( 'woocommerce_before_shop_loop', 'woocommerce_catalog_ordering', 30 );
    }
}

add_action( 'woocommerce_no_products_found', 're_remove_no_products_found_on_shop', 1 );
function re_remove_no_products_found_on_shop() {
    if ( function_exists( 'is_shop' ) && is_shop() && ! is_search() && ! is_product_category() && ! is_product_tag() ) {
        remove_action( 'woocommerce_no_products_found', 'wc_no_products_found', 10 );
    }
}
`;

  const finalContent = decoded + cleanSnippet;

  console.log('Sending clean AJAX save...');
  const params = new URLSearchParams();
  params.append('action', 'edit-theme-plugin-file');
  params.append('_ajax_nonce', nonce);
  params.append('nonce', nonce);
  params.append('file', 'functions.php');
  params.append('theme', 'astra');
  params.append('newcontent', finalContent);

  const ajaxRes = await fetch(`${siteUrl}/wp-admin/admin-ajax.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookies,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      Referer: `${siteUrl}/wp-admin/theme-editor.php`
    },
    body: params.toString()
  });

  const json = await ajaxRes.json();
  console.log('Save result:', json);

  // Purge cache
  console.log('Purging Hostinger cache...');
  await fetch(`${siteUrl}/wp-json/hostinger-tools-plugin/v1/clear-cache`, {
    method: 'DELETE',
    headers: {
      'Cookie': cookies,
      'X-WP-Nonce': wpNonce
    }
  });
  console.log('Cache purged.');
}

main().catch(console.error);
