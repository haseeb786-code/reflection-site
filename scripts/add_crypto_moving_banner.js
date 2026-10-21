import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  console.log('1. Authenticating to WordPress...');
  const { siteUrl, cookies, nonce } = await getProdAuth();

  console.log('2. Fetching Page 68...');
  const pageRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/68?context=edit`, {
    headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
  });
  if (!pageRes.ok) {
    throw new Error(`Failed to fetch Page 68: HTTP ${pageRes.status}`);
  }

  const pageData = await pageRes.json();
  let content = pageData.content?.raw || '';

  // 1. Remove redundant static crypto strip inside subscribe section if present
  const cryptoStripRegex = /<!-- Crypto Strip -->[\s\S]*?<div class="re-crypto-strip">[\s\S]*?<\/div>/i;
  if (cryptoStripRegex.test(content)) {
    content = content.replace(cryptoStripRegex, '');
    console.log('Removed static crypto strip from subscribe section.');
  }

  // 2. Define the exact Moving Announcement Banner matching Shopify Atelier
  const MOVING_BANNER_HTML = `
<!-- ===================================================================== -->
<!-- SECTION: ANNOUNCEMENT BANNER 5 (PL) - CRYPTO CURRENCY ACCEPTED (MOVING TICKER) -->
<!-- ===================================================================== -->
<section id="re-crypto-announcement-banner" class="re-crypto-ticker-container">
  <style>
    #re-crypto-announcement-banner {
      position: relative !important;
      width: 100vw !important;
      left: 50% !important;
      right: 50% !important;
      margin-left: -50vw !important;
      margin-right: -50vw !important;
      background-color: #000000 !important;
      border-top: 1px solid rgba(255, 255, 255, 0.15) !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
      padding: 16px 0 !important;
      overflow: hidden !important;
      box-sizing: border-box !important;
      z-index: 5;
    }

    .re-crypto-ticker-track {
      display: flex;
      width: max-content;
      animation: reCryptoMarquee 10s linear infinite;
      will-change: transform;
    }

    .re-crypto-ticker-track:hover {
      animation-play-state: paused;
    }

    .re-crypto-ticker-content {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .re-crypto-ticker-item {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      padding: 0 45px;
      color: #ffffff;
      font-family: 'Cinzel', Georgia, serif;
      font-size: 13.5px;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .re-crypto-btc-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      background: #f7931a;
      color: #ffffff;
      border-radius: 50%;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      font-weight: 700;
      box-shadow: 0 0 8px rgba(247, 147, 26, 0.5);
      flex-shrink: 0;
    }

    @keyframes reCryptoMarquee {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }

    @media (max-width: 767px) {
      #re-crypto-announcement-banner {
        padding: 12px 0 !important;
      }
      .re-crypto-ticker-item {
        font-size: 12px;
        gap: 10px;
        padding: 0 28px;
      }
      .re-crypto-btc-icon {
        width: 18px;
        height: 18px;
        font-size: 11px;
      }
    }
  </style>

  <div class="re-crypto-ticker-track">
    <div class="re-crypto-ticker-content">
      <span class="re-crypto-ticker-item">
        <span>CRYPTO CURRENCY ACCEPTED</span>
        <span class="re-crypto-btc-icon">&#8383;</span>
      </span>
      <span class="re-crypto-ticker-item">
        <span>CRYPTO CURRENCY ACCEPTED</span>
        <span class="re-crypto-btc-icon">&#8383;</span>
      </span>
      <span class="re-crypto-ticker-item">
        <span>CRYPTO CURRENCY ACCEPTED</span>
        <span class="re-crypto-btc-icon">&#8383;</span>
      </span>
      <span class="re-crypto-ticker-item">
        <span>CRYPTO CURRENCY ACCEPTED</span>
        <span class="re-crypto-btc-icon">&#8383;</span>
      </span>
      <span class="re-crypto-ticker-item">
        <span>CRYPTO CURRENCY ACCEPTED</span>
        <span class="re-crypto-btc-icon">&#8383;</span>
      </span>
    </div>
    <div class="re-crypto-ticker-content" aria-hidden="true">
      <span class="re-crypto-ticker-item">
        <span>CRYPTO CURRENCY ACCEPTED</span>
        <span class="re-crypto-btc-icon">&#8383;</span>
      </span>
      <span class="re-crypto-ticker-item">
        <span>CRYPTO CURRENCY ACCEPTED</span>
        <span class="re-crypto-btc-icon">&#8383;</span>
      </span>
      <span class="re-crypto-ticker-item">
        <span>CRYPTO CURRENCY ACCEPTED</span>
        <span class="re-crypto-btc-icon">&#8383;</span>
      </span>
      <span class="re-crypto-ticker-item">
        <span>CRYPTO CURRENCY ACCEPTED</span>
        <span class="re-crypto-btc-icon">&#8383;</span>
      </span>
      <span class="re-crypto-ticker-item">
        <span>CRYPTO CURRENCY ACCEPTED</span>
        <span class="re-crypto-btc-icon">&#8383;</span>
      </span>
    </div>
  </div>
</section>
`.trim();

  // 3. Insert or Replace Moving Banner right between Email section and FAQ section
  const existingBannerRegex = /<!-- =* -->[\s\S]*?<section id="re-crypto-announcement-banner"[\s\S]*?<\/section>/i;
  if (existingBannerRegex.test(content)) {
    content = content.replace(existingBannerRegex, MOVING_BANNER_HTML);
    console.log('Updated existing moving crypto banner.');
  } else {
    const faqTarget = '<section id="re-faq-section"';
    const faqIdx = content.indexOf(faqTarget);
    if (faqIdx === -1) {
      throw new Error('Could not find re-faq-section in Page 68!');
    }
    content = content.slice(0, faqIdx) + MOVING_BANNER_HTML + '\n\n' + content.slice(faqIdx);
    console.log('Inserted moving crypto banner right before FAQ section.');
  }

  // 4. Save Page 68 with retry
  console.log('3. Updating Page 68 via WordPress REST API...');
  let updateOk = false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`Attempt ${attempt} to save Page 68...`);
      const updateRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/68`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookies,
          'X-WP-Nonce': nonce
        },
        body: JSON.stringify({ content }),
        signal: AbortSignal.timeout(30000)
      });
      if (updateRes.ok) {
        updateOk = true;
        console.log('? Page 68 updated successfully.');
        break;
      } else {
        const errText = await updateRes.text();
        console.warn(`HTTP ${updateRes.status} on attempt ${attempt}: ${errText}`);
      }
    } catch (e) {
      console.warn(`Attempt ${attempt} network error: ${e.message}`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  if (!updateOk) {
    throw new Error('Failed to update Page 68 after 3 attempts');
  }

  // 5. Purge Hostinger Cache
  console.log('4. Purging Hostinger cache...');
  const purgeRes = await fetch(`${siteUrl}/wp-json/hostinger-tools-plugin/v1/clear-cache`, {
    method: 'DELETE',
    headers: {
      'Cookie': cookies,
      'X-WP-Nonce': nonce
    }
  });

  if (purgeRes.ok) {
    console.log('? Hostinger cache cleared successfully.');
  } else {
    console.warn(`Cache clear returned HTTP ${purgeRes.status}`);
  }

  console.log('ALL DONE!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
