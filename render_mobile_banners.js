import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\de9ea39a-cece-46b8-8bfb-32a9c75ec2c5';

// Read images to base64
const img1Base64 = fs.readFileSync(path.join(brainDir, 'banner_round_mirror.jpg')).toString('base64');
const img2Base64 = fs.readFileSync(path.join(brainDir, 'banner_standing_mirror.jpg')).toString('base64');
const brokenBase64 = fs.readFileSync(path.join(brainDir, 'broken_mobile_reference.png')).toString('base64');

function getMobileHtml(slideIndex) {
  const isSlide1 = slideIndex === 1;
  const currentImg = isSlide1 ? `data:image/jpeg;base64,${img1Base64}` : `data:image/jpeg;base64,${img2Base64}`;
  
  const tag = isSlide1 ? '— THE ART OF REFLECTION —' : '— BESPOKE ATELIER —';
  const title = isSlide1 ? 'ELEVATE YOUR SANCTUARY' : 'TIMELESS ARCHITECTURAL LUXURY';
  const subtitle = isSlide1 ? 'Handcrafted Venetian & Bespoke Mirrors' : 'Grand Proportions Custom Crafted For Refined Homes';
  const desc = isSlide1 
    ? 'Hand-beveled glass, Italian tiered floral profiles, and precision bespoke architectural installations crafted for refined residences.'
    : 'Centuries-old beveling artistry tailored to your exact architectural space. White-glove on-site templating included.';
  const btn1 = 'EXPLORE THE COLLECTION';
  const btn2 = isSlide1 ? 'COMMISSION BESPOKE' : 'BOOK SURVEY';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Mobile Preview Slide ${slideIndex}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
    }
    body {
      background: #08090a;
      font-family: 'Montserrat', sans-serif;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 0;
      margin: 0;
    }
    
    .phone-container {
      width: 430px;
      min-height: 932px;
      background: #0f1012;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 60px rgba(0,0,0,0.8);
    }
    
    /* Top iOS Status Bar */
    .ios-status-bar {
      height: 48px;
      background: #000000;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
      z-index: 100;
    }
    .dynamic-island {
      width: 110px;
      height: 28px;
      background: #1a1a1a;
      border-radius: 20px;
      margin: 0 auto;
    }
    .status-icons {
      display: flex;
      gap: 6px;
      align-items: center;
      font-size: 12px;
    }

    /* Safari URL bar */
    .safari-bar {
      background: #141517;
      padding: 6px 16px 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      font-size: 13px;
      color: #e5e5e5;
    }
    .safari-bar svg {
      width: 13px;
      height: 13px;
      fill: #22c55e;
    }
    .safari-url {
      font-weight: 500;
      letter-spacing: 0.02em;
    }

    /* Ticker announcement */
    .announcement-ticker {
      background: #08090a;
      border-bottom: 1px solid rgba(197, 168, 128, 0.2);
      padding: 7px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #c5a880;
      font-weight: 600;
    }
    .ticker-dot {
      color: #d4af37;
      margin: 0 4px;
    }

    /* Main brand header */
    .re-header {
      background: rgba(15, 16, 18, 0.98);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(197, 168, 128, 0.25);
      padding: 12px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 90;
    }
    .nav-toggle {
      width: 32px;
      height: 32px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      cursor: pointer;
    }
    .nav-toggle span {
      display: block;
      height: 2px;
      background: #c5a880;
      border-radius: 2px;
    }
    .nav-toggle span:nth-child(1) { width: 22px; }
    .nav-toggle span:nth-child(2) { width: 16px; }
    .nav-toggle span:nth-child(3) { width: 20px; }

    .brand-logo-wrap {
      display: flex;
      align-items: center;
      gap: 9px;
      text-decoration: none;
    }
    .brand-crest {
      width: 28px;
      height: 28px;
      border: 1.5px solid #d4af37;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Cinzel', serif;
      font-weight: 700;
      font-size: 13px;
      color: #d4af37;
      background: radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 80%);
      box-shadow: 0 0 10px rgba(212,175,55,0.25);
    }
    .brand-text {
      font-family: 'Cinzel', serif;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.16em;
      color: #f7ede2;
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }
    .brand-sub {
      font-family: 'Montserrat', sans-serif;
      font-size: 7px;
      letter-spacing: 0.28em;
      color: #c5a880;
      margin-top: 2px;
    }

    .cart-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #f7ede2;
      text-decoration: none;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.05em;
    }
    .cart-icon-wrap {
      position: relative;
    }
    .cart-badge {
      position: absolute;
      top: -6px;
      right: -8px;
      background: #c5a880;
      color: #000;
      font-size: 9px;
      font-weight: 700;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Sub-strip: Consultation / Survey */
    .consult-strip {
      background: #000000;
      padding: 6px 14px;
      text-align: center;
      font-size: 8.5px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #a69886;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .consult-strip b {
      color: #d4af37;
      font-weight: 600;
    }

    /* HERO AUTO-SLIDER BANNER CONTAINER */
    .hero-slider-section {
      position: relative;
      width: 100%;
      height: 520px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    .hero-bg-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 25%;
      z-index: 1;
      transform: scale(1.02);
    }

    /* Multi-stop luxury vignette overlay for perfect text contrast */
    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        rgba(10, 11, 14, 0.15) 0%,
        rgba(10, 11, 14, 0.35) 40%,
        rgba(10, 11, 14, 0.78) 70%,
        rgba(10, 11, 14, 0.98) 100%
      );
      z-index: 2;
    }
    
    /* Subtle radial gold spotlight */
    .hero-glow {
      position: absolute;
      bottom: 60px;
      left: 50%;
      transform: translateX(-50%);
      width: 320px;
      height: 220px;
      background: radial-gradient(ellipse at center, rgba(212, 175, 55, 0.12) 0%, transparent 70%);
      z-index: 3;
      pointer-events: none;
    }

    /* Slide Badge / Auto-Slide Pill */
    .slide-badge-pill {
      position: absolute;
      top: 16px;
      right: 16px;
      z-index: 10;
      background: rgba(15, 16, 18, 0.7);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(197, 168, 128, 0.4);
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 9px;
      letter-spacing: 0.15em;
      color: #e5d5be;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #d4af37;
      box-shadow: 0 0 6px #d4af37;
    }

    /* Hero Content Card */
    .hero-content {
      position: relative;
      z-index: 5;
      padding: 0 22px 28px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .hero-microtag {
      font-family: 'Montserrat', sans-serif;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: #d4af37;
      margin-bottom: 10px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.8);
    }

    .hero-heading {
      font-family: 'Cormorant Garamond', serif;
      font-size: 32px;
      font-weight: 700;
      line-height: 1.15;
      color: #ffffff;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      text-shadow: 0 3px 12px rgba(0,0,0,0.9);
    }

    .hero-subheading {
      font-family: 'Cinzel', serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.14em;
      color: #c5a880;
      margin-bottom: 10px;
      text-transform: uppercase;
    }

    .hero-desc {
      font-size: 11px;
      line-height: 1.55;
      color: #e0deda;
      max-width: 370px;
      margin-bottom: 20px;
      font-weight: 300;
      text-shadow: 0 1px 4px rgba(0,0,0,0.8);
    }

    /* Button Group */
    .hero-btn-group {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 10px;
      margin-bottom: 22px;
    }

    .btn-gold-solid {
      background: linear-gradient(135deg, #d4af37 0%, #c5a880 50%, #b89767 100%);
      color: #0d0e10;
      font-family: 'Cinzel', serif;
      font-size: 11.5px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      padding: 13px 20px;
      border-radius: 3px;
      text-decoration: none;
      box-shadow: 0 4px 18px rgba(212, 175, 55, 0.35);
      border: 1px solid rgba(255,255,255,0.4);
      display: block;
      width: 100%;
    }

    .btn-gold-outline {
      background: rgba(15, 16, 18, 0.6);
      backdrop-filter: blur(6px);
      color: #ffffff;
      font-family: 'Cinzel', serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      padding: 12px 20px;
      border-radius: 3px;
      text-decoration: none;
      border: 1px solid rgba(197, 168, 128, 0.6);
      display: block;
      width: 100%;
    }

    /* Slider Pagination Dots & Controls */
    .slider-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      width: 100%;
    }

    .slide-dot {
      height: 7px;
      border-radius: 4px;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.3);
    }
    .slide-dot.active {
      width: 32px;
      background: linear-gradient(90deg, #d4af37, #c5a880);
      box-shadow: 0 0 8px rgba(212, 175, 55, 0.6);
    }
    .slide-dot.inactive {
      width: 10px;
      background: rgba(255, 255, 255, 0.35);
    }

    .slide-counter {
      font-family: 'Cinzel', serif;
      font-size: 10px;
      color: #c5a880;
      letter-spacing: 0.15em;
      font-weight: 600;
      margin-left: 8px;
    }

    /* SECTION 2 (Next Section Preview below Banner) */
    .next-section-preview {
      background: #0f1012;
      border-top: 1px solid rgba(197, 168, 128, 0.2);
      padding: 26px 18px 40px;
      text-align: center;
      position: relative;
    }
    .section-tagline {
      font-size: 9.5px;
      letter-spacing: 0.25em;
      color: #d4af37;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 6px;
    }
    .section-title {
      font-family: 'Cinzel', serif;
      font-size: 19px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #ffffff;
      margin-bottom: 6px;
    }
    .section-subtitle {
      font-size: 10.5px;
      color: #8c8f96;
      font-weight: 300;
      margin-bottom: 20px;
    }
    
    /* Product preview card row */
    .mini-product-row {
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    .mini-card {
      background: #141619;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 4px;
      padding: 8px;
      width: 180px;
      text-align: left;
    }
    .mini-card-img {
      width: 100%;
      height: 120px;
      background: #1d2024;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      color: #777;
      overflow: hidden;
    }
    .mini-card-title {
      font-family: 'Cinzel', serif;
      font-size: 11px;
      color: #f7ede2;
      margin-top: 8px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .mini-card-price {
      font-size: 11px;
      color: #d4af37;
      font-weight: 600;
      margin-top: 3px;
    }

    /* Floating watermark indicator */
    .watermark-badge {
      position: absolute;
      top: 12px;
      left: 14px;
      z-index: 10;
      background: rgba(0, 0, 0, 0.75);
      border: 1px solid rgba(212,175,55,0.5);
      color: #d4af37;
      font-size: 8.5px;
      font-weight: 700;
      letter-spacing: 0.14em;
      padding: 3px 8px;
      border-radius: 3px;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="phone-container">
    <!-- iOS Status Bar -->
    <div class="ios-status-bar">
      <span>2:09</span>
      <div class="dynamic-island"></div>
      <div class="status-icons">
        <span>5G</span>
        <span>85%</span>
      </div>
    </div>

    <!-- Safari Address Bar -->
    <div class="safari-bar">
      <svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
      <span class="safari-url">reflectionelite.com</span>
    </div>

    <!-- Announcement Bar -->
    <div class="announcement-ticker">
      <span>FREE SHIPPING 📦</span>
      <span class="ticker-dot">•</span>
      <span>BESPOKE SIZING</span>
      <span class="ticker-dot">•</span>
      <span>PAN-INDIA</span>
    </div>

    <!-- Unified Header -->
    <div class="re-header">
      <div class="nav-toggle">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div class="brand-logo-wrap">
        <div class="brand-crest">TR</div>
        <div class="brand-text">
          <span>REFLECTION ELITE</span>
          <span class="brand-sub">LUXURY ATELIER</span>
        </div>
      </div>

      <div class="cart-btn">
        <div class="cart-icon-wrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <span class="cart-badge">0</span>
        </div>
      </div>
    </div>

    <!-- Secondary Consultation Strip -->
    <div class="consult-strip">
      <b>FREE ON-SITE LASER TEMPLATING</b> &bull; LUXURY MIRRORS
    </div>

    <!-- AUTO-SLIDE HERO BANNER -->
    <div class="hero-slider-section">
      <img src="${currentImg}" class="hero-bg-img" alt="Luxury Mirror Banner">
      <div class="hero-overlay"></div>
      <div class="hero-glow"></div>
      
      <div class="watermark-badge">PROPOSED DESIGN &bull; SLIDE ${slideIndex} OF 2</div>
      <div class="slide-badge-pill">
        <span class="pulse-dot"></span>
        <span>AUTO-SLIDE (5s)</span>
      </div>

      <div class="hero-content">
        <div class="hero-microtag">${tag}</div>
        <h1 class="hero-heading">${title}</h1>
        <div class="hero-subheading">${subtitle}</div>
        <p class="hero-desc">${desc}</p>

        <div class="hero-btn-group">
          <a href="#" class="btn-gold-solid">${btn1}</a>
          <a href="#" class="btn-gold-outline">${btn2}</a>
        </div>

        <div class="slider-controls">
          <div class="slide-dot ${isSlide1 ? 'active' : 'inactive'}"></div>
          <div class="slide-dot ${!isSlide1 ? 'active' : 'inactive'}"></div>
          <span class="slide-counter">0${slideIndex} / 02</span>
        </div>
      </div>
    </div>

    <!-- NEXT SECTION PREVIEW (THE VENETIAN HERITAGE COLLECTION) -->
    <div class="next-section-preview">
      <div class="section-tagline">— ATELIER ARCHIVE —</div>
      <h2 class="section-title">THE VENETIAN HERITAGE COLLECTION</h2>
      <div class="section-subtitle">Centuries-old tiered beveling methods preserved by master glass artisans.</div>

      <div class="mini-product-row">
        <div class="mini-card">
          <div class="mini-card-img" style="background:#181a1d; color:#999; font-size:10px; text-align:center; padding:10px;">
            Antique Venetian Cushion Mirror
          </div>
          <div class="mini-card-title">Antique Venetian Cushion</div>
          <div class="mini-card-price">₹81,500.00</div>
        </div>
        <div class="mini-card">
          <div class="mini-card-img" style="background:#181a1d; color:#999; font-size:10px; text-align:center; padding:10px;">
            Silver Crown Framed Mirror
          </div>
          <div class="mini-card-title">Silver Crown Framed</div>
          <div class="mini-card-price">₹35,900.00</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Function to generate comparison HTML
function getComparisonHtml() {
  const currentImg1 = `data:image/jpeg;base64,${img1Base64}`;
  const currentImg2 = `data:image/jpeg;base64,${img2Base64}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Side-by-Side Mobile Comparison</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Cormorant+Garamond:wght@600;700&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      background: #08090b;
      font-family: 'Montserrat', sans-serif;
      color: #fff;
      padding: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .header-banner {
      text-align: center;
      margin-bottom: 30px;
      max-width: 900px;
    }
    .header-badge {
      display: inline-block;
      font-size: 11px;
      letter-spacing: 0.25em;
      color: #d4af37;
      text-transform: uppercase;
      font-weight: 700;
      border: 1px solid rgba(212,175,55,0.4);
      padding: 5px 14px;
      border-radius: 20px;
      margin-bottom: 12px;
      background: rgba(212,175,55,0.08);
    }
    .header-title {
      font-family: 'Cinzel', serif;
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }
    .header-sub {
      font-size: 13px;
      color: #9ca3af;
      max-width: 650px;
      margin: 0 auto;
      line-height: 1.5;
    }
    
    .comparison-grid {
      display: flex;
      gap: 30px;
      justify-content: center;
      align-items: flex-start;
      flex-wrap: nowrap;
    }

    .column {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .col-label {
      font-family: 'Cinzel', serif;
      font-size: 14px;
      letter-spacing: 0.12em;
      font-weight: 700;
      margin-bottom: 14px;
      padding: 6px 16px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .col-label.broken {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    .col-label.proposed {
      background: rgba(212, 175, 55, 0.15);
      color: #d4af37;
      border: 1px solid rgba(212, 175, 55, 0.4);
    }

    .device-frame {
      width: 380px;
      height: 760px;
      border-radius: 36px;
      border: 4px solid #27272a;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.8);
      position: relative;
      background: #0f1012;
    }

    .device-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
    }

    .specs-box {
      width: 380px;
      margin-top: 14px;
      background: #141619;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 11px;
      line-height: 1.5;
      color: #cbd5e1;
    }
    .specs-box b {
      color: #d4af37;
    }
  </style>
</head>
<body>
  <div class="header-banner">
    <div class="header-badge">MOBILE ARCHITECTURAL REDESIGN</div>
    <h1 class="header-title">REFLECTION ELITE &bull; MOBILE HERO SLIDER DESIGN</h1>
    <p class="header-sub">Comparison between the currently broken dark-blue text section and the proposed auto-sliding luxury banner showcasing the 2 mirror interior photos.</p>
  </div>

  <div class="comparison-grid">
    <!-- COL 1: Current Broken Mobile View -->
    <div class="column">
      <div class="col-label broken">CURRENT (BROKEN MOBILE VIEW)</div>
      <div class="device-frame">
        <img src="data:image/png;base64,${brokenBase64}" alt="Current Broken Mobile View">
      </div>
      <div class="specs-box">
        <b>Issues Identified:</b><br>
        &bull; Illegible dark-blue text on black background.<br>
        &bull; No hero image or banner photography.<br>
        &bull; CTA links jammed together without button styling.<br>
        &bull; Lack of luxury spacing and visual hierarchy.
      </div>
    </div>

    <!-- COL 2: Proposed Slide 1 -->
    <div class="column">
      <div class="col-label proposed">PROPOSED DESIGN &bull; SLIDE 1 (ROUND MIRROR)</div>
      <div class="device-frame">
        <iframe src="mobile_slide_1.html" style="width:430px; height:932px; border:none; transform: scale(0.8837); transform-origin: top left; pointer-events:none;"></iframe>
      </div>
      <div class="specs-box">
        <b>Slide 1 Highlights:</b><br>
        &bull; Round gold mirror over marble floating shelf.<br>
        &bull; Multi-tier contrast gradient for crisp legibility.<br>
        &bull; High-contrast gold & outline CTA buttons.<br>
        &bull; Auto-slide indicator & slide dots (01/02).
      </div>
    </div>

    <!-- COL 3: Proposed Slide 2 -->
    <div class="column">
      <div class="col-label proposed">PROPOSED DESIGN &bull; SLIDE 2 (STANDING MIRROR)</div>
      <div class="device-frame">
        <iframe src="mobile_slide_2.html" style="width:430px; height:932px; border:none; transform: scale(0.8837); transform-origin: top left; pointer-events:none;"></iframe>
      </div>
      <div class="specs-box">
        <b>Slide 2 Highlights:</b><br>
        &bull; Grand ornate full-length standing floor mirror.<br>
        &bull; Architectural bespoke messaging.<br>
        &bull; Clear "Book Survey" & "Explore Collection" CTAs.<br>
        &bull; Synchronized transition to catalog below.
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

async function render() {
  console.log('Writing HTML templates...');
  fs.writeFileSync(path.join(brainDir, 'mobile_slide_1.html'), getMobileHtml(1), 'utf8');
  fs.writeFileSync(path.join(brainDir, 'mobile_slide_2.html'), getMobileHtml(2), 'utf8');
  fs.writeFileSync(path.join(brainDir, 'mobile_comparison.html'), getComparisonHtml(), 'utf8');

  console.log('Launching headless Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security'
    ]
  });

  const page = await browser.newPage();

  // Render Slide 1 Mobile Screenshot
  console.log('Rendering Slide 1 Mobile Screenshot (430x932)...');
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });
  await page.goto('file:///' + path.join(brainDir, 'mobile_slide_1.html').replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(brainDir, 'mobile_designed_slide_1.png'), fullPage: true });
  console.log('Saved mobile_designed_slide_1.png');

  // Render Slide 2 Mobile Screenshot
  console.log('Rendering Slide 2 Mobile Screenshot (430x932)...');
  await page.goto('file:///' + path.join(brainDir, 'mobile_slide_2.html').replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(brainDir, 'mobile_designed_slide_2.png'), fullPage: true });
  console.log('Saved mobile_designed_slide_2.png');

  // Render Comparison Overview (1300x960)
  console.log('Rendering Comprehensive Comparison (1300x1050)...');
  await page.setViewport({ width: 1320, height: 1060, deviceScaleFactor: 1.5 });
  await page.goto('file:///' + path.join(brainDir, 'mobile_comparison.html').replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(brainDir, 'mobile_designed_comparison.png'), fullPage: true });
  console.log('Saved mobile_designed_comparison.png');

  await browser.close();
  console.log('All images rendered successfully!');
}

render().catch(err => {
  console.error('Render failed:', err);
  process.exit(1);
});
