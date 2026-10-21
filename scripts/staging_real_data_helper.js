import fs from 'fs';

// 1. Session & Auth Setup
const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

async function getFreshNonce() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/index.php', {
    headers: {
      'Cookie': cookieHeader,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const html = await res.text();
  const match = html.match(/wpApiSettings\s*=\s*\{[^}]*?"nonce":"([^"]+)"/);
  if (!match) throw new Error('Could not extract fresh nonce from wp-admin/index.php');
  console.log('Obtained fresh WP Nonce:', match[1]);
  return match[1];
}

async function updatePage(pageId, title, slug, contentHtml, nonce) {
  console.log(`Updating Staging Page ${pageId} (${slug})...`);
  const payload = {
    title: title,
    slug: slug,
    status: 'publish',
    template: 'elementor_canvas',
    content: contentHtml,
    meta: {
      _elementor_edit_mode: ''
    }
  };

  const res = await fetch(`https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/${pageId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieHeader,
      'X-WP-Nonce': nonce
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to update page ${pageId}: HTTP ${res.status} - ${errText.slice(0, 300)}`);
  }
  const data = await res.json();
  console.log(`Successfully updated Page ${pageId} (${data.link})!`);
  return data;
}

// Global Luxury CSS Stylesheet
const COMMON_CSS = `
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
  --font-trajan: 'Trajan Pro Bold', 'Trajan Pro', 'Cinzel', Georgia, serif;
  --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --color-bg-dark: #0f1012;
  --color-surface-dark: #141518;
  --color-card-dark: #18191d;
  --color-gold: #c5a880;
  --color-gold-hover: #dfc198;
  --color-border: rgba(255, 255, 255, 0.08);
  --color-border-gold: rgba(197, 168, 128, 0.32);
  --color-text-light: #f4f4f5;
  --color-text-muted: #a1a1aa;
  --site-max-width: 1380px;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body, .te-staging-page {
  background-color: var(--color-bg-dark) !important;
  color: var(--color-text-light) !important;
  font-family: var(--font-body) !important;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  margin: 0 !important;
  padding: 0 !important;
}

h1, h2, h3, h4, .trajan-text, .nav-link, .btn-action, .price-display {
  font-family: var(--font-trajan) !important;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

a {
  color: inherit;
  text-decoration: none;
}

/* HEADER & NAV */
.announcement-bar {
  background: #090a0c;
  border-bottom: 1px solid var(--color-border);
  padding: 8px 16px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-align: center;
  color: var(--color-gold);
  text-transform: uppercase;
}
.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(15, 16, 18, 0.95);
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
  gap: 24px;
}
.nav-link {
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  color: var(--color-text-light);
  transition: color 0.25s ease;
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

/* FOOTER */
.site-footer {
  background: #090a0c;
  border-top: 1px solid var(--color-border);
  padding: 70px 24px 30px;
  color: var(--color-text-muted);
}
.footer-inner {
  max-width: var(--site-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 48px;
  margin-bottom: 50px;
}
.footer-brand p {
  margin: 16px 0 20px;
  font-size: 0.88rem;
  line-height: 1.6;
}
.footer-title {
  font-size: 0.92rem;
  color: #ffffff !important;
  letter-spacing: 0.12em;
  margin-bottom: 18px;
}
.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.footer-links a {
  font-size: 0.86rem;
  color: var(--color-text-muted);
  transition: color 0.2s ease;
}
.footer-links a:hover {
  color: var(--color-gold);
}
.footer-bottom {
  max-width: var(--site-max-width);
  margin: 0 auto;
  padding-top: 25px;
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  flex-wrap: wrap;
  gap: 16px;
}

@media (max-width: 900px) {
  .main-nav { display: none; }
  .footer-inner { grid-template-columns: 1fr; gap: 32px; }
}
`;

function getHeaderHtml(activeSlug) {
  return `
<div class="announcement-bar">
  <span>FREE COMPREHENSIVE ON-SITE CONSULTATION &amp; LASER TEMPLATING &bull; BESPOKE LUXURY MIRRORS</span>
</div>
<header class="site-header">
  <div class="header-inner">
    <a href="https://reflectionelite.ataanalytiq.com/staging-home/?demo=1" class="header-logo">
      <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/Logo-Reflection-e1777369196767-1024x186.png" alt="Reflection Elite">
    </a>
    <nav class="main-nav">
      <a href="https://reflectionelite.ataanalytiq.com/staging-home/?demo=1" class="nav-link ${activeSlug === 'home' ? 'active' : ''}">HOME</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1" class="nav-link ${activeSlug === 'shop' ? 'active' : ''}">COLLECTIONS (7)</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-product/?demo=1" class="nav-link ${activeSlug === 'product' ? 'active' : ''}">MURANA SHOWCASE</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-about-us/?demo=1" class="nav-link ${activeSlug === 'about' ? 'active' : ''}">ABOUT US</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="nav-link ${activeSlug === 'contact' ? 'active' : ''}">CONTACT</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-policies/?demo=1" class="nav-link ${activeSlug === 'policies' ? 'active' : ''}">POLICIES</a>
      <a href="https://reflectionelite.ataanalytiq.com/staging-cart/?demo=1" class="nav-link ${activeSlug === 'cart' ? 'active' : ''}">CART</a>
    </nav>
    <a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1" class="header-quote-btn">BOOK SURVEY</a>
  </div>
</header>
`;
}

function getFooterHtml() {
  return `
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <img src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/Logo-1-1-e1776241108698.png" alt="Reflection Elite" style="height:36px; width:auto;">
      <p>
        Reflection Elite crafts bespoke, museum-grade Venetian mirrors, handcrafted architectural glass, and custom interior mirrors tailored for prestigious residences and commercial landmarks.
      </p>
    </div>
    <div>
      <h4 class="footer-title">OUR COLLECTIONS</h4>
      <ul class="footer-links">
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1">Venetian Mirrors (4)</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-product/?demo=1">Murana Statement Mirror</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1">Mosaic &amp; Tukdi Art</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1">Modern Victorian Mirror</a></li>
      </ul>
    </div>
    <div>
      <h4 class="footer-title">CLIENT SERVICES</h4>
      <ul class="footer-links">
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-contact/?demo=1">On-Site Measurement Survey</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-policies/?demo=1">10-Year Glass Warranty</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-policies/?demo=1">White-Glove Delivery</a></li>
        <li><a href="https://reflectionelite.ataanalytiq.com/staging-about-us/?demo=1">Artisan Atelier Story</a></li>
      </ul>
    </div>
    <div>
      <h4 class="footer-title">PAYMENT OPTIONS</h4>
      <p style="font-size:0.86rem; color:var(--color-text-muted); line-height:1.6; margin-bottom:12px;">
        &bull; <strong>Full Online Payment:</strong> 5% Instant Discount via Razorpay.<br>
        &bull; <strong>50% Advance Booking:</strong> 3% Discount (Balance upon delivery).<br>
        &bull; <strong>Cryptocurrency:</strong> Direct Bitcoin (BTC) Settlement.
      </p>
      <a href="https://reflectionelite.ataanalytiq.com/staging-checkout/?demo=1" style="color:var(--color-gold); font-family:var(--font-trajan); font-size:0.8rem; font-weight:700;">PROCEED TO CHECKOUT &rarr;</a>
    </div>
  </div>
  <div class="footer-bottom">
    <div>&copy; 2026 Reflection Elite. All Rights Reserved. Staging Environment (Live Site Untouched).</div>
    <div>Payment Gateways: Razorpay (Full / 50% Deposit) &bull; Bitcoin (BTC)</div>
  </div>
</footer>
`;
}

export { cookies, cookieHeader, getFreshNonce, updatePage, COMMON_CSS, getHeaderHtml, getFooterHtml };
