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
  fs.writeFileSync('backups/page_68_before_new_arrivals_slideshow.html', content);
  console.log('✅ Backup saved to backups/page_68_before_new_arrivals_slideshow.html');

  // 2. Locate insertion point (right after Trending Era section)
  const trendingEraIdx = content.indexOf('TRENDING ERA');
  if (trendingEraIdx === -1) {
    throw new Error('Could not find TRENDING ERA in Page 68!');
  }

  const sectionEndTag = '</section>';
  const endOfTrendingSection = content.indexOf(sectionEndTag, trendingEraIdx);
  if (endOfTrendingSection === -1) {
    throw new Error('Could not find end of Trending Era section!');
  }

  const insertionPoint = endOfTrendingSection + sectionEndTag.length;

  // 3. Define the new luxury slideshow section
  const slideshowHtml = `

<!-- SHOPIFY ATELIER REPLICATED SLIDESHOW: NEW ARRIVALS & BESTSELLERS -->
<section id="re-slideshow-new-arrivals" class="re-shopify-slideshow">
  <style>
    #re-slideshow-new-arrivals {
      position: relative;
      width: 100%;
      height: 70vh;
      min-height: 520px;
      max-height: 780px;
      overflow: hidden;
      background: #000;
      color: #fff;
      font-family: inherit;
    }
    #re-slideshow-new-arrivals .re-slide {
      position: absolute;
      inset: 0;
      opacity: 0;
      visibility: hidden;
      transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
      transform: scale(1.04);
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    #re-slideshow-new-arrivals .re-slide.active {
      opacity: 1;
      visibility: visible;
      transform: scale(1);
      z-index: 2;
    }
    #re-slideshow-new-arrivals .re-slide-bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
    }
    #re-slideshow-new-arrivals .re-slide-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 100%);
    }
    #re-slideshow-new-arrivals .re-slide-content {
      position: relative;
      z-index: 3;
      max-width: 820px;
      padding: 30px 20px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    #re-slideshow-new-arrivals .re-slide-title {
      font-family: "Cinzel", "Playfair Display", Georgia, serif;
      font-size: clamp(2rem, 5vw, 3.8rem);
      font-weight: 400;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #ffffff;
      margin: 0 0 16px 0;
      line-height: 1.15;
      text-shadow: 0 2px 10px rgba(0,0,0,0.7);
    }
    #re-slideshow-new-arrivals .re-slide-desc {
      font-size: clamp(0.9rem, 2vw, 1.15rem);
      font-weight: 300;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.9);
      letter-spacing: 0.05em;
      margin: 0 0 28px 0;
      max-width: 600px;
      text-shadow: 0 1px 6px rgba(0,0,0,0.8);
    }
    #re-slideshow-new-arrivals .re-slide-btn {
      display: inline-block;
      padding: 14px 34px;
      font-size: 0.82rem;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #ffffff;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.75);
      border-radius: 0px;
      text-decoration: none;
      transition: all 0.3s ease;
      backdrop-filter: blur(4px);
    }
    #re-slideshow-new-arrivals .re-slide-btn:hover {
      background: #ffffff;
      color: #000000;
      border-color: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255,255,255,0.25);
    }
    /* Controls */
    #re-slideshow-new-arrivals .re-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 50%;
      transition: all 0.3s ease;
    }
    #re-slideshow-new-arrivals .re-arrow:hover {
      background: rgba(255, 255, 255, 0.9);
      color: #000;
      border-color: #fff;
    }
    #re-slideshow-new-arrivals .re-arrow-prev {
      left: 24px;
    }
    #re-slideshow-new-arrivals .re-arrow-next {
      right: 24px;
    }
    #re-slideshow-new-arrivals .re-arrow svg {
      width: 20px;
      height: 20px;
      stroke-width: 2;
    }
    /* Dots indicator */
    #re-slideshow-new-arrivals .re-dots {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
      display: flex;
      gap: 12px;
      align-items: center;
    }
    #re-slideshow-new-arrivals .re-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
      padding: 0;
    }
    #re-slideshow-new-arrivals .re-dot.active {
      background: #ffffff;
      transform: scale(1.3);
      box-shadow: 0 0 8px rgba(255,255,255,0.8);
    }
    @media (max-width: 768px) {
      #re-slideshow-new-arrivals {
        height: 520px;
        min-height: 460px;
      }
      #re-slideshow-new-arrivals .re-arrow {
        width: 38px;
        height: 38px;
      }
      #re-slideshow-new-arrivals .re-arrow-prev { left: 12px; }
      #re-slideshow-new-arrivals .re-arrow-next { right: 12px; }
    }
  </style>

  <div class="re-slides-wrapper">
    <!-- Slide 1: New arrivals -->
    <div class="re-slide active" data-index="0">
      <div class="re-slide-bg" style="background-image: url('https://reflectionelite.com/wp-content/uploads/2026/10/slide1_murano.png');"></div>
      <div class="re-slide-overlay"></div>
      <div class="re-slide-content">
        <h2 class="re-slide-title">New arrivals</h2>
        <p class="re-slide-desc">Introducing our latest products, made especially for the season. Shop your favorites before they're gone!</p>
        <a href="/shop/" class="re-slide-btn">Shop this collection</a>
      </div>
    </div>

    <!-- Slide 2: Bestsellers -->
    <div class="re-slide" data-index="1">
      <div class="re-slide-bg" style="background-image: url('https://reflectionelite.com/wp-content/uploads/2026/10/slide2_luxury.jpg');"></div>
      <div class="re-slide-overlay"></div>
      <div class="re-slide-content">
        <h2 class="re-slide-title">Bestsellers</h2>
        <p class="re-slide-desc">Discover the bestsellers that have captured the hearts of our customers with their perfect blend of functionality and style.</p>
        <a href="/shop/" class="re-slide-btn">Shop this collection</a>
      </div>
    </div>
  </div>

  <!-- Navigation Arrows -->
  <button class="re-arrow re-arrow-prev" aria-label="Previous slide">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
  </button>
  <button class="re-arrow re-arrow-next" aria-label="Next slide">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
  </button>

  <!-- Dots -->
  <div class="re-dots">
    <button class="re-dot active" data-slide="0" aria-label="Slide 1"></button>
    <button class="re-dot" data-slide="1" aria-label="Slide 2"></button>
  </div>

  <script>
    (function() {
      const container = document.getElementById('re-slideshow-new-arrivals');
      if (!container) return;
      
      const slides = container.querySelectorAll('.re-slide');
      const dots = container.querySelectorAll('.re-dot');
      const prevBtn = container.querySelector('.re-arrow-prev');
      const nextBtn = container.querySelector('.re-arrow-next');
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

  // 4. Splice new slideshow into Page 68 content
  const updatedContent = content.slice(0, insertionPoint) + '\n' + slideshowHtml + '\n' + content.slice(insertionPoint);

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

  console.log('✅ Page 68 successfully updated with New Arrivals slideshow!');

  // 5. Purge Hostinger cache
  console.log('3. Purging Hostinger cache...');
  try {
    const purgeRes = await fetch(`${auth.siteUrl}/wp-admin/admin-ajax.php`, {
      method: 'POST',
      headers: {
        'Cookie': auth.cookies,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ action: 'hostinger_purge_all_cache' })
    });
    console.log('Cache purge response:', purgeRes.status);
  } catch (e) {
    console.log('Cache purge notice:', e.message);
  }

  // 6. Verify live page
  console.log('4. Verifying live page content...');
  const verifyRes = await fetch(`${auth.siteUrl}/?nocache=${Date.now()}`);
  const verifyHtml = await verifyRes.text();
  const hasSlideshow = verifyHtml.includes('re-slideshow-new-arrivals');
  const hasMurano = verifyHtml.includes('slide1_murano.png');
  const hasBestsellers = verifyHtml.includes('Bestsellers');

  console.log('Verification Results:');
  console.log('- Slideshow container present:', hasSlideshow);
  console.log('- Murano mirror image present:', hasMurano);
  console.log('- Bestsellers slide present:', hasBestsellers);

  if (hasSlideshow && hasMurano && hasBestsellers) {
    console.log('🎉 SUCCESS: Slideshow replicated and live on reflectionelite.com!');
  } else {
    console.warn('⚠️ Warning: Some elements were not found in public HTML.');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
