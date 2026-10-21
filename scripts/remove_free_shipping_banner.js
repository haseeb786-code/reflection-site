import fs from 'fs';
import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  console.log('=== REMOVING FREE SHIPPING MOVING BANNER SITAWIDE ===');
  const auth = await getProdAuth();
  const { siteUrl, cookies, nonce } = auth;

  // -------------------------------------------------------------
  // 1. UPDATE WPCODE HEADER CSS
  // -------------------------------------------------------------
  console.log('Updating WPCode header CSS...');
  let headerCode = fs.readFileSync('scripts/wpcode_header_current.html', 'utf8');

  // Replace marquee rules with complete display: none !important
  const targetMarqueeCss = `.re-marquee-wrapper { position:relative; background:#0d0d0d; overflow:hidden; height:30px; display:flex; align-items:center; border-bottom:1px solid rgba(255,255,255,0.08); width:100%; box-sizing:border-box; }
.re-marquee { width:100%; overflow:hidden; white-space:nowrap; }
.re-marquee-track { display:inline-flex; width:max-content; animation:reMarqueeAnim 24s linear infinite; }
.re-marquee-track:hover { animation-play-state:paused; }
.re-marquee-item { display:inline-flex; align-items:center; font-family:var(--font-trajan); font-size:11px; letter-spacing:2px; color:#ffffff; padding:0 26px; text-transform:uppercase; }
.re-marquee-icon { margin-left:8px; font-size:13px; display:inline-block; }
@keyframes reMarqueeAnim { 0%{transform:translateX(0);} 100%{transform:translateX(-50%);} }`;

  const replacementMarqueeCss = `.re-marquee-wrapper, #reMarqueeBar, .re-marquee, .re-marquee-track, .re-marquee-item {
  display: none !important;
  height: 0 !important;
  max-height: 0 !important;
  min-height: 0 !important;
  visibility: hidden !important;
  overflow: hidden !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  opacity: 0 !important;
  pointer-events: none !important;
  animation: none !important;
}`;

  if (headerCode.includes(targetMarqueeCss)) {
    headerCode = headerCode.replace(targetMarqueeCss, replacementMarqueeCss);
    console.log('✓ Target marquee CSS replaced cleanly.');
  } else {
    console.log('! Target marquee CSS exact match not found; prepending override to CSS system.');
    headerCode = headerCode.replace('<style id="te-global-luxury-system">', '<style id="te-global-luxury-system">\n' + replacementMarqueeCss + '\n');
  }

  // Also replace mobile override line
  headerCode = headerCode.replace('.re-marquee-wrapper { height:26px !important; }', '.re-marquee-wrapper { display:none !important; height:0 !important; }');
  headerCode = headerCode.replace('.re-marquee-item { font-size:10px !important; padding:0 18px !important; }', '');

  fs.writeFileSync('scripts/wpcode_header_current.html', headerCode, 'utf8');

  // -------------------------------------------------------------
  // 2. UPDATE WPCODE FOOTER JS
  // -------------------------------------------------------------
  console.log('Updating WPCode footer JS...');
  let footerCode = fs.readFileSync('scripts/wpcode_footer_current.html', 'utf8');
  const REMOVE_MARQUEE_JS = `
<script id="re-remove-marquee-banner">
(function() {
  function dropMarquee() {
    var marquees = document.querySelectorAll('.re-marquee-wrapper, #reMarqueeBar');
    marquees.forEach(function(el) { el.remove(); });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', dropMarquee);
  } else {
    dropMarquee();
  }
})();
</script>
`;
  if (footerCode.includes('re-remove-marquee-banner')) {
    footerCode = footerCode.replace(/<script id="re-remove-marquee-banner">[\s\S]*?<\/script>/, '');
  }
  footerCode = footerCode.trim() + '\n\n' + REMOVE_MARQUEE_JS.trim() + '\n';
  fs.writeFileSync('scripts/wpcode_footer_current.html', footerCode, 'utf8');

  // -------------------------------------------------------------
  // 3. CLEAN UP PAGE 9 (MY ACCOUNT) POST CONTENT
  // -------------------------------------------------------------
  console.log('Fetching Page 9 to remove marquee block from HTML...');
  const res9 = await fetch(`${siteUrl}/wp-json/wp/v2/pages/9?context=edit`, {
    headers: {
      'Cookie': cookies,
      'X-WP-Nonce': nonce
    }
  });
  const data9 = await res9.json();
  let raw9 = data9.content.raw;
  const startIdx = raw9.indexOf('<div class="re-marquee-wrapper"');
  if (startIdx !== -1) {
    const nextTag = raw9.indexOf('<div class="re-main-header-row"', startIdx);
    if (nextTag !== -1) {
      raw9 = raw9.substring(0, startIdx) + raw9.substring(nextTag);
      console.log('Updating Page 9 without marquee HTML...');
      const update9Res = await fetch(`${siteUrl}/wp-json/wp/v2/pages/9`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies,
          'X-WP-Nonce': nonce
        },
        body: JSON.stringify({ content: raw9 })
      });
      console.log('Page 9 update status:', update9Res.status);
    }
  } else {
    console.log('Page 9 does not contain marquee block in raw HTML.');
  }

  // -------------------------------------------------------------
  // 4. DEPLOY TO WPCODE
  // -------------------------------------------------------------
  console.log('Fetching WPCode page to get fresh nonce...');
  const wpCodeRes = await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { Cookie: cookies }
  });
  const wpCodeHtml = await wpCodeRes.text();
  const nonceMatch = wpCodeHtml.match(/id="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i) 
                  || wpCodeHtml.match(/name="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i);
  if (!nonceMatch) {
    throw new Error('Could not find nonce on WPCode page');
  }
  const wpCodeNonce = nonceMatch[1];
  console.log('✓ Found WPCode Nonce:', wpCodeNonce);

  const formBody = new URLSearchParams();
  formBody.append('insert-headers-and-footers_nonce', wpCodeNonce);
  formBody.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-headers-footers');
  formBody.append('ihaf_insert_header', headerCode);
  formBody.append('ihaf_insert_body', '');
  formBody.append('ihaf_insert_footer', footerCode);

  const saveRes = await fetch(`${siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookies
    },
    body: formBody.toString(),
    redirect: 'manual'
  });
  console.log(`✓ WPCode saved successfully (HTTP ${saveRes.status})`);

  // -------------------------------------------------------------
  // 5. PURGE HOSTINGER CDN CACHE
  // -------------------------------------------------------------
  console.log('Purging Hostinger CDN cache...');
  const cacheRes = await fetch(`${siteUrl}/wp-json/hostinger-tools-plugin/v1/clear-cache`, {
    method: 'DELETE',
    headers: {
      'Cookie': cookies,
      'X-WP-Nonce': nonce
    }
  });
  console.log('✓ Hostinger CDN cache purged (HTTP', cacheRes.status, ')');
}

main().catch(console.error);
