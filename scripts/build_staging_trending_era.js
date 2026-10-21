import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
const nonce = 'f5b146aecd';

// Images available on reflectionelite.ataanalytiq.com
const IMGS = {
  logo: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/Logo-Reflection-e1777369196767-1024x186.png',
  logoWhite: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/Logo-1-1-e1776241108698.png',
  heroBg: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/generat-an-led-luxurious-mirror.webp',
  showerBanner: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/pomelli_photoshoot_image_4_5_0414_4.webp',
  artisanBanner: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260221_235950-1024x878.webp',
  surveyBanner: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/bg-07.png',
  
  // Grid 1
  shower: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/pomelli_photoshoot_image_4_5_0414_4-240x300.webp',
  ledMirror: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/generat-an-led-luxurious-mirror-600x900.webp',
  partition: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/mirror_cutout_before_087347fa24-modified_430x.webp',
  venetian: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/an-luxury-venetian-mirror.webp',
  
  // Grid 2
  balustrade: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2026-05-07-at-7.36.23-PM-1-rnap2d8uwqgjlwjgjuhishl91j0cbbjvxznhc6trwo.jpeg',
  acousticOffice: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/elementor/thumbs/c8cd3dca-91cf-4eff-a5cf-06a7214b18ba-rnap2wzgw97kdpqscl0oqulximb1syq90pcof00ia0.jpg',
  gymMirror: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/frame-mirror.webp',
  slidingDoor: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/elementor/thumbs/4fb12599-5787-4bef-a225-5e6b870f5688-1-rnapeat3o0skzp7hvi60xz6wim730zx7x1sdnn4ux4.webp',
  
  // Grid 3
  flutedGlass: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/mirror_cutout_after_af74e35a4c-modified_430x__1_-removebg-preview.png',
  smokedMirror: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/20260222_092831-1.webp',
  tukdiArt: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/cut-piece-tukdi-mirror_430x.webp',
  structuralGlass: 'https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/bg-03.png'
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
@font-face {
  font-family: 'trajanpro';
  src: url('https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/trajanpro-bold.otf.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

:root {
  --font-trajan: 'Trajan Pro Bold', 'Trajan Pro', 'trajanpro', 'Cinzel', Georgia, serif;
  --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --color-gold: #c5a880;
  --color-gold-hover: #dfc29a;
  --color-dark: #0f1012;
  --color-dark-surface: #18191c;
  --color-dark-card: #202226;
  --color-text-light: #f5f5f7;
  --color-text-muted: #a1a1aa;
  --color-border: rgba(255, 255, 255, 0.12);
  --color-border-gold: rgba(197, 168, 128, 0.35);
  --site-max-width: 1360px;
}

*, *::before, *::after {
  box-sizing: border-box;
}

body {
  background-color: var(--color-dark) !important;
  color: var(--color-text-light) !important;
  font-family: var(--font-body) !important;
  -webkit-font-smoothing: antialiased;
  line-height: 1.6;
  overflow-x: hidden;
  margin: 0 !important;
  padding: 0 !important;
}

/* Enforce Trajan Pro Bold on all Headings (H1–H3) & Titles */
h1, h2, h3, h4, .trajan-font, .banner-heading, .section-heading, .tile-label, .nav-item, .cta-btn, .header-quote-btn, .trust-title {
  font-family: 'Trajan Pro Bold', 'Trajan Pro', 'trajanpro', 'Cinzel', Georgia, serif !important;
  letter-spacing: 0.06em !important;
  text-transform: uppercase !important;
}

a {
  color: inherit;
  text-decoration: none;
}

.announcement-bar {
  background: #141518;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-gold);
  font-size: 0.78rem;
  letter-spacing: 0.15em;
  text-align: center;
  padding: 10px 16px;
  font-family: var(--font-trajan);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(15, 16, 18, 0.95);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--color-border);
  padding: 16px 32px;
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
  height: 48px;
  width: auto;
  display: block;
  object-fit: contain;
}
.main-nav {
  display: flex;
  align-items: center;
  gap: 28px;
}
.nav-link {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-text-light);
  transition: color 0.25s ease;
  white-space: nowrap;
}
.nav-link:hover {
  color: var(--color-gold);
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
.header-quote-btn {
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

.banner-section {
  position: relative;
  width: 100%;
  min-height: 82vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  padding: 80px 24px;
  overflow: hidden;
}
.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(15,16,18,0.55) 0%, rgba(15,16,18,0.78) 60%, rgba(15,16,18,0.92) 100%);
  z-index: 1;
}
.banner-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.banner-badge {
  display: inline-block;
  color: var(--color-gold);
  font-family: var(--font-trajan);
  font-size: 0.85rem;
  letter-spacing: 0.22em;
  padding: 6px 16px;
  border: 1px solid var(--color-border-gold);
  background: rgba(197, 168, 128, 0.08);
  border-radius: 40px;
}
.banner-heading {
  font-size: clamp(2.1rem, 4.5vw, 3.8rem);
  line-height: 1.15;
  color: #ffffff !important;
  text-shadow: 0 4px 24px rgba(0,0,0,0.85);
}
.banner-desc {
  font-size: clamp(1rem, 1.3vw, 1.2rem);
  color: #e4e4e7;
  max-width: 720px;
  line-height: 1.65;
  font-weight: 300;
}
.banner-cta-group {
  display: flex;
  gap: 16px;
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
.cta-btn-primary {
  background: var(--color-gold) !important;
  color: #0f1012 !important;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.12em;
  padding: 16px 36px;
  border-radius: 2px;
  border: 1px solid var(--color-gold);
  transition: all 0.3s ease;
  display: inline-block;
  cursor: pointer;
}
.cta-btn-primary:hover {
  background: var(--color-gold-hover) !important;
  border-color: var(--color-gold-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(197, 168, 128, 0.25);
}
.cta-btn-secondary {
  background: rgba(255,255,255,0.06) !important;
  color: #ffffff !important;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.12em;
  padding: 16px 36px;
  border-radius: 2px;
  border: 1px solid rgba(255,255,255,0.25);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  display: inline-block;
}
.cta-btn-secondary:hover {
  background: rgba(255,255,255,0.15) !important;
  border-color: #ffffff;
  transform: translateY(-2px);
}

.grid-section {
  padding: 90px 24px;
  background-color: var(--color-dark);
}
.grid-container {
  max-width: var(--site-max-width);
  margin: 0 auto;
}
.section-header {
  text-align: center;
  margin-bottom: 52px;
}
.section-tagline {
  color: var(--color-gold);
  font-family: var(--font-trajan);
  font-size: 0.8rem;
  letter-spacing: 0.25em;
  margin-bottom: 8px;
  display: block;
}
.section-heading {
  font-size: clamp(1.8rem, 3.2vw, 2.6rem);
  color: #ffffff !important;
  margin-bottom: 12px;
}
.section-desc {
  color: var(--color-text-muted);
  font-size: 1.05rem;
  max-width: 620px;
  margin: 0 auto;
}

.tiles-grid {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 28px !important;
  width: 100% !important;
}
.tile-card {
  background: var(--color-dark-surface);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.35s ease;
  display: flex;
  flex-direction: column;
}
.tile-card:hover {
  transform: translateY(-6px);
  border-color: var(--color-gold);
  box-shadow: 0 16px 32px rgba(0,0,0,0.45);
}
.tile-media {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  background: #141518;
  overflow: hidden;
}
.tile-media img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  display: block !important;
}
.tile-card:hover .tile-media img {
  transform: scale(1.06);
}
.tile-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(15, 16, 18, 0.85);
  border: 1px solid var(--color-border);
  color: var(--color-gold);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  padding: 4px 10px;
  border-radius: 2px;
  font-family: var(--font-trajan);
}
.tile-body {
  padding: 22px 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  gap: 12px;
  background: linear-gradient(180deg, rgba(24,25,28,0.7) 0%, rgba(20,21,24,1) 100%);
}
.tile-label {
  font-size: 1.05rem;
  color: #ffffff !important;
  line-height: 1.35;
  transition: color 0.25s ease;
}
.tile-card:hover .tile-label {
  color: var(--color-gold) !important;
}
.tile-caption {
  font-size: 0.88rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}
.tile-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.tile-action-link {
  font-family: var(--font-trajan);
  font-size: 0.78rem;
  color: var(--color-gold);
  letter-spacing: 0.12em;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: gap 0.25s ease;
}
.tile-card:hover .tile-action-link {
  gap: 10px;
  color: var(--color-gold-hover);
}

.trust-bar {
  background: #141518;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  padding: 60px 24px;
}
.trust-grid {
  max-width: var(--site-max-width);
  margin: 0 auto;
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 32px;
}
.trust-item {
  text-align: center;
  padding: 16px;
}
.trust-icon {
  font-size: 2rem;
  color: var(--color-gold);
  margin-bottom: 14px;
  display: inline-block;
}
.trust-title {
  font-size: 1.05rem;
  color: #ffffff !important;
  margin-bottom: 8px;
}
.trust-desc {
  font-size: 0.88rem;
  color: var(--color-text-muted);
  line-height: 1.55;
}

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
.footer-brand img {
  height: 42px;
  width: auto;
  margin-bottom: 20px;
}
.footer-brand p {
  font-size: 0.92rem;
  line-height: 1.6;
  max-width: 380px;
}
.footer-col h4 {
  color: #ffffff !important;
  font-size: 0.95rem;
  margin-bottom: 20px;
  letter-spacing: 0.1em;
}
.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 0.9rem;
}
.footer-links a:hover {
  color: var(--color-gold);
}
.footer-bottom {
  max-width: var(--site-max-width);
  margin: 0 auto;
  border-top: 1px solid rgba(255,255,255,0.06);
  padding-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
  flex-wrap: wrap;
  gap: 12px;
}

@media (max-width: 1024px) {
  .tiles-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 22px !important;
  }
  .trust-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 28px !important;
  }
  .footer-inner {
    grid-template-columns: 1fr 1fr;
    gap: 36px;
  }
  .main-nav {
    display: none;
  }
  .banner-section {
    min-height: 70vh;
    padding: 60px 20px;
  }
}

@media (max-width: 640px) {
  .announcement-bar {
    font-size: 0.68rem !important;
    padding: 6px 10px !important;
    letter-spacing: 0.08em !important;
  }
  .announcement-bar span:nth-child(2),
  .announcement-bar span:nth-child(3) {
    display: none;
  }
  .site-header {
    padding: 10px 16px !important;
  }
  .header-inner {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    width: 100% !important;
  }
  .header-logo img {
    height: 32px !important;
  }
  .header-quote-btn {
    padding: 6px 12px !important;
    font-size: 0.75rem !important;
  }
  .banner-section {
    min-height: 60vh;
    padding: 60px 16px 40px;
  }
  .banner-heading {
    font-size: 1.75rem !important;
    line-height: 1.2 !important;
  }
  .banner-desc {
    font-size: 0.92rem !important;
    line-height: 1.5 !important;
  }
  .banner-cta-group {
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }
  .cta-btn-primary, .cta-btn-secondary {
    width: 100%;
    text-align: center;
    padding: 13px 18px;
    font-size: 0.85rem;
  }
  .tiles-grid {
    grid-template-columns: 1fr !important;
    gap: 20px !important;
  }
  .trust-grid {
    grid-template-columns: 1fr !important;
    gap: 20px !important;
  }
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
`;

// Clean CSS: remove empty lines so wpautop does not inject <p> tags into <style>
const cleanCss = rawCss.split('\n').map(l => l.trim()).filter(Boolean).join('\n');

const bodyHtml = `
<!-- TOP ANNOUNCEMENT BAR -->
<div class="announcement-bar">
  <span>FREE COMPREHENSIVE ON-SITE CONSULTATION &amp; LASER TEMPLATING</span>
  <span>•</span>
  <span>PREMIUM ARCHITECTURAL GLASS &amp; MIRROR INSTALLATIONS</span>
</div>

<!-- HEADER NAVIGATION (Trajan Pro Bold Navigation) -->
<header class="site-header">
  <div class="header-inner">
    <a href="https://reflectionelite.ataanalytiq.com/staging-home/?demo=1" class="header-logo">
      <img src="${IMGS.logo}" alt="Reflection Elite Luxury Glass &amp; Mirrors">
    </a>
    <nav class="main-nav">
      <a href="https://reflectionelite.ataanalytiq.com/staging-home/?demo=1" class="nav-link active">HOME</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1" class="nav-link">SHOP &amp; COLLECTIONS</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-product/?demo=1" class="nav-link">SINGLE PRODUCT</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-about-us/?demo=1" class="nav-link">ABOUT US</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="nav-link">CONTACT</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-policies/?demo=1" class="nav-link">POLICIES</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?demo=1" class="nav-link">CART</a>
    </nav>
    <div class="header-actions">
      <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="header-quote-btn">BOOK SURVEY</a>
    </div>
  </div>
</header>

<!-- =========================================================================
     CYCLE 1: HERO BANNER -> 4-COLUMN CUT PIECES GRID
     ========================================================================= -->
<section id="cycle-1" class="banner-section" style="background-image: url('${IMGS.heroBg}');">
  <div class="banner-overlay"></div>
  <div class="banner-content">
    <span class="banner-badge">BESPOKE GLASS &amp; MIRROR INSTALLATION</span>
    <h1 class="banner-heading">ARCHITECTURAL GLASS &amp; BESPOKE MIRRORS</h1>
    <p class="banner-desc">
      Precision-engineered frameless shower systems, bespoke acoustic glass partitions, and luxury handcrafted mirrors tailored to your exact architectural specifications.
    </p>
    <div class="banner-cta-group">
      <a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1" class="cta-btn-primary">EXPLORE SIGNATURE WORK</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="cta-btn-secondary">BOOK ON-SITE SURVEY</a>
    </div>
  </div>
</section>

<!-- GRID 1: 4-Column "Cut Pieces" Categories -->
<section id="grid-1" class="grid-section">
  <div class="grid-container">
    <div class="section-header">
      <span class="section-tagline">CURATED PORTFOLIO</span>
      <h2 class="section-heading">OUR SIGNATURE COLLECTIONS</h2>
      <p class="section-desc">Explore flagship architectural installations and hand-finished decorative glass tailored for luxury homes and commercial spaces.</p>
    </div>
    
    <div class="tiles-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px;">
      <!-- Tile 1.1 -->
      <article class="tile-card">
        <div class="tile-media">
          <img src="${IMGS.shower}" alt="Frameless Shower Enclosures">
          <span class="tile-badge">PRECISION FIT</span>
        </div>
        <div class="tile-body">
          <div>
            <h3 class="tile-label">FRAMELESS SHOWER ENCLOSURES</h3>
            <p class="tile-caption">Custom 10mm toughened safety glass with premium concealed marine-grade hinges.</p>
          </div>
          <div class="tile-footer">
            <span class="tile-action-link">VIEW DESIGNS &rarr;</span>
          </div>
        </div>
      </article>

      <!-- Tile 1.2 -->
      <article class="tile-card">
        <div class="tile-media">
          <img src="${IMGS.ledMirror}" alt="Custom LED Backlit Mirrors">
          <span class="tile-badge">SMART LIGHTING</span>
        </div>
        <div class="tile-body">
          <div>
            <h3 class="tile-label">CUSTOM LED ILLUMINATED MIRRORS</h3>
            <p class="tile-caption">Integrated defogger pads, dual-temperature CCT touch controls, and high-CRI LEDs.</p>
          </div>
          <div class="tile-footer">
            <span class="tile-action-link">VIEW SPECIFICATIONS &rarr;</span>
          </div>
        </div>
      </article>

      <!-- Tile 1.3 -->
      <article class="tile-card">
        <div class="tile-media">
          <img src="${IMGS.partition}" alt="Architectural Glass Partitions">
          <span class="tile-badge">INTERIOR GLAZING</span>
        </div>
        <div class="tile-body">
          <div>
            <h3 class="tile-label">ARCHITECTURAL GLASS PARTITIONS</h3>
            <p class="tile-caption">Crittall-inspired slimline aluminium framing and acoustic laminated safety glass.</p>
          </div>
          <div class="tile-footer">
            <span class="tile-action-link">VIEW SYSTEMS &rarr;</span>
          </div>
        </div>
      </article>

      <!-- Tile 1.4 -->
      <article class="tile-card">
        <div class="tile-media">
          <img src="${IMGS.venetian}" alt="Handcrafted Venetian Mirrors">
          <span class="tile-badge">HERITAGE ART</span>
        </div>
        <div class="tile-body">
          <div>
            <h3 class="tile-label">ANTIQUE VENETIAN STATEMENT MIRRORS</h3>
            <p class="tile-caption">Hand-engraved floral crests, beveled borders, and authentic multi-tiered glass rosettes.</p>
          </div>
          <div class="tile-footer">
            <span class="tile-action-link">VIEW ARTWORK &rarr;</span>
          </div>
        </div>
      </article>
    </div>
  </div>
</section>

<!-- =========================================================================
     CYCLE 2: FEATURED BANNER -> SECOND 4-COLUMN GRID
     ========================================================================= -->
<section id="cycle-2" class="banner-section" style="background-image: url('${IMGS.showerBanner}');">
  <div class="banner-overlay"></div>
  <div class="banner-content">
    <span class="banner-badge">FLAGSHIP INSTALLATION</span>
    <h2 class="banner-heading">FRAMELESS SHOWER ENCLOSURES &amp; SYSTEMS</h2>
    <p class="banner-desc">
      Engineered for seamless elegance. Ultra-clear low-iron glass treated with anti-limescale protection, anchored by precision-milled solid brass hardware.
    </p>
    <div class="banner-cta-group">
      <a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1" class="cta-btn-primary">EXPLORE SHOWER STYLES</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="cta-btn-secondary">GET CUSTOM QUOTE</a>
    </div>
  </div>
</section>

<!-- GRID 2: Second 4-Column Grid -->
<section id="grid-2" class="grid-section" style="background: #121316;">
  <div class="grid-container">
    <div class="section-header">
      <span class="section-tagline">STRUCTURAL EXPERTISE</span>
      <h2 class="section-heading">STRUCTURAL &amp; INTERIOR GLAZING</h2>
      <p class="section-desc">Engineered architectural glass systems designed to maximize natural light and structural integrity.</p>
    </div>
    
    <div class="tiles-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px;">
      <!-- Tile 2.1 -->
      <article class="tile-card">
        <div class="tile-media">
          <img src="${IMGS.balustrade}" alt="Glass Balustrades &amp; Railings">
          <span class="tile-badge">STRUCTURAL SAFETY</span>
        </div>
        <div class="tile-body">
          <div>
            <h3 class="tile-label">GLASS BALUSTRADES &amp; RAILINGS</h3>
            <p class="tile-caption">Heavy-duty base shoe and spigot systems for staircases, balconies, and terraces.</p>
          </div>
          <div class="tile-footer">
            <span class="tile-action-link">VIEW BALUSTRADES &rarr;</span>
          </div>
        </div>
      </article>

      <!-- Tile 2.2 -->
      <article class="tile-card">
        <div class="tile-media">
          <img src="${IMGS.acousticOffice}" alt="Acoustic Glass Office Doors">
          <span class="tile-badge">COMMERCIAL</span>
        </div>
        <div class="tile-body">
          <div>
            <h3 class="tile-label">ACOUSTIC OFFICE GLASS DOORS</h3>
            <p class="tile-caption">High sound-attenuation glazing with soft-close pivot and sliding hardware.</p>
          </div>
          <div class="tile-footer">
            <span class="tile-action-link">VIEW OFFICE GLAZING &rarr;</span>
          </div>
        </div>
      </article>

      <!-- Tile 2.3 -->
      <article class="tile-card">
        <div class="tile-media">
          <img src="${IMGS.gymMirror}" alt="Gym &amp; Studio Mirror Walls">
          <span class="tile-badge">FULL-HEIGHT</span>
        </div>
        <div class="tile-body">
          <div>
            <h3 class="tile-label">GYM &amp; DANCE STUDIO MIRROR WALLS</h3>
            <p class="tile-caption">Shatter-resistant safety-backed commercial mirror panels installed with zero distortion.</p>
          </div>
          <div class="tile-footer">
            <span class="tile-action-link">VIEW WALL CLADDING &rarr;</span>
          </div>
        </div>
      </article>

      <!-- Tile 2.4 -->
      <article class="tile-card">
        <div class="tile-media">
          <img src="${IMGS.slidingDoor}" alt="Sliding Glass Room Dividers">
          <span class="tile-badge">SPACE SAVING</span>
        </div>
        <div class="tile-body">
          <div>
            <h3 class="tile-label">SLIDING GLASS ROOM DIVIDERS</h3>
            <p class="tile-caption">Top-hung concealed track systems creating fluid transitions between living spaces.</p>
          </div>
          <div class="tile-footer">
            <span class="tile-action-link">VIEW SLIDING SYSTEMS &rarr;</span>
          </div>
        </div>
      </article>
    </div>
  </div>
</section>

<!-- =========================================================================
     CYCLE 3: THIRD FEATURED BANNER -> THIRD 4-COLUMN GRID
     ========================================================================= -->
<section id="cycle-3" class="banner-section" style="background-image: url('${IMGS.artisanBanner}');">
  <div class="banner-overlay"></div>
  <div class="banner-content">
    <span class="banner-badge">DECORATIVE CRAFTSMANSHIP</span>
    <h2 class="banner-heading">ARTISANAL TEXTURES &amp; STATEMENT MIRRORS</h2>
    <p class="banner-desc">
      Combining age-old Venetian beveling, acid etching, and modern fluted textures to craft bespoke architectural features that redefine high-end residential interiors.
    </p>
    <div class="banner-cta-group">
      <a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1" class="cta-btn-primary">VIEW ARTISAN WORKS</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="cta-btn-secondary">CONSULT WITH A DESIGNER</a>
    </div>
  </div>
</section>

<!-- GRID 3: Third 4-Column Grid -->
<section id="grid-3" class="grid-section">
  <div class="grid-container">
    <div class="section-header">
      <span class="section-tagline">DECORATIVE SOLUTIONS</span>
      <h2 class="section-heading">CURATED ARTISAN FINISHES</h2>
      <p class="section-desc">Specialized architectural glass textures and decorative treatments for privacy, luxury, and visual impact.</p>
    </div>
    
    <div class="tiles-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px;">
      <!-- Tile 3.1 -->
      <article class="tile-card">
        <div class="tile-media">
          <img src="${IMGS.flutedGlass}" alt="Fluted &amp; Reeded Privacy Glass">
          <span class="tile-badge">POPULAR</span>
        </div>
        <div class="tile-body">
          <div>
            <h3 class="tile-label">FLUTED &amp; REEDED PRIVACY GLASS</h3>
            <p class="tile-caption">Linear fluted fluting that refracts light softly while maintaining sophisticated privacy.</p>
          </div>
          <div class="tile-footer">
            <span class="tile-action-link">VIEW SAMPLES &rarr;</span>
          </div>
        </div>
      </article>

      <!-- Tile 3.2 -->
      <article class="tile-card">
        <div class="tile-media">
          <img src="${IMGS.smokedMirror}" alt="Smoked Bronze &amp; Grey Mirrors">
          <span class="tile-badge">WARM TONES</span>
        </div>
        <div class="tile-body">
          <div>
            <h3 class="tile-label">SMOKED BRONZE &amp; GREY MIRRORS</h3>
            <p class="tile-caption">Subtle tinted mirror surfaces adding mood, warmth, and depth to feature walls and bars.</p>
          </div>
          <div class="tile-footer">
            <span class="tile-action-link">VIEW TINT PALETTES &rarr;</span>
          </div>
        </div>
      </article>

      <!-- Tile 3.3 -->
      <article class="tile-card">
        <div class="tile-media">
          <img src="${IMGS.tukdiArt}" alt="Mosaic &amp; Tukdi Glass Mirror Art">
          <span class="tile-badge">BESPOKE</span>
        </div>
        <div class="tile-body">
          <div>
            <h3 class="tile-label">TUKDI &amp; CUT-PIECE MIRROR ART</h3>
            <p class="tile-caption">Intricate geometric facets and handcrafted mirror mosaic inlays for statement lobby walls.</p>
          </div>
          <div class="tile-footer">
            <span class="tile-action-link">VIEW MOSAICS &rarr;</span>
          </div>
        </div>
      </article>

      <!-- Tile 3.4 -->
      <article class="tile-card">
        <div class="tile-media">
          <img src="${IMGS.structuralGlass}" alt="Low-Iron Walk-On Glass &amp; Skylights">
          <span class="tile-badge">ENGINEERED</span>
        </div>
        <div class="tile-body">
          <div>
            <h3 class="tile-label">STRUCTURAL WALK-ON GLASS</h3>
            <p class="tile-caption">Multi-layer laminated toughened glass with anti-slip ceramic fritting for modern floors.</p>
          </div>
          <div class="tile-footer">
            <span class="tile-action-link">VIEW ENGINEERING &rarr;</span>
          </div>
        </div>
      </article>
    </div>
  </div>
</section>

<!-- =========================================================================
     CYCLE 4: CLOSING BANNER -> VALUE PILLARS & INQUIRY
     ========================================================================= -->
<section id="cycle-4" class="banner-section" style="background-image: url('${IMGS.surveyBanner}');">
  <div class="banner-overlay"></div>
  <div class="banner-content">
    <span class="banner-badge">PERFECT FIT GUARANTEE</span>
    <h2 class="banner-heading">CUSTOM DIMENSIONS IN EVERY PERSPECTIVE</h2>
    <p class="banner-desc">
      No standard sizes. Every mirror and glass panel is laser-measured on site, CNC cut, beveled to perfection, and securely installed by our certified glazing engineers.
    </p>
    <div class="banner-cta-group">
      <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="cta-btn-primary">SCHEDULE MEASUREMENT SURVEY</a>
      <a href="tel:+919876543210" class="cta-btn-secondary">CALL OUR SPECIALISTS</a>
    </div>
  </div>
</section>

<!-- VALUE REASSURANCE GRID (4 Pillars) -->
<section class="trust-bar">
  <div class="trust-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px;">
    <div class="trust-item">
      <div class="trust-icon">📐</div>
      <h3 class="trust-title">LASER-MEASURED PRECISION</h3>
      <p class="trust-desc">Sub-millimeter digital templating guarantees absolute alignment with out-of-square walls and floors.</p>
    </div>
    <div class="trust-item">
      <div class="trust-icon">🛡️</div>
      <h3 class="trust-title">TOUGHENED SAFETY GLASS</h3>
      <p class="trust-desc">Certified thermal and chemical tempering meets the highest architectural safety codes.</p>
    </div>
    <div class="trust-item">
      <div class="trust-icon">💎</div>
      <h3 class="trust-title">WHITE-GLOVE INSTALLATION</h3>
      <p class="trust-desc">Our in-house master glazers handle every stage with immaculate care, cleanliness, and precision.</p>
    </div>
    <div class="trust-item">
      <div class="trust-icon">📜</div>
      <h3 class="trust-title">10-YEAR WARRANTY</h3>
      <p class="trust-desc">Comprehensive protection against hardware tarnishing, glass delamination, and silvering defect.</p>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <img src="${IMGS.logoWhite}" alt="Reflection Elite">
      <p>
        Reflection Elite is a premier architectural glass and luxury mirror installation firm. We design, manufacture, and install bespoke glazing solutions for residential and commercial landmarks.
      </p>
    </div>
    <div class="footer-col">
      <h4>GLASS SOLUTIONS</h4>
      <ul class="footer-links">
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1">Frameless Showers</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1">Glass Partitions</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1">Balustrades &amp; Railings</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1">Office Glazing</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1">Fluted Glass</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>BESPOKE MIRRORS</h4>
      <ul class="footer-links">
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1">Custom LED Mirrors</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-product/?demo=1">Murana Venetian Mirror</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1">Modern Victorian Mirror</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1">Smoked Bronze Mirrors</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1">Tukdi Mirror Art</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>CLIENT CONCIERGE</h4>
      <ul class="footer-links">
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-about-us/?demo=1">About Our Atelier</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1">Contact Concierge</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-policies/?demo=1">Policies &amp; Warranty</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-cart/?demo=1">View Shopping Cart</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" style="color: var(--color-gold); font-weight: 700;">REQUEST ON-SITE SURVEY &rarr;</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <div>&copy; 2026 Reflection Elite. All Rights Reserved. Staging Preview for "Trending Era" Layout.</div>
    <div>Strictly staging environment — Live homepage untouched.</div>
  </div>
</footer>
`;

// Wrap in Gutenberg html block so wpautop is completely disabled!
const finalPostContent = `<!-- wp:html -->
<style id="trending-era-styles">
${cleanCss}
</style>
${bodyHtml}
<!-- /wp:html -->`;

async function deploy() {
  console.log('Deploying Gutenberg protected HTML to Page 1984...');
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/1984', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieHeader,
      'X-WP-Nonce': nonce
    },
    body: JSON.stringify({
      content: finalPostContent,
      template: 'elementor_canvas',
      meta: {
        _elementor_edit_mode: ''
      }
    })
  });

  console.log('Update status:', res.status);
  const data = await res.json();
  console.log('Saved page 1984 link:', data.link);

  // Purge LiteSpeed Cache
  const url1 = 'https://reflectionelite.ataanalytiq.com/wp-admin/admin.php?page=litespeed-toolbox&LSCWP_CTRL=purge&LSCWP_NONCE=3dfeaf3e77&litespeed_type=purge_all';
  await fetch(url1, { headers: { 'Cookie': cookieHeader } });
  console.log('LiteSpeed Cache purged.');
}

deploy().catch(console.error);
