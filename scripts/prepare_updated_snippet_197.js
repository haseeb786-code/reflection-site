import fs from 'fs';

const currentCode = fs.readFileSync('backups/snippet_197_before_overlay_update.html', 'utf8');

// 1. New Overlay CSS
const NEW_OVERLAY_CSS = `/* CHANGE 4: THREE-TIER LUXURY TEXT OVERLAY ON HERO IMAGES */
.te-hero-overlay-wrap {
  position: absolute !important;
  left: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  height: 62% !important;
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
  background: linear-gradient(to top, rgba(8, 9, 11, 0.94) 0%, rgba(8, 9, 11, 0.72) 48%, rgba(8, 9, 11, 0.35) 78%, rgba(8, 9, 11, 0) 100%) !important;
  pointer-events: none !important;
  z-index: 1 !important;
}
.te-hero-overlay-content {
  position: relative !important;
  z-index: 2 !important;
  text-align: center !important;
  max-width: 64% !important;
  margin: 0 auto !important;
  padding: 0 16px !important;
  box-sizing: border-box !important;
}
.te-hero-line1 {
  font-family: var(--font-trajan), 'Cinzel', serif !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  letter-spacing: 0.22em !important;
  color: var(--color-gold, #c5a880) !important;
  text-transform: uppercase !important;
  margin: 0 0 4px 0 !important;
  line-height: 1.3 !important;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.85) !important;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease 0s, transform 0.8s ease 0s;
}
.te-hero-gold-line {
  width: 55px !important;
  height: 1.5px !important;
  background: var(--color-gold, #c5a880) !important;
  margin: 6px auto !important;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s;
}
.te-hero-line2 {
  font-family: var(--font-trajan), 'Cinzel', serif !important;
  font-size: clamp(28px, 2.8vw, 42px) !important;
  font-weight: 700 !important;
  letter-spacing: 0.08em !important;
  color: #ffffff !important;
  text-transform: uppercase !important;
  line-height: 1.2 !important;
  margin: 0 0 10px 0 !important;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.9) !important;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
}
.te-hero-desc {
  font-family: var(--font-trajan), 'Cinzel', serif !important;
  font-size: clamp(12px, 1.05vw, 15px) !important;
  font-weight: 400 !important;
  letter-spacing: 0.05em !important;
  color: #f2ece4 !important;
  line-height: 1.45 !important;
  text-transform: uppercase !important;
  text-wrap: balance !important;
  margin: 0 auto !important;
  max-width: 680px !important;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.95) !important;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s;
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
    font-size: 10px !important;
    letter-spacing: 0.16em !important;
    margin-bottom: 3px !important;
  }
  .te-hero-gold-line {
    width: 40px !important;
    margin: 5px auto !important;
  }
  .te-hero-line2 {
    font-size: 20px !important;
    letter-spacing: 0.05em !important;
    line-height: 1.2 !important;
    margin-bottom: 6px !important;
  }
  .te-hero-desc {
    font-size: 9.5px !important;
    letter-spacing: 0.03em !important;
    line-height: 1.38 !important;
    max-width: 100% !important;
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

// Replace the CSS portion
const oldCssRegex = /\/\* CHANGE 4: TWO-LINE LUXURY TEXT OVERLAY ON HERO IMAGES \*\/[\s\S]*?(?=<\/style>)/;
if (!oldCssRegex.test(currentCode)) {
  throw new Error('Could not find CHANGE 4 CSS in snippet 197 code!');
}
let updatedCode = currentCode.replace(oldCssRegex, NEW_OVERLAY_CSS + '\n');

// 2. New Overlay HTML in JS
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
  throw new Error('Could not find overlay creation in snippet 197 JS!');
}
updatedCode = updatedCode.replace(oldJsRegex, NEW_OVERLAY_HTML);

fs.writeFileSync('snippet_te_hero_ticker_slider_v2.html', updatedCode);
console.log('✓ Successfully prepared snippet_te_hero_ticker_slider_v2.html, size:', updatedCode.length);
