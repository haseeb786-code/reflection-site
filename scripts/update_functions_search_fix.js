import { getProdAuth } from './prod_auth_helper.js';

function decodeHtmlEntities(str) {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

async function main() {
  const { siteUrl, cookies, nonce: wpNonce } = await getProdAuth();
  console.log('Fetching functions.php from theme editor...');
  const editorRes = await fetch(`${siteUrl}/wp-admin/theme-editor.php?file=functions.php&theme=astra`, {
    headers: {
      Cookie: cookies,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      Referer: `${siteUrl}/wp-admin/theme-editor.php`
    }
  });
  const html = await editorRes.text();

  const nonceMatch = html.match(/id="nonce"\s+name="nonce"\s+value="([^"]+)"/i)
                  || html.match(/name="nonce"\s+value="([^"]+)"/i);
  if (!nonceMatch) throw new Error('No theme editor nonce found');
  const nonce = nonceMatch[1];

  const contentMatch = html.match(/<textarea[^>]*id="newcontent"[^>]*>([\s\S]*?)<\/textarea>/i);
  if (!contentMatch) throw new Error('No newcontent textarea found');
  let currentContent = decodeHtmlEntities(contentMatch[1]);

  // Remove previous suppression snippets
  let baseContent = currentContent
    .replace(/\/\/ RE_TEMPLATE_LEVEL_SHOP_LOOP_SUPPRESSION_V[\s\S]*$/, '')
    .trim();

  // Refined snippet:
  // 1. Suppress native shop archive loop on /shop/
  // 2. Filter site searches to products so search surfaces real catalog mirrors & links to their product pages!
  const newSnippet = `

// RE_TEMPLATE_LEVEL_SHOP_LOOP_SUPPRESSION_V5
/**
 * Suppress native duplicate loop on /shop/ archive page
 */
add_filter( 'woocommerce_product_loop', 're_disable_shop_product_loop', 999 );
function re_disable_shop_product_loop( $is_loop ) {
    if ( function_exists( 'is_shop' ) && is_shop() && ! is_search() && ! is_product_category() && ! is_product_tag() ) {
        return false;
    }
    return $is_loop;
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

/**
 * Filter search queries to WooCommerce products only
 */
add_action( 'pre_get_posts', 're_filter_search_to_products', 99 );
function re_filter_search_to_products( $query ) {
    if ( ! is_admin() && $query->is_main_query() && $query->is_search() ) {
        $query->set( 'post_type', array( 'product' ) );
    }
}
`;

  const updatedContent = baseContent + newSnippet;

  console.log('Sending AJAX theme edit request...');
  const params = new URLSearchParams();
  params.append('action', 'edit-theme-plugin-file');
  params.append('_ajax_nonce', nonce);
  params.append('nonce', nonce);
  params.append('file', 'functions.php');
  params.append('theme', 'astra');
  params.append('newcontent', updatedContent);

  const ajaxRes = await fetch(`${siteUrl}/wp-admin/admin-ajax.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookies,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      Referer: `${siteUrl}/wp-admin/theme-editor.php?file=functions.php&theme=astra`
    },
    body: params.toString()
  });

  const json = await ajaxRes.json();
  console.log('Response:', json);

  // Purge cache
  console.log('Purging Hostinger cache...');
  await fetch(`${siteUrl}/wp-json/hostinger-tools-plugin/v1/clear-cache`, {
    method: 'DELETE',
    headers: {
      'Cookie': cookies,
      'X-WP-Nonce': wpNonce
    }
  });
  console.log('Cache cleared.');
}

main().catch(console.error);
