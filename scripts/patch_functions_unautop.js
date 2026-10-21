import fs from 'fs';
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

async function backupAndPatchFunctions() {
  const { siteUrl, cookies } = await getProdAuth();
  console.log('1. Fetching functions.php from theme editor...');
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

  // Save backup
  fs.writeFileSync('functions_backup_pre_unautop.php', currentContent);
  console.log('✓ Saved functions_backup_pre_unautop.php');

  // Check if unautop filter already present
  if (currentContent.includes('RE_SHOP_DESCRIPTION_RAW_UNAUTOP')) {
    console.log('Unautop filter already present.');
    return;
  }

  const unautopSnippet = `
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

  const updatedContent = currentContent + '\n' + unautopSnippet.trim() + '\n';

  console.log('2. Saving updated functions.php with unautop filter...');
  const formBody = new URLSearchParams();
  formBody.append('nonce', nonce);
  formBody.append('_wp_http_referer', '/wp-admin/theme-editor.php?file=functions.php&theme=astra');
  formBody.append('theme', 'astra');
  formBody.append('file', 'functions.php');
  formBody.append('newcontent', updatedContent);

  const saveRes = await fetch(`${siteUrl}/wp-admin/theme-editor.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookies,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      Referer: `${siteUrl}/wp-admin/theme-editor.php?file=functions.php&theme=astra`
    },
    body: formBody.toString()
  });

  console.log('Theme editor save status:', saveRes.status);
  const saveHtml = await saveRes.text();
  if (saveHtml.includes('File edited successfully') || saveRes.status === 200) {
    console.log('✓ functions.php updated successfully with unautop filter!');
  } else {
    throw new Error('Could not verify successful save of functions.php');
  }
}

backupAndPatchFunctions().catch(console.error);
