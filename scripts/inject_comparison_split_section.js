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
  fs.writeFileSync('backups/page_68_before_comparison_split.html', content);
  console.log('✅ Backup saved to backups/page_68_before_comparison_split.html');

  // 2. Locate end of #re-craftsmanship-video-slider
  const targetId = 'id="re-craftsmanship-video-slider"';
  const targetIdx = content.indexOf(targetId);
  if (targetIdx === -1) {
    throw new Error('Could not find #re-craftsmanship-video-slider in Page 68!');
  }

  const sectionEndTag = '</section>';
  const endOfVideoSection = content.indexOf(sectionEndTag, targetIdx);
  if (endOfVideoSection === -1) {
    throw new Error('Could not find closing </section> for #re-craftsmanship-video-slider!');
  }

  const insertionPoint = endOfVideoSection + sectionEndTag.length;

  // 3. Exact Shopify Comparison Split Section HTML, CSS & Script
  const comparisonSectionHtml = `

<!-- SHOPIFY ATELIER EXACT REPLICA: INTERACTIVE BEFORE/AFTER COMPARISON SLIDER (GENERAL VS ELITE) -->
<section id="re-comparison-split-section" class="re-comparison-section">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap');

    #re-comparison-split-section {
      position: relative !important;
      width: 100vw !important;
      left: 50% !important;
      right: 50% !important;
      margin-left: -50vw !important;
      margin-right: -50vw !important;
      background-color: #000000 !important;
      padding: 90px 0 100px !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
      color: #ffffff !important;
      z-index: 5;
    }

    #re-comparison-split-section * {
      box-sizing: border-box;
    }

    #re-comparison-split-section .re-split-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 60px;
    }

    /* Left Text Column */
    #re-comparison-split-section .re-text-column {
      flex: 1;
      max-width: 580px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    #re-comparison-split-section .re-main-heading {
      font-family: 'Cinzel', Georgia, serif;
      font-size: clamp(2rem, 3.8vw, 44px);
      font-weight: 500;
      line-height: 1.25;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #ffffff;
      margin: 0 0 32px 0;
      text-shadow: 0 2px 14px rgba(0, 0, 0, 0.8);
    }

    #re-comparison-split-section .re-shop-link {
      font-family: 'Montserrat', -apple-system, sans-serif;
      display: inline-block;
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #ffffff;
      text-decoration: none;
      padding-bottom: 6px;
      border-bottom: 1.5px solid rgba(255, 255, 255, 0.85);
      transition: all 0.35s ease;
      cursor: pointer;
    }

    #re-comparison-split-section .re-shop-link:hover {
      color: #d4a574;
      border-bottom-color: #d4a574;
      transform: translateY(-2px);
      letter-spacing: 0.26em;
    }

    /* Right Interactive Comparison Slider Column */
    #re-comparison-split-section .re-slider-column {
      flex: 1;
      max-width: 560px;
      width: 100%;
    }

    #re-comparison-split-section .re-compare-widget {
      position: relative;
      width: 100%;
      height: 580px;
      border-radius: 14px;
      overflow: hidden;
      background-color: #141414;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
      user-select: none;
      --position: 50%;
    }

    #re-comparison-split-section .re-layer-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      display: block;
      pointer-events: none;
    }

    #re-comparison-split-section .re-layer-before {
      z-index: 1;
    }

    #re-comparison-split-section .re-layer-after {
      z-index: 2;
      clip-path: polygon(0 0, var(--position) 0, var(--position) 100%, 0 100%);
    }

    /* Floating Badges (General vs Elite) */
    #re-comparison-split-section .re-compare-badge {
      position: absolute;
      bottom: 24px;
      z-index: 5;
      padding: 8px 18px;
      font-family: 'Cinzel', Georgia, serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      border-radius: 4px;
      pointer-events: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    }

    #re-comparison-split-section .re-badge-general {
      left: 24px;
      background-color: rgba(20, 20, 20, 0.85);
      color: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(6px);
    }

    #re-comparison-split-section .re-badge-elite {
      right: 24px;
      background-color: rgba(10, 10, 10, 0.9);
      color: #d4a574;
      border: 1px solid rgba(212, 165, 116, 0.5);
      backdrop-filter: blur(6px);
    }

    /* Draggable Divider Line & Circular Handle */
    #re-comparison-split-section .re-compare-divider {
      position: absolute;
      top: 0;
      bottom: 0;
      left: var(--position);
      width: 2px;
      background-color: #ffffff;
      z-index: 10;
      pointer-events: none;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
      transform: translateX(-50%);
    }

    #re-comparison-split-section .re-compare-handle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 44px;
      height: 44px;
      background-color: #ffffff;
      color: #000000;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
      gap: 3px;
    }

    #re-comparison-split-section .re-compare-handle svg {
      width: 12px;
      height: 12px;
    }

    /* Transparent Overlay Range Input for Native Smooth Scrubbing */
    #re-comparison-split-section .re-compare-range {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      opacity: 0;
      cursor: ew-resize;
      z-index: 20;
    }

    @media screen and (max-width: 989px) {
      #re-comparison-split-section .re-split-container {
        flex-direction: column;
        gap: 45px;
        text-align: center;
      }
      #re-comparison-split-section .re-text-column {
        align-items: center;
        max-width: 100%;
      }
      #re-comparison-split-section .re-slider-column {
        max-width: 500px;
      }
      #re-comparison-split-section .re-compare-widget {
        height: 480px;
      }
    }

    @media screen and (max-width: 640px) {
      #re-comparison-split-section {
        padding: 60px 0 70px !important;
      }
      #re-comparison-split-section .re-split-container {
        padding: 0 20px;
      }
      #re-comparison-split-section .re-main-heading {
        font-size: 22px;
        margin-bottom: 24px;
      }
      #re-comparison-split-section .re-compare-widget {
        height: 420px;
      }
    }
  </style>

  <div class="re-split-container">
    
    <!-- Left Text Block -->
    <div class="re-text-column">
      <h2 class="re-main-heading">Beyond retail , beyond general & reflect elite</h2>
      <a href="/shop/" class="re-shop-link">SHOP NOW</a>
    </div>

    <!-- Right Interactive Comparison Slider -->
    <div class="re-slider-column">
      <div class="re-compare-widget" id="reCompareWidget">
        
        <!-- Layer 1: General (Before) -->
        <div class="re-layer-before">
          <img class="re-layer-img" src="https://reflectionelite.com/wp-content/uploads/2026/10/compare_general.png" alt="General Mirror" loading="lazy">
          <div class="re-compare-badge re-badge-general">General</div>
        </div>

        <!-- Layer 2: Elite (After) -->
        <div class="re-layer-after" id="reLayerAfter">
          <img class="re-layer-img" src="https://reflectionelite.com/wp-content/uploads/2026/10/compare_elite.png" alt="Elite Luxury Mirror" loading="lazy">
          <div class="re-compare-badge re-badge-elite">Elite</div>
        </div>

        <!-- Draggable Handle Divider -->
        <div class="re-compare-divider" id="reCompareDivider">
          <div class="re-compare-handle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>

        <!-- Interactive Range Slider -->
        <input type="range" min="0" max="100" value="50" class="re-compare-range" id="reCompareRange" aria-label="Comparison Slider">

      </div>
    </div>

  </div>

  <script>
    (function() {
      const widget = document.getElementById('reCompareWidget');
      const range = document.getElementById('reCompareRange');
      if (!widget || !range) return;

      function updateSlider(val) {
        widget.style.setProperty('--position', val + '%');
      }

      range.addEventListener('input', function(e) {
        updateSlider(e.target.value);
      });

      // Mouse drag and touch drag
      let isDragging = false;
      function onMove(clientX) {
        const rect = widget.getBoundingClientRect();
        let percent = ((clientX - rect.left) / rect.width) * 100;
        percent = Math.max(0, Math.min(100, percent));
        range.value = percent;
        updateSlider(percent);
      }

      widget.addEventListener('mousedown', function(e) {
        isDragging = true;
        onMove(e.clientX);
      });
      window.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        onMove(e.clientX);
      });
      window.addEventListener('mouseup', function() {
        isDragging = false;
      });

      widget.addEventListener('touchstart', function(e) {
        isDragging = true;
        onMove(e.touches[0].clientX);
      }, { passive: true });
      window.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        onMove(e.touches[0].clientX);
      }, { passive: true });
      window.addEventListener('touchend', function() {
        isDragging = false;
      });

      // Initialize at 50%
      updateSlider(50);
    })();
  </script>
</section>
`;

  const updatedContent = content.slice(0, insertionPoint) + '\n' + comparisonSectionHtml.trim() + '\n' + content.slice(insertionPoint);

  console.log('2. Updating Page 68 via WordPress REST API with Interactive Comparison Split Section...');
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

  console.log('✅ Page 68 successfully updated with Comparison Split Section!');

  // Verify
  const verifyRes = await fetch(`${auth.siteUrl}/?nocache=${Date.now()}`);
  const verifyHtml = await verifyRes.text();
  const hasSection = verifyHtml.includes('re-comparison-split-section');
  const hasHeading = verifyHtml.includes('Beyond retail , beyond general & reflect elite');
  const hasCompareGeneral = verifyHtml.includes('compare_general.png');
  const hasCompareElite = verifyHtml.includes('compare_elite.png');

  console.log('Verification:');
  console.log('- Comparison section present:', hasSection);
  console.log('- Heading present:', hasHeading);
  console.log('- General image present:', hasCompareGeneral);
  console.log('- Elite image present:', hasCompareElite);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
