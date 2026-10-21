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
  fs.writeFileSync('backups/page_68_before_fullwidth_slideshow_upgrade.html', content);
  console.log('✅ Backup saved to backups/page_68_before_fullwidth_slideshow_upgrade.html');

  // Check if slideshow already exists
  const existingStart = content.indexOf('<section id="re-slideshow-new-arrivals"');
  if (existingStart === -1) {
    throw new Error('Could not find existing #re-slideshow-new-arrivals in Page 68!');
  }

  const existingEnd = content.indexOf('</section>', existingStart) + '</section>'.length;

  // Exact full-width, full-frame, zoom-in/zoom-out luxury slideshow
  const updatedSlideshowHtml = `
<!-- SHOPIFY ATELIER EXACT REPLICA: FULL FRAME SLIDESHOW WITH CONTINUOUS ZOOM -->
<section id="re-slideshow-new-arrivals" class="re-shopify-slideshow-fullframe">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap');

    #re-slideshow-new-arrivals {
      position: relative !important;
      width: 100vw !important;
      left: 50% !important;
      right: 50% !important;
      margin-left: -50vw !important;
      margin-right: -50vw !important;
      height: 92vh !important;
      min-height: 650px !important;
      max-height: 980px !important;
      overflow: hidden !important;
      background-color: #6f6a67 !important;
      color: #ffffff !important;
      box-sizing: border-box !important;
      z-index: 10;
    }

    #re-slideshow-new-arrivals * {
      box-sizing: border-box;
    }

    #re-slideshow-new-arrivals .re-slides-track {
      position: relative;
      width: 100%;
      height: 100%;
    }

    #re-slideshow-new-arrivals .re-slide-item {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      visibility: hidden;
      transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    #re-slideshow-new-arrivals .re-slide-item.active {
      opacity: 1;
      visibility: visible;
      z-index: 2;
    }

    /* Continuous luxury zoom-in and zoom-out effect */
    @keyframes reContinuousZoom {
      0% {
        transform: scale(1.0);
      }
      50% {
        transform: scale(1.12);
      }
      100% {
        transform: scale(1.0);
      }
    }

    #re-slideshow-new-arrivals .re-slide-media {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    #re-slideshow-new-arrivals .re-slide-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      display: block;
      transform-origin: center center;
    }

    #re-slideshow-new-arrivals .re-slide-item.active .re-slide-img {
      animation: reContinuousZoom 12s ease-in-out infinite alternate;
    }

    #re-slideshow-new-arrivals .re-slide-vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.48) 100%);
      pointer-events: none;
    }

    #re-slideshow-new-arrivals .re-slide-content-center {
      position: relative;
      z-index: 5;
      max-width: 640px;
      padding: 0 24px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
    }

    #re-slideshow-new-arrivals .re-heading-title {
      font-family: 'Cinzel', Georgia, serif;
      font-size: clamp(2.4rem, 5.5vw, 4.4rem);
      font-weight: 500;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #ffffff;
      margin: 0 0 20px 0;
      line-height: 1.1;
      text-shadow: 0 2px 14px rgba(0,0,0,0.7);
    }

    #re-slideshow-new-arrivals .re-heading-subtext {
      font-family: 'Montserrat', -apple-system, sans-serif;
      font-size: clamp(0.72rem, 1.15vw, 0.92rem);
      font-weight: 500;
      line-height: 1.85;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.94);
      margin: 0 0 28px 0;
      text-shadow: 0 1px 8px rgba(0,0,0,0.8);
      max-width: 520px;
    }

    #re-slideshow-new-arrivals .re-cta-button {
      font-family: 'Montserrat', -apple-system, sans-serif;
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: #ffffff;
      text-decoration: none;
      padding-bottom: 6px;
      border-bottom: 1.5px solid rgba(255, 255, 255, 0.85);
      transition: all 0.35s ease;
      text-shadow: 0 1px 6px rgba(0,0,0,0.6);
    }

    #re-slideshow-new-arrivals .re-cta-button:hover {
      color: #ffffff;
      border-bottom-color: #ffffff;
      transform: translateY(-2px);
      letter-spacing: 0.28em;
    }

    /* Minimalist luxury arrows matching Shopify Atelier */
    #re-slideshow-new-arrivals .re-nav-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 20;
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.8);
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 0;
    }

    #re-slideshow-new-arrivals .re-nav-arrow:hover {
      color: #ffffff;
      transform: translateY(-50%) scale(1.15);
    }

    #re-slideshow-new-arrivals .re-nav-prev {
      left: 32px;
    }

    #re-slideshow-new-arrivals .re-nav-next {
      right: 32px;
    }

    #re-slideshow-new-arrivals .re-nav-arrow svg {
      width: 32px;
      height: 32px;
      filter: drop-shadow(0 2px 6px rgba(0,0,0,0.6));
    }

    /* Dots indicator */
    #re-slideshow-new-arrivals .re-nav-dots {
      position: absolute;
      bottom: 28px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 20;
      display: flex;
      gap: 12px;
      align-items: center;
    }

    #re-slideshow-new-arrivals .re-nav-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
      padding: 0;
    }

    #re-slideshow-new-arrivals .re-nav-dot.active {
      background: #ffffff;
      transform: scale(1.35);
      box-shadow: 0 0 10px rgba(255,255,255,0.9);
    }

    @media (max-width: 768px) {
      #re-slideshow-new-arrivals {
        height: 85vh !important;
        min-height: 520px !important;
      }
      #re-slideshow-new-arrivals .re-nav-prev { left: 12px; }
      #re-slideshow-new-arrivals .re-nav-next { right: 12px; }
      #re-slideshow-new-arrivals .re-nav-arrow svg {
        width: 24px;
        height: 24px;
      }
    }
  </style>

  <div class="re-slides-track">
    <!-- Slide 1: NEW ARRIVALS -->
    <div class="re-slide-item active" data-index="0">
      <div class="re-slide-media">
        <img class="re-slide-img" src="https://reflectionelite.com/wp-content/uploads/2026/10/slide1_murano.png" alt="New Arrivals Luxury Mirror" loading="eager">
        <div class="re-slide-vignette"></div>
      </div>
      <div class="re-slide-content-center">
        <h2 class="re-heading-title">NEW ARRIVALS</h2>
        <p class="re-heading-subtext">INTRODUCING OUR LATEST PRODUCTS, MADE ESPECIALLY FOR THE SEASON. SHOP YOUR FAVORITES BEFORE THEY'RE GONE!</p>
        <a href="/shop/" class="re-cta-button">SHOP THIS COLLECTION</a>
      </div>
    </div>

    <!-- Slide 2: BESTSELLERS -->
    <div class="re-slide-item" data-index="1">
      <div class="re-slide-media">
        <img class="re-slide-img" src="https://reflectionelite.com/wp-content/uploads/2026/10/slide2_luxury.jpg" alt="Bestsellers Luxury Mirror" loading="lazy">
        <div class="re-slide-vignette"></div>
      </div>
      <div class="re-slide-content-center">
        <h2 class="re-heading-title">BESTSELLERS</h2>
        <p class="re-heading-subtext">DISCOVER THE BESTSELLERS THAT HAVE CAPTURED THE HEARTS OF OUR CUSTOMERS WITH THEIR PERFECT BLEND OF FUNCTIONALITY AND STYLE.</p>
        <a href="/shop/" class="re-cta-button">SHOP THIS COLLECTION</a>
      </div>
    </div>
  </div>

  <!-- Navigation Arrows -->
  <button class="re-nav-arrow re-nav-prev" aria-label="Previous slide">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  </button>
  <button class="re-nav-arrow re-nav-next" aria-label="Next slide">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  </button>

  <!-- Navigation Dots -->
  <div class="re-nav-dots">
    <button class="re-nav-dot active" data-slide="0" aria-label="Slide 1"></button>
    <button class="re-nav-dot" data-slide="1" aria-label="Slide 2"></button>
  </div>

  <script>
    (function() {
      const container = document.getElementById('re-slideshow-new-arrivals');
      if (!container) return;
      
      const slides = container.querySelectorAll('.re-slide-item');
      const dots = container.querySelectorAll('.re-nav-dot');
      const prevBtn = container.querySelector('.re-nav-prev');
      const nextBtn = container.querySelector('.re-nav-next');
      let currentIndex = 0;
      let timer = null;
      const intervalMs = 6000;

      function goToSlide(index) {
        slides[currentIndex].classList.remove('active');
        if (dots[currentIndex]) dots[currentIndex].classList.remove('active');
        
        currentIndex = (index + slides.length) % slides.length;
        
        slides[currentIndex].classList.add('active');
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
      }

      function nextSlide() {
        goToSlide(currentIndex + 1);
      }

      function prevSlide() {
        goToSlide(currentIndex - 1);
      }

      function startTimer() {
        stopTimer();
        timer = setInterval(nextSlide, intervalMs);
      }

      function stopTimer() {
        if (timer) clearInterval(timer);
      }

      if (nextBtn) nextBtn.addEventListener('click', function(e) { e.preventDefault(); nextSlide(); startTimer(); });
      if (prevBtn) prevBtn.addEventListener('click', function(e) { e.preventDefault(); prevSlide(); startTimer(); });

      dots.forEach((dot, idx) => {
        dot.addEventListener('click', function(e) {
          e.preventDefault();
          goToSlide(idx);
          startTimer();
        });
      });

      container.addEventListener('mouseenter', stopTimer);
      container.addEventListener('mouseleave', startTimer);

      startTimer();
    })();
  </script>
</section>
`;

  const updatedContent = content.slice(0, existingStart) + updatedSlideshowHtml.trim() + content.slice(existingEnd);

  console.log('2. Updating Page 68 via WordPress REST API with full-width zoom slideshow...');
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

  console.log('✅ Page 68 successfully updated!');

  // Verify
  const verifyRes = await fetch(`${auth.siteUrl}/?nocache=${Date.now()}`);
  const verifyHtml = await verifyRes.text();
  const hasContinuousZoom = verifyHtml.includes('reContinuousZoom');
  const hasFullframe = verifyHtml.includes('re-shopify-slideshow-fullframe');
  console.log('Verification:');
  console.log('- reContinuousZoom CSS animation present:', hasContinuousZoom);
  console.log('- Fullframe class present:', hasFullframe);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
