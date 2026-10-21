import { getProdAuth } from './prod_auth_helper.js';
import fs from 'fs';

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
  console.log('1. Fetching current functions.php...');
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
  fs.writeFileSync('functions_pre_unautop_backup.php', decoded);
  console.log('✓ Saved functions_pre_unautop_backup.php');

  // Strip previous unautop snippet if any
  decoded = decoded.replace(/\/\/ RE_SHOP_DESCRIPTION_RAW_UNAUTOP[\s\S]*?(?=(\/\/ RE_TEMPLATE|\Z))/, '').trim();

  const unautopCode = `

// RE_SHOP_DESCRIPTION_RAW_UNAUTOP
/**
 * Prevent WooCommerce wc_format_content from corrupting custom HTML on shop archive description with wpautop / br
 */
add_filter( 'woocommerce_format_content', 're_prevent_shop_wpautop_corruption', 1, 2 );
function re_prevent_shop_wpautop_corruption( $content, $raw_string = '' ) {
    if ( ! empty( $raw_string ) && ( strpos( $raw_string, 'te-live-page' ) !== false || strpos( $raw_string, 're-unified-header-container' ) !== false ) ) {
        return $raw_string;
    }
    return $content;
}
`;

  const finalContent = decoded + unautopCode;

  console.log('2. Sending AJAX save to admin-ajax.php...');
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

  if (!json.success) {
    throw new Error('Failed to save functions.php: ' + JSON.stringify(json));
  }

  // Purge cache
  console.log('3. Purging Hostinger cache...');
  await fetch(`${siteUrl}/wp-json/hostinger-tools-plugin/v1/clear-cache`, {
    method: 'DELETE',
    headers: {
      'Cookie': cookies,
      'X-WP-Nonce': wpNonce
    }
  });
  console.log('✓ Cache purged successfully!');
}

main().catch(console.error);
