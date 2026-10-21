import fs from 'fs';
import http from 'https';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
const nonce = 'f5b146aecd';

const IMGS = {
  logo: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/Logo-Reflection-e1777369196767-1024x186.png',
  heroBg: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/bg-07.png',
  showroom: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/generat-an-led-luxurious-mirror.webp'
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

body, .te-contact-page {
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
.contact-hero {
  position: relative;
  width: 100%;
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-size: cover;
  background-position: center;
  padding: 80px 24px;
  overflow: hidden;
}
.contact-hero-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(180deg, rgba(15,16,18,0.65) 0%, rgba(15,16,18,0.92) 100%);
  z-index: 1;
}
.contact-hero-content {
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
.contact-hero h1 {
  font-size: clamp(2.2rem, 4.2vw, 3.5rem);
  line-height: 1.18;
  color: #ffffff;
  margin-bottom: 16px;
  text-shadow: 0 4px 20px rgba(0,0,0,0.8);
}
.contact-hero p {
  font-size: clamp(1rem, 1.2vw, 1.15rem);
  color: #d1d5db;
  max-width: 720px;
  margin: 0 auto;
  line-height: 1.65;
}

/* 2-COLUMN CONTACT SECTION */
.contact-section {
  padding: 90px 24px;
}
.contact-container {
  max-width: var(--site-max-width);
  margin: 0 auto;
}
.contact-split-grid {
  display: grid;
  grid-template-columns: 1fr 1.35fr;
  gap: 60px;
  align-items: flex-start;
}

/* STUDIO INFO COLUMN */
.studio-info {
  background: var(--color-surface-dark);
  border: 1px solid var(--color-border-gold);
  padding: 40px 36px;
  border-radius: 3px;
}
.studio-info h2 {
  font-size: 1.8rem;
  color: #ffffff;
  margin-bottom: 16px;
}
.studio-info > p {
  color: var(--color-text-muted);
  margin-bottom: 30px;
  font-size: 0.98rem;
}
.info-block {
  margin-bottom: 26px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
}
.info-block:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}
.info-label {
  font-family: var(--font-trajan);
  font-size: 0.82rem;
  letter-spacing: 0.15em;
  color: var(--color-gold);
  margin-bottom: 6px;
  display: block;
}
.info-val {
  font-size: 1.05rem;
  color: #ffffff;
  line-height: 1.5;
}
.info-val a:hover {
  color: var(--color-gold);
}

/* LUXURY BOOKING FORM */
.booking-form-card {
  background: var(--color-card-dark);
  border: 1px solid var(--color-border);
  padding: 44px 40px;
  border-radius: 3px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}
.booking-form-card h2 {
  font-size: 1.8rem;
  color: #ffffff;
  margin-bottom: 10px;
}
.booking-form-card p {
  color: var(--color-text-muted);
  margin-bottom: 28px;
  font-size: 0.95rem;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 18px;
}
.form-group {
  margin-bottom: 18px;
}
.form-label {
  display: block;
  font-family: var(--font-trajan);
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  color: #e4e4e7;
  margin-bottom: 8px;
}
.form-control {
  width: 100%;
  background: #111215;
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #ffffff;
  padding: 14px 16px;
  border-radius: 2px;
  font-family: var(--font-body);
  font-size: 0.95rem;
  transition: all 0.25s ease;
  outline: none;
}
.form-control:focus {
  border-color: var(--color-gold);
  box-shadow: 0 0 0 2px rgba(197, 168, 128, 0.2);
}
select.form-control {
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="%23c5a880"><path d="M4 6l4 4 4-4z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 14px center;
}
textarea.form-control {
  resize: vertical;
  min-height: 120px;
}

.btn-submit-gold {
  width: 100%;
  background: var(--color-gold);
  color: #0f1012 !important;
  font-family: var(--font-trajan);
  font-weight: 700;
  font-size: 0.92rem;
  letter-spacing: 0.14em;
  padding: 18px 24px;
  border: 1px solid var(--color-gold);
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
}
.btn-submit-gold:hover {
  background: var(--color-gold-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(197, 168, 128, 0.3);
}

/* FAQ SECTION */
.contact-faq-section {
  background: var(--color-surface-dark);
  border-top: 1px solid var(--color-border);
  padding: 80px 24px;
}
.faq-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  margin-top: 40px;
}
.faq-item {
  background: var(--color-bg-dark);
  border: 1px solid var(--color-border);
  padding: 28px 22px;
  border-radius: 2px;
}
.faq-title {
  font-size: 1.02rem;
  color: #ffffff;
  margin-bottom: 12px;
}
.faq-desc {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.55;
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
  .contact-split-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .faq-grid {
    grid-template-columns: 1fr;
  }
  .footer-inner {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 768px) {
  .site-header { padding: 12px 16px !important; }
  .header-logo img { height: 32px !important; }
  .main-nav { display: none; }
  .form-grid-2 { grid-template-columns: 1fr; }
  .booking-form-card { padding: 28px 20px; }
  .studio-info { padding: 28px 20px; }
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
      <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="nav-link active">CONTACT</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-policies/?demo=1" class="nav-link">POLICIES</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?demo=1" class="nav-link">CART</a>
    </nav>
    <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="header-quote-btn">BOOK SURVEY</a>
  </div>
</header>

<!-- CONTACT HERO BANNER -->
<section class="contact-hero" style="background-image: url('${IMGS.heroBg}');">
  <div class="contact-hero-overlay"></div>
  <div class="contact-hero-content">
    <span class="hero-badge">BESPOKE CLIENT CONCIERGE</span>
    <h1>REQUEST AN ON-SITE SURVEY &amp; CONSULTATION</h1>
    <p>Whether you are designing a master bath frameless shower, a custom backlit LED mirror, or an architectural glass partition, our master glaziers are ready to assist.</p>
  </div>
</section>

<!-- 2-COLUMN CONTACT & BOOKING -->
<section class="contact-section">
  <div class="contact-container">
    <div class="contact-split-grid">
      
      <!-- LEFT: STUDIO CONCIERGE -->
      <div class="studio-info">
        <span class="hero-badge">DIRECT ACCESS</span>
        <h2>GLAZING ATELIER CONCIERGE</h2>
        <p>Have questions or looking for a custom mirror solution? Our team at Reflection Elite is ready to assist you. Reach out to us for product inquiries, bespoke dimensions, or on-site survey appointments.</p>
        
        <div class="info-block">
          <span class="info-label">PHONE &amp; WHATSAPP</span>
          <div class="info-val">
            <a href="tel:+919876543210">+91 98765 43210</a>
          </div>
          <div style="font-size:0.85rem; color:var(--color-text-muted); margin-top:4px;">Available for quick WhatsApp photo &amp; dimension estimates</div>
        </div>

        <div class="info-block">
          <span class="info-label">EMAIL CONCIERGE</span>
          <div class="info-val">
            <a href="mailto:concierge@reflectionelite.com">concierge@reflectionelite.com</a>
          </div>
          <div style="font-size:0.85rem; color:var(--color-text-muted); margin-top:4px;">Inquiries answered within 4 business hours</div>
        </div>

        <div class="info-block">
          <span class="info-label">STUDIO &amp; SHOWROOM HOURS</span>
          <div class="info-val">Monday – Saturday: 9:00 AM – 7:00 PM<br>Sunday: By Prior Appointment</div>
        </div>

        <div class="info-block">
          <span class="info-label">OUR WHITE-GLOVE PROMISE</span>
          <div style="font-size:0.9rem; color:#e4e4e7; line-height:1.6;">
            &bull; Sub-millimeter digital laser templating<br>
            &bull; 100% Ultra-clear low-iron safety glass<br>
            &bull; Certified white-glove glazier installation team
          </div>
        </div>
      </div>

      <!-- RIGHT: LUXURY BOOKING FORM -->
      <div class="booking-form-card">
        <span class="hero-badge">PROJECT SPECIFICATION</span>
        <h2>SCHEDULE YOUR SURVEY</h2>
        <p>Submit your project details below and an architectural glazing specialist will review your specifications and contact you to confirm your consultation.</p>

        <form id="stagingBookingForm" onsubmit="event.preventDefault(); document.getElementById('formSuccessMsg').style.display='block'; this.reset();">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label" for="clientName">YOUR FULL NAME *</label>
              <input type="text" id="clientName" class="form-control" placeholder="e.g. Alexander Wright" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="clientPhone">PHONE NUMBER *</label>
              <input type="tel" id="clientPhone" class="form-control" placeholder="+91 98765 00000" required>
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label" for="clientEmail">EMAIL ADDRESS *</label>
              <input type="email" id="clientEmail" class="form-control" placeholder="alexander@domain.com" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="projectService">SERVICE CATEGORY *</label>
              <select id="projectService" class="form-control" required>
                <option value="">Select Service Needed...</option>
                <option value="Frameless Shower Enclosure">Frameless Shower Enclosure</option>
                <option value="Custom LED Illuminated Mirror">Custom LED Illuminated Mirror</option>
                <option value="Architectural Glass Partition">Architectural Glass Partition</option>
                <option value="Antique Venetian Statement Mirror">Antique Venetian Statement Mirror</option>
                <option value="Glass Balustrades & Railings">Glass Balustrades &amp; Railings</option>
                <option value="Full Mirror Wall / Gym">Full Mirror Wall / Dance Studio</option>
                <option value="Bespoke Artisan Commission">Bespoke Artisan Commission</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="projectDimensions">APPROXIMATE DIMENSIONS OR LOCATION (OPTIONAL)</label>
            <input type="text" id="projectDimensions" class="form-control" placeholder="e.g. Bathroom 9ft x 7ft or Mirror 48&quot; x 36&quot;">
          </div>

          <div class="form-group">
            <label class="form-label" for="projectNotes">PROJECT VISION &amp; SPECIAL REQUIREMENTS</label>
            <textarea id="projectNotes" class="form-control" placeholder="Tell us about the space, hardware finishes (matte black, brushed brass, chrome), or any design inspiration..."></textarea>
          </div>

          <button type="submit" class="btn-submit-gold">REQUEST ON-SITE CONSULTATION &rarr;</button>

          <div id="formSuccessMsg" style="display:none; margin-top:20px; padding:16px; background:rgba(197,168,128,0.12); border:1px solid var(--color-gold); color:#ffffff; border-radius:2px; font-size:0.9rem; text-align:center;">
            <strong style="color:var(--color-gold); font-family:var(--font-trajan);">THANK YOU FOR YOUR REQUEST</strong><br>
            Our master glazier concierge has received your details and will contact you within 4 hours to arrange your on-site digital laser survey.
          </div>
        </form>
      </div>

    </div>
  </div>
</section>

<!-- FAQ / REASSURANCE -->
<section class="contact-faq-section">
  <div class="contact-container">
    <div style="text-align:center; max-width:700px; margin:0 auto;">
      <span class="hero-badge">FREQUENTLY ASKED QUESTIONS</span>
      <h2 style="font-size:clamp(1.8rem, 2.8vw, 2.4rem); color:#ffffff; margin-bottom:12px;">CLIENT CONCIERGE FAQ</h2>
      <p style="color:var(--color-text-muted);">Common questions regarding custom fabrications, templating visits, and lead times.</p>
    </div>

    <div class="faq-grid">
      <div class="faq-item">
        <h3 class="faq-title">HOW QUICKLY CAN YOU SURVEY?</h3>
        <p class="faq-desc">Our certified glazier templaters can visit residential and commercial sites within 24 to 48 hours of your consultation booking.</p>
      </div>
      <div class="faq-item">
        <h3 class="faq-title">WHAT IS YOUR FABRICATION TIMELINE?</h3>
        <p class="faq-desc">Standard bespoke frameless showers and LED mirrors are fabricated within 7 to 10 business days. Handcrafted Venetian mirrors require 2 to 3 weeks.</p>
      </div>
      <div class="faq-item">
        <h3 class="faq-title">WHAT SAFETY STANDARDS APPLY?</h3>
        <p class="faq-desc">All shower enclosures, balustrades, and partitions use thermally toughened architectural safety glass tested to withstand heavy impacts.</p>
      </div>
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
<style id="te-contact-styles">
${cleanCss}
</style>
<div class="te-contact-page">
${bodyHtml}
</div>
<!-- /wp:html -->`;

async function deployContact() {
  console.log('Deploying Staging Contact Us page...');
  
  // Check if staging-contact already exists
  const checkReq = http.get('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages?slug=staging-contact', {
    headers: { 'Cookie': cookieHeader }
  }, res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
      const existing = JSON.parse(body);
      const targetId = existing.length > 0 ? existing[0].id : null;
      
      const payload = JSON.stringify({
        title: 'Contact Us — Staging Preview (Trending Era)',
        slug: 'staging-contact',
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
            console.log('Staging Contact Us Page ID:', result.id, '| Link:', result.link);
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

deployContact();
