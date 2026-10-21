import { generateGlobalCss } from './generate_luxury_css.js';
import { generateGlobalFooterScript } from './deploy_reflection_elite_luxury_redesign.js';

const WP_URL = 'https://reflectionelite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'process.env.PROD_WP_APP_PASS || "[REDACTED]"';
const auth = { 
  Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64')}`,
  'Content-Type': 'application/json' 
};

// GENERATE LUXURY EDITORIAL "OUR STORY" HTML (Page ID 50)
// Designed with warm ivory (#F7F1E8), champagne gold (#C7A15A), deep espresso (#2A170D)
function generateOurStoryHtml() {
  return `<div class="re-story-page-wrapper"><div class="re-story-hero"><div class="re-catalog-breadcrumb">HOME / OUR STORY</div><div class="re-sub-title-accent">&mdash; HERITAGE ITALIAN &amp; VENETIAN CRAFTSMANSHIP &mdash;</div><h1 class="re-story-title">The Story of <span class="re-serif-italic">Reflection Elite</span></h1><p class="re-story-hero-sub">Born from a reverence for the centuries-old glassmaking traditions of Venice and Murano, Reflection Elite creates museum-grade architectural mirrors that transform living spaces into realms of quiet grandeur and light.</p></div><div class="re-story-inner-container"><div class="re-story-origins-section"><div class="re-story-origins-text"><div class="re-eyebrow-wrap"><span class="re-eyebrow-line"></span><span class="re-eyebrow">OUR ATELIER ORIGINS</span></div><h2 class="re-story-section-heading">Reviving Renaissance Glass Art for <span class="re-serif-italic">Modern Luxury Living</span></h2><p class="re-story-paragraph">Founded by <strong class="re-dark-accent">Mohammad Kaif</strong> at our atelier in Parra, Goa, Reflection Elite was founded with a single uncompromising mission: to liberate luxury homeowners and designers from fragile, mass-produced commercial glass and restore the tactile majesty of authentic hand-beveled Venetian mirrors.</p><p class="re-story-paragraph">Every Reflection Elite creation begins with 4&ndash;5mm distortion-free optical float glass. Each bevel, rosette, cushion border, and floral scroll is hand-ground and polished by master artisans using traditional diamond-grit techniques. Sealed with moisture-impervious backing, our mirrors are built to endure decades without silvering oxidation or coastal tarnish.</p><div class="re-story-cta-group"><a href="/shop/" class="re-btn-primary">EXPLORE COLLECTION &rarr;</a><a href="https://wa.me/917387463103?text=Hi%20Mohammad%20Kaif%2C%20I%20would%20like%20to%20discuss%20a%20mirror%20commission." target="_blank" rel="noopener noreferrer" class="re-btn-link">Speak with Atelier Lead &#8599;</a></div></div><div class="re-story-highlights-card"><h3 class="re-highlights-card-title">Atelier Standards of Distinction</h3><div class="re-gold-divider-mini"></div><ul class="re-highlights-list"><li class="re-highlight-item"><span class="re-highlight-icon">&#9878;&#65039;</span><div><strong class="re-highlight-bold">4&ndash;5mm High-Clarity Float Glass:</strong> Zero optical distortion with razor-sharp reflection fidelity.</div></li><li class="re-highlight-item"><span class="re-highlight-icon">&#128737;&#65039;</span><div><strong class="re-highlight-bold">Anti-Humidity Sealed Backing:</strong> High-density moisture-resistant MDF shields against humidity, steam, and oxidation.</div></li><li class="re-highlight-item"><span class="re-highlight-icon">&#128230;</span><div><strong class="re-highlight-bold">Bolted Reinforced Wooden Crating:</strong> Multi-layer shock-dampening transit packaging ensuring 100% zero glass breakage.</div></li><li class="re-highlight-item"><span class="re-highlight-icon">&#128179;</span><div><strong class="re-highlight-bold">50% Advance Handcrafted Flexibility:</strong> Pay 50% to initiate custom build, balance upon doorstep arrival.</div></li><li class="re-highlight-item"><span class="re-highlight-icon">&#128208;</span><div><strong class="re-highlight-bold">Made-to-Measure Tailoring:</strong> Custom sizing for grand foyers, luxury master baths, and boutique hotel suites.</div></li></ul></div></div><div class="re-story-pillars-section"><div class="re-section-header"><div class="re-sub-title-accent">&mdash; STANDARDS OF DISTINCTION &mdash;</div><h2 class="re-section-title">The Four Pillars of Reflection Elite</h2><div class="re-gold-divider"></div></div><div class="re-story-pillars-grid"><div class="re-story-pillar-card"><div class="re-pillar-icon-badge">&#127912;</div><h3 class="re-pillar-title">Artisanal Venetian Beveling</h3><p class="re-pillar-desc">Elaborate cushion cuts, scalloped edges, and floral rosettes hand-carved by veteran glass craftsmen with decades of heritage.</p></div><div class="re-story-pillar-card"><div class="re-pillar-icon-badge">&#128300;</div><h3 class="re-pillar-title">Engineered Longevity</h3><p class="re-pillar-desc">Pure silver reflective deposition shielded by hydrophobic anti-corrosion sealant. Zero black spots even in high-humidity master bathrooms.</p></div><div class="re-story-pillar-card"><div class="re-pillar-icon-badge">&#128230;</div><h3 class="re-pillar-title">Fortified Crated Transit</h3><p class="re-pillar-desc">Every piece travels in high-density foam cushions inside a bolted industrial pine-wood crate for zero transit breakage to any Indian pincode.</p></div><div class="re-story-pillar-card"><div class="re-pillar-icon-badge">&#128142;</div><h3 class="re-pillar-title">White-Glove Concierge</h3><p class="re-pillar-desc">Direct WhatsApp consultation from blueprint conception through installation support. We stand behind every mirror with pride.</p></div></div></div><div class="re-story-journey-section"><div class="re-section-header"><div class="re-sub-title-accent">&mdash; FROM GLASS TO MASTERPIECE &mdash;</div><h2 class="re-section-title">The Making of a Reflection Elite Mirror</h2><div class="re-gold-divider"></div></div><div class="re-story-journey-grid"><div class="re-journey-step-card"><div class="re-journey-step-num">01</div><h4 class="re-journey-step-title">Diamond Precision Cut</h4><p class="re-journey-step-desc">Ultra-clear float glass scored and cut to exact millimetric dimensions.</p></div><div class="re-journey-step-card"><div class="re-journey-step-num">02</div><h4 class="re-journey-step-title">Hand-Beveled Grinding</h4><p class="re-journey-step-desc">Multi-tier water-cooled diamond wheel beveling creates prismatic light refraction.</p></div><div class="re-journey-step-card"><div class="re-journey-step-num">03</div><h4 class="re-journey-step-title">Venetian Etching</h4><p class="re-journey-step-desc">Floral rosettes, cushion crowns, and corner accents etched with classical motifs.</p></div><div class="re-journey-step-card"><div class="re-journey-step-num">04</div><h4 class="re-journey-step-title">Dual-Layer Moisture Seal</h4><p class="re-journey-step-desc">Hydrophobic coating bonded to heavy-gauge moisture-resistant backboard.</p></div><div class="re-journey-step-card"><div class="re-journey-step-num">05</div><h4 class="re-journey-step-title">Bolted Crate Dispatch</h4><p class="re-journey-step-desc">Encased in reinforced wooden crates and dispatched with insured pan-India tracking.</p></div></div></div><div class="re-story-studio-card"><div class="re-sub-title-accent">&mdash; GOA ATELIER &amp; DESIGN SUITE &mdash;</div><h2 class="re-studio-card-heading">Visit Our Design Studio in Goa</h2><div class="re-gold-divider"></div><p class="re-studio-card-address"><strong class="re-studio-bold">Reflection Elite (KGN GLASS)</strong><br>On the way of Saligaon Road, Parra, Goa &ndash; 403510, India<br>Phone &amp; WhatsApp: <strong class="re-studio-contact">+91 7387463103</strong> &middot; Email: <strong class="re-studio-contact">reflectionelite.com@gmail.com</strong></p><div class="re-studio-btn-group"><a href="/shop/" class="re-btn-primary">VIEW MIRROR COLLECTION &rarr;</a><a href="https://wa.me/917387463103?text=Hi%20Reflection%20Elite%2C%20I%20would%20like%20to%20consult%20about%20a%20mirror." target="_blank" rel="noopener noreferrer" class="re-btn-outline-gold">Chat on WhatsApp (+91 7387463103) &#8599;</a></div></div></div></div>`;
}

async function deployStoryPage() {
  console.log('=== DEPLOYING OUR STORY LUXURY EDITORIAL REDESIGN ===\n');

  // STEP 1: Update Page 50 (About Us / Our Story)
  console.log('1. Updating Page 50 (About Us / Our Story)...');
  const storyRes = await fetch(`${WP_URL}/wp-json/wp/v2/pages/50`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      title: 'Our Story',
      content: generateOurStoryHtml(),
      status: 'publish'
    })
  });

  if (storyRes.ok) {
    console.log('[SUCCESS] Page 50 (Our Story) updated with luxury warm ivory & gold editorial theme!');
  } else {
    console.error('Failed to update page 50:', storyRes.status, await storyRes.text());
    process.exit(1);
  }

  // STEP 2: Update WPCode with fresh CSS including .re-story-* styles
  console.log('\n2. Updating WPCode with updated luxury CSS...');
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
  formBody.append('ihaf_insert_header', generateGlobalCss());
  formBody.append('ihaf_insert_body', '');
  formBody.append('ihaf_insert_footer', generateGlobalFooterScript());

  const saveRes = await fetch(`${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': allCookies
    },
    body: formBody.toString(),
    redirect: 'manual'
  });

  console.log(`[SUCCESS] WPCode updated with Our Story luxury CSS (HTTP ${saveRes.status})`);

  console.log('\n========================================================');
  console.log('Our Story Luxury Redesign Deployed Successfully!');
  console.log('URL: https://reflectionelite.com/about-us/');
  console.log('========================================================\n');
}

deployStoryPage().catch(console.error);
