import https from 'https';
import fs from 'fs';
import path from 'path';

function loadEnv() {
  const envPath = path.resolve('.env');
  const envVars = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          envVars[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
        }
      }
    }
  }
  return envVars;
}

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request({ ...options, family: 4, timeout: 25000 }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')); });
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  const env = loadEnv();
  const username = env.PROD_WP_USER;
  const password = env.PROD_WP_PASS;

  console.log('1. Authenticating to WordPress...');
  const loginBody = new URLSearchParams({
    log: username,
    pwd: password,
    'wp-submit': 'Log In',
    redirect_to: 'https://reflectionelite.com/wp-admin/',
    testcookie: '1'
  }).toString();

  const loginRes = await request({
    hostname: 'reflectionelite.com',
    port: 443,
    path: '/wp-login.php',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(loginBody)
    }
  }, loginBody);

  const cookies = (loginRes.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ');

  const adminRes = await request({
    hostname: 'reflectionelite.com',
    port: 443,
    path: '/wp-admin/index.php',
    method: 'GET',
    headers: { 'Cookie': cookies }
  });

  const nonceMatch = adminRes.body.match(/wpApiSettings\s*=\s*\{[^}]*?"nonce":"([^"]+)"/);
  const nonce = nonceMatch ? nonceMatch[1] : null;
  if (!nonce) throw new Error('Nonce not found');

  // 2. Fetch live Page 50
  console.log('2. Fetching freshest live Page 50 (/about-us/)...');
  const pageRes = await request({
    hostname: 'reflectionelite.com',
    port: 443,
    path: '/wp-json/wp/v2/pages/50?context=edit',
    method: 'GET',
    headers: { 'Cookie': cookies, 'X-WP-Nonce': nonce }
  });

  const pageData = JSON.parse(pageRes.body);
  const originalContent = pageData.content?.raw || '';
  console.log('Live Page 50 content length:', originalContent.length);

  // Backup original content
  fs.writeFileSync('backups/page_50_pre_shopify_about_' + Date.now() + '.html', originalContent, 'utf8');

  // 3. Locate boundaries between header and footer
  const headerEndTag = '</header>';
  const headerEndIdx = originalContent.indexOf(headerEndTag);
  if (headerEndIdx === -1) {
    throw new Error('Could not find </header> in Page 50!');
  }

  const footerStartTag = '<footer class="site-footer">';
  const footerStartIdx = originalContent.indexOf(footerStartTag);
  if (footerStartIdx === -1) {
    throw new Error('Could not find <footer class="site-footer"> in Page 50!');
  }

  console.log(`Replacing content between index ${headerEndIdx + headerEndTag.length} and ${footerStartIdx}`);

  // 4. Build exact Shopify Atelier About Us HTML & Scoped CSS
  const shopifyAboutHtml = `
<!-- ========================================================================= -->
<!-- SHOPIFY ATELIER EXACT REPLICA: ABOUT US PAGE (7 SECTIONS, IMAGES & STYLES) -->
<!-- ========================================================================= -->
<main id="re-about-atelier-main" class="re-about-atelier-wrapper">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap');

    .re-about-atelier-wrapper {
      background-color: #000000 !important;
      color: #ffffff !important;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      width: 100% !important;
      overflow-x: hidden !important;
      box-sizing: border-box !important;
    }

    .re-about-atelier-wrapper * {
      box-sizing: border-box !important;
    }

    /* SECTION 1: HERO HEADER BANNER */
    .re-about-hero-sec {
      position: relative !important;
      width: 100vw !important;
      left: 50% !important;
      right: 50% !important;
      margin-left: -50vw !important;
      margin-right: -50vw !important;
      height: 500px !important;
      background-image: url('https://enmj61-4v.myshopify.com/cdn/shop/files/ne4.webp?v=1780575734&width=2000') !important;
      background-size: cover !important;
      background-position: center center !important;
      background-repeat: no-repeat !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      text-align: center !important;
      overflow: hidden !important;
    }

    .re-about-hero-overlay {
      position: absolute !important;
      inset: 0 !important;
      background-color: rgba(0, 0, 0, 0.35) !important;
      z-index: 1 !important;
    }

    .re-about-hero-content {
      position: relative !important;
      z-index: 2 !important;
      width: 90% !important;
      max-width: 800px !important;
      margin: 0 auto !important;
      padding: 0 20px !important;
    }

    .re-about-hero-heading {
      color: #ffffff !important;
      font-family: 'Cinzel', Georgia, serif !important;
      font-size: clamp(2.4rem, 5.5vw, 68px) !important;
      font-weight: 500 !important;
      line-height: 1.15 !important;
      letter-spacing: 0.06em !important;
      margin: 0 0 18px 0 !important;
      text-transform: none !important;
      text-shadow: 0 2px 14px rgba(0, 0, 0, 0.75) !important;
    }

    .re-about-hero-sub {
      color: #ffffff !important;
      font-family: 'Montserrat', sans-serif !important;
      font-size: clamp(1rem, 1.6vw, 18px) !important;
      font-weight: 300 !important;
      line-height: 1.5 !important;
      letter-spacing: 0.04em !important;
      margin: 0 !important;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.75) !important;
    }

    /* SECTION 2: WHO WE ARE */
    .re-about-who-sec {
      padding: 70px 24px 50px !important;
      text-align: center !important;
      max-width: 980px !important;
      margin: 0 auto !important;
    }

    .re-about-eyebrow {
      font-family: 'Montserrat', sans-serif !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      letter-spacing: 0.22em !important;
      text-transform: uppercase !important;
      color: #a1a1aa !important;
      margin: 0 0 16px 0 !important;
    }

    .re-about-brand-title {
      font-family: 'Cinzel', Georgia, serif !important;
      font-size: clamp(1.8rem, 3.2vw, 36px) !important;
      font-weight: 500 !important;
      letter-spacing: 0.12em !important;
      text-transform: lowercase !important;
      color: #ffffff !important;
      margin: 0 0 24px 0 !important;
    }

    .re-about-lead-text {
      font-family: 'Montserrat', sans-serif !important;
      font-size: clamp(13px, 1.15vw, 15px) !important;
      font-weight: 400 !important;
      line-height: 1.95 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: #d4d4d8 !important;
      max-width: 860px !important;
      margin: 0 auto !important;
      text-align: center !important;
    }

    /* SECTION 3 & 4: OUR MISSION & OUR VISION */
    .re-about-text-sec {
      padding: 40px 24px !important;
      text-align: center !important;
      max-width: 900px !important;
      margin: 0 auto !important;
    }

    .re-about-sec-heading {
      font-family: 'Cinzel', Georgia, serif !important;
      font-size: clamp(1.6rem, 2.6vw, 30px) !important;
      font-weight: 500 !important;
      letter-spacing: 0.1em !important;
      color: #ffffff !important;
      margin: 0 0 20px 0 !important;
      text-transform: none !important;
    }

    .re-about-sec-p {
      font-family: 'Montserrat', sans-serif !important;
      font-size: clamp(14px, 1.15vw, 16px) !important;
      font-weight: 300 !important;
      line-height: 1.85 !important;
      letter-spacing: 0.03em !important;
      color: #d1d5db !important;
      max-width: 820px !important;
      margin: 0 auto !important;
      text-align: center !important;
    }

    .re-about-founder-title {
      font-family: 'Cinzel', Georgia, serif !important;
      font-size: clamp(1.6rem, 2.6vw, 30px) !important;
      font-weight: 500 !important;
      letter-spacing: 0.1em !important;
      color: #ffffff !important;
      margin: 45px 0 25px 0 !important;
      text-transform: none !important;
    }

    /* SECTION 5: FOUNDER PORTRAIT & WHAT WE OFFER */
    .re-about-offer-sec {
      padding: 0 24px 60px !important;
      text-align: center !important;
      max-width: 900px !important;
      margin: 0 auto !important;
    }

    .re-about-founder-img-box {
      margin: 0 auto 45px !important;
      max-width: 440px !important;
      width: 100% !important;
    }

    .re-about-founder-img {
      width: 100% !important;
      height: auto !important;
      border-radius: 8px !important;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7) !important;
      display: block !important;
      margin: 0 auto !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
    }

    .re-about-offer-sub {
      font-family: 'Montserrat', sans-serif !important;
      font-size: clamp(15px, 1.2vw, 17px) !important;
      font-weight: 300 !important;
      line-height: 1.6 !important;
      color: #d1d5db !important;
      margin: 0 0 24px 0 !important;
    }

    .re-about-offer-list {
      list-style: none !important;
      padding: 0 !important;
      margin: 0 auto !important;
      max-width: 460px !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 14px !important;
    }

    .re-about-offer-list li {
      display: flex !important;
      align-items: center !important;
      gap: 12px !important;
      font-family: 'Montserrat', sans-serif !important;
      font-size: 16px !important;
      color: #ffffff !important;
    }

    .re-about-offer-list li .re-bullet-star {
      color: #d4a574 !important;
      font-size: 13px !important;
    }

    .re-about-offer-list h5 {
      margin: 0 !important;
      font-family: 'Montserrat', sans-serif !important;
      font-size: 16px !important;
      font-weight: 400 !important;
      letter-spacing: 0.05em !important;
      color: #ffffff !important;
    }

    /* SECTION 6: WHY CHOOSE US & OUR COMMITMENT */
    .re-about-card-sec {
      padding: 0 24px 60px !important;
      max-width: 860px !important;
      margin: 0 auto !important;
    }

    .re-about-card-inner {
      background-color: #121214 !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      border-radius: 10px !important;
      padding: 48px 36px !important;
      text-align: center !important;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5) !important;
    }

    .re-card-eyebrow {
      font-family: 'Montserrat', sans-serif !important;
      font-size: 12px !important;
      font-weight: 600 !important;
      letter-spacing: 0.22em !important;
      text-transform: uppercase !important;
      color: #d4a574 !important;
      margin: 0 0 12px 0 !important;
    }

    .re-card-title {
      font-family: 'Cinzel', Georgia, serif !important;
      font-size: clamp(1.4rem, 2.4vw, 26px) !important;
      font-weight: 500 !important;
      letter-spacing: 0.08em !important;
      color: #ffffff !important;
      margin: 0 0 28px 0 !important;
    }

    .re-card-points {
      display: flex !important;
      flex-direction: column !important;
      gap: 12px !important;
      max-width: 480px !important;
      margin: 0 auto 36px !important;
      text-align: left !important;
    }

    .re-card-point-item {
      display: flex !important;
      align-items: center !important;
      gap: 12px !important;
      font-family: 'Montserrat', sans-serif !important;
      font-size: 15px !important;
      font-weight: 400 !important;
      color: #f4f4f5 !important;
    }

    .re-point-badge {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 26px !important;
      height: 26px !important;
      border-radius: 50% !important;
      background-color: rgba(212, 165, 116, 0.15) !important;
      color: #d4a574 !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      border: 1px solid rgba(212, 165, 116, 0.4) !important;
      flex-shrink: 0 !important;
    }

    .re-card-divider {
      width: 60px !important;
      height: 1px !important;
      background-color: rgba(255, 255, 255, 0.15) !important;
      margin: 28px auto !important;
    }

    .re-commitment-desc {
      font-family: 'Montserrat', sans-serif !important;
      font-size: 15px !important;
      font-weight: 300 !important;
      line-height: 1.85 !important;
      letter-spacing: 0.03em !important;
      color: #d1d5db !important;
      max-width: 740px !important;
      margin: 0 auto !important;
      text-align: center !important;
    }

    /* SECTION 7: MANUFACTURING UNIT */
    .re-about-factory-sec {
      padding: 20px 24px 90px !important;
      max-width: 1040px !important;
      margin: 0 auto !important;
    }

    .re-about-factory-row {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 40px !important;
      flex-wrap: wrap !important;
    }

    .re-factory-img-wrap {
      flex: 1 1 450px !important;
      max-width: 520px !important;
    }

    .re-factory-img {
      width: 100% !important;
      height: auto !important;
      border-radius: 8px !important;
      box-shadow: 0 14px 35px rgba(0, 0, 0, 0.6) !important;
      display: block !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
    }

    .re-factory-text-wrap {
      flex: 1 1 340px !important;
      max-width: 440px !important;
    }

    .re-factory-text {
      font-family: 'Cinzel', Georgia, serif !important;
      font-size: clamp(1.2rem, 2vw, 24px) !important;
      font-weight: 500 !important;
      letter-spacing: 0.08em !important;
      line-height: 1.6 !important;
      color: #ffffff !important;
      text-transform: uppercase !important;
      margin: 0 !important;
    }

    @media screen and (max-width: 768px) {
      .re-about-hero-sec {
        height: 380px !important;
      }
      .re-about-card-inner {
        padding: 36px 20px !important;
      }
      .re-about-factory-row {
        flex-direction: column !important;
        text-align: center !important;
        gap: 28px !important;
      }
      .re-factory-text {
        text-align: center !important;
        margin: 0 auto !important;
      }
    }
  </style>

  <!-- SECTION 1: HERO HEADER BANNER -->
  <section class="re-about-hero-sec">
    <div class="re-about-hero-overlay"></div>
    <div class="re-about-hero-content">
      <h1 class="re-about-hero-heading">About US</h1>
      <p class="re-about-hero-sub">Elevate your space with refined elegance</p>
    </div>
  </section>

  <!-- SECTION 2: WHO WE ARE -->
  <section class="re-about-who-sec">
    <h4 class="re-about-eyebrow">Who We Are</h4>
    <h3 class="re-about-brand-title">reflection elite</h3>
    <h4 class="re-about-lead-text">
      REFLECTION ELITE CREATES PREMIUM DESIGNER MIRRORS THAT ELEVATE EVERYDAY SPACES INTO INFLUENCER-WORTHY BACKDROPS. WE FOCUS ON QUALITY CRAFTSMANSHIP, MODERN AESTHETICS, AND CAREFULLY CURATED DESIGNS SO YOUR HOME LOOKS STUNNING ON AND OFF CAMERA. TRUSTED BY STYLE-FORWARD CUSTOMERS, WE DELIVER DECOR THAT REFLECTS YOUR BEST SELF.
    </h4>
  </section>

  <!-- SECTION 3: OUR MISSION -->
  <section class="re-about-text-sec">
    <h3 class="re-about-sec-heading">Our Mission</h3>
    <p class="re-about-sec-p">
      At ReflectionElite, our mission is to deliver high-quality, stylish, and durable mirror solutions that enhance the beauty and functionality of every space. We are committed to combining modern design with expert craftsmanship, ensuring every product meets the highest standards of quality and customer satisfaction. Our goal is to make premium mirror designs accessible and reliable for homes, offices, and commercial environments.
    </p>
  </section>

  <!-- SECTION 4: OUR VISION & FOUNDER -->
  <section class="re-about-text-sec">
    <h3 class="re-about-sec-heading">Our Vision</h3>
    <p class="re-about-sec-p">
      Our vision is to become a leading and trusted name in the mirror industry by continuously innovating and setting new standards in design and quality. We aim to transform spaces with elegant mirror solutions while building long-term relationships with our customers through trust, excellence, and service.
    </p>
    <h3 class="re-about-founder-title">Founder</h3>
  </section>

  <!-- SECTION 5: FOUNDER PORTRAIT & WHAT WE OFFER -->
  <section class="re-about-offer-sec">
    <div class="re-about-founder-img-box">
      <img
        src="https://enmj61-4v.myshopify.com/cdn/shop/files/IMG-20260605-WA0004.jpg?v=1780733879&width=1600"
        alt="Founder - Reflection Elite"
        class="re-about-founder-img"
        loading="lazy"
        width="800"
        height="1058"
      >
    </div>

    <h3 class="re-about-sec-heading">What We Offer</h3>
    <p class="re-about-offer-sub">We provide a wide range of mirror solutions tailored to your needs:</p>

    <ul class="re-about-offer-list">
      <li><span class="re-bullet-star">✦</span> <h5>Custom Mirror Design</h5></li>
      <li><span class="re-bullet-star">✦</span> <h5>Decorative &amp; Designer Mirrors</h5></li>
      <li><span class="re-bullet-star">✦</span> <h5>Bathroom &amp; LED Mirrors</h5></li>
      <li><span class="re-bullet-star">✦</span> <h5>Full-Length Mirrors</h5></li>
      <li><span class="re-bullet-star">✦</span> <h5>Office &amp; Commercial Mirrors</h5></li>
    </ul>
  </section>

  <!-- SECTION 6: WHY CHOOSE US & OUR COMMITMENT -->
  <section class="re-about-card-sec">
    <div class="re-about-card-inner">
      <h5 class="re-card-eyebrow">Why Choose Us</h5>
      <h4 class="re-card-title">Why Choose ReflectionElite?</h4>
      
      <div class="re-card-points">
        <div class="re-card-point-item">
          <span class="re-point-badge">1</span>
          <span>Premium Quality Materials</span>
        </div>
        <div class="re-card-point-item">
          <span class="re-point-badge">2</span>
          <span>Modern &amp; Stylish Designs</span>
        </div>
        <div class="re-card-point-item">
          <span class="re-point-badge">3</span>
          <span>Affordable Pricing</span>
        </div>
        <div class="re-card-point-item">
          <span class="re-point-badge">4</span>
          <span>Skilled &amp; Professional Team</span>
        </div>
        <div class="re-card-point-item">
          <span class="re-point-badge">5</span>
          <span>Customer Satisfaction Focus</span>
        </div>
      </div>

      <div class="re-card-divider"></div>

      <h5 class="re-card-eyebrow">Our Commitment</h5>
      <p class="re-commitment-desc">
        At ReflectionElite, we are committed to delivering excellence in every project. From design , we ensure attention to detail, high-quality materials, and a smooth customer experience. Your satisfaction is our priority, and we strive to exceed expectations with every mirror we create.
      </p>
    </div>
  </section>

  <!-- SECTION 7: MANUFACTURING UNIT -->
  <section class="re-about-factory-sec">
    <div class="re-about-factory-row">
      <div class="re-factory-img-wrap">
        <img
          src="https://enmj61-4v.myshopify.com/cdn/shop/files/unnamed_-_2026-06-05T162216.764.webp?v=1780656749&width=1600"
          alt="Reflection Elite Goa Manufacturing Unit"
          class="re-factory-img"
          loading="lazy"
          width="800"
          height="600"
        >
      </div>
      <div class="re-factory-text-wrap">
        <p class="re-factory-text">We have our own manufacturing unit in goa by kgn glass</p>
      </div>
    </div>
  </section>
</main>
`;

  // 5. Assemble updated Page 50 content
  const updatedPageContent = originalContent.slice(0, headerEndIdx + headerEndTag.length) +
    '\n' + shopifyAboutHtml.trim() + '\n' +
    originalContent.slice(footerStartIdx);

  // 6. Save to WordPress Page 50
  console.log('3. Updating live WordPress Page 50...');
  const postData = JSON.stringify({ content: updatedPageContent });
  const updateRes = await request({
    hostname: 'reflectionelite.com',
    port: 443,
    path: '/wp-json/wp/v2/pages/50',
    method: 'POST',
    headers: {
      'Cookie': cookies,
      'X-WP-Nonce': nonce,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, postData);

  if (updateRes.statusCode !== 200) {
    throw new Error('Update failed with status ' + updateRes.statusCode + ': ' + updateRes.body);
  }

  console.log('✅ Page 50 successfully updated with exact Shopify Atelier About Us layout!');
}

main().catch(err => {
  console.error('Execution error:', err);
  process.exit(1);
});
