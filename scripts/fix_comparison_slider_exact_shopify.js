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
  fs.writeFileSync('backups/page_68_before_comparison_slider_fix.html', content);
  console.log('✅ Backup saved to backups/page_68_before_comparison_slider_fix.html');

  // 2. Locate existing #re-comparison-split-section
  const sectionStart = content.indexOf('<section id="re-comparison-split-section"');
  if (sectionStart === -1) {
    throw new Error('Could not find #re-comparison-split-section in Page 68!');
  }

  const sectionEnd = content.indexOf('</section>', sectionStart) + '</section>'.length;

  // 3. New Exact Shopify Comparison Section
  const updatedSectionHtml = `
<!-- SHOPIFY ATELIER EXACT REPLICA: INTERACTIVE BEFORE/AFTER COMPARISON SLIDER (WITH LIVE DRAG EFFECT & AUTO-REVEAL) -->
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
      flex: 1.2;
      max-width: 620px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    #re-comparison-split-section .re-main-heading {
      font-family: 'Cinzel', Georgia, serif;
      font-size: clamp(2.2rem, 4.2vw, 48px);
      font-weight: 500;
      line-height: 1.22;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #ffffff;
      margin: 0 0 28px 0;
      text-shadow: 0 2px 14px rgba(0, 0, 0, 0.85);
    }

    #re-comparison-split-section .re-shop-link {
      font-family: 'Montserrat', -apple-system, sans-serif;
      display: inline-block;
      font-size: 0.82rem;
      font-weight: 600;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      padding-bottom: 6px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.5);
      transition: all 0.35s ease;
      cursor: pointer;
    }

    #re-comparison-split-section .re-shop-link:hover {
      color: #ffffff;
      border-bottom-color: #ffffff;
      transform: translateY(-2px);
      letter-spacing: 0.26em;
    }

    /* Right Comparison Slider Column matching 33% Shopify sizing */
    #re-comparison-split-section .re-slider-column {
      flex: 0.9;
      max-width: 440px;
      width: 100%;
      display: flex;
      justify-content: center;
    }

    #re-comparison-split-section .re-compare-widget {
      --compare: 50;
      position: relative;
      width: 100%;
      height: 600px;
      overflow: hidden;
      background-color: #0c0c0c;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85);
      user-select: none;
      border-radius: 4px;
      display: grid;
      grid-template: 1fr / 1fr;
    }

    /* Layer Before (General - Left) and Layer After (Elite - Right) */
    #re-comparison-split-section .re-compare-layer {
      grid-area: 1 / 1;
      position: relative;
      width: 100%;
      height: 100%;
      transition: clip-path var(--transition-duration, 0s) cubic-bezier(0.4, 0, 0.2, 1);
    }

    #re-comparison-split-section .re-layer-general {
      clip-path: inset(0 calc((100 - var(--compare)) * 1%) 0 0);
      z-index: 2;
    }

    #re-comparison-split-section .re-layer-elite {
      clip-path: inset(0 0 0 calc(var(--compare) * 1%));
      z-index: 2;
    }

    #re-comparison-split-section .re-compare-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      display: block;
      pointer-events: none;
    }

    /* Clean Top Labels (GENERAL on Left, ELITE on Right) */
    #re-comparison-split-section .re-top-label {
      position: absolute;
      top: 24px;
      z-index: 10;
      font-family: 'Cinzel', Georgia, serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #ffffff;
      pointer-events: none;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
    }

    #re-comparison-split-section .re-label-general {
      left: 24px;
    }

    #re-comparison-split-section .re-label-elite {
      right: 24px;
    }

    /* Center Vertical Divider Line & Black Circular Handle */
    #re-comparison-split-section .re-compare-line {
      position: absolute;
      top: 0;
      bottom: 0;
      left: calc(var(--compare) * 1%);
      width: 2px;
      background-color: #000000;
      z-index: 20;
      pointer-events: none;
      transform: translateX(-50%);
      transition: left var(--transition-duration, 0s) cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.7);
    }

    #re-comparison-split-section .re-compare-handle-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
      background-color: #000000;
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.7);
      gap: 3px;
      cursor: ew-resize;
      pointer-events: auto;
    }

    #re-comparison-split-section .re-compare-handle-btn svg {
      width: 10px;
      height: 10px;
      stroke-width: 2.2;
    }

    /* Native range input for seamless touch / mouse scrubbing */
    #re-comparison-split-section .re-range-scrubber {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: ew-resize;
      z-index: 30;
      margin: 0;
      padding: 0;
    }

    @media screen and (max-width: 989px) {
      #re-comparison-split-section .re-split-container {
        flex-direction: column;
        gap: 50px;
        text-align: center;
      }
      #re-comparison-split-section .re-text-column {
        align-items: center;
        max-width: 100%;
      }
      #re-comparison-split-section .re-slider-column {
        max-width: 420px;
      }
      #re-comparison-split-section .re-compare-widget {
        height: 520px;
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
        font-size: 24px;
        margin-bottom: 20px;
      }
      #re-comparison-split-section .re-compare-widget {
        height: 460px;
      }
      #re-comparison-split-section .re-compare-handle-btn {
        width: 34px;
        height: 34px;
      }
    }
  </style>

  <div class="re-split-container">
    
    <!-- Left Text Block -->
    <div class="re-text-column">
      <h2 class="re-main-heading">Beyond retail , beyond general &amp; reflect elite</h2>
      <a href="/shop/" class="re-shop-link">SHOP NOW</a>
    </div>

    <!-- Right Comparison Slider -->
    <div class="re-slider-column">
      <div class="re-compare-widget" id="reCompareWidget">
        
        <!-- Top Text Labels -->
        <div class="re-top-label re-label-general">GENERAL</div>
        <div class="re-top-label re-label-elite">ELITE</div>

        <!-- Layer 1: General Mirror (Left side revealed) -->
        <div class="re-compare-layer re-layer-general" id="reLayerGeneral">
          <img class="re-compare-img" src="https://reflectionelite.com/wp-content/uploads/2026/10/compare_general.png" alt="General Mirror" loading="lazy">
        </div>

        <!-- Layer 2: Elite Luxury Mirror (Right side revealed) -->
        <div class="re-compare-layer re-layer-elite" id="reLayerElite">
          <img class="re-compare-img" src="https://reflectionelite.com/wp-content/uploads/2026/10/compare_elite.png" alt="Elite Mirror" loading="lazy">
        </div>

        <!-- Center Divider Black Line & Circular Handle Button -->
        <div class="re-compare-line" id="reCompareLine">
          <div class="re-compare-handle-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>

        <!-- Invisible range slider for full drag/touch responsiveness -->
        <input type="range" min="0" max="100" value="50" class="re-range-scrubber" id="reCompareRange" aria-label="Comparison Slider">

      </div>
    </div>

  </div>

  <script>
    (function() {
      const widget = document.getElementById('reCompareWidget');
      const range = document.getElementById('reCompareRange');
      if (!widget || !range) return;

      let isAnimating = false;
      let hasAnimated = false;

      function setCompare(val) {
        val = Math.max(0, Math.min(100, Math.round(val)));
        widget.style.setProperty('--compare', val);
      }

      // Input listener
      range.addEventListener('input', function(e) {
        if (isAnimating) return;
        setCompare(e.target.value);
      });

      // Smooth mouse / touch dragging
      let isDragging = false;
      function handleMove(clientX) {
        const rect = widget.getBoundingClientRect();
        let percent = ((clientX - rect.left) / rect.width) * 100;
        percent = Math.max(0, Math.min(100, percent));
        range.value = Math.round(percent);
        setCompare(percent);
      }

      widget.addEventListener('mousedown', function(e) {
        if (isAnimating) return;
        isDragging = true;
        handleMove(e.clientX);
      });
      window.addEventListener('mousemove', function(e) {
        if (!isDragging || isAnimating) return;
        handleMove(e.clientX);
      });
      window.addEventListener('mouseup', function() {
        isDragging = false;
      });

      widget.addEventListener('touchstart', function(e) {
        if (isAnimating) return;
        isDragging = true;
        handleMove(e.touches[0].clientX);
      }, { passive: true });
      window.addEventListener('touchmove', function(e) {
        if (!isDragging || isAnimating) return;
        handleMove(e.touches[0].clientX);
      }, { passive: true });
      window.addEventListener('touchend', function() {
        isDragging = false;
      });

      // Shopify Auto-Reveal Animation when scrolled into view
      function triggerAutoReveal() {
        if (hasAnimated) return;
        hasAnimated = true;
        isAnimating = true;

        widget.style.setProperty('--transition-duration', '0.55s');
        setTimeout(() => { setCompare(35); range.value = 35; }, 150);
        setTimeout(() => { setCompare(65); range.value = 65; }, 750);
        setTimeout(() => { setCompare(50); range.value = 50; }, 1350);
        setTimeout(() => {
          widget.style.setProperty('--transition-duration', '0s');
          isAnimating = false;
        }, 1900);
      }

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
              setTimeout(triggerAutoReveal, 200);
              observer.disconnect();
            }
          });
        }, { threshold: 0.35 });
        observer.observe(widget);
      } else {
        setCompare(50);
      }
    })();
  </script>
</section>
`;

  const updatedContent = content.slice(0, sectionStart) + updatedSectionHtml.trim() + content.slice(sectionEnd);

  console.log('2. Updating Page 68 via WordPress REST API with exact Shopify Comparison Slider...');
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

  console.log('✅ Page 68 successfully updated with exact Comparison Slider!');

  // Verify
  const verifyRes = await fetch(`${auth.siteUrl}/?nocache=${Date.now()}`);
  const verifyHtml = await verifyRes.text();
  const hasCompareLine = verifyHtml.includes('re-compare-line');
  const hasAutoReveal = verifyHtml.includes('triggerAutoReveal');

  console.log('Verification:');
  console.log('- Comparison Line present:', hasCompareLine);
  console.log('- Auto-Reveal animation present:', hasAutoReveal);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
