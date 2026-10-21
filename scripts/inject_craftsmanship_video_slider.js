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
  fs.writeFileSync('backups/page_68_before_video_slider.html', content);
  console.log('✅ Backup saved to backups/page_68_before_video_slider.html');

  // 2. Locate end of #re-precious-discount-banner
  const targetId = 'id="re-precious-discount-banner"';
  const targetIdx = content.indexOf(targetId);
  if (targetIdx === -1) {
    throw new Error('Could not find #re-precious-discount-banner in Page 68!');
  }

  const sectionEndTag = '</section>';
  const endOfBannerSection = content.indexOf(sectionEndTag, targetIdx);
  if (endOfBannerSection === -1) {
    throw new Error('Could not find closing </section> for #re-precious-discount-banner!');
  }

  const insertionPoint = endOfBannerSection + sectionEndTag.length;

  // 3. Exact Shopify Craftsmanship Video Slider HTML, CSS & Script
  const videoSliderHtml = `

<!-- SHOPIFY ATELIER EXACT REPLICA: CRAFTSMANSHIP VIDEO SLIDER (PREMIUM MATERIALS) -->
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
      padding: 90px 0 90px !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
      color: #ffffff !important;
      z-index: 5;
    }

    #re-craftsmanship-video-slider * {
      box-sizing: border-box;
    }

    #re-craftsmanship-video-slider .re-slider-container {
      max-width: 1600px;
      margin: 0 auto;
      padding: 0 40px;
      position: relative;
    }

    #re-craftsmanship-video-slider .re-slider-heading {
      text-align: center;
      color: #ffffff;
      font-family: 'Cinzel', Georgia, serif;
      font-weight: 500;
      font-size: clamp(1.6rem, 3.2vw, 36px);
      letter-spacing: 0.12em;
      margin: 0 0 54px;
      text-transform: uppercase;
      line-height: 1.25;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
    }

    #re-craftsmanship-video-slider .re-carousel-outer {
      position: relative;
    }

    #re-craftsmanship-video-slider .re-carousel-viewport {
      overflow: hidden;
      position: relative;
      width: 100%;
    }

    #re-craftsmanship-video-slider .re-carousel-track {
      display: flex;
      gap: 30px;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform;
    }

    #re-craftsmanship-video-slider .re-carousel-slide {
      flex: 0 0 calc((100% - 60px) / 3);
      min-width: 0;
      position: relative;
    }

    #re-craftsmanship-video-slider .re-video-box {
      position: relative;
      width: 100%;
      padding-bottom: 125%;
      overflow: hidden;
      background-color: #1a1a1a;
      border-radius: 8px;
    }

    #re-craftsmanship-video-slider .re-video-el {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: grayscale(100%);
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), filter 0.5s ease;
      display: block;
    }

    #re-craftsmanship-video-slider .re-carousel-slide:hover .re-video-el {
      transform: scale(1.08);
      filter: grayscale(0%);
    }

    #re-craftsmanship-video-slider .re-slide-title {
      text-align: center;
      color: #ffffff;
      font-family: 'Cinzel', Georgia, serif;
      font-weight: 400;
      font-size: 20px;
      letter-spacing: 0.08em;
      margin: 24px 0 0;
      text-transform: uppercase;
      line-height: 1.3;
    }

    /* Minimalist luxury navigation arrows */
    #re-craftsmanship-video-slider .re-nav-btn {
      position: absolute;
      top: 42%;
      transform: translateY(-50%);
      width: 50px;
      height: 50px;
      background-color: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.8);
      color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: all 0.3s ease;
      border-radius: 50%;
      padding: 0;
    }

    #re-craftsmanship-video-slider .re-nav-btn:hover {
      background-color: #ffffff;
      color: #000000;
      border-color: #ffffff;
      transform: translateY(-50%) scale(1.1);
    }

    #re-craftsmanship-video-slider .re-nav-prev {
      left: -20px;
    }

    #re-craftsmanship-video-slider .re-nav-next {
      right: -20px;
    }

    #re-craftsmanship-video-slider .re-nav-btn svg {
      width: 22px;
      height: 22px;
    }

    @media screen and (max-width: 989px) {
      #re-craftsmanship-video-slider .re-slider-container {
        padding: 0 30px;
      }
      #re-craftsmanship-video-slider .re-slider-heading {
        font-size: 24px;
        margin-bottom: 40px;
      }
      #re-craftsmanship-video-slider .re-carousel-slide {
        flex: 0 0 calc((100% - 30px) / 2);
      }
      #re-craftsmanship-video-slider .re-slide-title {
        font-size: 17px;
      }
      #re-craftsmanship-video-slider .re-nav-prev { left: 4px; }
      #re-craftsmanship-video-slider .re-nav-next { right: 4px; }
    }

    @media screen and (max-width: 749px) {
      #re-craftsmanship-video-slider {
        padding: 60px 0 !important;
      }
      #re-craftsmanship-video-slider .re-slider-container {
        padding: 0 20px;
      }
      #re-craftsmanship-video-slider .re-slider-heading {
        font-size: 18px;
        letter-spacing: 0.08em;
        margin-bottom: 34px;
      }
      #re-craftsmanship-video-slider .re-carousel-slide {
        flex: 0 0 100%;
      }
      #re-craftsmanship-video-slider .re-slide-title {
        font-size: 14px;
        margin-top: 18px;
      }
      #re-craftsmanship-video-slider .re-nav-btn {
        width: 38px;
        height: 38px;
      }
      #re-craftsmanship-video-slider .re-nav-prev { left: 8px; }
      #re-craftsmanship-video-slider .re-nav-next { right: 8px; }
    }
  </style>

  <div class="re-slider-container">
    <h2 class="re-slider-heading">Premium materials and hand-selected finishing touches</h2>

    <div class="re-carousel-outer">
      <div class="re-carousel-viewport">
        <div class="re-carousel-track">
          
          <!-- Slide 1: Artistic beveling -->
          <div class="re-carousel-slide">
            <div class="re-video-box">
              <video class="re-video-el" autoplay muted loop playsinline preload="metadata">
                <source src="https://cdn.shopify.com/videos/c/vp/f0dc08273df6442ab525979e1b95a9c9/f0dc08273df6442ab525979e1b95a9c9.HD-1080p-7.2Mbps-85453874.mp4" type="video/mp4">
              </video>
            </div>
            <h3 class="re-slide-title">Artistic beveling</h3>
          </div>

          <!-- Slide 2: Glass engraving -->
          <div class="re-carousel-slide">
            <div class="re-video-box">
              <video class="re-video-el" autoplay muted loop playsinline preload="metadata">
                <source src="https://cdn.shopify.com/videos/c/vp/d8b2e5e14dae43eb861687c982709290/d8b2e5e14dae43eb861687c982709290.HD-1080p-7.2Mbps-85453876.mp4" type="video/mp4">
              </video>
            </div>
            <h3 class="re-slide-title">Glass engraving</h3>
          </div>

          <!-- Slide 3: Silvering -->
          <div class="re-carousel-slide">
            <div class="re-video-box">
              <video class="re-video-el" autoplay muted loop playsinline preload="metadata">
                <source src="https://cdn.shopify.com/videos/c/vp/7fec2597e4eb42b289ba6d9410f32033/7fec2597e4eb42b289ba6d9410f32033.HD-1080p-7.2Mbps-85492899.mp4" type="video/mp4">
              </video>
            </div>
            <h3 class="re-slide-title">Silvering</h3>
          </div>

          <!-- Slide 4: Customize size in every perspective -->
          <div class="re-carousel-slide">
            <div class="re-video-box">
              <video class="re-video-el" autoplay muted loop playsinline preload="metadata">
                <source src="https://cdn.shopify.com/videos/c/vp/41497ea7ccfc4841be65c24b090afab4/41497ea7ccfc4841be65c24b090afab4.SD-480p-1.5Mbps-85453875.mp4" type="video/mp4">
              </video>
            </div>
            <h3 class="re-slide-title">Customize size in every perspective</h3>
          </div>

        </div>
      </div>

      <!-- Navigation Arrows -->
      <button class="re-nav-btn re-nav-prev" aria-label="Previous slide">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button class="re-nav-btn re-nav-next" aria-label="Next slide">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  </div>

  <script>
    (function() {
      const container = document.getElementById('re-craftsmanship-video-slider');
      if (!container) return;

      const track = container.querySelector('.re-carousel-track');
      const slides = container.querySelectorAll('.re-carousel-slide');
      const prevBtn = container.querySelector('.re-nav-prev');
      const nextBtn = container.querySelector('.re-nav-next');
      const viewport = container.querySelector('.re-carousel-viewport');

      let currentIndex = 0;
      let isHovered = false;
      let autoplayTimer = null;
      const autoplaySpeed = 4000;

      function getSlidesPerView() {
        const w = window.innerWidth;
        if (w <= 749) return 1;
        if (w <= 989) return 2;
        return 3;
      }

      function getMaxIndex() {
        return Math.max(0, slides.length - getSlidesPerView());
      }

      function updatePosition() {
        const spv = getSlidesPerView();
        const gap = 30;
        const totalSlides = slides.length;
        const vpWidth = viewport.offsetWidth;
        
        // Calculate exact movement
        const slideWidth = (vpWidth - (spv - 1) * gap) / spv;
        const offsetPx = currentIndex * (slideWidth + gap);
        track.style.transform = 'translateX(-' + offsetPx + 'px)';
      }

      function nextSlide() {
        const maxIdx = getMaxIndex();
        if (currentIndex < maxIdx) {
          currentIndex++;
        } else {
          currentIndex = 0;
        }
        updatePosition();
      }

      function prevSlide() {
        const maxIdx = getMaxIndex();
        if (currentIndex > 0) {
          currentIndex--;
        } else {
          currentIndex = maxIdx;
        }
        updatePosition();
      }

      function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(() => {
          if (!isHovered) nextSlide();
        }, autoplaySpeed);
      }

      function stopAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
      }

      if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); nextSlide(); startAutoplay(); });
      if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); prevSlide(); startAutoplay(); });

      container.addEventListener('mouseenter', () => { isHovered = true; stopAutoplay(); });
      container.addEventListener('mouseleave', () => { isHovered = false; startAutoplay(); });

      window.addEventListener('resize', updatePosition);

      // Touch / swipe support
      let startX = 0;
      viewport.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].screenX;
      }, { passive: true });

      viewport.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].screenX;
        if (startX - endX > 40) {
          nextSlide();
          startAutoplay();
        } else if (endX - startX > 40) {
          prevSlide();
          startAutoplay();
        }
      }, { passive: true });

      // Start
      updatePosition();
      startAutoplay();
    })();
  </script>
</section>
`;

  const updatedContent = content.slice(0, insertionPoint) + '\n' + videoSliderHtml.trim() + '\n' + content.slice(insertionPoint);

  console.log('2. Updating Page 68 via WordPress REST API with Craftsmanship Video Slider...');
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

  console.log('✅ Page 68 successfully updated with Craftsmanship Video Slider!');

  // Verify
  const verifyRes = await fetch(`${auth.siteUrl}/?nocache=${Date.now()}`);
  const verifyHtml = await verifyRes.text();
  const hasSlider = verifyHtml.includes('re-craftsmanship-video-slider');
  const hasBeveling = verifyHtml.includes('Artistic beveling');
  const hasSilvering = verifyHtml.includes('Silvering');

  console.log('Verification:');
  console.log('- Video slider present:', hasSlider);
  console.log('- Artistic beveling present:', hasBeveling);
  console.log('- Silvering present:', hasSilvering);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
