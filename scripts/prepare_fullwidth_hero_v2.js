import fs from 'fs';

// Read current live snippet code
const currentCode = fs.readFileSync('backups/snippet_197_before_overlay_update.html', 'utf8');

// Build the updated snippet code
// We replace CHANGE 2 (Full mirror picture on desktop), CHANGE 4 (Overlay CSS), and the JS overlay HTML
let updatedCode = currentCode;

// 1. Update CHANGE 2: Desktop Full Width & Frame Sizing
const NEW_DESKTOP_FRAME_CSS = `/* CHANGE 2: FULL-WIDTH HERO SLIDER ON DESKTOP & LAPTOP */
@media (min-width: 769px) {
  .re-hero-section {
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  .re-carousel-box {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    height: clamp(560px, 80vh, 900px) !important;
    aspect-ratio: auto !important;
    border-radius: 0 !important;
    border: none !important;
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
  }
  /* Slide-specific framing so main mirror subjects remain prominent */
  .re-carousel-slide:nth-child(1) .re-carousel-img {
    object-position: center 32% !important;
  }
  .re-carousel-slide:nth-child(2) .re-carousel-img {
    object-position: center 26% !important;
  }

  /* Desktop Arrows & Dots */
  .re-carousel-arrow.prev {
    left: 32px !important;
  }
  .re-carousel-arrow.next {
    right: 32px !important;
  }
  .re-carousel-dots {
    bottom: 24px !important;
  }
}`;

const oldChange2Regex = /\/\* CHANGE 2: SHOW FULL MIRROR PICTURE ON DESKTOP \*\/[\s\S]*?(?=\/\* CHANGE 3:)/;
if (!oldChange2Regex.test(updatedCode)) {
  throw new Error('Could not find CHANGE 2 in snippet code!');
}
updatedCode = updatedCode.replace(oldChange2Regex, NEW_DESKTOP_FRAME_CSS + '\n\n');

// 2. Update CHANGE 4: Larger, Bolder, Neatly Aligned Overlay CSS
const NEW_OVERLAY_CSS = `/* CHANGE 4: THREE-TIER LUXURY TEXT OVERLAY ON HERO IMAGES */
.te-hero-overlay-wrap {
  position: absolute !important;
  left: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: flex-end !important;
  align-items: center !important;
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
  background: linear-gradient(to top, rgba(8, 9, 11, 0.95) 0%, rgba(8, 9, 11, 0.76) 45%, rgba(8, 9, 11, 0.35) 75%, rgba(8, 9, 11, 0) 100%) !important;
  pointer-events: none !important;
  z-index: 1 !important;
}
.te-hero-overlay-content {
  position: relative !important;
  z-index: 2 !important;
  text-align: center !important;
  margin: 0 auto !important;
  box-sizing: border-box !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
}

/* DESKTOP (769px and wider): Larger, Bolder, Aligned */
@media (min-width: 769px) {
  .te-hero-overlay-wrap {
    height: 70% !important;
    padding-bottom: 72px !important; /* at least 48px from dots at 24px */
  }
  .te-hero-overlay-content {
    width: 100% !important;
    max-width: 900px !important;
    padding: 0 24px !important;
  }
  .te-hero-line1 {
    font-family: var(--font-trajan), 'Cinzel', serif !important;
    font-size: clamp(18px, 1.35vw, 22px) !important;
    font-weight: 700 !important;
    letter-spacing: 0.3em !important;
    color: var(--color-gold, #c5a880) !important;
    text-transform: uppercase !important;
    margin: 0 0 16px 0 !important;
    line-height: 1.2 !important;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.9) !important;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s ease 0s, transform 0.8s ease 0s;
  }
  .te-hero-gold-line {
    width: 90px !important;
    height: 1.5px !important;
    background: var(--color-gold, #c5a880) !important;
    margin: 0 auto 18px auto !important;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s;
  }
  .te-hero-line2 {
    font-family: var(--font-trajan), 'Cinzel', serif !important;
    font-size: clamp(48px, 4.4vw, 78px) !important;
    font-weight: 700 !important;
    letter-spacing: 0.07em !important;
    color: #ffffff !important;
    text-transform: uppercase !important;
    line-height: 1.1 !important;
    margin: 0 0 20px 0 !important;
    text-shadow: 0 3px 18px rgba(0, 0, 0, 0.95) !important;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
  }
  .te-hero-desc {
    font-family: var(--font-trajan), 'Cinzel', serif !important;
    font-size: clamp(16px, 1.2vw, 20px) !important;
    font-weight: 500 !important;
    letter-spacing: 0.08em !important;
    color: #f2ece4 !important;
    line-height: 1.5 !important;
    text-transform: uppercase !important;
    text-wrap: balance !important;
    margin: 0 auto !important;
    max-width: 860px !important;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.95) !important;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s;
  }
}

/* MOBILE (max-width 768px): Exact unchanged mobile styling */
@media (max-width: 768px) {
  .te-hero-overlay-wrap {
    height: 64% !important;
    padding-bottom: 28px !important;
  }
  .te-hero-overlay-content {
    max-width: 96% !important;
    padding: 0 16px !important;
  }
  .te-hero-line1 {
    font-family: var(--font-trajan), 'Cinzel', serif !important;
    font-size: 10px !important;
    font-weight: 600 !important;
    letter-spacing: 0.16em !important;
    color: var(--color-gold, #c5a880) !important;
    text-transform: uppercase !important;
    margin-bottom: 3px !important;
    line-height: 1.3 !important;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.85) !important;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s ease 0s, transform 0.8s ease 0s;
  }
  .te-hero-gold-line {
    width: 40px !important;
    height: 1.5px !important;
    background: var(--color-gold, #c5a880) !important;
    margin: 5px auto !important;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s;
  }
  .te-hero-line2 {
    font-family: var(--font-trajan), 'Cinzel', serif !important;
    font-size: 20px !important;
    font-weight: 700 !important;
    letter-spacing: 0.05em !important;
    color: #ffffff !important;
    text-transform: uppercase !important;
    line-height: 1.2 !important;
    margin-bottom: 6px !important;
    text-shadow: 0 2px 14px rgba(0, 0, 0, 0.9) !important;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
  }
  .te-hero-desc {
    font-family: var(--font-trajan), 'Cinzel', serif !important;
    font-size: 9.5px !important;
    font-weight: 400 !important;
    letter-spacing: 0.03em !important;
    color: #f2ece4 !important;
    line-height: 1.38 !important;
    text-transform: uppercase !important;
    text-wrap: balance !important;
    margin: 0 auto !important;
    max-width: 100% !important;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.95) !important;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s;
  }
}

@media (max-width: 380px) {
  .te-hero-overlay-wrap {
    height: 68% !important;
    padding-bottom: 24px !important;
  }
  .te-hero-line1 {
    font-size: 9px !important;
  }
  .te-hero-line2 {
    font-size: 18px !important;
  }
  .te-hero-desc {
    font-size: 8.5px !important;
    line-height: 1.35 !important;
  }
}

/* Active slide animation */
.re-carousel-slide.active .te-hero-line1,
.re-carousel-slide.active .te-hero-gold-line,
.re-carousel-slide.active .te-hero-line2,
.re-carousel-slide.active .te-hero-desc {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

/* Inactive slide reset */
.re-carousel-slide:not(.active) .te-hero-line1,
.re-carousel-slide:not(.active) .te-hero-gold-line,
.re-carousel-slide:not(.active) .te-hero-line2,
.re-carousel-slide:not(.active) .te-hero-desc {
  opacity: 0 !important;
  transform: translateY(20px) !important;
  transition: opacity 0.4s ease, transform 0.4s ease !important;
}

@media (prefers-reduced-motion: reduce) {
  .te-hero-line1,
  .te-hero-gold-line,
  .te-hero-line2,
  .te-hero-desc {
    transition: none !important;
    transform: none !important;
  }
  .re-carousel-slide.active .te-hero-line1,
  .re-carousel-slide.active .te-hero-gold-line,
  .re-carousel-slide.active .te-hero-line2,
  .re-carousel-slide.active .te-hero-desc {
    opacity: 1 !important;
    transform: none !important;
  }
}`;

const oldChange4Regex = /\/\* CHANGE 4: TWO-LINE LUXURY TEXT OVERLAY ON HERO IMAGES \*\/[\s\S]*?(?=<\/style>)/;
if (!oldChange4Regex.test(updatedCode)) {
  throw new Error('Could not find CHANGE 4 in snippet code!');
}
updatedCode = updatedCode.replace(oldChange4Regex, NEW_OVERLAY_CSS + '\n');

// 3. Update Overlay HTML in JavaScript
const NEW_OVERLAY_HTML = `      var overlay = document.createElement('div');
      overlay.className = 'te-hero-overlay-wrap';
      overlay.innerHTML = 
        '<div class="te-hero-overlay-gradient"></div>' +
        '<div class="te-hero-overlay-content">' +
          '<div class="te-hero-line1">COMPLETE YOUR WALLS</div>' +
          '<div class="te-hero-gold-line"></div>' +
          '<div class="te-hero-line2">WITH TIMELESS LUXURY</div>' +
          '<div class="te-hero-desc">DISCOVER OUR EXQUISITE COLLECTION OF HANDCRAFTED MIRRORS THAT REFLECT ELEGANCE AND SOPHISTICATION. EACH PIECE IS METICULOUSLY DESIGNED TO TRANSFORM YOUR HOME INTO A SANCTUARY OF REFINED BEAUTY.</div>' +
        '</div>';
      slide.appendChild(overlay);`;

const oldJsRegex = /var overlay = document\.createElement\('div'\);[\s\S]*?slide\.appendChild\(overlay\);/;
if (!oldJsRegex.test(updatedCode)) {
  throw new Error('Could not find overlay creation in snippet JS!');
}
updatedCode = updatedCode.replace(oldJsRegex, NEW_OVERLAY_HTML);

fs.writeFileSync('snippet_te_hero_ticker_slider_v2.html', updatedCode);
console.log('✓ Prepared updated snippet_te_hero_ticker_slider_v2.html, size:', updatedCode.length);
