import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

const STAGING_URL = 'https://reflectionelite.ataanalytiq.com';

async function updateStagingFunctions() {
  console.log('=== READING STAGING FUNCTIONS.PHP ===');
  const editorRes = await fetch(`${STAGING_URL}/wp-admin/theme-editor.php?file=functions.php&theme=hello-elementor`, {
    headers: { Cookie: cookieHeader }
  });
  const html = await editorRes.text();

  const nonceMatch = html.match(/name="nonce"\s+value="([a-f0-9]+)"/i);
  if (!nonceMatch) throw new Error('No theme editor nonce found on staging');
  const nonce = nonceMatch[1];
  console.log('Staging Theme Editor Nonce:', nonce);

  const contentMatch = html.match(/<textarea[^>]*id="newcontent"[^>]*>([\s\S]*?)<\/textarea>/i);
  if (!contentMatch) throw new Error('No newcontent textarea found on staging');
  let currentContent = contentMatch[1]
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
  console.log('Current staging functions.php length:', currentContent.length);

  const hookMarker = 'RE_STAGING_GLOBAL_HEADER_HOOK';
  if (currentContent.includes(hookMarker)) {
    console.log('Hook marker already exists in functions.php, updating...');
    const startIdx = currentContent.indexOf('// START ' + hookMarker);
    const endIdx = currentContent.indexOf('// END ' + hookMarker);
    if (startIdx !== -1 && endIdx !== -1) {
      currentContent = currentContent.slice(0, startIdx) + currentContent.slice(endIdx + ('// END ' + hookMarker).length);
    }
  }

  const hookCode = `
// START RE_STAGING_GLOBAL_HEADER_HOOK
add_action('wp_head', function() {
    ?>
    <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/trajan-pro">
    <style id="re-staging-global-header-css">
    @font-face {
      font-family: 'Trajan Pro Bold';
      src: url('https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/trajanpro-bold.otf.ttf') format('truetype');
      font-weight: 700; font-style: normal; font-display: swap;
    }
    :root {
      --font-trajan: 'Trajan Pro Bold', 'Cinzel', Georgia, serif;
      --color-bg-dark: #0f1012;
      --color-gold: #c5a880;
      --color-border: rgba(197, 168, 128, 0.22);
      --color-text-light: #f5f5f7;
    }
    .announcement-bar {
      background: #090a0c; border-bottom: 1px solid var(--color-border);
      padding: 9px 16px; font-size: 0.72rem; font-weight: 600;
      letter-spacing: 0.18em; text-align: center; color: var(--color-gold); text-transform: uppercase;
      width: 100%; box-sizing: border-box;
    }
    .site-header {
      position: sticky; top: 0; z-index: 1000; background: rgba(15, 16, 18, 0.95);
      backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--color-border); padding: 14px 32px;
      width: 100%; box-sizing: border-box;
    }
    .header-inner {
      max-width: 1380px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 24px;
    }
    .header-logo img { height: 40px; width: auto; display: block; }
    .main-nav { display: flex; align-items: center; gap: 24px; }
    .nav-link {
      font-family: var(--font-trajan) !important; font-size: 0.82rem; letter-spacing: 0.08em;
      color: var(--color-text-light); text-decoration: none; padding: 4px 0;
    }
    .nav-link:hover { color: var(--color-gold) !important; }
    .header-quote-btn {
      font-family: var(--font-trajan) !important; background: transparent; color: var(--color-gold);
      border: 1px solid var(--color-gold); padding: 8px 18px; font-size: 0.82rem; font-weight: 700;
      letter-spacing: 0.1em; border-radius: 2px; text-decoration: none;
    }
    .header-quote-btn:hover { background: var(--color-gold); color: #000 !important; }
    @media (max-width: 900px) { .main-nav { display: none; } }
    </style>
    <?php
});

add_action('wp_body_open', function() {
    if (is_singular('product') || is_archive()) {
        ?>
        <div class="announcement-bar">
          Complimentary Insured White-Glove Logistics &amp; Laser Templating Across India
        </div>
        <header class="site-header">
          <div class="header-inner">
            <a href="https://reflectionelite.ataanalytiq.com/" class="header-logo">
              <img decoding="async" src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/Logo-Reflection-e1777369196767-1024x186.png" alt="Reflection Elite">
            </a>
            <nav class="main-nav">
              <a href="https://reflectionelite.ataanalytiq.com/" class="nav-link">HOME</a>
              <a href="https://reflectionelite.ataanalytiq.com/shop/" class="nav-link">COLLECTIONS (7)</a>
              <a href="https://reflectionelite.ataanalytiq.com/about-us/" class="nav-link">ABOUT US</a>
              <a href="https://reflectionelite.ataanalytiq.com/contact/" class="nav-link">CONTACT</a>
              <a href="https://reflectionelite.ataanalytiq.com/shipping-policy/" class="nav-link">POLICIES</a>
              <a href="https://reflectionelite.ataanalytiq.com/cart/" class="nav-link">CART</a>
            </nav>
            <a href="https://reflectionelite.ataanalytiq.com/custom-dimensions/" class="header-quote-btn">BOOK SURVEY</a>
          </div>
        </header>
        <?php
    }
}, 1);
// END RE_STAGING_GLOBAL_HEADER_HOOK
`;

  const updatedContent = currentContent + '\n' + hookCode;
  console.log('Submitting updated functions.php to staging...');

  const bodyParams = new URLSearchParams();
  bodyParams.append('nonce', nonce);
  bodyParams.append('_wp_http_referer', '/wp-admin/theme-editor.php?file=functions.php&theme=hello-elementor');
  bodyParams.append('action', 'update');
  bodyParams.append('file', 'functions.php');
  bodyParams.append('theme', 'hello-elementor');
  bodyParams.append('newcontent', updatedContent);
  bodyParams.append('submit', 'Update File');

  const saveRes = await fetch(`${STAGING_URL}/wp-admin/theme-editor.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookieHeader
    },
    body: bodyParams.toString()
  });

  console.log('Save response status:', saveRes.status);
  const saveHtml = await saveRes.text();
  if (saveHtml.includes('File edited successfully') || saveHtml.includes('updated')) {
    console.log('✓ Staging functions.php updated successfully!');
  } else {
    console.log('Notice or warning from theme editor:', saveHtml.slice(0, 300));
  }
}

updateStagingFunctions().catch(console.error);
