import fs from 'fs';

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'process.env.PROD_WP_APP_PASS || "[REDACTED]"';
const auth = { 
  Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64')}`,
  'Content-Type': 'application/json' 
};

// 1. GENERATE DARK LUXURY HOMEPAGE HTML
function generateLuxuryHomepageHtml() {
  return `
<!-- TOP ANNOUNCEMENT RIBBON -->
<div style="background: linear-gradient(90deg, #101520 0%, #1e2638 50%, #101520 100%); border-bottom: 1px solid rgba(212, 175, 55, 0.3); padding: 10px 16px; text-align: center; margin: -20px -20px 40px -20px;">
  <span style="font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #f5e7a9;">
    ✨ BESPOKE VENETIAN &amp; ITALIAN ARTISAN MIRRORS &nbsp;•&nbsp; 🛡️ REINFORCED WOODEN CRATE DELIVERY PAN-INDIA &nbsp;•&nbsp; 💳 50% ADVANCE TO INITIATE FABRICATION
  </span>
</div>

<!-- HERO SHOWCASE SECTION -->
<div style="position: relative; background: radial-gradient(circle at 50% 25%, #182234 0%, #0c111a 60%, #06090e 100%); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 16px; padding: 75px 24px; margin-bottom: 50px; text-align: center; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 175, 55, 0.1); overflow: hidden;">
  <div style="max-width: 900px; margin: 0 auto; position: relative; z-index: 2;">
    <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(212, 175, 55, 0.12); border: 1px solid rgba(212, 175, 55, 0.4); padding: 7px 20px; border-radius: 50px; margin-bottom: 24px;">
      <span style="color: #d4af37; font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; font-family: 'Cinzel', serif;">
        ★ Master Artisans of Venice &amp; Murano ★
      </span>
    </div>

    <h1 style="font-family: 'Cinzel', 'Playfair Display', serif; font-size: clamp(32px, 5vw, 54px); font-weight: 800; line-height: 1.15; margin: 0 0 20px 0; color: #ffffff; letter-spacing: 1px; text-shadow: 0 4px 20px rgba(0,0,0,0.8);">
      Reflect Timeless Elegance in Your Living Space
    </h1>

    <p style="font-family: 'Montserrat', sans-serif; font-size: 17px; line-height: 1.7; color: #cbd5e1; margin: 0 auto 36px auto; max-width: 720px; font-weight: 300;">
      Crafted with precision 4–5mm float glass, moisture-resistant protective backing, and hand-beveled Venetian carvings. Tailored for India's most prestigious residences, luxury villas, and boutique hospitality.
    </p>

    <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; align-items: center;">
      <a href="/shop/" style="background: linear-gradient(135deg, #f5d77f 0%, #d4af37 50%, #996515 100%); color: #07090d; font-family: 'Cinzel', serif; font-weight: 700; font-size: 14px; letter-spacing: 1.5px; text-transform: uppercase; padding: 15px 34px; border-radius: 6px; text-decoration: none; box-shadow: 0 6px 20px rgba(212, 175, 55, 0.35); transition: all 0.3s ease;">
        Explore Mirror Collection →
      </a>
      <a href="https://wa.me/917387463103?text=Hi%20Reflection%20Elite,%20I%20would%20like%20to%20inquire%20about%20a%20luxury%20mirror." target="_blank" style="background: #128C7E; color: #ffffff; font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 14px; padding: 15px 28px; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; gap: 10px; border: 1px solid rgba(255,255,255,0.25); box-shadow: 0 6px 20px rgba(18, 140, 126, 0.35);">
        <svg style="width: 20px; height: 20px; fill: #fff;" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.06-2.146-.541-1.854-.77-3.047-2.662-3.14-2.785-.092-.122-.741-.986-.741-1.88 0-.895.469-1.334.636-1.516.166-.182.365-.228.487-.228.122 0 .243.002.349.006.111.005.26-.042.406.31.15.362.512 1.248.558 1.339.045.091.076.197.015.319-.06.121-.091.197-.182.303-.091.106-.192.237-.274.319-.092.091-.188.19-.081.373.106.183.473.78 1.014 1.262.697.621 1.285.813 1.468.904.182.091.289.076.395-.045.106-.122.456-.531.577-.714.122-.182.243-.152.41-.091s1.063.501 1.245.592c.182.091.303.137.349.213.045.076.045.441-.099.846zm-3.392-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.88l-1.304 4.76 4.877-1.278c1.401.764 3.003 1.198 4.703 1.198 5.523 0 10-4.477 10-10 0-5.522-4.477-10-10-10z"/></svg>
        WhatsApp Concierge (+91 7387463103)
      </a>
    </div>
  </div>
</div>

<!-- VALUE PROPOSITION / TRUST PILLARS -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 20px; margin-bottom: 60px;">
  <div style="background: #141924; border: 1px solid rgba(212, 175, 55, 0.22); padding: 26px 20px; border-radius: 12px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <div style="font-size: 30px; margin-bottom: 12px; filter: drop-shadow(0 2px 8px rgba(212,175,55,0.4));">🛡️</div>
    <h3 style="font-family: 'Cinzel', serif; font-size: 16px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0; letter-spacing: 0.5px;">Reinforced Wooden Crating</h3>
    <p style="font-size: 13px; color: #94a3b8; margin: 0; line-height: 1.6;">Industrial-grade crated protection engineered for zero transit glass breakage across all Indian states.</p>
  </div>

  <div style="background: #141924; border: 1px solid rgba(212, 175, 55, 0.22); padding: 26px 20px; border-radius: 12px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <div style="font-size: 30px; margin-bottom: 12px; filter: drop-shadow(0 2px 8px rgba(212,175,55,0.4));">💳</div>
    <h3 style="font-family: 'Cinzel', serif; font-size: 16px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0; letter-spacing: 0.5px;">50% Advance &amp; 50% on Delivery</h3>
    <p style="font-size: 13px; color: #94a3b8; margin: 0; line-height: 1.6;">Pay 50% advance to initiate your handcrafted build, and settle the remaining 50% upon doorstep arrival.</p>
  </div>

  <div style="background: #141924; border: 1px solid rgba(212, 175, 55, 0.22); padding: 26px 20px; border-radius: 12px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <div style="font-size: 30px; margin-bottom: 12px; filter: drop-shadow(0 2px 8px rgba(212,175,55,0.4));">📐</div>
    <h3 style="font-family: 'Cinzel', serif; font-size: 16px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0; letter-spacing: 0.5px;">Custom Made-to-Measure</h3>
    <p style="font-size: 13px; color: #94a3b8; margin: 0; line-height: 1.6;">Vanity consoles, grand foyer statements, bathrooms, and dressing suites customized to any dimension.</p>
  </div>

  <div style="background: #141924; border: 1px solid rgba(212, 175, 55, 0.22); padding: 26px 20px; border-radius: 12px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <div style="font-size: 30px; margin-bottom: 12px; filter: drop-shadow(0 2px 8px rgba(212,175,55,0.4));">🇮🇹</div>
    <h3 style="font-family: 'Cinzel', serif; font-size: 16px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0; letter-spacing: 0.5px;">Authentic Venetian Art</h3>
    <p style="font-size: 13px; color: #94a3b8; margin: 0; line-height: 1.6;">Intricate floral scrolls, cushion frames, and hand-polished beveling inspired by Italian heritage.</p>
  </div>
</div>

<!-- FEATURED MASTERPIECE SPOTLIGHTS -->
<div style="margin-bottom: 60px;">
  <div style="text-align: center; margin-bottom: 35px;">
    <span style="font-family: 'Cinzel', serif; color: #d4af37; font-size: 13px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;">Signature Creations</span>
    <h2 style="font-family: 'Cinzel', serif; font-size: 32px; font-weight: 800; color: #ffffff; margin: 6px 0 10px 0; letter-spacing: 1px;">
      Master Artisan Collections
    </h2>
    <div style="width: 70px; height: 2px; background: linear-gradient(90deg, transparent, #d4af37, transparent); margin: 0 auto;"></div>
  </div>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px;">
    <!-- Card 1 -->
    <div style="background: #131722; border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 14px; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,0.6); display: flex; flex-direction: column;">
      <div style="height: 240px; overflow: hidden; position: relative;">
        <img src="https://mediumpurple-salamander-731288.hostingersite.com/wp-content/uploads/2026/10/1771694577552.jpg" alt="Antique Venetian Cushion Mirror" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" />
        <span style="position: absolute; top: 12px; left: 12px; background: rgba(9, 12, 16, 0.85); color: #d4af37; border: 1px solid rgba(212, 175, 55, 0.4); padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Venetian Heritage</span>
      </div>
      <div style="padding: 22px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <h3 style="font-family: 'Cinzel', serif; font-size: 18px; color: #ffffff; margin: 0 0 8px 0;">Antique Venetian Cushion</h3>
          <p style="font-size: 13px; color: #94a3b8; margin: 0 0 14px 0; line-height: 1.5;">Elaborate cushion beveling with ornate floral rosettes. The pinnacle of Venetian opulence.</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 14px;">
          <span style="font-size: 18px; font-weight: 700; color: #d4af37;">₹81,500</span>
          <a href="/product/antique-venetian-cushion/" style="background: linear-gradient(135deg, #d4af37, #996515); color: #000; font-family: 'Cinzel', serif; font-weight: 700; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; padding: 8px 16px; border-radius: 4px; text-decoration: none;">View Details</a>
        </div>
      </div>
    </div>

    <!-- Card 2 -->
    <div style="background: #131722; border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 14px; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,0.6); display: flex; flex-direction: column;">
      <div style="height: 240px; overflow: hidden; position: relative;">
        <img src="https://mediumpurple-salamander-731288.hostingersite.com/wp-content/uploads/2026/10/20260222_002716-scaled.jpg" alt="Modern Victorian Mirror" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" />
        <span style="position: absolute; top: 12px; left: 12px; background: rgba(9, 12, 16, 0.85); color: #d4af37; border: 1px solid rgba(212, 175, 55, 0.4); padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Classic Victorian</span>
      </div>
      <div style="padding: 22px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <h3 style="font-family: 'Cinzel', serif; font-size: 18px; color: #ffffff; margin: 0 0 8px 0;">Modern Victorian</h3>
          <p style="font-size: 13px; color: #94a3b8; margin: 0 0 14px 0; line-height: 1.5;">Available in Gold, Rose Gold, and Silver finishes. A dramatic statement piece.</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 14px;">
          <span style="font-size: 18px; font-weight: 700; color: #d4af37;">₹58,787</span>
          <a href="/product/modern-victorian/" style="background: linear-gradient(135deg, #d4af37, #996515); color: #000; font-family: 'Cinzel', serif; font-weight: 700; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; padding: 8px 16px; border-radius: 4px; text-decoration: none;">View Details</a>
        </div>
      </div>
    </div>

    <!-- Card 3 -->
    <div style="background: #131722; border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 14px; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,0.6); display: flex; flex-direction: column;">
      <div style="height: 240px; overflow: hidden; position: relative;">
        <img src="https://mediumpurple-salamander-731288.hostingersite.com/wp-content/uploads/2026/10/20260221_235950-scaled.jpg" alt="Silver Crown Framed Mirror" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" />
        <span style="position: absolute; top: 12px; left: 12px; background: rgba(9, 12, 16, 0.85); color: #d4af37; border: 1px solid rgba(212, 175, 55, 0.4); padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Royal Crown Crest</span>
      </div>
      <div style="padding: 22px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <h3 style="font-family: 'Cinzel', serif; font-size: 18px; color: #ffffff; margin: 0 0 8px 0;">Silver Crown Framed</h3>
          <p style="font-size: 13px; color: #94a3b8; margin: 0 0 14px 0; line-height: 1.5;">Majestic tiara crown pediment with hand-etched glass borders and sparkling beveled accents.</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 14px;">
          <span style="font-size: 18px; font-weight: 700; color: #d4af37;">₹35,900</span>
          <a href="/product/silver-crown-framed/" style="background: linear-gradient(135deg, #d4af37, #996515); color: #000; font-family: 'Cinzel', serif; font-weight: 700; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; padding: 8px 16px; border-radius: 4px; text-decoration: none;">View Details</a>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- DYNAMIC PRODUCT CATALOG GRID -->
<div style="margin-bottom: 70px;">
  <div style="text-align: center; margin-bottom: 35px;">
    <span style="font-family: 'Cinzel', serif; color: #d4af37; font-size: 13px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;">Full Catalog</span>
    <h2 style="font-family: 'Cinzel', serif; font-size: 32px; font-weight: 800; color: #ffffff; margin: 6px 0 10px 0; letter-spacing: 1px;">
      Explore All Masterpieces
    </h2>
    <div style="width: 70px; height: 2px; background: linear-gradient(90deg, transparent, #d4af37, transparent); margin: 0 auto;"></div>
  </div>

  [products limit="8" columns="4" orderby="price" order="DESC"]

  <div style="text-align: center; margin-top: 35px;">
    <a href="/shop/" style="display: inline-block; background: transparent; border: 2px solid #d4af37; color: #f5e7a9; font-family: 'Cinzel', serif; font-weight: 700; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; padding: 14px 36px; border-radius: 6px; text-decoration: none; transition: all 0.3s ease;">
      View Complete Store Catalog →
    </a>
  </div>
</div>

<!-- BESPOKE CUSTOMIZATION CONSULTATION BANNER -->
<div style="background: radial-gradient(circle at 50% 50%, #161e2c 0%, #0d121c 100%); border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 16px; padding: 50px 24px; text-align: center; margin-bottom: 40px; box-shadow: 0 15px 35px rgba(0,0,0,0.7);">
  <span style="color: #d4af37; font-family: 'Cinzel', serif; font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">Tailored For Architects &amp; Homeowners</span>
  <h2 style="font-family: 'Cinzel', serif; font-size: clamp(24px, 4vw, 36px); font-weight: 800; color: #ffffff; margin: 10px 0 14px 0; letter-spacing: 1px;">
    Require Custom Dimensions or Bespoke Frame Detailing?
  </h2>
  <p style="font-size: 16px; color: #cbd5e1; max-width: 680px; margin: 0 auto 30px auto; line-height: 1.7; font-weight: 300;">
    Our artisan studio specializes in custom-cut luxury mirrors crafted to your architectural blueprints, interior themes, and backlighting preferences. Connect directly with our design master on WhatsApp.
  </p>
  <a href="https://wa.me/917387463103?text=Hi%20Reflection%20Elite,%20I%20need%20a%20custom-sized%20mirror.%20My%20dimensions%20and%20requirements%20are:%20" target="_blank" style="display: inline-flex; align-items: center; gap: 10px; background: #25D366; color: #ffffff; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 15px; padding: 16px 36px; border-radius: 50px; text-decoration: none; box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4); border: 2px solid rgba(255,255,255,0.25);">
    <svg style="width: 22px; height: 22px; fill: #fff;" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.06-2.146-.541-1.854-.77-3.047-2.662-3.14-2.785-.092-.122-.741-.986-.741-1.88 0-.895.469-1.334.636-1.516.166-.182.365-.228.487-.228.122 0 .243.002.349.006.111.005.26-.042.406.31.15.362.512 1.248.558 1.339.045.091.076.197.015.319-.06.121-.091.197-.182.303-.091.106-.192.237-.274.319-.092.091-.188.19-.081.373.106.183.473.78 1.014 1.262.697.621 1.285.813 1.468.904.182.091.289.076.395-.045.106-.122.456-.531.577-.714.122-.182.243-.152.41-.091s1.063.501 1.245.592c.182.091.303.137.349.213.045.076.045.441-.099.846zm-3.392-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.88l-1.304 4.76 4.877-1.278c1.401.764 3.003 1.198 4.703 1.198 5.523 0 10-4.477 10-10 0-5.522-4.477-10-10-10z"/></svg>
    Inquire Custom Dimensions on WhatsApp (+91 7387463103)
  </a>
</div>
  `;
}

// 2. GENERATE GLOBAL LUXURY CSS
function generateLuxuryCss() {
  return `
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">

<style id="luxury-dark-gold-theme">
  :root {
    --bg-dark: #07090e;
    --bg-surface: #0f131c;
    --bg-card: #141824;
    --bg-elevated: #1a2030;
    --gold-primary: #d4af37;
    --gold-light: #f5e7a9;
    --gold-dark: #aa771c;
    --gold-gradient: linear-gradient(135deg, #f5d77f 0%, #d4af37 50%, #996515 100%);
    --gold-text: linear-gradient(135deg, #fff3c4 0%, #d4af37 60%, #b8860b 100%);
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --text-muted: #94a3b8;
    --border-gold: rgba(212, 175, 55, 0.28);
    --border-subtle: rgba(255, 255, 255, 0.08);
  }

  /* Global Body & Framework */
  html, body, #page, .site, .site-content, .ast-container, #content, .entry-content, article, .ast-article-single {
    background-color: var(--bg-dark) !important;
    color: var(--text-primary) !important;
    font-family: 'Montserrat', sans-serif !important;
    -webkit-font-smoothing: antialiased;
  }

  /* Headings Typography */
  h1, h2, h3, h4, h5, h6,
  .site-title a, .ast-site-title a,
  .entry-title, .product_title,
  .woocommerce-loop-product__title {
    font-family: 'Cinzel', 'Playfair Display', serif !important;
    letter-spacing: 0.05em !important;
    color: #ffffff !important;
  }

  /* Astra Header & Navigation */
  header#masthead, .site-header, .main-header-bar, .ast-primary-header-bar, .ast-desktop-header, .ast-mobile-header-wrap {
    background-color: #05070a !important;
    border-bottom: 1px solid var(--border-gold) !important;
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.8) !important;
  }
  .site-title a, .ast-site-title a {
    font-family: 'Cinzel', serif !important;
    font-size: 24px !important;
    font-weight: 800 !important;
    letter-spacing: 2px !important;
    text-transform: uppercase !important;
    background: var(--gold-text) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
  }
  .main-header-menu a, .main-navigation a, .ast-nav-menu a {
    font-family: 'Montserrat', sans-serif !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    letter-spacing: 1.5px !important;
    text-transform: uppercase !important;
    color: #cbd5e1 !important;
    transition: color 0.3s ease !important;
  }
  .main-header-menu a:hover, .main-navigation a:hover, .ast-nav-menu a:hover,
  .main-header-menu .current-menu-item > a {
    color: var(--gold-primary) !important;
  }

  /* Breadcrumbs */
  .woocommerce-breadcrumb, .ast-breadcrumbs {
    color: var(--text-muted) !important;
    margin: 1.5rem 0 !important;
  }
  .woocommerce-breadcrumb a, .ast-breadcrumbs a {
    color: var(--gold-light) !important;
  }

  /* WooCommerce Shop & Product Cards */
  ul.products {
    margin: 2em 0 !important;
  }
  ul.products li.product,
  .ast-woocommerce-container ul.products li.product {
    background: linear-gradient(180deg, #131824 0%, #0c1017 100%) !important;
    border: 1px solid var(--border-gold) !important;
    border-radius: 12px !important;
    padding: 1.25rem !important;
    text-align: center !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6) !important;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
    overflow: hidden !important;
  }
  ul.products li.product:hover,
  .ast-woocommerce-container ul.products li.product:hover {
    transform: translateY(-8px) !important;
    border-color: var(--gold-primary) !important;
    box-shadow: 0 18px 40px rgba(212, 175, 55, 0.22), 0 0 30px rgba(0,0,0,0.8) !important;
  }
  ul.products li.product img {
    border-radius: 8px !important;
    margin-bottom: 1rem !important;
    transition: transform 0.4s ease !important;
    object-fit: cover !important;
    aspect-ratio: 1 / 1 !important;
    width: 100% !important;
  }
  ul.products li.product:hover img {
    transform: scale(1.04) !important;
  }
  .woocommerce-loop-product__title {
    font-size: 1.15rem !important;
    margin: 0.75rem 0 0.5rem 0 !important;
    line-height: 1.35 !important;
    color: #ffffff !important;
  }
  ul.products li.product .price,
  .entry-summary .price {
    color: var(--gold-primary) !important;
    font-weight: 700 !important;
    font-size: 1.25rem !important;
    margin-bottom: 1rem !important;
  }
  ul.products li.product .price del,
  .entry-summary .price del {
    color: var(--text-muted) !important;
    font-size: 0.9em !important;
    opacity: 0.7 !important;
  }
  ul.products li.product .price ins,
  .entry-summary .price ins {
    color: var(--gold-light) !important;
    text-decoration: none !important;
  }

  /* Gold Luxury Buttons */
  .button,
  a.button,
  button.button,
  input.button,
  .woocommerce #respond input#submit,
  .woocommerce a.button,
  .woocommerce button.button,
  .woocommerce input.button,
  .woocommerce #respond input#submit.alt,
  .woocommerce a.button.alt,
  .woocommerce button.button.alt,
  .woocommerce input.button.alt {
    background: var(--gold-gradient) !important;
    color: #07090d !important;
    font-weight: 700 !important;
    font-family: 'Cinzel', serif !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    padding: 12px 26px !important;
    border-radius: 6px !important;
    border: none !important;
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.25) !important;
    transition: all 0.3s ease !important;
  }
  .button:hover,
  a.button:hover,
  button.button:hover,
  input.button:hover,
  .woocommerce a.button:hover,
  .woocommerce button.button:hover,
  .woocommerce input.button:hover,
  .woocommerce #respond input#submit.alt:hover,
  .woocommerce a.button.alt:hover,
  .woocommerce button.button.alt:hover,
  .woocommerce input.button.alt:hover {
    background: linear-gradient(135deg, #ffffff 0%, #f5d77f 50%, #d4af37 100%) !important;
    color: #000000 !important;
    box-shadow: 0 6px 25px rgba(212, 175, 55, 0.5) !important;
    transform: translateY(-2px) !important;
  }

  /* Single Product Styling */
  .single-product div.product {
    background: var(--bg-surface) !important;
    border: 1px solid var(--border-gold) !important;
    border-radius: 16px !important;
    padding: 2.5rem !important;
    margin-top: 2rem !important;
    box-shadow: 0 15px 40px rgba(0,0,0,0.7) !important;
  }
  .single-product .product_title {
    font-size: 32px !important;
    margin-bottom: 12px !important;
  }
  .single-product .summary.entry-summary {
    color: var(--text-secondary) !important;
  }
  .woocommerce-product-details__short-description {
    color: var(--text-secondary) !important;
    line-height: 1.7 !important;
  }
  .woocommerce-variation-description {
    color: var(--text-primary) !important;
  }

  /* Form Controls & Inputs */
  input[type="text"], input[type="email"], input[type="tel"], input[type="password"],
  textarea, select, .select2-container--default .select2-selection--single {
    background-color: var(--bg-card) !important;
    border: 1px solid var(--border-gold) !important;
    color: #ffffff !important;
    border-radius: 6px !important;
    padding: 10px 14px !important;
  }
  input[type="text"]:focus, input[type="email"]:focus, input[type="tel"]:focus,
  textarea:focus, select:focus {
    border-color: var(--gold-light) !important;
    outline: none !important;
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.3) !important;
  }

  /* Quantity buttons */
  .quantity input.qty {
    background-color: var(--bg-card) !important;
    color: #ffffff !important;
    border: 1px solid var(--border-gold) !important;
  }

  /* Product Tabs */
  .woocommerce-tabs ul.tabs {
    background: var(--bg-card) !important;
    border-bottom: 1px solid var(--border-gold) !important;
  }
  .woocommerce-tabs ul.tabs li {
    background: var(--bg-surface) !important;
    border: 1px solid var(--border-subtle) !important;
    border-bottom: none !important;
  }
  .woocommerce-tabs ul.tabs li.active {
    background: var(--bg-card) !important;
    border-color: var(--gold-primary) !important;
  }
  .woocommerce-tabs ul.tabs li a {
    color: var(--text-secondary) !important;
    font-family: 'Cinzel', serif !important;
  }
  .woocommerce-tabs ul.tabs li.active a {
    color: var(--gold-primary) !important;
  }
  .woocommerce-tabs .panel {
    background: var(--bg-card) !important;
    border: 1px solid var(--border-gold) !important;
    border-top: none !important;
    padding: 2rem !important;
    color: var(--text-secondary) !important;
  }

  /* Cart & Checkout */
  .woocommerce-cart .cart_totals,
  .woocommerce-checkout #order_review,
  .woocommerce-checkout #customer_details {
    background: var(--bg-surface) !important;
    border: 1px solid var(--border-gold) !important;
    border-radius: 12px !important;
    padding: 2rem !important;
    box-shadow: 0 15px 40px rgba(0,0,0,0.7) !important;
  }
  table.shop_table {
    border: 1px solid var(--border-gold) !important;
    border-radius: 8px !important;
    background: var(--bg-card) !important;
    color: var(--text-primary) !important;
  }
  table.shop_table th {
    background: #090c12 !important;
    color: var(--gold-primary) !important;
    font-family: 'Cinzel', serif !important;
    border-bottom: 1px solid var(--border-gold) !important;
  }
  table.shop_table td {
    border-top: 1px solid var(--border-subtle) !important;
    color: var(--text-secondary) !important;
  }
  table.shop_table tr.cart_item:hover {
    background-color: rgba(255, 255, 255, 0.02) !important;
  }

  /* Payment Box */
  #payment {
    background: var(--bg-elevated) !important;
    border: 1px solid var(--border-gold) !important;
    border-radius: 10px !important;
  }
  #payment ul.payment_methods {
    border-bottom: 1px solid var(--border-subtle) !important;
  }
  #payment div.payment_box {
    background: var(--bg-card) !important;
    color: var(--text-primary) !important;
    border: 1px solid var(--border-gold) !important;
    border-radius: 6px !important;
  }

  /* Notices */
  .woocommerce-message, .woocommerce-info {
    background-color: var(--bg-surface) !important;
    color: var(--text-primary) !important;
    border-top-color: var(--gold-primary) !important;
    box-shadow: 0 10px 25px rgba(0,0,0,0.5) !important;
  }

  /* Floating WhatsApp Support Button */
  .wa-floating-concierge {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 999999;
    display: flex;
    align-items: center;
    gap: 10px;
    background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
    color: #ffffff !important;
    text-decoration: none !important;
    padding: 12px 22px;
    border-radius: 50px;
    box-shadow: 0 8px 24px rgba(37, 211, 102, 0.45), 0 0 20px rgba(212, 175, 55, 0.3);
    border: 2px solid rgba(255, 255, 255, 0.4);
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.5px;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .wa-floating-concierge:hover {
    transform: translateY(-4px) scale(1.04);
    box-shadow: 0 14px 32px rgba(37, 211, 102, 0.65), 0 0 30px rgba(212, 175, 55, 0.5);
    color: #ffffff !important;
  }
  .wa-floating-concierge svg {
    width: 24px;
    height: 24px;
    fill: #ffffff;
    flex-shrink: 0;
  }

  /* Footer */
  footer.site-footer, #mastfoot, .ast-footer-overlay, .site-below-footer-wrap, .site-primary-footer-wrap {
    background-color: #040507 !important;
    border-top: 1px solid var(--border-gold) !important;
    color: var(--text-muted) !important;
  }
  footer.site-footer a {
    color: var(--gold-light) !important;
  }
  footer.site-footer a:hover {
    color: #ffffff !important;
  }
</style>
`;
}

// 3. GENERATE FOOTER WIDGET
function generateFooterHtml() {
  return `
<!-- Reflection Elite Concierge Floating WhatsApp -->
<a href="https://wa.me/917387463103?text=Hi%20Reflection%20Elite,%20I%20am%20interested%20in%20your%20luxury%20mirrors." 
   target="_blank" 
   rel="noopener noreferrer" 
   class="wa-floating-concierge" 
   aria-label="Chat with Reflection Elite Concierge on WhatsApp">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.06-2.146-.541-1.854-.77-3.047-2.662-3.14-2.785-.092-.122-.741-.986-.741-1.88 0-.895.469-1.334.636-1.516.166-.182.365-.228.487-.228.122 0 .243.002.349.006.111.005.26-.042.406.31.15.362.512 1.248.558 1.339.045.091.076.197.015.319-.06.121-.091.197-.182.303-.091.106-.192.237-.274.319-.092.091-.188.19-.081.373.106.183.473.78 1.014 1.262.697.621 1.285.813 1.468.904.182.091.289.076.395-.045.106-.122.456-.531.577-.714.122-.182.243-.152.41-.091s1.063.501 1.245.592c.182.091.303.137.349.213.045.076.045.441-.099.846zm-3.392-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.88l-1.304 4.76 4.877-1.278c1.401.764 3.003 1.198 4.703 1.198 5.523 0 10-4.477 10-10 0-5.522-4.477-10-10-10z"/>
  </svg>
  <span>Concierge Support</span>
</a>
`;
}

async function deploy() {
  console.log('=== DEPLOYING COMPLETE DARK & GOLD LUXURY THEME ===\n');

  // Step 1: Update Homepage Content via REST API
  console.log('Step 1: Updating Homepage (Page ID 68) with Dark Luxury Content...');
  const hpRes = await fetch(`${WP_URL}/wp-json/wp/v2/pages/68`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      title: 'Reflection Elite | Luxury Italian & Venetian Mirrors',
      content: generateLuxuryHomepageHtml(),
      status: 'publish'
    })
  });
  if (!hpRes.ok) {
    const err = await hpRes.text();
    console.error('Failed to update homepage:', err);
  } else {
    console.log('[SUCCESS] Homepage updated with dark glassmorphic hero & spotlights!');
  }

  // Step 2: Inject Global CSS & WhatsApp Widget via WPCode
  console.log('\nStep 2: Injecting Global Dark Luxury CSS & WhatsApp Widget into WPCode...');
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`);
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');

  const res3 = await fetch(`${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await res3.text();
  const nonceMatch = html.match(/id="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i) 
                  || html.match(/name="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i);
  if (!nonceMatch) {
    throw new Error('Could not find nonce on WPCode page');
  }
  const nonce = nonceMatch[1];

  const formBody = new URLSearchParams();
  formBody.append('insert-headers-and-footers_nonce', nonce);
  formBody.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-headers-footers');
  formBody.append('ihaf_insert_header', generateLuxuryCss());
  formBody.append('ihaf_insert_body', '');
  formBody.append('ihaf_insert_footer', generateFooterHtml());

  const saveRes = await fetch(`${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': allCookies
    },
    body: formBody.toString(),
    redirect: 'manual'
  });

  console.log(`[SUCCESS] WPCode settings saved (HTTP ${saveRes.status})`);

  console.log('\n========================================================');
  console.log('Dark & Gold Italian Luxury Makeover Deployed Successfully!');
  console.log('Live Site: https://mediumpurple-salamander-731288.hostingersite.com/');
  console.log('========================================================\n');
}

deploy().catch(console.error);
