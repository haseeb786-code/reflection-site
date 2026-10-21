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
    const req = https.request({ ...options, family: 4, timeout: 15000 }, (res) => {
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

async function run() {
  const env = loadEnv();
  const username = env.PROD_WP_USER;
  const password = env.PROD_WP_PASS;

  console.log('1. Logging in via https...');
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
  console.log('Cookies retrieved:', cookies ? 'YES' : 'NO');

  const adminRes = await request({
    hostname: 'reflectionelite.com',
    port: 443,
    path: '/wp-admin/index.php',
    method: 'GET',
    headers: { 'Cookie': cookies }
  });

  const match = adminRes.body.match(/wpApiSettings\s*=\s*\{[^}]*?"nonce":"([^"]+)"/);
  const nonce = match ? match[1] : null;
  console.log('Nonce retrieved:', nonce);

  if (!nonce) throw new Error('Could not get nonce');

  // Read base content
  console.log('2. Reading Page 68 base...');
  let content = fs.readFileSync('backups/page_68_before_3video_carousel.html', 'utf8');

  const targetId = 'id="re-craftsmanship-video-slider"';
  const targetIdx = content.indexOf(targetId);
  const secStart = content.lastIndexOf('<section', targetIdx);
  const secEnd = content.indexOf('</section>', targetIdx) + '</section>'.length;

  const carouselHtml = `
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

    #re-craftsmanship-video-slider .re-carousel-track {
      display: flex;
      gap: 30px;
      transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform;
    }

    /* Exactly 3 videos visible on desktop */
    #re-craftsmanship-video-slider .re-carousel-slide {
      flex: 0 0 calc((100% - (2 * 30px)) / 3);
      min-width: 0;
      position: relative;
      cursor: pointer;
    }

    #re-craftsmanship-video-slider .re-video-box {
      position: relative;
      width: 100%;
      padding-bottom: 125%;
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

    #re-craftsmanship-video-slider .re-nav-prev { left: 12px; }
    #re-craftsmanship-video-slider .re-nav-next { right: 12px; }
    #re-craftsmanship-video-slider .re-nav-btn svg { width: 20px; height: 20px; }

    @media screen and (max-width: 989px) {
      #re-craftsmanship-video-slider .re-slider-container { padding: 0 30px; }
      #re-craftsmanship-video-slider .re-slider-heading { font-size: 24px; margin-bottom: 40px; }
      #re-craftsmanship-video-slider .re-carousel-slide { flex: 0 0 calc((100% - 30px) / 2); }
      #re-craftsmanship-video-slider .re-slide-title { font-size: 17px; }
    }

    @media screen and (max-width: 749px) {
      #re-craftsmanship-video-slider { padding: 60px 0 65px !important; }
      #re-craftsmanship-video-slider .re-slider-container { padding: 0 20px; }
      #re-craftsmanship-video-slider .re-slider-heading { font-size: 20px; margin-bottom: 30px; }
      #re-craftsmanship-video-slider .re-carousel-slide { flex: 0 0 100%; }
      #re-craftsmanship-video-slider .re-slide-title { font-size: 15px; margin-top: 18px; }
      #re-craftsmanship-video-slider .re-nav-btn { width: 40px; height: 40px; }
    }
  </style>

  <div class="re-slider-container">
    <h2 class="re-slider-heading">Premium materials and hand-selected finishing touches</h2>

    <div class="re-carousel-outer">
      <button class="re-nav-btn re-nav-prev" aria-label="Previous slide" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <div class="re-carousel-viewport">
        <div class="re-carousel-track">
          
          <div class="re-carousel-slide" data-index="0">
            <div class="re-video-box">
              <video class="re-video-el" autoplay muted loop playsinline preload="metadata">
                <source src="https://cdn.shopify.com/videos/c/vp/f0dc08273df6442ab525979e1b95a9c9/f0dc08273df6442ab525979e1b95a9c9.HD-1080p-7.2Mbps-85453874.mp4" type="video/mp4">
              </video>
            </div>
            <h3 class="re-slide-title">Artistic beveling</h3>
          </div>

          <div class="re-carousel-slide" data-index="1">
            <div class="re-video-box">
              <video class="re-video-el" autoplay muted loop playsinline preload="metadata">
                <source src="https://cdn.shopify.com/videos/c/vp/d8b2e5e14dae43eb861687c982709290/d8b2e5e14dae43eb861687c982709290.HD-1080p-7.2Mbps-85453876.mp4" type="video/mp4">
              </video>
            </div>
            <h3 class="re-slide-title">Glass engraving</h3>
          </div>

          <div class="re-carousel-slide" data-index="2">
            <div class="re-video-box">
              <video class="re-video-el" autoplay muted loop playsinline preload="metadata">
                <source src="https://cdn.shopify.com/videos/c/vp/7fec2597e4eb42b289ba6d9410f32033/7fec2597e4eb42b289ba6d9410f32033.HD-1080p-7.2Mbps-85492899.mp4" type="video/mp4">
              </video>
            </div>
            <h3 class="re-slide-title">Silvering</h3>
          </div>

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
      const autoplaySpeed = 3800;

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
        const perView = getSlidesPerView();
        const gap = 30;
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

  const updatedContent = content.slice(0, secStart) + '\n' + carouselHtml.trim() + '\n' + content.slice(secEnd);

  console.log('3. Updating Page 68...');
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

  console.log('Update response status:', updateRes.statusCode);
  if (updateRes.statusCode !== 200) {
    console.error('Update response:', updateRes.body);
    throw new Error('Update failed with status ' + updateRes.statusCode);
  }

  console.log('✅ Page 68 successfully updated with 3-video auto-slideover carousel!');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
