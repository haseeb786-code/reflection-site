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
  fs.writeFileSync('backups/page_68_before_video_slider_fix.html', content);
  console.log('✅ Backup saved to backups/page_68_before_video_slider_fix.html');

  // 2. Locate existing #re-craftsmanship-video-slider
  const sliderStart = content.indexOf('<section id="re-craftsmanship-video-slider"');
  if (sliderStart === -1) {
    throw new Error('Could not find #re-craftsmanship-video-slider in Page 68!');
  }

  const sliderEnd = content.indexOf('</section>', sliderStart) + '</section>'.length;

  // 3. New Compact, Elegant 4-Video Grid with Perfect Shopify Sizing
  const updatedSliderHtml = `
<!-- SHOPIFY ATELIER EXACT REPLICA: CRAFTSMANSHIP 4-VIDEO SHOWCASE (ALL 4 VIDEOS VISIBLE & PERFECT PROPORTIONS) -->
<section id="re-craftsmanship-video-slider" class="re-video-slider-section">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Montserrat:wght@300;400;500;600&display=swap');

    #re-craftsmanship-video-slider {
      position: relative !important;
      width: 100vw !important;
      left: 50% !important;
      right: 50% !important;
      margin-left: -50vw !important;
      margin-right: -50vw !important;
      background-color: #000000 !important;
      padding: 70px 0 80px !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
      color: #ffffff !important;
      z-index: 5;
    }

    #re-craftsmanship-video-slider * {
      box-sizing: border-box;
    }

    #re-craftsmanship-video-slider .re-slider-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 30px;
      position: relative;
    }

    #re-craftsmanship-video-slider .re-slider-heading {
      text-align: center;
      color: #ffffff;
      font-family: 'Cinzel', Georgia, serif;
      font-weight: 500;
      font-size: clamp(1.4rem, 2.6vw, 32px);
      letter-spacing: 0.12em;
      margin: 0 0 45px;
      text-transform: uppercase;
      line-height: 1.25;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
    }

    /* 4-Column Grid on Desktop so all 4 videos are visible simultaneously */
    #re-craftsmanship-video-slider .re-video-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 22px;
      width: 100%;
    }

    #re-craftsmanship-video-slider .re-video-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
    }

    #re-craftsmanship-video-slider .re-video-box {
      position: relative;
      width: 100%;
      height: 380px;
      max-height: 400px;
      border-radius: 10px;
      overflow: hidden;
      background-color: #141414;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
    }

    #re-craftsmanship-video-slider .re-video-el {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      filter: grayscale(100%);
      transition: transform 0.65s cubic-bezier(0.25, 1, 0.5, 1), filter 0.5s ease;
      display: block;
    }

    #re-craftsmanship-video-slider .re-video-card:hover .re-video-el {
      transform: scale(1.08);
      filter: grayscale(0%);
    }

    #re-craftsmanship-video-slider .re-video-vignette {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 100%);
      pointer-events: none;
      transition: background 0.4s ease;
    }

    #re-craftsmanship-video-slider .re-video-card:hover .re-video-vignette {
      background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%);
    }

    #re-craftsmanship-video-slider .re-slide-title {
      text-align: center;
      color: #ffffff;
      font-family: 'Cinzel', Georgia, serif;
      font-weight: 500;
      font-size: 16px;
      letter-spacing: 0.08em;
      margin: 18px 0 0;
      text-transform: uppercase;
      line-height: 1.3;
      transition: color 0.3s ease;
    }

    #re-craftsmanship-video-slider .re-video-card:hover .re-slide-title {
      color: #d4a574;
    }

    @media screen and (max-width: 1100px) {
      #re-craftsmanship-video-slider .re-video-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }
      #re-craftsmanship-video-slider .re-video-box {
        height: 360px;
      }
    }

    @media screen and (max-width: 640px) {
      #re-craftsmanship-video-slider {
        padding: 50px 0 60px !important;
      }
      #re-craftsmanship-video-slider .re-slider-container {
        padding: 0 20px;
      }
      #re-craftsmanship-video-slider .re-video-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }
      #re-craftsmanship-video-slider .re-video-box {
        height: 340px;
      }
      #re-craftsmanship-video-slider .re-slider-heading {
        font-size: 20px;
        margin-bottom: 30px;
      }
      #re-craftsmanship-video-slider .re-slide-title {
        font-size: 15px;
        margin-top: 14px;
      }
    }
  </style>

  <div class="re-slider-container">
    <h2 class="re-slider-heading">Premium materials and hand-selected finishing touches</h2>

    <div class="re-video-grid">
      
      <!-- Video 1: Artistic beveling -->
      <div class="re-video-card" tabindex="0" role="article" aria-label="Artistic beveling">
        <div class="re-video-box">
          <video class="re-video-el" autoplay muted loop playsinline preload="metadata">
            <source src="https://cdn.shopify.com/videos/c/vp/f0dc08273df6442ab525979e1b95a9c9/f0dc08273df6442ab525979e1b95a9c9.HD-1080p-7.2Mbps-85453874.mp4" type="video/mp4">
          </video>
          <div class="re-video-vignette"></div>
        </div>
        <h3 class="re-slide-title">Artistic beveling</h3>
      </div>

      <!-- Video 2: Glass engraving -->
      <div class="re-video-card" tabindex="0" role="article" aria-label="Glass engraving">
        <div class="re-video-box">
          <video class="re-video-el" autoplay muted loop playsinline preload="metadata">
            <source src="https://cdn.shopify.com/videos/c/vp/d8b2e5e14dae43eb861687c982709290/d8b2e5e14dae43eb861687c982709290.HD-1080p-7.2Mbps-85453876.mp4" type="video/mp4">
          </video>
          <div class="re-video-vignette"></div>
        </div>
        <h3 class="re-slide-title">Glass engraving</h3>
      </div>

      <!-- Video 3: Silvering -->
      <div class="re-video-card" tabindex="0" role="article" aria-label="Silvering">
        <div class="re-video-box">
          <video class="re-video-el" autoplay muted loop playsinline preload="metadata">
            <source src="https://cdn.shopify.com/videos/c/vp/7fec2597e4eb42b289ba6d9410f32033/7fec2597e4eb42b289ba6d9410f32033.HD-1080p-7.2Mbps-85492899.mp4" type="video/mp4">
          </video>
          <div class="re-video-vignette"></div>
        </div>
        <h3 class="re-slide-title">Silvering</h3>
      </div>

      <!-- Video 4: Customize size in every perspective -->
      <div class="re-video-card" tabindex="0" role="article" aria-label="Customize size in every perspective">
        <div class="re-video-box">
          <video class="re-video-el" autoplay muted loop playsinline preload="metadata">
            <source src="https://cdn.shopify.com/videos/c/vp/41497ea7ccfc4841be65c24b090afab4/41497ea7ccfc4841be65c24b090afab4.SD-480p-1.5Mbps-85453875.mp4" type="video/mp4">
          </video>
          <div class="re-video-vignette"></div>
        </div>
        <h3 class="re-slide-title">Customize size in every perspective</h3>
      </div>

    </div>
  </div>
</section>
`;

  const updatedContent = content.slice(0, sliderStart) + updatedSliderHtml.trim() + content.slice(sliderEnd);

  console.log('2. Updating Page 68 via WordPress REST API with fixed 4-video layout...');
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

  console.log('✅ Page 68 successfully updated with compact 4-video layout!');

  // Verify
  const verifyRes = await fetch(`${auth.siteUrl}/?nocache=${Date.now()}`);
  const verifyHtml = await verifyRes.text();
  const hasGrid = verifyHtml.includes('re-video-grid');
  const has4Videos = verifyHtml.includes('Customize size in every perspective');

  console.log('Verification:');
  console.log('- 4-Video grid present:', hasGrid);
  console.log('- All 4 videos present:', has4Videos);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
