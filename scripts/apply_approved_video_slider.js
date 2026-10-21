import https from 'https';
import fs from 'fs';
import path from 'path';

function loadEnv() {
  const envPath = path.resolve('.env');
  const envVars = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          envVars[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
        }
      }
    }
  }
  return envVars;
}

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request({ ...options, family: 4, timeout: 20000 }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')); });
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  const env = loadEnv();
  const username = env.PROD_WP_USER;
  const password = env.PROD_WP_PASS;

  console.log('1. Authenticating to WordPress...');
  const loginBody = new URLSearchParams({
    log: username,
    pwd: password,
    'wp-submit': 'Log In',
    redirect_to: 'https://reflectionelite.com/wp-admin/',
    testcookie: '1'
  }).toString();

  const loginRes = await request({
    hostname: 'reflectionelite.com',
    port: 443,
    path: '/wp-login.php',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(loginBody)
    }
  }, loginBody);

  const cookies = (loginRes.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ');
  if (!cookies) throw new Error('Failed to obtain cookies');

  const adminRes = await request({
    hostname: 'reflectionelite.com',
    port: 443,
    path: '/wp-admin/index.php',
    method: 'GET',
    headers: { 'Cookie': cookies }
  });

  const nonceMatch = adminRes.body.match(/wpApiSettings\s*=\s*\{[^}]*?"nonce":"([^"]+)"/);
  const nonce = nonceMatch ? nonceMatch[1] : null;
  if (!nonce) throw new Error('Failed to obtain nonce');
  console.log('✅ Authenticated successfully.');

  // 2. PULL FRESHEST LIVE PAGE 68
  console.log('2. Pulling freshest live Page 68 from WordPress...');
  const pageRes = await request({
    hostname: 'reflectionelite.com',
    port: 443,
    path: '/wp-json/wp/v2/pages/68?context=edit',
    method: 'GET',
    headers: { 'Cookie': cookies, 'X-WP-Nonce': nonce }
  });

  if (pageRes.statusCode !== 200) {
    throw new Error('Failed to fetch Page 68: HTTP ' + pageRes.statusCode);
  }

  const pageData = JSON.parse(pageRes.body);
  const liveContent = pageData.content?.raw || '';

  // 3. Locate #re-craftsmanship-video-slider
  const targetId = 'id="re-craftsmanship-video-slider"';
  const targetIdx = liveContent.indexOf(targetId);
  if (targetIdx === -1) {
    throw new Error('Could not find #re-craftsmanship-video-slider in live Page 68!');
  }

  const secStart = liveContent.lastIndexOf('<section', targetIdx);
  const secEnd = liveContent.indexOf('</section>', targetIdx) + '</section>'.length;
  console.log(`Replacing only #re-craftsmanship-video-slider between indices ${secStart} and ${secEnd}`);

  // 4. Exact Shopify Atelier 3-Videos Visible Compact Auto-Slideover Carousel
  // Using unique class .re-video-slide to avoid any collision with global hero slider CSS
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
      padding: 70px 0 80px !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
      color: #ffffff !important;
      z-index: 5;
    }

    #re-craftsmanship-video-slider * {
      box-sizing: border-box;
    }

    /* Bounded container matching Shopify editor */
    #re-craftsmanship-video-slider .re-slider-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 35px;
      position: relative;
    }

    #re-craftsmanship-video-slider .re-slider-heading {
      text-align: center;
      color: #ffffff;
      font-family: 'Cinzel', Georgia, serif;
      font-weight: 500;
      font-size: clamp(1.4rem, 2.5vw, 30px);
      letter-spacing: 0.1em;
      margin: 0 0 45px;
      text-transform: uppercase;
      line-height: 1.25;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.85);
    }

    #re-craftsmanship-video-slider .re-carousel-outer {
      position: relative;
      width: 100%;
    }

    #re-craftsmanship-video-slider .re-carousel-viewport {
      overflow: hidden !important;
      position: relative;
      width: 100%;
      border-radius: 8px;
    }

    /* Track that slides over smoothly */
    #re-craftsmanship-video-slider .re-carousel-track {
      display: flex !important;
      gap: 24px !important;
      transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1) !important;
      will-change: transform;
      width: 100%;
    }

    /* EXACTLY 3 VIDEOS PER VIEW ON DESKTOP & LAPTOPS */
    #re-craftsmanship-video-slider .re-video-slide {
      flex: 0 0 calc((100% - 48px) / 3) !important;
      width: calc((100% - 48px) / 3) !important;
      max-width: calc((100% - 48px) / 3) !important;
      min-width: 0 !important;
      position: relative !important;
      cursor: pointer;
      display: block !important;
    }

    /* Compact 360px height preventing giant 600px overflow */
    #re-craftsmanship-video-slider .re-video-box {
      position: relative;
      width: 100%;
      height: 360px !important;
      overflow: hidden;
      background-color: #1a1a1a;
      border-radius: 8px;
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
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), filter 0.5s ease;
      display: block;
    }

    #re-craftsmanship-video-slider .re-video-slide:hover .re-video-el {
      transform: scale(1.08);
      filter: grayscale(0%);
    }

    /* Shopify exact overlay: 0.2 top / 0.5 bottom -> hover 0.4 top / 0.8 bottom */
    #re-craftsmanship-video-slider .re-video-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.2) 0%,
        rgba(0, 0, 0, 0.5) 100%
      );
      pointer-events: none;
      transition: background 0.4s ease;
    }

    #re-craftsmanship-video-slider .re-video-slide:hover .re-video-overlay {
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.4) 0%,
        rgba(0, 0, 0, 0.8) 100%
      );
    }

    /* Shopify exact title typography: 19px, 0.1em spacing, Cinzel */
    #re-craftsmanship-video-slider .re-slide-title {
      text-align: center;
      color: #ffffff;
      font-family: 'Cinzel', Georgia, serif;
      font-weight: 500;
      font-size: 19px;
      letter-spacing: 0.1em;
      margin: 18px 0 0;
      text-transform: uppercase;
      line-height: 1.3;
      transition: color 0.3s ease;
    }

    #re-craftsmanship-video-slider .re-video-slide:hover .re-slide-title {
      color: #d4a574;
    }

    /* Inset navigation arrows matching Shopify editor */
    #re-craftsmanship-video-slider .re-nav-btn {
      position: absolute;
      top: calc(50% - 20px);
      transform: translateY(-50%);
      width: 44px;
      height: 44px;
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
      left: 10px;
    }

    #re-craftsmanship-video-slider .re-nav-next {
      right: 10px;
    }

    #re-craftsmanship-video-slider .re-nav-btn svg {
      width: 18px;
      height: 18px;
    }

    /* Mobile phone only breakpoint (<= 640px) */
    @media screen and (max-width: 640px) {
      #re-craftsmanship-video-slider {
        padding: 50px 0 60px !important;
      }
      #re-craftsmanship-video-slider .re-slider-container {
        padding: 0 20px;
      }
      #re-craftsmanship-video-slider .re-slider-heading {
        font-size: 20px;
        margin-bottom: 28px;
      }
      #re-craftsmanship-video-slider .re-video-slide {
        flex: 0 0 100% !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      #re-craftsmanship-video-slider .re-video-box {
        height: 320px !important;
      }
      #re-craftsmanship-video-slider .re-slide-title {
        font-size: 15px;
        margin-top: 14px;
      }
      #re-craftsmanship-video-slider .re-nav-btn {
        width: 36px;
        height: 36px;
      }
      #re-craftsmanship-video-slider .re-nav-prev { left: 4px; }
      #re-craftsmanship-video-slider .re-nav-next { right: 4px; }
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
          <div class="re-video-slide" data-index="0">
            <div class="re-video-box">
              <video class="re-video-el" autoplay muted loop playsinline preload="auto">
                <source src="https://cdn.shopify.com/videos/c/vp/f0dc08273df6442ab525979e1b95a9c9/f0dc08273df6442ab525979e1b95a9c9.HD-1080p-7.2Mbps-85453874.mp4" type="video/mp4">
              </video>
              <div class="re-video-overlay"></div>
            </div>
            <h3 class="re-slide-title">Artistic beveling</h3>
          </div>

          <!-- Slide 2: Glass engraving -->
          <div class="re-video-slide" data-index="1">
            <div class="re-video-box">
              <video class="re-video-el" autoplay muted loop playsinline preload="auto">
                <source src="https://cdn.shopify.com/videos/c/vp/d8b2e5e14dae43eb861687c982709290/d8b2e5e14dae43eb861687c982709290.HD-1080p-7.2Mbps-85453876.mp4" type="video/mp4">
              </video>
              <div class="re-video-overlay"></div>
            </div>
            <h3 class="re-slide-title">Glass engraving</h3>
          </div>

          <!-- Slide 3: Silvering -->
          <div class="re-video-slide" data-index="2">
            <div class="re-video-box">
              <video class="re-video-el" autoplay muted loop playsinline preload="auto">
                <source src="https://cdn.shopify.com/videos/c/vp/7fec2597e4eb42b289ba6d9410f32033/7fec2597e4eb42b289ba6d9410f32033.HD-1080p-7.2Mbps-85492899.mp4" type="video/mp4">
              </video>
              <div class="re-video-overlay"></div>
            </div>
            <h3 class="re-slide-title">Silvering</h3>
          </div>

          <!-- Slide 4: Customize size in every perspective -->
          <div class="re-video-slide" data-index="3">
            <div class="re-video-box">
              <video class="re-video-el" autoplay muted loop playsinline preload="auto">
                <source src="https://cdn.shopify.com/videos/c/vp/41497ea7ccfc4841be65c24b090afab4/41497ea7ccfc4841be65c24b090afab4.SD-480p-1.5Mbps-85453875.mp4" type="video/mp4">
              </video>
              <div class="re-video-overlay"></div>
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
      const slides = section.querySelectorAll('.re-video-slide');
      const prevBtn = section.querySelector('.re-nav-prev');
      const nextBtn = section.querySelector('.re-nav-next');
      const viewport = section.querySelector('.re-carousel-viewport');

      let currentIndex = 0;
      let autoplayTimer = null;
      let isHovered = false;
      const autoplaySpeed = 3800;

      function getSlidesPerView() {
        return window.innerWidth <= 640 ? 1 : 3;
      }

      function getMaxIndex() {
        return Math.max(0, slides.length - getSlidesPerView());
      }

      function updatePosition() {
        const perView = getSlidesPerView();
        const gap = 24;
        const viewportWidth = viewport.offsetWidth;
        if (!viewportWidth) return;

        const slideWidth = (viewportWidth - (gap * (perView - 1))) / perView;
        const moveAmount = currentIndex * (slideWidth + gap);
        track.style.transform = 'translateX(-' + moveAmount + 'px)';
      }

      function goToNext() {
        const max = getMaxIndex();
        if (currentIndex < max) {
          currentIndex++;
        } else {
          currentIndex = 0;
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

      section.addEventListener('mouseenter', () => {
        isHovered = true;
        stopAutoplay();
      });

      section.addEventListener('mouseleave', () => {
        isHovered = false;
        startAutoplay();
      });

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
      updatePosition();
      startAutoplay();

      section.querySelectorAll('video').forEach(v => {
        v.muted = true;
        const p = v.play();
        if (p !== undefined) p.catch(() => {});
      });
    })();
  </script>
</section>
`;

  // 5. Merge directly into freshest live content (preserving everything else)
  const updatedContent = liveContent.slice(0, secStart) + '\n' + exactVideoCarouselHtml.trim() + '\n' + liveContent.slice(secEnd);

  console.log('3. Updating live Page 68 via REST API...');
  const postData = JSON.stringify({ content: updatedContent });
  const updateRes = await request({
    hostname: 'reflectionelite.com',
    port: 443,
    path: '/wp-json/wp/v2/pages/68',
    method: 'POST',
    headers: {
      'Cookie': cookies,
      'X-WP-Nonce': nonce,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, postData);

  if (updateRes.statusCode !== 200) {
    console.error('Update failed:', updateRes.body);
    throw new Error('Update returned status ' + updateRes.statusCode);
  }

  console.log('✅ Page 68 successfully saved (HTTP 200).');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
