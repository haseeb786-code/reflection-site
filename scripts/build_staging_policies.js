import fs from 'fs';
import http from 'https';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
const nonce = 'f5b146aecd';

const IMGS = {
  logo: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/Logo-Reflection-e1777369196767-1024x186.png',
  heroBg: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/bg-03.png'
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

body, .te-policies-page {
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
.policies-hero {
  position: relative;
  width: 100%;
  min-height: 45vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-size: cover;
  background-position: center;
  padding: 70px 24px;
  overflow: hidden;
}
.policies-hero-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(180deg, rgba(15,16,18,0.65) 0%, rgba(15,16,18,0.92) 100%);
  z-index: 1;
}
.policies-hero-content {
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
.policies-hero h1 {
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  line-height: 1.18;
  color: #ffffff;
  margin-bottom: 12px;
  text-shadow: 0 4px 20px rgba(0,0,0,0.8);
}
.policies-hero p {
  font-size: clamp(1rem, 1.2vw, 1.15rem);
  color: #d1d5db;
  max-width: 720px;
  margin: 0 auto;
  line-height: 1.65;
}

/* POLICY SECTION */
.policy-section {
  padding: 70px 24px 90px;
}
.policy-container {
  max-width: 1080px;
  margin: 0 auto;
}
.policy-card {
  background: var(--color-card-dark);
  border: 1px solid var(--color-border);
  padding: 44px 40px;
  border-radius: 3px;
  margin-bottom: 40px;
}
.policy-card-title {
  font-size: 1.45rem;
  color: #ffffff;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-border-gold);
  margin-bottom: 24px;
}
.policy-card h3 {
  font-size: 1.05rem;
  color: var(--color-gold);
  margin: 24px 0 10px;
}
.policy-card p {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 14px;
}
.policy-card ul {
  list-style: square;
  padding-left: 24px;
  margin-bottom: 18px;
  color: var(--color-text-muted);
  font-size: 0.95rem;
  line-height: 1.7;
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

@media (max-width: 768px) {
  .site-header { padding: 12px 16px !important; }
  .header-logo img { height: 32px !important; }
  .main-nav { display: none; }
  .policy-card { padding: 26px 20px; }
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
      <a href="https://reflectionelite.ataanalytiq.com/staging-about-us/?demo=1" class="nav-link">ABOUT US</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="nav-link">CONTACT</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-policies/?demo=1" class="nav-link active">POLICIES</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?demo=1" class="nav-link">CART</a>
    </nav>
    <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="header-quote-btn">BOOK SURVEY</a>
  </div>
</header>

<!-- HERO -->
<section class="policies-hero" style="background-image: url('${IMGS.heroBg}');">
  <div class="policies-hero-overlay"></div>
  <div class="policies-hero-content">
    <span class="hero-badge">TRANSPARENCY &amp; TRUST</span>
    <h1>POLICIES, WARRANTY &amp; COMMISSION TERMS</h1>
    <p>Comprehensive guidelines covering bespoke glass manufacturing, white-glove transport, our 10-year anti-tarnish warranty, and client confidentiality.</p>
  </div>
</section>

<!-- MAIN CONTENT CARDS -->
<section class="policy-section">
  <div class="policy-container">

    <!-- Card 1: 10-Year Warranty & Guarantee -->
    <div class="policy-card" id="warranty">
      <h2 class="policy-card-title">10-YEAR ARCHITECTURAL WARRANTY &amp; GUARANTEE</h2>
      <p>Reflection Elite provides an industry-leading 10-Year Limited Warranty on all bespoke architectural mirrors and custom-tempered glass installations.</p>
      
      <h3>ANTI-DESILVERING &amp; CLARITY PROTECTION</h3>
      <p>All mirror products are sealed using archival, copper-free epoxy backing that prevents atmospheric black-edge oxidization. If any reflection desilvering or discoloration occurs under normal residential or commercial usage within 10 years, Reflection Elite will repair or replace the affected piece free of charge.</p>

      <h3>STRUCTURAL HARDWARE &amp; MECHANICAL DEFECTS</h3>
      <p>Marine-grade solid brass shower hinges, French cleat wall anchors, and stainless steel balustrade shoe components are covered against structural fatigue, cracking, or mechanical binding for a period of 5 years from installation.</p>
    </div>

    <!-- Card 2: White-Glove Crated Shipping & Delivery -->
    <div class="policy-card" id="shipping">
      <h2 class="policy-card-title">WHITE-GLOVE CRATED DELIVERY POLICY</h2>
      <p>Every mirror and glass system is an irreplaceable bespoke work of art. We enforce rigorous handling protocols:</p>

      <ul>
        <li><strong>Custom Reinforced Timber Crating:</strong> Glass panels and mirrors are secured in bespoke cushioned plywood crates with high-density shock absorbers.</li>
        <li><strong>Transit Insurance:</strong> All shipments carry 100% full-replacement insurance during transit until signed for on-site.</li>
        <li><strong>Certified Master Glazier Uncrating:</strong> For local and regional architectural deliveries, our certified glaziers uncrate, inspect, and position your piece directly inside your room of choice.</li>
      </ul>
    </div>

    <!-- Card 3: Terms of Service & Custom Commissions -->
    <div class="policy-card" id="terms">
      <h2 class="policy-card-title">TERMS OF BESPOKE SERVICE &amp; COMMISSIONS</h2>
      <p>Because each mirror and glass partition is custom-fabricated to client-specified dimensions, production begins following digital templating sign-off:</p>

      <ul>
        <li><strong>Digital Laser Sign-Off:</strong> Once our glazier captures and approves the on-site 3D laser measurements with the client or architect, the dimensions are locked into CNC production.</li>
        <li><strong>Cancellation &amp; Modifications:</strong> Project modifications must be requested within 24 hours of laser templating verification.</li>
        <li><strong>Deposit Settlement:</strong> Custom commissions require a 50% deposit upon survey verification, with final settlement due upon white-glove glazier completion.</li>
      </ul>
    </div>

    <!-- Card 4: Privacy & Client Data Protection -->
    <div class="policy-card" id="privacy">
      <h2 class="policy-card-title">PRIVACY &amp; CLIENT CONFIDENTIALITY</h2>
      <p>Reflection Elite respects the absolute privacy of our residential and commercial clients:</p>
      <p>We do not share, sell, or rent your personal contact details, property layouts, or architectural blueprints with any third-party marketing services. All payment transactions utilize 256-bit bank-grade SSL encryption, and property address data is retained strictly for warranty tracking and concierge service requests.</p>
    </div>

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
<style id="te-policies-styles">
${cleanCss}
</style>
<div class="te-policies-page">
${bodyHtml}
</div>
<!-- /wp:html -->`;

async function deployPolicies() {
  console.log('Deploying Staging Policies Hub page...');
  
  // Check if staging-policies already exists
  const checkReq = http.get('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages?slug=staging-policies', {
    headers: { 'Cookie': cookieHeader }
  }, res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
      const existing = JSON.parse(body);
      const targetId = existing.length > 0 ? existing[0].id : null;
      
      const payload = JSON.stringify({
        title: 'Policies & Warranty — Staging Preview (Trending Era)',
        slug: 'staging-policies',
        status: 'publish',
        template: 'elementor_canvas',
        content: fullGutenbergPayload,
        meta: {
          _elementor_edit_mode: ''
        }
      });
      
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
            console.log('Staging Policies Page ID:', result.id, '| Link:', result.link);
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

deployPolicies();
