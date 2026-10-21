const WP_URL = 'https://reflectionelite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'process.env.PROD_WP_APP_PASS || "[REDACTED]"';
const auth = { 
  Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64')}`,
  'Content-Type': 'application/json' 
};

// 1. PRIVACY POLICY HTML (Page ID 102)
export function generatePrivacyPolicyHtml() {
  return `<div class="re-policy-page-wrapper">
  <div class="re-policy-hero">
    <div class="re-catalog-breadcrumb">HOME / PRIVACY POLICY</div>
    <div class="re-sub-title-accent">&mdash; CLIENT CONFIDENTIALITY &amp; DATA PROTECTION &mdash;</div>
    <h1 class="re-policy-title">Privacy Policy</h1>
    <div class="re-gold-divider-mini"></div>
    <p class="re-policy-hero-sub">Our commitment to protecting your personal information and architectural project specifications.</p>
  </div>

  <div class="re-policy-card">
    <p class="re-policy-lead"><strong class="re-dark-accent">Reflection Elite</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is dedicated to safeguarding the privacy and confidentiality of our esteemed patrons, architects, and interior designers. This Privacy Policy outlines how your personal information is collected, used, and protected when you visit or make a purchase from <a href="https://reflectionelite.com" class="re-gold-link">reflectionelite.com</a>.</p>

    <h2 class="re-policy-heading">Information We Collect</h2>
    <p class="re-policy-text">When you place an order or commission a bespoke mirror, we collect necessary billing and dispatch details including your full name, shipping address, 6-digit Indian PIN code, mobile contact number, and email address. Payment credentials processed via Razorpay or UPI are encrypted and handled securely by authorized banking partners; we do not store raw card numbers or UPI PINs.</p>

    <h2 class="re-policy-heading">How We Use Your Information</h2>
    <ul class="re-policy-list">
      <li>To fabricate, inspect, package, and safely dispatch your bespoke mirror in reinforced wooden crates.</li>
      <li>To send insured transit tracking notifications and direct WhatsApp delivery updates.</li>
      <li>To provide responsive customer service and concierge consultation for custom architectural dimensions.</li>
    </ul>

    <h2 class="re-policy-heading">Atelier Concierge Contact</h2>
    <p class="re-policy-text">For questions regarding your data or our practices, contact our atelier lead at:</p>
    <div class="re-policy-atelier-box">
      <strong class="re-dark-accent">Reflection Elite (KGN GLASS)</strong><br>
      Saligaon Road, Parra, Goa &ndash; 403510, India<br>
      Email: <a href="mailto:reflectionelite.com@gmail.com" class="re-gold-link">reflectionelite.com@gmail.com</a><br>
      WhatsApp Support: <a href="https://wa.me/917387463103" class="re-gold-link"><strong>+91 7387463103</strong></a>
    </div>
  </div>
</div>`;
}

// 2. REFUND & RETURNS POLICY HTML (Page ID 103)
export function generateRefundReturnsHtml() {
  return `<div class="re-policy-page-wrapper">
  <div class="re-policy-hero">
    <div class="re-catalog-breadcrumb">HOME / REFUND &amp; RETURNS</div>
    <div class="re-sub-title-accent">&mdash; CLIENT SATISFACTION &amp; TRANSIT ASSURANCE &mdash;</div>
    <h1 class="re-policy-title">Refund &amp; Returns Policy</h1>
    <div class="re-gold-divider-mini"></div>
    <p class="re-policy-hero-sub">Our clear policies on insured transit protection, bespoke orders, and immediate replacements.</p>
  </div>

  <div class="re-policy-card">
    <p class="re-policy-lead">At <strong class="re-dark-accent">Reflection Elite</strong>, every luxury Venetian mirror and bespoke glass creation is crafted to the highest standards of architectural excellence and encased in reinforced wooden crates designed to withstand transit across India.</p>

    <h2 class="re-policy-heading">100% Zero-Breakage Transit Guarantee</h2>
    <p class="re-policy-text">Every shipment is fully insured against all transit damage. In the unlikely event that your mirror arrives with glass fractures, scratches, or crating damage:</p>
    <ul class="re-policy-list">
      <li>Please inspect the crate upon delivery and record an unboxing video or take high-resolution photographs of the damage.</li>
      <li>Notify our workshop concierge via WhatsApp at <a href="https://wa.me/917387463103" class="re-gold-link"><strong>+91 7387463103</strong></a> or email <a href="mailto:reflectionelite.com@gmail.com" class="re-gold-link">reflectionelite.com@gmail.com</a> within <strong>48 hours</strong> of receipt.</li>
      <li>We will fabricate and dispatch an immediate brand-new replacement at zero additional charge to you, or issue a 100% full refund upon verification.</li>
    </ul>

    <h2 class="re-policy-heading">Bespoke &amp; Custom Orders</h2>
    <p class="re-policy-text">Because each made-to-measure mirror is custom carved to your exact millimetric requirements, change-of-mind cancellations cannot be accepted once glass cutting has commenced. However, our 100% quality and transit replacement guarantee applies unconditionally to all custom commissions.</p>

    <div class="re-policy-atelier-box">
      <strong class="re-dark-accent">Immediate Assistance:</strong><br>
      WhatsApp Concierge: <a href="https://wa.me/917387463103" class="re-gold-link"><strong>+91 7387463103</strong></a><br>
      Email Support: <a href="mailto:reflectionelite.com@gmail.com" class="re-gold-link">reflectionelite.com@gmail.com</a>
    </div>
  </div>
</div>`;
}

export async function deployPolicies() {
  console.log('=== DEPLOYING LUXURY EDITORIAL POLICY PAGES ===\n');

  // Page 102
  console.log('1. Updating Page 102 (Privacy Policy)...');
  const res102 = await fetch(`${WP_URL}/wp-json/wp/v2/pages/102`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      title: 'Privacy Policy',
      content: generatePrivacyPolicyHtml(),
      status: 'publish'
    })
  });
  if (res102.ok) {
    console.log('[SUCCESS] Page 102 (Privacy Policy) updated!');
  } else {
    console.error('Failed to update Page 102:', res102.status, await res102.text());
  }

  // Page 103
  console.log('2. Updating Page 103 (Refund & Returns Policy)...');
  const res103 = await fetch(`${WP_URL}/wp-json/wp/v2/pages/103`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      title: 'Refund & Returns Policy',
      content: generateRefundReturnsHtml(),
      status: 'publish'
    })
  });
  if (res103.ok) {
    console.log('[SUCCESS] Page 103 (Refund & Returns Policy) updated!');
  } else {
    console.error('Failed to update Page 103:', res103.status, await res103.text());
  }
}

if (process.argv[1]?.endsWith('deploy_policies_luxury.js')) {
  deployPolicies().catch(console.error);
}
