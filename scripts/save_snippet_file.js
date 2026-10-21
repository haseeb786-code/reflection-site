import puppeteer from 'puppeteer-core';
import fs from 'fs';

const TEST_SNIPPET = `
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

    var halfHtml = '';
    for (var i = 0; i < 4; i++) {
      halfHtml += '<div class="te-ticker-item"><span>' + textContent + '</span></div>';
    }
    track.innerHTML = halfHtml + halfHtml;

    wrap.appendChild(track);
    strip.innerHTML = '';
    strip.appendChild(wrap);
  }

  function initHeroSliderEnhancements() {
    var carousel = document.getElementById('reHeroCarousel');
    var track = document.getElementById('reCarouselTrack');
    if (!carousel || !track) return;

    var slides = carousel.querySelectorAll('.re-carousel-slide');
    if (!slides.length) return;

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

    function syncTrackToActive() {
      for (var i = 0; i < slides.length; i++) {
        if (slides[i].classList.contains('active')) {
          track.style.transform = 'translateX(-' + (i * 100) + '%)';
          break;
        }
      }
    }

    var observer = new MutationObserver(function() {
      syncTrackToActive();
    });

    slides.forEach(function(slide) {
      observer.observe(slide, { attributes: true, attributeFilter: ['class'] });
    });

    var touchStartX = 0;
    var touchEndX = 0;
    var nextBtn = document.getElementById('reNextBtn');
    var prevBtn = document.getElementById('rePrevBtn');

    carousel.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0 && nextBtn) {
          nextBtn.click();
        } else if (diff < 0 && prevBtn) {
          prevBtn.click();
        }
      }
    }, { passive: true });

    syncTrackToActive();
  }

  function runAll() {
    initTicker();
    initHeroSliderEnhancements();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAll);
  } else {
    runAll();
  }
})();
</script>
`;

fs.writeFileSync('snippet_te_hero_ticker_slider_v2.html', TEST_SNIPPET.trim());
console.log('Saved snippet_te_hero_ticker_slider_v2.html');
