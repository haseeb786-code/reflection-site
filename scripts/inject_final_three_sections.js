import fs from 'fs';
import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  const auth = await getProdAuth();
  console.log('1. Fetching Page 68 from:', auth.siteUrl);

  const res = await fetch(`${auth.siteUrl}/wp-json/wp/v2/pages/68?context=edit`, {
    headers: { Cookie: auth.cookies, 'X-WP-Nonce': auth.nonce }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch Page 68: HTTP ${res.status}`);
  }

  const pageData = await res.json();
  let content = pageData.content?.raw || '';

  // 1. Save Backup
  fs.writeFileSync('backups/page_68_before_final_three_sections.html', content);
  console.log('✅ Backup saved to backups/page_68_before_final_three_sections.html');

  // 2. Locate insertion point:
  // If #re-why-choose-section already exists, replace from #re-why-choose-section up to <footer class="re-unified-footer-container">
  // Otherwise, insert right after #re-comparison-split-section </section>
  const existingSectionIdx = content.indexOf('id="re-why-choose-section"');
  const footerIdx = content.indexOf('<footer class="re-unified-footer-container">');

  let insertionStart = -1;
  let insertionEnd = -1;

  if (existingSectionIdx !== -1 && footerIdx !== -1 && existingSectionIdx < footerIdx) {
    // Look backward for section tag
    const secStart = content.lastIndexOf('<section', existingSectionIdx);
    insertionStart = secStart !== -1 ? secStart : existingSectionIdx;
    insertionEnd = footerIdx;
    console.log('Replacing existing final sections between index', insertionStart, 'and', insertionEnd);
  } else {
    const compIdx = content.indexOf('id="re-comparison-split-section"');
    if (compIdx === -1) {
      throw new Error('Could not find #re-comparison-split-section in Page 68!');
    }
    const sectionEndTag = '</section>';
    const endOfCompSection = content.indexOf(sectionEndTag, compIdx);
    if (endOfCompSection === -1) {
      throw new Error('Could not find closing </section> for #re-comparison-split-section!');
    }
    insertionStart = endOfCompSection + sectionEndTag.length;
    insertionEnd = insertionStart;
    console.log('Inserting new final sections at index', insertionStart);
  }

  // 3. Define the HTML & Scoped CSS & JS for the 3 Final Sections
  const finalThreeSectionsHtml = `

<!-- ===================================================================== -->
<!-- SECTION 12: WHY CHOOSE REFLECTION ELITE (EXACT SHOPIFY ATELIER REPLICA) -->
<!-- ===================================================================== -->
<section id="re-why-choose-section" class="re-why-choose-container">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap');

    #re-why-choose-section {
      position: relative !important;
      width: 100vw !important;
      left: 50% !important;
      right: 50% !important;
      margin-left: -50vw !important;
      margin-right: -50vw !important;
      background-color: #000000 !important;
      padding: 95px 0 95px !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
      color: #ffffff !important;
      z-index: 5;
    }

    #re-why-choose-section * {
      box-sizing: border-box;
    }

    #re-why-choose-section .re-choose-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 40px;
    }

    /* Section Header */
    #re-why-choose-section .re-choose-header {
      text-align: center;
      max-width: 820px;
      margin: 0 auto 65px;
    }

    #re-why-choose-section .re-choose-title {
      font-family: 'Cinzel', Georgia, serif;
      font-size: clamp(2rem, 3.8vw, 42px);
      font-weight: 500;
      line-height: 1.25;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #ffffff;
      margin: 0 0 22px 0;
      text-shadow: 0 2px 14px rgba(0, 0, 0, 0.8);
    }

    #re-why-choose-section .re-choose-subtitle {
      font-family: 'Montserrat', -apple-system, sans-serif;
      font-size: clamp(13px, 1.1vw, 15px);
      font-weight: 400;
      line-height: 1.75;
      color: #cccccc;
      letter-spacing: 0.03em;
      margin: 0;
    }

    /* 3 Cards Grid */
    #re-why-choose-section .re-choose-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 50px;
    }

    #re-why-choose-section .re-feature-item {
      text-align: center;
      cursor: pointer;
    }

    #re-why-choose-section .re-feature-image-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      overflow: hidden;
      margin-bottom: 30px;
      background-color: #1a1a1a;
      border-radius: 4px;
    }

    #re-why-choose-section .re-feature-image-wrapper::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      pointer-events: none;
      transition: background-color 0.4s ease;
      z-index: 2;
    }

    #re-why-choose-section .re-feature-item:hover .re-feature-image-wrapper::after {
      background-color: rgba(0, 0, 0, 0.5);
    }

    #re-why-choose-section .re-feature-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      filter: grayscale(100%);
      transition: transform 0.65s cubic-bezier(0.25, 1, 0.5, 1), filter 0.65s ease;
      transform: scale(1.0);
    }

    #re-why-choose-section .re-feature-item:hover .re-feature-image {
      transform: scale(1.1);
      filter: grayscale(70%);
    }

    #re-why-choose-section .re-feature-content {
      padding: 0 16px;
    }

    #re-why-choose-section .re-feature-title {
      font-family: 'Cinzel', Georgia, serif;
      font-weight: 500;
      font-size: 18px;
      color: #ffffff;
      margin: 0 0 16px 0;
      letter-spacing: 2px;
      text-transform: uppercase;
      line-height: 1.3;
    }

    #re-why-choose-section .re-feature-desc {
      font-family: 'Montserrat', -apple-system, sans-serif;
      font-weight: 400;
      font-size: 13px;
      color: #cccccc;
      line-height: 1.65;
      margin: 0;
      letter-spacing: 0.5px;
    }

    #re-why-choose-section .re-feature-divider {
      width: 60px;
      height: 1px;
      background-color: #ffffff;
      margin: 25px auto 0;
      opacity: 0.3;
    }

    @media screen and (max-width: 989px) {
      #re-why-choose-section .re-choose-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 40px;
      }
      #re-why-choose-section .re-feature-title {
        font-size: 16px;
      }
      #re-why-choose-section .re-feature-desc {
        font-size: 12px;
      }
    }

    @media screen and (max-width: 749px) {
      #re-why-choose-section {
        padding: 60px 0 60px !important;
      }
      #re-why-choose-section .re-choose-inner {
        padding: 0 20px;
      }
      #re-why-choose-section .re-choose-header {
        margin-bottom: 45px;
      }
      #re-why-choose-section .re-choose-title {
        font-size: 24px;
      }
      #re-why-choose-section .re-choose-grid {
        grid-template-columns: 1fr;
        gap: 45px;
      }
      #re-why-choose-section .re-feature-content {
        padding: 0 8px;
      }
    }
  </style>

  <div class="re-choose-inner">
    <!-- Header Block -->
    <div class="re-choose-header">
      <h3 class="re-choose-title">Why Choose<br/>Reflection Elite</h3>
      <p class="re-choose-subtitle">
        At Reflection Elite, we go beyond ordinary glasswork to deliver refined mirror solutions that elevate every space. Our commitment to detail, durability, and design excellence ensures you receive products that are both beautiful and built to last.
      </p>
    </div>

    <!-- 3 Craftsmanship Cards -->
    <div class="re-choose-grid">
      
      <!-- Card 1: Expert Craftsmanship -->
      <div class="re-feature-item" tabindex="0" role="article" aria-label="Expert Craftsmanship">
        <div class="re-feature-image-wrapper">
          <img
            src="https://reflectionelite.com/wp-content/uploads/2026/10/why_choose_craftsmanship.jpg"
            alt="Expert Craftsmanship"
            loading="lazy"
            width="500"
            height="500"
            class="re-feature-image"
          >
        </div>
        <div class="re-feature-content">
          <h4 class="re-feature-title">Expert Craftsmanship</h4>
          <p class="re-feature-desc">Skilled artisans with deep experience in engraving, beveling, and mirror finishing.</p>
          <div class="re-feature-divider"></div>
        </div>
      </div>

      <!-- Card 2: Premium Quality Materials -->
      <div class="re-feature-item" tabindex="0" role="article" aria-label="Premium Quality Materials">
        <div class="re-feature-image-wrapper">
          <img
            src="https://reflectionelite.com/wp-content/uploads/2026/10/why_choose_materials.jpg"
            alt="Premium Quality Materials"
            loading="lazy"
            width="500"
            height="500"
            class="re-feature-image"
          >
        </div>
        <div class="re-feature-content">
          <h4 class="re-feature-title">Premium Quality Materials</h4>
          <p class="re-feature-desc">We use high-grade glass and advanced silvering techniques for superior clarity and durability.</p>
          <div class="re-feature-divider"></div>
        </div>
      </div>

      <!-- Card 3: Customized Designs -->
      <div class="re-feature-item" tabindex="0" role="article" aria-label="Customized Designs">
        <div class="re-feature-image-wrapper">
          <img
            src="https://reflectionelite.com/wp-content/uploads/2026/10/why_choose_custom.jpg"
            alt="Customized Designs"
            loading="lazy"
            width="500"
            height="500"
            class="re-feature-image"
          >
        </div>
        <div class="re-feature-content">
          <h4 class="re-feature-title">Customized Designs</h4>
          <p class="re-feature-desc">Tailor-made solutions crafted to match your unique style and interior needs.</p>
          <div class="re-feature-divider"></div>
        </div>
      </div>

    </div>
  </div>
</section>


<!-- ===================================================================== -->
<!-- SECTION 15: SUBSCRIBE TO OUR EMAILS (EXACT SHOPIFY ATELIER REPLICA)    -->
<!-- ===================================================================== -->
<section id="re-email-subscribe-section" class="re-subscribe-container">
  <style>
    #re-email-subscribe-section {
      position: relative !important;
      width: 100vw !important;
      left: 50% !important;
      right: 50% !important;
      margin-left: -50vw !important;
      margin-right: -50vw !important;
      background-color: #000000 !important;
      padding: 85px 0 80px !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
      color: #ffffff !important;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      z-index: 5;
    }

    #re-email-subscribe-section * {
      box-sizing: border-box;
    }

    #re-email-subscribe-section .re-sub-inner {
      max-width: 760px;
      margin: 0 auto;
      padding: 0 24px;
      text-align: center;
    }

    #re-email-subscribe-section .re-sub-heading {
      font-family: 'Cinzel', Georgia, serif;
      font-size: clamp(1.8rem, 3.2vw, 36px);
      font-weight: 500;
      line-height: 1.25;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #ffffff;
      margin: 0 0 14px 0;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
    }

    #re-email-subscribe-section .re-sub-subtext {
      font-family: 'Montserrat', -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.6;
      color: #aaaaaa;
      letter-spacing: 0.04em;
      margin: 0 auto 34px auto;
    }

    /* Pill-Shaped Input Form */
    #re-email-subscribe-section .re-sub-form-wrap {
      max-width: 480px;
      margin: 0 auto;
    }

    #re-email-subscribe-section .re-sub-input-group {
      display: flex;
      align-items: center;
      border: 1px solid rgba(255, 255, 255, 0.28);
      border-radius: 100px;
      padding: 4px 6px 4px 22px;
      background: rgba(255, 255, 255, 0.03);
      transition: border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
    }

    #re-email-subscribe-section .re-sub-input-group:focus-within {
      border-color: #d4a574;
      background: rgba(255, 255, 255, 0.06);
      box-shadow: 0 0 15px rgba(212, 165, 116, 0.2);
    }

    #re-email-subscribe-section .re-sub-input {
      flex: 1;
      background: transparent;
      border: none;
      color: #ffffff;
      font-family: 'Montserrat', -apple-system, sans-serif;
      font-size: 14px;
      outline: none;
      padding: 12px 0;
      letter-spacing: 0.02em;
    }

    #re-email-subscribe-section .re-sub-input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    #re-email-subscribe-section .re-sub-button {
      background: transparent;
      border: none;
      color: #ffffff;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.3s ease, color 0.3s ease, background 0.3s ease;
      padding: 0;
    }

    #re-email-subscribe-section .re-sub-button:hover {
      transform: translateX(4px);
      color: #d4a574;
    }

    #re-email-subscribe-section .re-sub-button svg {
      width: 20px;
      height: 20px;
    }

    #re-email-subscribe-section .re-sub-feedback {
      display: none;
      font-family: 'Montserrat', sans-serif;
      font-size: 13.5px;
      color: #d4a574;
      margin-top: 16px;
      letter-spacing: 0.03em;
    }

    /* Crypto Currency Strip */
    #re-email-subscribe-section .re-crypto-strip {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-top: 36px;
    }

    #re-email-subscribe-section .re-crypto-text {
      font-family: 'Montserrat', -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.65);
      letter-spacing: 0.05em;
    }

    #re-email-subscribe-section .re-crypto-badge {
      height: 24px;
      width: auto;
      object-fit: contain;
      filter: brightness(1.1);
    }

    @media screen and (max-width: 749px) {
      #re-email-subscribe-section {
        padding: 55px 0 55px !important;
      }
      #re-email-subscribe-section .re-sub-heading {
        font-size: 22px;
      }
      #re-email-subscribe-section .re-sub-subtext {
        font-size: 13px;
        margin-bottom: 26px;
      }
      #re-email-subscribe-section .re-crypto-strip {
        flex-direction: column;
        gap: 10px;
        margin-top: 28px;
      }
    }
  </style>

  <div class="re-sub-inner">
    <h2 class="re-sub-heading">Subscribe to our emails</h2>
    <p class="re-sub-subtext">Be the first to know about new collections and special offers.</p>

    <div class="re-sub-form-wrap">
      <form class="re-sub-form" onsubmit="event.preventDefault(); const fb = this.nextElementSibling; fb.style.display='block'; this.reset();">
        <div class="re-sub-input-group">
          <input
            type="email"
            class="re-sub-input"
            placeholder="Email address"
            required
            aria-label="Email address"
          >
          <button type="submit" class="re-sub-button" aria-label="Sign up">
            <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
              <path clip-rule="evenodd" d="m11.246 5.31759c.0322-.07821.0833-.14723.1486-.20093.0654-.0537.143-.09041.2259-.10686.083-.01645.1688-.01214.2497.01257.0808.0247.1544.06902.214.12902l4.104 4.104c.0478.04765.0857.10426.1115.16659.0259.06232.0392.12913.0392.19661 0 .06747-.0133.13429-.0392.19661-.0258.06233-.0637.11893-.1115.16659l-4.104 4.10401c-.0963.0963-.227.1504-.3632.1504s-.2669-.0541-.3632-.1504-.1504-.227-.1504-.3632.0541-.2669.1504-.3632l3.2288-3.2278h-11.0736c-.13606 0-.26654-.0541-.36275-.15027-.0962-.0962-.15025-.22669-.15025-.36274 0-.13606.05405-.26654.15025-.36275.09621-.0962.22669-.15025.36275-.15025h11.0736l-3.2288-3.2278c-.0721-.07178-.1212-.16335-.1411-.2631s-.0097-.20316.0293-.2971z" fill="currentColor" fill-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </form>
      <div class="re-sub-feedback">Thank you for subscribing to Reflection Elite.</div>
    </div>

    <!-- Crypto Strip -->
    <div class="re-crypto-strip">
      <span class="re-crypto-text">Crypto currency accepted</span>
      <img
        src="https://reflectionelite.com/wp-content/uploads/2026/10/crypto_accepted_badge.png"
        alt="Cryptocurrency Accepted"
        class="re-crypto-badge"
        loading="lazy"
        width="180"
        height="24"
      >
    </div>
  </div>
</section>


<!-- ===================================================================== -->
<!-- SECTION 16: FREQUENTLY ASKED QUESTIONS (EXACT SHOPIFY ATELIER REPLICA) -->
<!-- ===================================================================== -->
<section id="re-faq-section" class="re-faq-container">
  <style>
    #re-faq-section {
      position: relative !important;
      width: 100vw !important;
      left: 50% !important;
      right: 50% !important;
      margin-left: -50vw !important;
      margin-right: -50vw !important;
      background-color: #000000 !important;
      padding: 95px 0 105px !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
      color: #ffffff !important;
      z-index: 5;
    }

    #re-faq-section * {
      box-sizing: border-box;
    }

    #re-faq-section .re-faq-inner {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 30px;
    }

    #re-faq-section .re-faq-main-title {
      font-family: 'Cinzel', Georgia, serif;
      font-size: clamp(2rem, 3.8vw, 42px);
      font-weight: 500;
      line-height: 1.25;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #ffffff;
      text-align: center;
      margin: 0 0 55px 0;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8);
    }

    /* Accordion */
    #re-faq-section .re-faq-accordion {
      border-top: 1px solid rgba(255, 255, 255, 0.15);
    }

    #re-faq-section .re-faq-item {
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      transition: background-color 0.3s ease;
    }

    #re-faq-section .re-faq-trigger {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 24px 8px;
      background: transparent;
      border: none;
      cursor: pointer;
      text-align: left;
      outline: none;
      color: #ffffff;
      transition: color 0.3s ease;
    }

    #re-faq-section .re-faq-trigger:hover,
    #re-faq-section .re-faq-item.active .re-faq-trigger {
      color: #d4a574;
    }

    #re-faq-section .re-faq-question {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 17px;
      font-weight: 500;
      letter-spacing: 0.04em;
      color: inherit;
      line-height: 1.4;
      margin: 0;
    }

    #re-faq-section .re-faq-caret {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      margin-left: 16px;
      transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), color 0.3s ease;
      color: inherit;
    }

    #re-faq-section .re-faq-item.active .re-faq-caret {
      transform: rotate(180deg);
    }

    #re-faq-section .re-faq-drawer {
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transition: max-height 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease, padding 0.3s ease;
      padding: 0 8px;
    }

    #re-faq-section .re-faq-item.active .re-faq-drawer {
      max-height: 260px;
      opacity: 1;
      padding: 0 8px 24px 8px;
    }

    #re-faq-section .re-faq-answer {
      font-family: 'Montserrat', -apple-system, sans-serif;
      font-size: 14.5px;
      font-weight: 400;
      line-height: 1.8;
      color: #bbbbbb;
      letter-spacing: 0.02em;
      margin: 0;
    }

    @media screen and (max-width: 749px) {
      #re-faq-section {
        padding: 60px 0 70px !important;
      }
      #re-faq-section .re-faq-inner {
        padding: 0 20px;
      }
      #re-faq-section .re-faq-main-title {
        font-size: 24px;
        margin-bottom: 35px;
      }
      #re-faq-section .re-faq-question {
        font-size: 15px;
      }
      #re-faq-section .re-faq-answer {
        font-size: 13.5px;
        line-height: 1.7;
      }
      #re-faq-section .re-faq-trigger {
        padding: 20px 4px;
      }
    }
  </style>

  <div class="re-faq-inner">
    <h3 class="re-faq-main-title">Frequently asked questions</h3>

    <div class="re-faq-accordion">
      
      <!-- FAQ 1 -->
      <div class="re-faq-item">
        <button class="re-faq-trigger" type="button" aria-expanded="false">
          <span class="re-faq-question">What is the return policy?</span>
          <span class="re-faq-caret">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 5.5L7 9.5L3 5.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </button>
        <div class="re-faq-drawer">
          <p class="re-faq-answer">Our goal is for every customer to be totally satisfied with their purchase. If this isn't the case, let us know and we'll do our best to work with you to make it right.</p>
        </div>
      </div>

      <!-- FAQ 2 -->
      <div class="re-faq-item">
        <button class="re-faq-trigger" type="button" aria-expanded="false">
          <span class="re-faq-question">Are any purchases final sale?</span>
          <span class="re-faq-caret">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 5.5L7 9.5L3 5.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </button>
        <div class="re-faq-drawer">
          <p class="re-faq-answer">We are unable to accept returns on certain items. These will be carefully marked before purchase.</p>
        </div>
      </div>

      <!-- FAQ 3 -->
      <div class="re-faq-item">
        <button class="re-faq-trigger" type="button" aria-expanded="false">
          <span class="re-faq-question">When will I get my order?</span>
          <span class="re-faq-caret">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 5.5L7 9.5L3 5.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </button>
        <div class="re-faq-drawer">
          <p class="re-faq-answer">We will work quickly to ship your order as soon as possible. Once your order has shipped, you will receive an email with further information. Delivery times vary depending on your location.</p>
        </div>
      </div>

      <!-- FAQ 4 -->
      <div class="re-faq-item">
        <button class="re-faq-trigger" type="button" aria-expanded="false">
          <span class="re-faq-question">Where are your products manufactured?</span>
          <span class="re-faq-caret">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 5.5L7 9.5L3 5.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </button>
        <div class="re-faq-drawer">
          <p class="re-faq-answer">Our products are manufactured both locally and globally. We carefully select our manufacturing partners to ensure our products are high quality and a fair value.</p>
        </div>
      </div>

      <!-- FAQ 5 -->
      <div class="re-faq-item">
        <button class="re-faq-trigger" type="button" aria-expanded="false">
          <span class="re-faq-question">How much does shipping cost?</span>
          <span class="re-faq-caret">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 5.5L7 9.5L3 5.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </button>
        <div class="re-faq-drawer">
          <p class="re-faq-answer">Shipping is calculated based on your location and the items in your order. You will always know the shipping price before you purchase.</p>
        </div>
      </div>

    </div>
  </div>

  <script>
    (function initFaqAccordion() {
      const faqSection = document.getElementById('re-faq-section');
      if (!faqSection) return;

      const items = faqSection.querySelectorAll('.re-faq-item');
      items.forEach(item => {
        const trigger = item.querySelector('.re-faq-trigger');
        if (!trigger) return;

        trigger.addEventListener('click', () => {
          const isActive = item.classList.contains('active');

          // Close all other items (Shopify accordion behavior)
          items.forEach(other => {
            other.classList.remove('active');
            const otherBtn = other.querySelector('.re-faq-trigger');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          });

          // Toggle current
          if (!isActive) {
            item.classList.add('active');
            trigger.setAttribute('aria-expanded', 'true');
          }
        });
      });
    })();
  </script>
</section>
`;

  const updatedContent = content.slice(0, insertionStart) + '\n' + finalThreeSectionsHtml.trim() + '\n\n' + content.slice(insertionEnd);

  console.log('2. Updating Page 68 via WordPress REST API with all 3 final sections...');
  const updateRes = await fetch(`${auth.siteUrl}/wp-json/wp/v2/pages/68`, {
    method: 'POST',
    headers: {
      'Cookie': auth.cookies,
      'X-WP-Nonce': auth.nonce,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content: updatedContent })
  });

  if (!updateRes.ok) {
    const errText = await updateRes.text();
    throw new Error(`Failed to update Page 68: HTTP ${updateRes.status} - ${errText}`);
  }

  console.log('✅ Page 68 successfully updated with the 3 Final Sections!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
