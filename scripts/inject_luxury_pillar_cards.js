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
  fs.writeFileSync('backups/page_68_before_luxury_pillar_cards.html', content);
  console.log('✅ Backup saved to backups/page_68_before_luxury_pillar_cards.html');

  // 2. Locate target to replace or insert
  // Look for <!-- 4 VALUE PILLARS --> or insertion after #re-slideshow-new-arrivals
  const pillarsStart = content.indexOf('<!-- 4 VALUE PILLARS -->');
  let replaceStart = -1;
  let replaceEnd = -1;

  if (pillarsStart !== -1) {
    replaceStart = pillarsStart;
    replaceEnd = content.indexOf('</section>', pillarsStart) + '</section>'.length;
  } else {
    // Fallback: right after #re-slideshow-new-arrivals
    const slideIdx = content.indexOf('id="re-slideshow-new-arrivals"');
    if (slideIdx === -1) {
      throw new Error('Could not find slideshow or pillars in Page 68!');
    }
    replaceStart = content.indexOf('</section>', slideIdx) + '</section>'.length;
    replaceEnd = replaceStart;
  }

  // 3. Exact Shopify Luxury Cards HTML & Scoped CSS
  const luxuryCardsHtml = `
<!-- SHOPIFY ATELIER EXACT REPLICA: LUXURY HOVER CARDS (INTERNATIONAL DESIGN, QUALITY FIRST, CUSTOMER CARE) -->
<section id="re-luxury-pillar-cards" class="re-luxury-cards-section">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Montserrat:wght@300;400;500&display=swap');

    #re-luxury-pillar-cards {
      position: relative !important;
      width: 100vw !important;
      left: 50% !important;
      right: 50% !important;
      margin-left: -50vw !important;
      margin-right: -50vw !important;
      background-color: #000000 !important;
      padding: 90px 0 !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
      color: #ffffff !important;
      z-index: 5;
    }

    #re-luxury-pillar-cards * {
      box-sizing: border-box;
    }

    #re-luxury-pillar-cards .re-cards-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 40px;
    }

    #re-luxury-pillar-cards .re-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
    }

    #re-luxury-pillar-cards .re-luxury-card {
      position: relative;
      overflow: hidden;
      border-radius: 12px;
      cursor: pointer;
      aspect-ratio: 2 / 3;
      background-color: #111111;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    #re-luxury-pillar-cards .re-card-img-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    #re-luxury-pillar-cards .re-card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      display: block;
      transition: transform 0.65s cubic-bezier(0.25, 1, 0.5, 1);
      transform: scale(1.0);
    }

    #re-luxury-pillar-cards .re-luxury-card:hover .re-card-img {
      transform: scale(1.12);
    }

    #re-luxury-pillar-cards .re-card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.2) 0%,
        rgba(0, 0, 0, 0.6) 100%
      );
      transition: background 0.6s ease;
      z-index: 1;
    }

    #re-luxury-pillar-cards .re-luxury-card:hover .re-card-overlay {
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.35) 0%,
        rgba(0, 0, 0, 0.88) 100%
      );
    }

    #re-luxury-pillar-cards .re-card-content {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 40px 30px;
      text-align: center;
      color: #ffffff;
      transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
      z-index: 2;
    }

    #re-luxury-pillar-cards .re-luxury-card:hover .re-card-content {
      transform: translateY(-20px);
    }

    #re-luxury-pillar-cards .re-card-title {
      font-family: 'Cinzel', Georgia, serif;
      font-weight: 500;
      font-size: 28px;
      line-height: 1.25;
      margin: 0 0 14px 0;
      letter-spacing: 0.1em;
      color: #ffffff;
      text-transform: none;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
    }

    #re-luxury-pillar-cards .re-card-desc {
      font-family: 'Montserrat', -apple-system, sans-serif;
      font-weight: 400;
      font-size: 14px;
      line-height: 1.65;
      margin: 0;
      color: rgba(255, 255, 255, 0.92);
      opacity: 0;
      max-height: 0;
      overflow: hidden;
      transition: opacity 0.6s ease, max-height 0.6s ease;
      text-shadow: 0 1px 6px rgba(0, 0, 0, 0.8);
    }

    #re-luxury-pillar-cards .re-luxury-card:hover .re-card-desc {
      opacity: 1;
      max-height: 220px;
    }

    @media (max-width: 989px) {
      #re-luxury-pillar-cards .re-cards-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }
      #re-luxury-pillar-cards .re-card-title {
        font-size: 24px;
      }
      #re-luxury-pillar-cards .re-card-desc {
        font-size: 13px;
      }
    }

    @media (max-width: 749px) {
      #re-luxury-pillar-cards {
        padding: 50px 0 !important;
      }
      #re-luxury-pillar-cards .re-cards-container {
        padding: 0 20px;
      }
      #re-luxury-pillar-cards .re-cards-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }
      #re-luxury-pillar-cards .re-card-content {
        padding: 28px 20px;
      }
      #re-luxury-pillar-cards .re-card-title {
        font-size: 22px;
      }
      #re-luxury-pillar-cards .re-card-desc {
        font-size: 12.5px;
        opacity: 0.95;
        max-height: 100px;
      }
    }
  </style>

  <div class="re-cards-container">
    <div class="re-cards-grid">
      
      <!-- Card 1: International Design -->
      <div class="re-luxury-card" tabindex="0" role="article" aria-label="International Design">
        <div class="re-card-img-wrapper">
          <img class="re-card-img" src="https://reflectionelite.com/wp-content/uploads/2026/10/card1_design.jpg" alt="International Design" loading="lazy" width="990" height="1589">
        </div>
        <div class="re-card-overlay"></div>
        <div class="re-card-content">
          <h3 class="re-card-title">International Design</h3>
          <p class="re-card-desc">We create with intention. Our products solve real problems with clean design and honest materials.</p>
        </div>
      </div>

      <!-- Card 2: Quality First -->
      <div class="re-luxury-card" tabindex="0" role="article" aria-label="Quality First">
        <div class="re-card-img-wrapper">
          <img class="re-card-img" src="https://reflectionelite.com/wp-content/uploads/2026/10/card2_quality.jpg" alt="Quality First" loading="lazy" width="998" height="1575">
        </div>
        <div class="re-card-overlay"></div>
        <div class="re-card-content">
          <h3 class="re-card-title">Quality First</h3>
          <p class="re-card-desc">We obsess over the details and strive to deliver the best products at the best prices, every time.</p>
        </div>
      </div>

      <!-- Card 3: Customer Care -->
      <div class="re-luxury-card" tabindex="0" role="article" aria-label="Customer Care">
        <div class="re-card-img-wrapper">
          <img class="re-card-img" src="https://reflectionelite.com/wp-content/uploads/2026/10/card3_care.jpg" alt="Customer Care" loading="lazy" width="736" height="981">
        </div>
        <div class="re-card-overlay"></div>
        <div class="re-card-content">
          <h3 class="re-card-title">Customer Care</h3>
          <p class="re-card-desc">We're always on your side: keeping our loyal customers happy with dedicated support.</p>
        </div>
      </div>

    </div>
  </div>
</section>
`;

  const updatedContent = content.slice(0, replaceStart) + luxuryCardsHtml.trim() + content.slice(replaceEnd);

  console.log('2. Updating Page 68 via WordPress REST API with exact Luxury Pillar Cards...');
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

  console.log('✅ Page 68 successfully updated with Luxury Pillar Cards!');

  // Verify
  const verifyRes = await fetch(`${auth.siteUrl}/?nocache=${Date.now()}`);
  const verifyHtml = await verifyRes.text();
  const hasCards = verifyHtml.includes('re-luxury-pillar-cards');
  const hasDesign = verifyHtml.includes('International Design');
  const hasQuality = verifyHtml.includes('Quality First');
  const hasCare = verifyHtml.includes('Customer Care');

  console.log('Verification:');
  console.log('- Luxury cards section present:', hasCards);
  console.log('- International Design card present:', hasDesign);
  console.log('- Quality First card present:', hasQuality);
  console.log('- Customer Care card present:', hasCare);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
