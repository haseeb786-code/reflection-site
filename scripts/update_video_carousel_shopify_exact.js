import fs from 'fs';
import dns from 'dns';
try { dns.setDefaultResultOrder('ipv4first'); } catch (e) {}
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

  // 1. Backup
  fs.writeFileSync('backups/page_68_before_3video_shopify_exact.html', content);
  console.log('✅ Backup saved to backups/page_68_before_3video_shopify_exact.html');

  // 2. Locate #re-craftsmanship-video-slider
  const targetId = 'id="re-craftsmanship-video-slider"';
  const targetIdx = content.indexOf(targetId);
  if (targetIdx === -1) {
    throw new Error('Could not find #re-craftsmanship-video-slider in Page 68!');
  }

  const secStart = content.lastIndexOf('<section', targetIdx);
  const secEnd = content.indexOf('</section>', targetIdx) + '</section>'.length;

  console.log(`Found current video section between indices ${secStart} and ${secEnd}`);

  // 3. Exact Shopify Atelier 3-Videos Visible Auto-Slideover Component
  const exactVideoCarouselHtml = `
<!-- ========================================================================= -->
<!-- SHOPIFY ATELIER EXACT REPLICA: 3-VIDEO AUTO SLIDEOVER CRAFTSMANSHIP CAROUSEL -->
<!-- ========================================================================= -->
<section id="re-craftsmanship-video-slider" class="re-video-slider-section">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap');

    #re-craftsmanship-video-slider {
      position: relative !important;
      width: 100vw !important;
      left: 50% !important;
      right: 50% !important;
      margin-left: -50vw !important;
      margin-right: -50vw !important;
      background-color: #000000 !important;
      padding: 90px 0 95px !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
      color: #ffffff !important;
      z-index: 5;
    }

    #re-craftsmanship-video-slider * {
      box-sizing: border-box;
    }

    #re-craftsmanship-video-slider .re-slider-container {
      max-width: 1440px;
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
      letter-spacing: 0.1em;
      margin: 0 0 55px;
      text-transform: uppercase;
      line-height: 1.25;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.85);
    }

    /* Carousel Outer & Viewport */
    #re-craftsmanship-video-slider .re-carousel-outer {
      position: relative;
      width: 100%;
    }

    #re-craftsmanship-video-slider .re-carousel-viewport {
      overflow: hidden;
      position: relative;
      width: 100%;
      border-radius: 8px;
    }

    /* Track that slides over smoothly */
    #re-craftsmanship-video-slider .re-carousel-track {
      display: flex;
      gap: 30px;
      transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform;
    }

    /* EXACT 3 VIDEOS VISIBLE ON DESKTOP */
    #re-craftsmanship-video-slider .re-carousel-slide {
      flex: 0 0 calc((100% - (2 * 30px)) / 3);
      min-width: 0;
      position: relative;
      cursor: pointer;
    }

    #re-craftsmanship-video-slider .re-video-box {
      position: relative;
      width: 100%;
      padding-bottom: 125%; /* Exact 4:5 portrait aspect ratio */
      overflow: hidden;
      background-color: #1a1a1a;
      border-radius: 6px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    }

    #re-craftsmanship-video-slider .re-video-el {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: grayscale(100%);
      transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1), filter 0.5s ease;
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
      font-weight: 500;
      font-size: 20px;
      letter-spacing: 1.5px;
      margin: 24px 0 0;
      text-transform: uppercase;
      line-height: 1.3;
      transition: color 0.3s ease;
    }

    #re-craftsmanship-video-slider .re-carousel-slide:hover .re-slide-title {
      color: #d4a574;
    }

    /* Exact Shopify Navigation Arrows */
    #re-craftsmanship-video-slider .re-nav-btn {
      position: absolute;
      top: calc(50% - 24px);
      transform: translateY(-50%);
      width: 48px;
      height: 48px;
      background-color: rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.7);
      color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: all 0.3s ease;
      border-radius: 50%;
      padding: 0;
      backdrop-filter: blur(4px);
    }

    #re-craftsmanship-video-slider .re-nav-btn:hover {
      background-color: #ffffff;
      color: #000000;
      border-color: #ffffff;
      transform: translateY(-50%) scale(1.08);
    }

    #re-craftsmanship-video-slider .re-nav-prev {
      left: 12px;
    }

    #re-craftsmanship-video-slider .re-nav-next {
      right: 12px;
    }

    #re-craftsmanship-video-slider .re-nav-btn svg {
      width: 20px;
      height: 20px;
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
        flex: 0 0 calc((100% - 30px) / 2); /* 2 videos on tablet */
      }
      #re-craftsmanship-video-slider .re-slide-title {
        font-size: 17px;
      }
      #re-craftsmanship-video-slider .re-nav-prev { left: 4px; }
      #re-craftsmanship-video-slider .re-nav-next { right: 4px; }
    }

    @media screen and (max-width: 749px) {
      #re-craftsmanship-video-slider {
        padding: 60px 0 65px !important;
      }
      #re-craftsmanship-video-slider .re-slider-container {
        padding: 0 20px;
      }
      #re-craftsmanship-video-slider .re-slider-heading {
        font-size: 20px;
        margin-bottom: 30px;
      }
      #re-craftsmanship-video-slider .re-carousel-slide {
        flex: 0 0 100%; /* 1 video on mobile */
      }
      #re-craftsmanship-video-slider .re-slide-title {
        font-size: 15px;
        margin-top: 18px;
      }
      #re-craftsmanship-video-slider .re-nav-btn {
        width: 40px;
        height: 40px;
      }
      #re-craftsmanship-video-slider .re-nav-prev { left: 2px; }
      #re-craftsmanship-video-slider .re-nav-next { right: 2px; }
    }
  </style>

  <div class="re-slider-container">
    <h2 class="re-slider-heading">Premium materials and hand-selected finishing touches</h2>

    <div class="re-carousel-outer">
      <!-- Previous Button -->
      <button class="re-nav-btn re-nav-prev" aria-label="Previous slide" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <!-- Carousel Viewport -->
      <div class="re-carousel-viewport">
        <div class="re-carousel-track">
          
          <!-- Slide 1: Artistic beveling -->
          <div class="re-carousel-slide" data-index="0">
            <div class="re-video-box">
              <video class="re-video-el" autoplay muted loop playsinline preload="metadata">
                <source src="https://cdn.shopify.com/videos/c/vp/f0dc08273df6442ab525979e1b95a9c9/f0dc08273df6442ab525979e1b95a9c9.HD-1080p-7.2Mbps-85453874.mp4" type="video/mp4">
              </video>
            </div>
            <h3 class="re-slide-title">Artistic beveling</h3>
          </div>

          <!-- Slide 2: Glass engraving -->
          <div class="re-carousel-slide" data-index="1">
            <div class="re-video-box">
              <video class="re-video-el" autoplay muted loop playsinline preload="metadata">
                <source src="https://cdn.shopify.com/videos/c/vp/d8b2e5e14dae43eb861687c982709290/d8b2e5e14dae43eb861687c982709290.HD-1080p-7.2Mbps-85453876.mp4" type="video/mp4">
              </video>
            </div>
            <h3 class="re-slide-title">Glass engraving</h3>
          </div>

          <!-- Slide 3: Silvering -->
          <div class="re-carousel-slide" data-index="2">
            <div class="re-video-box">
              <video class="re-video-el" autoplay muted loop playsinline preload="metadata">
                <source src="https://cdn.shopify.com/videos/c/vp/7fec2597e4eb42b289ba6d9410f32033/7fec2597e4eb42b289ba6d9410f32033.HD-1080p-7.2Mbps-85492899.mp4" type="video/mp4">
              </video>
            </div>
            <h3 class="re-slide-title">Silvering</h3>
          </div>

          <!-- Slide 4: Customize size in every perspective -->
          <div class="re-carousel-slide" data-index="3">
            <div class="re-video-box">
              <video class="re-video-el" autoplay muted loop playsinline preload="metadata">
                <source src="https://cdn.shopify.com/videos/c/vp/41497ea7ccfc4841be65c24b090afab4/41497ea7ccfc4841be65c24b090afab4.SD-480p-1.5Mbps-85453875.mp4" type="video/mp4">
              </video>
            </div>
            <h3 class="re-slide-title">Customize size in every perspective</h3>
          </div>

        </div>
      </div>

      <!-- Next Button -->
      <button class="re-nav-btn re-nav-next" aria-label="Next slide" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  </div>

  <script>
    (function initVideoCarousel() {
      const section = document.getElementById('re-craftsmanship-video-slider');
      if (!section) return;

      const track = section.querySelector('.re-carousel-track');
      const slides = section.querySelectorAll('.re-carousel-slide');
      const prevBtn = section.querySelector('.re-nav-prev');
      const nextBtn = section.querySelector('.re-nav-next');
      const viewport = section.querySelector('.re-carousel-viewport');

      let currentIndex = 0;
      let autoplayTimer = null;
      let isHovered = false;
      const autoplaySpeed = 3800; // Exact smooth Shopify auto-slide interval

      function getSlidesPerView() {
        const w = window.innerWidth;
        if (w <= 749) return 1;
        if (w <= 989) return 2;
        return 3; // Exactly 3 visible on desktop
      }

      function getMaxIndex() {
        return Math.max(0, slides.length - getSlidesPerView());
      }

      function updatePosition() {
        const perView = getSlidesPerView();
        const gap = 30;
        const viewportWidth = viewport.offsetWidth;
        if (!viewportWidth) return;

        // Calculate exact movement offset matching Shopify Atelier
        const slideWidth = (viewportWidth - (gap * (perView - 1))) / perView;
        const moveAmount = currentIndex * (slideWidth + gap);
        track.style.transform = 'translateX(-' + moveAmount + 'px)';
      }

      function goToNext() {
        const max = getMaxIndex();
        if (currentIndex < max) {
          currentIndex++;
        } else {
          currentIndex = 0; // Seamless loop back to start
        }
        updatePosition();
      }

      function goToPrev() {
        const max = getMaxIndex();
        if (currentIndex > 0) {
          currentIndex--;
        } else {
          currentIndex = max;
        }
        updatePosition();
      }

      if (nextBtn) nextBtn.addEventListener('click', () => { goToNext(); restartAutoplay(); });
      if (prevBtn) prevBtn.addEventListener('click', () => { goToPrev(); restartAutoplay(); });

      // Pause on hover, resume on leave
      section.addEventListener('mouseenter', () => {
        isHovered = true;
        stopAutoplay();
      });

      section.addEventListener('mouseleave', () => {
        isHovered = false;
        startAutoplay();
      });

      // Touch / Swipe support for mobile
      let touchStartX = 0;
      viewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      viewport.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) goToNext();
          else goToPrev();
          restartAutoplay();
        }
      }, { passive: true });

      function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(() => {
          if (!isHovered) goToNext();
        }, autoplaySpeed);
      }

      function stopAutoplay() {
        if (autoplayTimer) {
          clearInterval(autoplayTimer);
          autoplayTimer = null;
        }
      }

      function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
      }

      window.addEventListener('resize', updatePosition);

      // Start initial state
      updatePosition();
      startAutoplay();

      // Ensure all videos play continuously
      section.querySelectorAll('video').forEach(v => {
        v.muted = true;
        const playPromise = v.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      });
    })();
  </script>
</section>
`;

  // 4. Replace the old section
  const updatedContent = content.slice(0, secStart) + '\n' + exactVideoCarouselHtml.trim() + '\n' + content.slice(secEnd);

  console.log('2. Updating Page 68 via WordPress REST API...');
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

  console.log('✅ Page 68 successfully updated with 3-video visible auto-slideover carousel!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
