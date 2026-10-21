import fs from 'fs';
import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  const auth = await getProdAuth();
  console.log('1. Fetching Page 68 from:', auth.siteUrl);

  const res = await fetch(`${auth.siteUrl}/wp-json/wp/v2/pages/68?context=edit`, {
    headers: { Cookie: auth.cookies, 'X-WP-Nonce': auth.nonce }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch Page 68: HTTP ${res.status}`);
  }

  const pageData = await res.json();
  let content = pageData.content?.raw || '';

  // 1. Save Backup
  fs.writeFileSync('backups/page_68_before_discount_banner.html', content);
  console.log('✅ Backup saved to backups/page_68_before_discount_banner.html');

  // 2. Locate end of #re-luxury-pillar-cards
  const targetId = 'id="re-luxury-pillar-cards"';
  const targetIdx = content.indexOf(targetId);
  if (targetIdx === -1) {
    throw new Error('Could not find #re-luxury-pillar-cards in Page 68!');
  }

  const sectionEndTag = '</section>';
  const endOfCardsSection = content.indexOf(sectionEndTag, targetIdx);
  if (endOfCardsSection === -1) {
    throw new Error('Could not find closing </section> for #re-luxury-pillar-cards!');
  }

  const insertionPoint = endOfCardsSection + sectionEndTag.length;

  // 3. Exact Shopify Precious Discount Banner HTML & Scoped CSS
  const bannerHtml = `

<!-- SHOPIFY ATELIER EXACT REPLICA: UPTO 30% OFF ON YOUR PRECIOUS COLLECTION BANNER -->
<section id="re-precious-discount-banner" class="re-discount-banner-section">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Montserrat:wght@300;400;500;600&display=swap');

    #re-precious-discount-banner {
      position: relative !important;
      width: 100vw !important;
      left: 50% !important;
      right: 50% !important;
      margin-left: -50vw !important;
      margin-right: -50vw !important;
      display: block !important;
      overflow: hidden !important;
      background-color: #000000 !important;
      box-sizing: border-box !important;
      z-index: 5;
    }

    #re-precious-discount-banner * {
      box-sizing: border-box;
    }

    #re-precious-discount-banner .re-banner-wrapper {
      position: relative;
      width: 100%;
      height: 650px;
      overflow: hidden;
    }

    #re-precious-discount-banner .re-banner-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      display: block;
      transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
    }

    #re-precious-discount-banner:hover .re-banner-img {
      transform: scale(1.05);
    }

    #re-precious-discount-banner .re-banner-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #000000;
      opacity: 0.45;
      pointer-events: none;
      transition: opacity 0.5s ease;
    }

    #re-precious-discount-banner:hover .re-banner-overlay {
      opacity: 0.52;
    }

    #re-precious-discount-banner .re-banner-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      width: 90%;
      max-width: 740px;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    #re-precious-discount-banner .re-banner-heading {
      font-family: 'Cinzel', Georgia, serif;
      color: #ffffff;
      font-size: clamp(1.8rem, 4vw, 36px);
      margin: 0 0 18px 0;
      line-height: 1.25;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-shadow: 0 2px 14px rgba(0, 0, 0, 0.85);
    }

    #re-precious-discount-banner .re-banner-subheading {
      font-family: 'Montserrat', -apple-system, sans-serif;
      color: #f5f5f5;
      font-size: clamp(0.95rem, 1.8vw, 18px);
      margin: 0 0 28px 0;
      line-height: 1.5;
      font-weight: 400;
      letter-spacing: 0.06em;
      text-shadow: 0 1px 8px rgba(0, 0, 0, 0.8);
    }

    #re-precious-discount-banner .re-banner-btn {
      font-family: 'Montserrat', -apple-system, sans-serif;
      display: inline-block;
      padding: 16px 36px;
      background-color: #1a1a1a;
      color: #d4a574;
      text-decoration: none;
      border: 1px solid rgba(212, 165, 116, 0.4);
      cursor: pointer;
      font-size: 11px;
      font-weight: 600;
      transition: all 0.35s ease;
      text-transform: uppercase;
      letter-spacing: 2px;
      border-radius: 0px;
    }

    #re-precious-discount-banner .re-banner-btn:hover {
      background-color: #383838;
      color: #ffffff;
      border-color: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
    }

    @media screen and (max-width: 749px) {
      #re-precious-discount-banner .re-banner-wrapper {
        height: 420px;
      }
      #re-precious-discount-banner .re-banner-heading {
        font-size: 22px;
      }
      #re-precious-discount-banner .re-banner-subheading {
        font-size: 14.5px;
      }
      #re-precious-discount-banner .re-banner-btn {
        font-size: 9.5px;
        padding: 13px 26px;
      }
    }
  </style>

  <div class="re-banner-wrapper">
    <img
      src="https://reflectionelite.com/wp-content/uploads/2026/10/luxury_discount_mirror.png"
      alt="Precious Collection Luxury Mirror"
      loading="lazy"
      width="1248"
      height="832"
      class="re-banner-img"
    >
    <div class="re-banner-overlay"></div>
    <div class="re-banner-content">
      <h2 class="re-banner-heading">Upto 30% off on your precious collection</h2>
      <div class="re-banner-subheading">Elevate your space with refined elegance</div>
      <a href="/shop/" class="re-banner-btn">Shop now</a>
    </div>
  </div>
</section>
`;

  const updatedContent = content.slice(0, insertionPoint) + '\n' + bannerHtml.trim() + '\n' + content.slice(insertionPoint);

  console.log('2. Updating Page 68 via WordPress REST API with exact Precious Discount Banner...');
  const updateRes = await fetch(`${auth.siteUrl}/wp-json/wp/v2/pages/68`, {
    method: 'POST',
    headers: {
      'Cookie': auth.cookies,
      'X-WP-Nonce': auth.nonce,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content: updatedContent })
  });

  if (!updateRes.ok) {
    const errText = await updateRes.text();
    throw new Error(`Failed to update Page 68: HTTP ${updateRes.status} - ${errText}`);
  }

  console.log('✅ Page 68 successfully updated with Precious Discount Banner!');

  // Verify
  const verifyRes = await fetch(`${auth.siteUrl}/?nocache=${Date.now()}`);
  const verifyHtml = await verifyRes.text();
  const hasBanner = verifyHtml.includes('re-precious-discount-banner');
  const hasHeading = verifyHtml.includes('Upto 30% off on your precious collection');
  const hasImg = verifyHtml.includes('luxury_discount_mirror.png');

  console.log('Verification:');
  console.log('- Discount banner present:', hasBanner);
  console.log('- Heading present:', hasHeading);
  console.log('- Mirror image present:', hasImg);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
