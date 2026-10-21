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
  const { siteUrl, cookies } = await getProdAuth();
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
  fs.writeFileSync('backups/functions_before_showcases.php', decoded);
  console.log('✓ Saved backups/functions_before_showcases.php');

  // Strip previous showcase snippets if any
  decoded = decoded.replace(/\/\/ RE_HOMEPAGE_SHOWCASES_START[\s\S]*?\/\/ RE_HOMEPAGE_SHOWCASES_END/g, '').trim();

  const PHP_CODE = `

// RE_HOMEPAGE_SHOWCASES_START
/**
 * Shortcode [te_category_showcase]
 * Category showcase: 5 luxury categories with fixed superscript counts + arched LED mirror
 */
add_shortcode( 'te_category_showcase', 're_category_showcase_shortcode' );
function re_category_showcase_shortcode() {
    $arched_img_url = 'https://reflectionelite.com/wp-content/uploads/2026/10/arched-led-contemporary-mirror.png';
    $base = 'https://reflectionelite.com';
    
    ob_start();
    ?>
    <section class="te-cat-showcase-section" id="teCatShowcase">
      <div class="te-cat-showcase-container">
        <div class="te-cat-showcase-grid">
          <div class="te-cat-list-col">
            <nav class="te-cat-nav-list" aria-label="Mirror Categories Showcase">
              <div class="te-cat-item te-cat-item-plain">
                <span class="te-cat-name"><span class="te-cat-cap">L</span>ED</span><sup class="te-cat-num">0</sup>
              </div>
              <div class="te-cat-item te-cat-item-plain">
                <span class="te-cat-name"><span class="te-cat-cap">F</span>RAME</span><sup class="te-cat-num">0</sup>
              </div>
              <div class="te-cat-item te-cat-item-linked">
                <a href="<?php echo esc_url( $base . '/product-category/diy-glass-mirror/' ); ?>" class="te-cat-link" title="Explore DIY Glass Mirrors">
                  <span class="te-cat-name"><span class="te-cat-cap">D</span>IY <span class="te-cat-cap">G</span>LASS</span><sup class="te-cat-num">1</sup>
                </a>
              </div>
              <div class="te-cat-item te-cat-item-linked">
                <a href="<?php echo esc_url( $base . '/product-category/venetian-mirror/' ); ?>" class="te-cat-link" title="Explore Venetian Mirrors">
                  <span class="te-cat-name"><span class="te-cat-cap">V</span>ENETIAN</span><sup class="te-cat-num">4</sup>
                </a>
              </div>
              <div class="te-cat-item te-cat-item-plain">
                <span class="te-cat-name"><span class="te-cat-cap">V</span>ANISHED <span class="te-cat-cap">M</span>URANO</span><sup class="te-cat-num">0</sup>
              </div>
            </nav>
          </div>
          <div class="te-cat-media-col">
            <div class="te-cat-frame-wrap">
              <img decoding="async" loading="lazy" src="<?php echo esc_url( $arched_img_url ); ?>" alt="Arched LED backlit luxury vanity mirror with handcrafted gold frame" class="te-cat-showcase-img" width="832" height="1248" />
            </div>
          </div>
        </div>
      </div>
    </section>
    <?php
    return ob_get_clean();
}

/**
 * Shortcode [te_duo_showcase]
 * Duo Mirror showcase: Silver Crown Framed (non-clickable) + Rococo Floral (clickable with live price)
 */
add_shortcode( 'te_duo_showcase', 're_duo_showcase_shortcode' );
function re_duo_showcase_shortcode() {
    $crown_img_url = 'https://reflectionelite.com/wp-content/uploads/2026/10/20260221_235950-scaled.jpg';
    $rococo_img_url = 'https://reflectionelite.com/wp-content/uploads/2026/10/20260222_092621-scaled.jpg';
    $rococo_product_url = 'https://reflectionelite.com/product/rococo-floral/';
    
    // Live WooCommerce price: Rs. 14,000.00 (no artificial sale price)
    $rococo_price = 'RS. 14,000.00';
    
    ob_start();
    ?>
    <section class="te-duo-showcase-section" id="teDuoShowcase">
      <div class="te-duo-showcase-container">
        <div class="te-duo-showcase-grid">
          
          <!-- LEFT PANEL: Silver Crown Framed (EXPLICITLY NON-CLICKABLE) -->
          <div class="te-duo-panel te-duo-panel-left" id="teDuoLeftPanel">
            <div class="te-duo-panel-inner">
              <div class="te-duo-img-wrap">
                <img decoding="async" loading="lazy" src="<?php echo esc_url( $crown_img_url ); ?>" alt="Silver Crown Framed Venetian mirror" class="te-duo-img te-duo-img-static" width="2560" height="2196" />
              </div>
            </div>
          </div>
          
          <!-- RIGHT PANEL: Rococo Floral (CLICKABLE LINK) -->
          <div class="te-duo-panel te-duo-panel-right" id="teDuoRightPanel">
            <a href="<?php echo esc_url( $rococo_product_url ); ?>" class="te-duo-card-link" aria-label="View Rococo Floral Venetian Mirror Details">
              <div class="te-duo-panel-inner">
                <div class="te-duo-caption-row">
                  <span class="te-duo-prod-title">ROCOCO FLORAL</span>
                  <span class="te-duo-prod-price"><?php echo esc_html( $rococo_price ); ?></span>
                </div>
                <div class="te-duo-img-wrap">
                  <img decoding="async" loading="lazy" src="<?php echo esc_url( $rococo_img_url ); ?>" alt="Rococo Floral Venetian mirror" class="te-duo-img te-duo-img-interactive" width="2560" height="2560" />
                </div>
              </div>
            </a>
          </div>

        </div>
      </div>
    </section>
    <?php
    return ob_get_clean();
}
// RE_HOMEPAGE_SHOWCASES_END
`;

  const finalContent = decoded + PHP_CODE;

  console.log('2. Sending AJAX save to admin-ajax.php...');
  const params = new URLSearchParams();
  params.append('action', 'edit-theme-plugin-file');
  params.append('_ajax_nonce', nonce);
  params.append('nonce', nonce);
  params.append('file', 'functions.php');
  params.append('theme', 'astra');
  params.append('newcontent', finalContent);

  const saveRes = await fetch(`${siteUrl}/wp-admin/admin-ajax.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookies,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      Referer: `${siteUrl}/wp-admin/theme-editor.php`
    },
    body: params.toString()
  });

  console.log('Save response status:', saveRes.status);
  const saveJson = await saveRes.json();
  console.log('Save response JSON:', saveJson);

  if (saveJson.success) {
    console.log('✓ functions.php updated with [te_category_showcase] and [te_duo_showcase] shortcodes!');
  } else {
    throw new Error('Failed to update functions.php: ' + JSON.stringify(saveJson));
  }
}

main().catch(err => {
  console.error('DEPLOY FAILED:', err);
  process.exit(1);
});
