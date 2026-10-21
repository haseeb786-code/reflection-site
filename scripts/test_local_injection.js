import puppeteer from 'puppeteer-core';
import fs from 'fs';

const SNIPPET_CODE = `
<style id="te-hero-ticker-slider-v2-css">
/* ============================================================
   SNIPPET: te-hero-ticker-slider-v2
   Scope: (1) Announcement ticker, (2) Hero slider on homepage
   ============================================================ */

/* CHANGE 1: CONTINUOUS SCROLLING MARQUEE TICKER */
.re-announcement-strip {
  overflow: hidden !important;
  white-space: nowrap !important;
  display: block !important;
  padding: 8px 0 !important;
  box-sizing: border-box !important;
  position: relative !important;
  width: 100% !important;
  background: #080808 !important;
}
.te-ticker-wrap {
  width: 100% !important;
  max-width: 100vw !important;
  overflow: hidden !important;
  display: flex !important;
  position: relative !important;
}
.te-ticker-track {
  display: flex !important;
  flex-shrink: 0 !important;
  width: max-content !important;
  animation: te-ticker-scroll 28s linear infinite !important;
  will-change: transform;
}
.te-ticker-item {
  display: inline-flex !important;
  align-items: center !important;
  padding: 0 40px !important;
  white-space: nowrap !important;
  font-family: var(--font-trajan), 'Cinzel', serif !important;
  font-size: 0.72rem !important;
  font-weight: 600 !important;
  letter-spacing: 0.16em !important;
  color: var(--color-gold, #c5a880) !important;
  text-transform: uppercase !important;
}
@media (max-width: 768px) {
  .re-announcement-strip {
    padding: 7px 0 !important;
  }
  .te-ticker-item {
    font-size: 0.62rem !important;
    letter-spacing: 0.1em !important;
    padding: 0 25px !important;
  }
}
@keyframes te-ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .te-ticker-track {
    animation-play-state: paused !important;
  }
}

/* CHANGE 2: SHOW FULL MIRROR PICTURE ON DESKTOP */
@media (min-width: 769px) {
  .re-carousel-box {
    width: 100% !important;
    max-width: 1100px !important;
    height: auto !important;
    aspect-ratio: 1024 / 682 !important;
    margin: 0 auto !important;
    border-radius: 2px !important;
    overflow: hidden !important;
    background: #08090b !important;
    position: relative !important;
  }
  .re-carousel-track {
    width: 100% !important;
    height: 100% !important;
  }
  .re-carousel-slide {
    width: 100% !important;
    height: 100% !important;
  }
  .re-carousel-img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    object-position: center center !important;
  }
}

/* CHANGE 3: HORIZONTAL SLIDE TRANSITION + SUBTLE KEN BURNS ZOOM */
.re-carousel-box {
  overflow: hidden !important;
  position: relative !important;
}
.re-carousel-track {
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  width: 100% !important;
  height: 100% !important;
  position: relative !important;
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1) !important;
  will-change: transform;
}
.re-carousel-slide {
  position: relative !important;
  top: auto !important;
  left: auto !important;
  flex: 0 0 100% !important;
  width: 100% !important;
  height: 100% !important;
  opacity: 1 !important;
  visibility: visible !important;
  overflow: hidden !important;
  z-index: 1 !important;
  transition: none !important;
}
.re-carousel-slide .re-carousel-img {
  transform: scale(1);
  will-change: transform;
  transform-origin: center center !important;
}
.re-carousel-slide.active .re-carousel-img {
  animation: te-ken-burns 7s ease-in-out infinite alternate !important;
}
@keyframes te-ken-burns {
  0% { transform: scale(1.0); }
  100% { transform: scale(1.055); }
}
@media (prefers-reduced-motion: reduce) {
  .re-carousel-slide.active .re-carousel-img {
    animation: none !important;
    transform: scale(1) !important;
  }
}

/* CHANGE 4: TWO-LINE LUXURY TEXT OVERLAY ON HERO IMAGES */
.te-hero-overlay-wrap {
  position: absolute !important;
  left: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  height: 52% !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: flex-end !important;
  align-items: center !important;
  padding-bottom: 38px !important;
  box-sizing: border-box !important;
  pointer-events: none !important;
  z-index: 5 !important;
}
.te-hero-overlay-gradient {
  position: absolute !important;
  left: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background: linear-gradient(to top, rgba(8, 9, 11, 0.88) 0%, rgba(8, 9, 11, 0.55) 50%, rgba(8, 9, 11, 0) 100%) !important;
  pointer-events: none !important;
  z-index: 1 !important;
}
.te-hero-overlay-content {
  position: relative !important;
  z-index: 2 !important;
  text-align: center !important;
  max-width: 70% !important;
  margin: 0 auto !important;
  padding: 0 16px !important;
  box-sizing: border-box !important;
}
.te-hero-line1 {
  font-family: var(--font-trajan), 'Cinzel', serif !important;
  font-size: 13.5px !important;
  font-weight: 600 !important;
  letter-spacing: 0.24em !important;
  color: var(--color-gold, #c5a880) !important;
  text-transform: uppercase !important;
  margin: 0 0 6px 0 !important;
  line-height: 1.3 !important;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.te-hero-gold-line {
  width: 60px !important;
  height: 1.5px !important;
  background: var(--color-gold, #c5a880) !important;
  margin: 8px auto !important;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease 0.12s, transform 0.8s ease 0.12s;
}
.te-hero-line2 {
  font-family: var(--font-trajan), 'Cinzel', serif !important;
  font-size: clamp(32px, 3.2vw, 46px) !important;
  font-weight: 700 !important;
  letter-spacing: 0.08em !important;
  color: #ffffff !important;
  text-transform: uppercase !important;
  line-height: 1.2 !important;
  margin: 0 !important;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8) !important;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease 0.25s, transform 0.8s ease 0.25s;
}

/* Active slide animation */
.re-carousel-slide.active .te-hero-line1,
.re-carousel-slide.active .te-hero-gold-line,
.re-carousel-slide.active .te-hero-line2 {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

/* Inactive slide reset */
.re-carousel-slide:not(.active) .te-hero-line1,
.re-carousel-slide:not(.active) .te-hero-gold-line,
.re-carousel-slide:not(.active) .te-hero-line2 {
  opacity: 0 !important;
  transform: translateY(20px) !important;
  transition: opacity 0.4s ease, transform 0.4s ease !important;
}

@media (max-width: 768px) {
  .te-hero-overlay-wrap {
    height: 58% !important;
    padding-bottom: 32px !important;
  }
  .te-hero-overlay-content {
    max-width: 94% !important;
    padding: 0 16px !important;
  }
  .te-hero-line1 {
    font-size: 11px !important;
    letter-spacing: 0.16em !important;
    margin-bottom: 4px !important;
  }
  .te-hero-gold-line {
    width: 44px !important;
    margin: 6px auto !important;
  }
  .te-hero-line2 {
    font-size: 24px !important;
    letter-spacing: 0.05em !important;
    line-height: 1.25 !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .te-hero-line1,
  .te-hero-gold-line,
  .te-hero-line2 {
    transition: none !important;
    transform: none !important;
  }
  .re-carousel-slide.active .te-hero-line1,
  .re-carousel-slide.active .te-hero-gold-line,
  .re-carousel-slide.active .te-hero-line2 {
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>

<script id="te-hero-ticker-slider-v2-js">
(function() {
  // 1. INITIALIZE MOVING TICKER
  function initTicker() {
    var strip = document.querySelector('.re-announcement-strip');
    if (!strip || strip.querySelector('.te-ticker-track')) return;

    var textContent = strip.textContent.trim();
    if (!textContent) {
      textContent = 'FREE COMPREHENSIVE ON-SITE CONSULTATION & LASER TEMPLATING • BESPOKE LUXURY MIRRORS';
    }

    var wrap = document.createElement('div');
    wrap.className = 'te-ticker-wrap';

    var track = document.createElement('div');
    track.className = 'te-ticker-track';

    // Build repeated items (4 in first half, 4 in second half) for seamless 50% loop
    var halfHtml = '';
    for (var i = 0; i < 4; i++) {
      halfHtml += '<div class="te-ticker-item"><span>' + textContent + '</span></div>';
    }
    track.innerHTML = halfHtml + halfHtml;

    wrap.appendChild(track);
    strip.innerHTML = '';
    strip.appendChild(wrap);
  }

  // 2. INITIALIZE HERO SLIDER ENHANCEMENTS & OVERLAYS
  function initEnhancedSlider() {
    var carousel = document.getElementById('reHeroCarousel');
    var track = document.getElementById('reCarouselTrack');
    if (!carousel || !track) return;

    var slides = track.querySelectorAll('.re-carousel-slide');
    var dots = carousel.querySelectorAll('.re-carousel-dot');
    var prevBtn = document.getElementById('rePrevBtn');
    var nextBtn = document.getElementById('reNextBtn');
    if (!slides.length) return;

    // Inject Two-Line Luxury Text Overlay into BOTH slides
    slides.forEach(function(slide) {
      if (slide.querySelector('.te-hero-overlay-wrap')) return;

      var overlay = document.createElement('div');
      overlay.className = 'te-hero-overlay-wrap';
      overlay.innerHTML = 
        '<div class="te-hero-overlay-gradient"></div>' +
        '<div class="te-hero-overlay-content">' +
          '<div class="te-hero-line1">COMPLETE YOUR WALLS</div>' +
          '<div class="te-hero-gold-line"></div>' +
          '<div class="te-hero-line2">WITH ENDLESS LUXURY</div>' +
        '</div>';
      slide.appendChild(overlay);
    });

    var currentIndex = 0;
    var autoSlideTimer = null;

    function updateSlider(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentIndex = index;

      // Smooth horizontal slide
      track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

      // Update active states
      for (var i = 0; i < slides.length; i++) {
        slides[i].classList.toggle('active', i === currentIndex);
      }
      for (var j = 0; j < dots.length; j++) {
        dots[j].classList.toggle('active', j === currentIndex);
      }
    }

    function nextSlide() { updateSlider(currentIndex + 1); }
    function prevSlide() { updateSlider(currentIndex - 1); }

    function startAuto() {
      stopAuto();
      autoSlideTimer = setInterval(nextSlide, 4500);
    }
    function stopAuto() {
      if (autoSlideTimer) clearInterval(autoSlideTimer);
    }

    // Clear any previous click listeners by replacing buttons with clones or attaching cleanly
    if (nextBtn) {
      var newNext = nextBtn.cloneNode(true);
      nextBtn.parentNode.replaceChild(newNext, nextBtn);
      newNext.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        nextSlide();
        startAuto();
      });
    }

    if (prevBtn) {
      var newPrev = prevBtn.cloneNode(true);
      prevBtn.parentNode.replaceChild(newPrev, prevBtn);
      newPrev.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        prevSlide();
        startAuto();
      });
    }

    dots.forEach(function(dot, idx) {
      var newDot = dot.cloneNode(true);
      dot.parentNode.replaceChild(newDot, dot);
      newDot.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        updateSlider(idx);
        startAuto();
      });
    });

    // Touch swipe support for mobile
    var touchStartX = 0;
    var touchEndX = 0;

    carousel.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        startAuto();
      }
    }, { passive: true });

    // Initial positioning
    updateSlider(0);
    startAuto();
  }

  function runAll() {
    initTicker();
    initEnhancedSlider();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAll);
  } else {
    runAll();
  }
})();
</script>
`;

async function testLocally() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36');

    // Load home page
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('https://reflectionelite.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    // Inject snippet
    await page.evaluate((snippet) => {
      const div = document.createElement('div');
      div.id = 'te-hero-ticker-slider-v2-container';
      div.innerHTML = snippet;
      document.body.appendChild(div);
      
      // Execute the scripts in snippet
      const scripts = div.querySelectorAll('script');
      scripts.forEach(s => {
        const newScript = document.createElement('script');
        newScript.text = s.text;
        document.body.appendChild(newScript);
      });
    }, SNIPPET_CODE);

    await new Promise(r => setTimeout(r, 1500));

    // Screenshot Desktop 1440 Slide 1
    await page.screenshot({ path: 'test_v2_desktop_1440_slide1.png' });
    console.log('✓ test_v2_desktop_1440_slide1.png');

    // Click Next -> Slide 2
    await page.click('#reNextBtn');
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: 'test_v2_desktop_1440_slide2.png' });
    console.log('✓ test_v2_desktop_1440_slide2.png');

    // Desktop 1920
    await page.setViewport({ width: 1920, height: 1080 });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: 'test_v2_desktop_1920_slide2.png' });
    console.log('✓ test_v2_desktop_1920_slide2.png');

    // Mobile 375 Slide 1
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await page.click('#rePrevBtn');
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: 'test_v2_mobile_375_slide1.png' });
    console.log('✓ test_v2_mobile_375_slide1.png');

    // Mobile 390 Slide 2
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.click('#reNextBtn');
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: 'test_v2_mobile_390_slide2.png' });
    console.log('✓ test_v2_mobile_390_slide2.png');

  } finally {
    await browser.close();
  }
}

testLocally().catch(console.error);
