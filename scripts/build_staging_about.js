import fs from 'fs';
import http from 'https';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
const nonce = 'f5b146aecd';

const IMGS = {
  logo: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/Logo-Reflection-e1777369196767-1024x186.png',
  heroBg: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/generat-an-led-luxurious-mirror.webp',
  workshop1: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/pomelli_photoshoot_image_4_5_0414_4.webp',
  craftsman: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260221_235950-1024x878.webp',
  mirrorDetail: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/an-luxury-venetian-mirror.webp',
  surveyBg: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/bg-07.png'
};

const rawCss = `
@font-face {
  font-family: 'Trajan Pro Bold';
  src: url('https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/trajanpro-bold.otf.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Trajan Pro';
  src: url('https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/trajanpro-bold.otf.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

:root {
  --font-trajan: 'Trajan Pro Bold', 'Trajan Pro', trajanpro, 'Cinzel', Georgia, serif;
  --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --color-bg-dark: #0f1012;
  --color-surface-dark: #141518;
  --color-card-dark: #18191d;
  --color-gold: #c5a880;
  --color-gold-hover: #dfc198;
  --color-border: rgba(255, 255, 255, 0.08);
  --color-border-gold: rgba(197, 168, 128, 0.28);
  --color-text-light: #f4f4f5;
  --color-text-muted: #a1a1aa;
  --site-max-width: 1380px;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body, .te-about-page {
  background-color: var(--color-bg-dark) !important;
  color: var(--color-text-light) !important;
  font-family: var(--font-body) !important;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

h1, h2, h3, h4, .trajan-text {
  font-family: var(--font-trajan) !important;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

a {
  color: inherit;
  text-decoration: none;
}

/* ANNOUNCEMENT BAR */
.announcement-bar {
  background: #090a0c;
  border-bottom: 1px solid var(--color-border);
  padding: 8px 16px;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-align: center;
  color: var(--color-gold);
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

/* HEADER */
.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(15, 16, 18, 0.94);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--color-border);
  padding: 14px 32px;
}
.header-inner {
  max-width: var(--site-max-width);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.header-logo img {
  height: 40px;
  width: auto;
  display: block;
}
.main-nav {
  display: flex;
  align-items: center;
  gap: 28px;
}
.nav-link {
  font-family: var(--font-trajan) !important;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  color: var(--color-text-light);
  transition: color 0.25s ease;
  position: relative;
  padding: 4px 0;
}
.nav-link:hover, .nav-link.active {
  color: var(--color-gold) !important;
}
.header-quote-btn {
  font-family: var(--font-trajan) !important;
  background: transparent;
  color: var(--color-gold);
  border: 1px solid var(--color-gold);
  padding: 8px 18px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  border-radius: 2px;
  transition: all 0.25s ease;
  white-space: nowrap;
}
.header-quote-btn:hover {
  background: var(--color-gold);
  color: #000;
}

/* HERO BANNER */
.about-hero {
  position: relative;
  width: 100%;
  min-height: 55vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-size: cover;
  background-position: center;
  padding: 80px 24px;
  overflow: hidden;
}
.about-hero-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(180deg, rgba(15,16,18,0.6) 0%, rgba(15,16,18,0.88) 100%);
  z-index: 1;
}
.about-hero-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
}
.hero-badge {
  display: inline-block;
  color: var(--color-gold);
  font-family: var(--font-trajan);
  font-size: 0.82rem;
  letter-spacing: 0.22em;
  padding: 6px 18px;
  border: 1px solid var(--color-border-gold);
  background: rgba(197, 168, 128, 0.08);
  border-radius: 40px;
  margin-bottom: 16px;
}
.about-hero h1 {
  font-size: clamp(2.2rem, 4.2vw, 3.5rem);
  line-height: 1.18;
  color: #ffffff;
  margin-bottom: 16px;
  text-shadow: 0 4px 20px rgba(0,0,0,0.8);
}
.about-hero p {
  font-size: clamp(1rem, 1.2vw, 1.15rem);
  color: #d1d5db;
  max-width: 720px;
  margin: 0 auto;
  line-height: 1.65;
}

/* CONTENT SECTIONS */
.about-section {
  padding: 90px 24px;
}
.about-container {
  max-width: var(--site-max-width);
  margin: 0 auto;
}

/* 2-COLUMN SPLIT */
.split-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}
.split-text h2 {
  font-size: clamp(1.8rem, 2.8vw, 2.4rem);
  color: #ffffff;
  margin-bottom: 20px;
  line-height: 1.25;
}
.split-text p {
  color: var(--color-text-muted);
  font-size: 1.02rem;
  margin-bottom: 18px;
  line-height: 1.7;
}
.split-image {
  position: relative;
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid var(--color-border-gold);
  box-shadow: 0 20px 40px rgba(0,0,0,0.6);
}
.split-image img {
  width: 100%;
  height: 480px;
  object-fit: cover;
  display: block;
}

/* VALUE PILLARS */
.pillars-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 50px;
}
.pillar-card {
  background: var(--color-card-dark);
  border: 1px solid var(--color-border);
  padding: 36px 26px;
  border-radius: 3px;
  text-align: center;
  transition: all 0.3s ease;
}
.pillar-card:hover {
  border-color: var(--color-gold);
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.5);
}
.pillar-num {
  font-family: var(--font-trajan);
  font-size: 2.2rem;
  color: var(--color-gold);
  margin-bottom: 12px;
  display: block;
}
.pillar-title {
  font-size: 1.05rem;
  color: #ffffff;
  margin-bottom: 10px;
}
.pillar-desc {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.55;
}

/* PROCESS WORKFLOW */
.process-section {
  background: var(--color-surface-dark);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  padding: 90px 24px;
}
.section-header-center {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 50px;
}
.section-header-center h2 {
  font-size: clamp(1.8rem, 2.8vw, 2.4rem);
  color: #ffffff;
  margin-bottom: 12px;
}
.section-header-center p {
  color: var(--color-text-muted);
}
.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
}
.step-item {
  background: var(--color-bg-dark);
  border: 1px solid var(--color-border-gold);
  padding: 32px 24px;
  border-radius: 2px;
  position: relative;
}
.step-badge {
  display: inline-block;
  background: var(--color-gold);
  color: #0f1012;
  font-family: var(--font-trajan);
  font-weight: 700;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 2px;
  margin-bottom: 14px;
}
.step-title {
  font-size: 1rem;
  color: #ffffff;
  margin-bottom: 10px;
}
.step-desc {
  font-size: 0.88rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

/* CTA BANNER */
.cta-banner {
  background: linear-gradient(180deg, #18191d 0%, #0f1012 100%);
  border-top: 1px solid var(--color-border-gold);
  padding: 80px 24px;
  text-align: center;
}
.cta-banner h2 {
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  color: #ffffff;
  margin-bottom: 16px;
}
.cta-banner p {
  color: var(--color-text-muted);
  max-width: 600px;
  margin: 0 auto 28px;
}
.btn-gold-solid {
  display: inline-block;
  background: var(--color-gold);
  color: #0f1012 !important;
  font-family: var(--font-trajan);
  font-weight: 700;
  font-size: 0.88rem;
  letter-spacing: 0.12em;
  padding: 16px 36px;
  border-radius: 2px;
  border: 1px solid var(--color-gold);
  transition: all 0.3s ease;
}
.btn-gold-solid:hover {
  background: var(--color-gold-hover);
  transform: translateY(-2px);
}

/* FOOTER */
.site-footer {
  background: #090a0c;
  border-top: 1px solid var(--color-border);
  padding: 80px 24px 30px;
  color: var(--color-text-muted);
}
.footer-inner {
  max-width: var(--site-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 48px;
  margin-bottom: 60px;
}
.footer-brand p {
  margin: 16px 0 20px;
  font-size: 0.9rem;
  line-height: 1.6;
}
.footer-title {
  font-size: 0.92rem;
  color: #ffffff !important;
  letter-spacing: 0.12em;
  margin-bottom: 20px;
}
.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.footer-links a {
  font-size: 0.88rem;
  color: var(--color-text-muted);
  transition: color 0.2s ease;
}
.footer-links a:hover {
  color: var(--color-gold);
}
.footer-bottom {
  max-width: var(--site-max-width);
  margin: 0 auto;
  padding-top: 30px;
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
  flex-wrap: wrap;
  gap: 16px;
}

@media (max-width: 1024px) {
  .split-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .pillars-grid, .steps-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .footer-inner {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 768px) {
  .site-header { padding: 12px 16px !important; }
  .header-logo img { height: 32px !important; }
  .main-nav { display: none; }
  .pillars-grid, .steps-grid {
    grid-template-columns: 1fr;
  }
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
`;

const cleanCss = rawCss.split('\n').map(l => l.trim()).filter(Boolean).join('\n');

const bodyHtml = `
<!-- TOP ANNOUNCEMENT BAR -->
<div class="announcement-bar">
  <span>FREE COMPREHENSIVE ON-SITE CONSULTATION &amp; LASER TEMPLATING</span>
  <span>•</span>
  <span>PREMIUM ARCHITECTURAL GLASS &amp; MIRROR INSTALLATIONS</span>
</div>

<!-- HEADER NAVIGATION -->
<header class="site-header">
  <div class="header-inner">
    <a href="https://reflectionelite.ataanalytiq.com/staging-home/?demo=1" class="header-logo">
      <img src="${IMGS.logo}" alt="Reflection Elite Luxury Glass &amp; Mirrors">
    </a>
    <nav class="main-nav">
      <a href="https://reflectionelite.ataanalytiq.com/staging-home/?demo=1" class="nav-link">HOME</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1" class="nav-link">SHOP &amp; COLLECTIONS</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-product/?demo=1" class="nav-link">SINGLE PRODUCT</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-about-us/?demo=1" class="nav-link active">ABOUT US</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="nav-link">CONTACT</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-policies/?demo=1" class="nav-link">POLICIES</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?demo=1" class="nav-link">CART</a>
    </nav>
    <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="header-quote-btn">BOOK SURVEY</a>
  </div>
</header>

<!-- ABOUT HERO BANNER -->
<section class="about-hero" style="background-image: url('${IMGS.heroBg}');">
  <div class="about-hero-overlay"></div>
  <div class="about-hero-content">
    <span class="hero-badge">OUR ARTISANAL HERITAGE</span>
    <h1>MASTER CRAFTSMANSHIP IN GLASS &amp; MIRRORS</h1>
    <p>Creating bespoke designer mirrors and architectural glass installations that elevate interior spaces into timeless luxury sanctuaries.</p>
  </div>
</section>

<!-- WHO WE ARE (AUTHENTIC CONTENT) -->
<section class="about-section">
  <div class="about-container">
    <div class="split-grid">
      <div class="split-text">
        <span class="hero-badge" style="margin-bottom:12px;">WHO WE ARE</span>
        <h2>ELEVATING SPACES INTO INFLUENCER-WORTHY BACKDROPS</h2>
        <p>Reflection Elite creates premium designer mirrors and architectural glazing that transform everyday spaces into stunning, high-fashion environments. We focus on master craftsmanship, modern aesthetics, and meticulously curated glass designs so your home and commercial spaces look breathtaking both on and off camera.</p>
        <p>Trusted by discerning homeowners, premier interior designers, and luxury architects, we deliver custom decor and precision-engineered structural glass that reflects your highest standards of elegance and durability.</p>
      </div>
      <div class="split-image">
        <img src="${IMGS.mirrorDetail}" alt="Handcrafted Venetian Mirror Detail">
      </div>
    </div>

    <!-- MISSION & VISION -->
    <div class="pillars-grid">
      <div class="pillar-card">
        <span class="pillar-num">01</span>
        <h3 class="pillar-title">OUR MISSION</h3>
        <p class="pillar-desc">To deliver high-quality, stylish, and durable glass and mirror solutions that enhance the beauty and functionality of every architectural space.</p>
      </div>
      <div class="pillar-card">
        <span class="pillar-num">02</span>
        <h3 class="pillar-title">OUR VISION</h3>
        <p class="pillar-desc">To lead the bespoke glazing industry by continuously innovating in digital laser templating, beveling art, and silvering technologies.</p>
      </div>
      <div class="pillar-card">
        <span class="pillar-num">03</span>
        <h3 class="pillar-title">LOW-IRON PURITY</h3>
        <p class="pillar-desc">We fabricate exclusively using ultra-clear low-iron glass, eliminating the green tint of standard glass for flawless optical reflection.</p>
      </div>
      <div class="pillar-card">
        <span class="pillar-num">04</span>
        <h3 class="pillar-title">10-YEAR GUARANTEE</h3>
        <p class="pillar-desc">All bespoke mirror silvering and structural hardware are backed by our comprehensive anti-desilvering and structural warranty.</p>
      </div>
    </div>
  </div>
</section>

<!-- OUR 4-STAGE ARCHITECTURAL PROCESS -->
<section class="process-section">
  <div class="about-container">
    <div class="section-header-center">
      <span class="hero-badge">PRECISION GLAZING</span>
      <h2>OUR 4-STAGE ARCHITECTURAL WORKFLOW</h2>
      <p>From initial digital survey to final white-glove glazier installation, every project is executed with sub-millimeter precision.</p>
    </div>

    <div class="steps-grid">
      <div class="step-item">
        <span class="step-badge">STAGE 01</span>
        <h3 class="step-title">DIGITAL LASER TEMPLATING</h3>
        <p class="step-desc">Our certified glazier engineers visit your premises with 3D digital laser templaters, capturing exact wall contours, out-of-square angles, and floor slopes.</p>
      </div>
      <div class="step-item">
        <span class="step-badge">STAGE 02</span>
        <h3 class="step-title">CNC WATERJET &amp; CUTTING</h3>
        <p class="step-desc">Glass panels are precision-cut using automated CNC waterjet tables, ensuring flawless cutouts for hinges, hardware notches, and electrical outlets.</p>
      </div>
      <div class="step-item">
        <span class="step-badge">STAGE 03</span>
        <h3 class="step-title">HAND-BEVELED POLISHING</h3>
        <p class="step-desc">Our artisan craftsmen hand-polish every edge with multi-tiered diamond wheels, creating radiant pencil polish, miters, or multi-step Venetian bevels.</p>
      </div>
      <div class="step-item">
        <span class="step-badge">STAGE 04</span>
        <h3 class="step-title">WHITE-GLOVE INSTALLATION</h3>
        <p class="step-desc">Master glaziers anchor and seal your glass systems with structural silicone and marine-grade brass hardware, ensuring lifetime safety and elegance.</p>
      </div>
    </div>
  </div>
</section>

<!-- CALL TO ACTION BANNER -->
<section class="cta-banner">
  <div class="about-container">
    <span class="hero-badge">BEGIN YOUR COMMISSION</span>
    <h2>READY TO TRANSFORM YOUR ARCHITECTURAL SPACE?</h2>
    <p>Contact our concierge team to schedule an on-site survey or discuss a custom Venetian mirror, frameless shower, or glass partition.</p>
    <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="btn-gold-solid">SCHEDULE ON-SITE CONSULTATION</a>
  </div>
</section>

<!-- LUXURY BRAND FOOTER -->
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <img src="${IMGS.logo}" alt="Reflection Elite" style="height:36px; margin-bottom:12px;">
      <p>Reflection Elite is an architectural glass and bespoke mirror atelier specializing in frameless shower systems, custom LED mirrors, acoustic office partitions, and handcrafted Venetian mirrors.</p>
    </div>
    <div>
      <h4 class="footer-title">COLLECTIONS</h4>
      <ul class="footer-links">
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1">Frameless Showers</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1">Venetian Statement Mirrors</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1">LED Smart Mirrors</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1">Architectural Partitions</a></li>
      </ul>
    </div>
    <div>
      <h4 class="footer-title">NAVIGATION</h4>
      <ul class="footer-links">
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-home/?demo=1">Home</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-about-us/?demo=1">About Us</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1">Contact Concierge</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-policies/?demo=1">Policies &amp; Warranty</a></li>
      </ul>
    </div>
    <div>
      <h4 class="footer-title">STUDIO CONCIERGE</h4>
      <p style="font-size:0.88rem; line-height:1.6; margin-bottom:12px;">Direct Line: +91 98765 43210<br>Email: concierge@reflectionelite.com<br>Mon – Sat: 9:00 AM – 7:00 PM</p>
      <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="header-quote-btn" style="display:inline-block; margin-top:8px;">BOOK SURVEY</a>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2026 Reflection Elite. All Rights Reserved. Staging Preview.</p>
    <p style="color:var(--color-gold);">TRENDING ERA LUXURY EDITION</p>
  </div>
</footer>
`;

const fullGutenbergPayload = `<!-- wp:html -->
<style id="te-about-styles">
${cleanCss}
</style>
<div class="te-about-page">
${bodyHtml}
</div>
<!-- /wp:html -->`;

async function deployAbout() {
  console.log('Deploying Staging About Us page...');
  
  // Check if staging-about-us already exists
  const checkReq = http.get('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages?slug=staging-about-us', {
    headers: { 'Cookie': cookieHeader }
  }, res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
      const existing = JSON.parse(body);
      const targetId = existing.length > 0 ? existing[0].id : null;
      
      const payload = JSON.stringify({
        title: 'About Us — Staging Preview (Trending Era)',
        slug: 'staging-about-us',
        status: 'publish',
        template: 'elementor_canvas',
        content: fullGutenbergPayload,
        meta: {
          _elementor_edit_mode: ''
        }
      });
      
      const method = targetId ? 'POST' : 'POST';
      const endpoint = targetId 
        ? `https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/${targetId}`
        : 'https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages';
        
      console.log(`Sending to ${endpoint} (Target ID: ${targetId || 'NEW'})...`);
      
      const req = http.request(endpoint, {
        method: 'POST',
        headers: {
          'Cookie': cookieHeader,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          'X-WP-Nonce': nonce
        }
      }, resPost => {
        let postBody = '';
        resPost.on('data', d => postBody += d);
        resPost.on('end', () => {
          console.log('Deploy response code:', resPost.statusCode);
          try {
            const result = JSON.parse(postBody);
            console.log('Staging About Us Page ID:', result.id, '| Link:', result.link);
          } catch(e) {
            console.log('Error parsing response:', postBody.slice(0, 300));
          }
        });
      });
      req.write(payload);
      req.end();
    });
  });
}

deployAbout();
