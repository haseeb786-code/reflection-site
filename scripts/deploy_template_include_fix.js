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
  const { siteUrl, cookies } = await getProdAuth();
  console.log('Fetching theme-editor.php...');
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

  // Remove previous V3 suppression snippet if present
  if (currentContent.includes('// RE_TEMPLATE_LEVEL_SHOP_LOOP_SUPPRESSION_V3')) {
    const idx = currentContent.indexOf('// RE_TEMPLATE_LEVEL_SHOP_LOOP_SUPPRESSION_V3');
    currentContent = currentContent.slice(0, idx).trim();
  }
  if (currentContent.includes('// RE_TEMPLATE_LEVEL_SHOP_LOOP_SUPPRESSION_V4')) {
    const idx = currentContent.indexOf('// RE_TEMPLATE_LEVEL_SHOP_LOOP_SUPPRESSION_V4');
    currentContent = currentContent.slice(0, idx).trim();
  }

  const newSnippet = `

// RE_TEMPLATE_LEVEL_SHOP_LOOP_SUPPRESSION_V4
/**
 * Direct template override via template_include to completely suppress native WooCommerce archive product loop.
 * Renders pure Page 6 content and exits before native WooCommerce product loop executes.
 */
add_filter( 'template_include', 're_clean_shop_template', 999 );
function re_clean_shop_template( $template ) {
    if ( function_exists( 'is_shop' ) && is_shop() && ! is_product_category() && ! is_product_tag() ) {
        get_header( 'shop' );
        $shop_page_id = wc_get_page_id( 'shop' );
        $shop_page    = get_post( $shop_page_id );
        echo '<div id="primary" class="content-area primary">';
        echo '<main id="main" class="site-main">';
        echo '<div class="ast-container">';
        if ( $shop_page ) {
            echo apply_filters( 'the_content', $shop_page->post_content );
        }
        echo '</div>';
        echo '</main>';
        echo '</div>';
        get_footer( 'shop' );
        exit;
    }
    return $template;
}
`;

  const updatedContent = currentContent + newSnippet;

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

  const jsonText = await ajaxRes.text();
  console.log('Response:', jsonText);
}

main().catch(console.error);
