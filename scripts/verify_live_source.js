const PROD_URL = 'https://reflectionelite.com';

async function verifyShop() {
  console.log('=== VERIFYING /shop/ RAW HTML ===');
  const res = await fetch(`${PROD_URL}/shop/?v=` + Date.now());
  const html = await res.text();

  const checks = [
    { name: '<p class="woocommerce-result-count"> HTML element', pattern: /<p[^>]*class="[^"]*woocommerce-result-count/i, shouldExist: false },
    { name: '<form class="woocommerce-ordering"> HTML element', pattern: /<form[^>]*class="[^"]*woocommerce-ordering/i, shouldExist: false },
    { name: 'Junk product text: High Strength Metal Materials', pattern: /High Strength Metal Materials/i, shouldExist: false },
    { name: 'Native archive <ul class="products ..."> HTML element', pattern: /<ul[^>]*class="[^"]*products[^"]*"[^>]*>/i, shouldExist: false },
    { name: 'No products were found matching your selection', pattern: /No products were found/i, shouldExist: false },
    { name: 'Shop Hero H1 (THE ARTISAN COLLECTION)', pattern: /<h1>\s*THE ARTISAN COLLECTION\s*<\/h1>/i, shouldExist: true },
    { name: 'Curated card: ANTIQUE VENETIAN CUSHION', pattern: /ANTIQUE VENETIAN CUSHION/i, shouldExist: true },
    { name: 'Curated card: MODERN VICTORIAN', pattern: /MODERN VICTORIAN/i, shouldExist: true },
    { name: 'Curated card: SILVER CROWN FRAMED', pattern: /SILVER CROWN FRAMED/i, shouldExist: true },
    { name: 'Curated card: ROCOCO FLORAL', pattern: /ROCOCO FLORAL/i, shouldExist: true },
    { name: 'Curated card: MOSAIC MIRROR ART', pattern: /MOSAIC MIRROR ART/i, shouldExist: true },
    { name: 'Curated card: PREMIUM UPHOLSTERED FRAME', pattern: /PREMIUM UPHOLSTERED FRAME/i, shouldExist: true },
    { name: 'Curated card: CUSTOMISED MIRROR', pattern: /CUSTOMISED MIRROR/i, shouldExist: true },
    { name: 'Unified Header', pattern: /re-unified-header-container/i, shouldExist: true },
    { name: 'Unified Footer', pattern: /re-unified-footer-container/i, shouldExist: true },
    { name: 'Master WPCode CSS in head', pattern: /id="te-global-luxury-system"/i, shouldExist: true },
    { name: 'Shine sweep CSS animation', pattern: /shine-sweep/i, shouldExist: true }
  ];

  let shopPassed = true;
  for (const c of checks) {
    const found = c.pattern.test(html);
    const pass = found === c.shouldExist;
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${c.name} (found: ${found}, expected: ${c.shouldExist})`);
    if (!pass) shopPassed = false;
  }

  // Count curated cards
  const curatedCards = [...html.matchAll(/class="[^"]*luxury-card[^"]*"/g)].length;
  console.log(`Curated luxury-card count: ${curatedCards} (Expected: 7)`);
  if (curatedCards !== 7) shopPassed = false;

  return shopPassed;
}

async function verifyPage(slug, title, requiredClasses) {
  console.log(`\n=== VERIFYING /${slug}/ RAW HTML ===`);
  const res = await fetch(`${PROD_URL}/${slug}/?v=` + Date.now());
  const html = await res.text();

  console.log(`HTTP Status: ${res.status}`);
  const hasCss = html.includes('id="te-global-luxury-system"');
  console.log(`[${hasCss ? 'PASS' : 'FAIL'}] Master WPCode CSS in head: ${hasCss}`);

  let allClassPassed = true;
  for (const cls of requiredClasses) {
    const inHtml = html.includes(cls);
    console.log(`[${inHtml ? 'PASS' : 'FAIL'}] Class "${cls}" in page HTML: ${inHtml}`);
    if (!inHtml) allClassPassed = false;
  }

  return hasCss && allClassPassed;
}

async function main() {
  const shopOk = await verifyShop();

  const aboutOk = await verifyPage('about-us', 'About Us', [
    're-story-page-wrapper',
    're-story-hero',
    're-story-title',
    're-story-origins-section',
    're-story-pillars-grid',
    're-story-journey-section',
    're-story-studio-card'
  ]);

  const contactOk = await verifyPage('contact', 'Contact', [
    're-contact-page-wrapper',
    're-contact-hero',
    're-contact-title',
    're-contact-cards-grid',
    're-contact-inquiry-container',
    're-contact-faq-section'
  ]);

  const customOk = await verifyPage('custom-dimensions', 'Custom Dimensions', [
    're-dedicated-bespoke-wrapper',
    're-bespoke-glass-panel',
    're-bespoke-heading'
  ]);

  const policyOk = await verifyPage('privacy-policy-2', 'Privacy Policy', [
    're-policy-page-wrapper',
    're-policy-hero',
    're-policy-title',
    're-policy-card'
  ]);

  console.log('\n======================================================');
  console.log(`VERIFICATION SUMMARY:`);
  console.log(`/shop/: ${shopOk ? 'ALL PASS' : 'FAILED'}`);
  console.log(`/about-us/: ${aboutOk ? 'ALL PASS' : 'FAILED'}`);
  console.log(`/contact/: ${contactOk ? 'ALL PASS' : 'FAILED'}`);
  console.log(`/custom-dimensions/: ${customOk ? 'ALL PASS' : 'FAILED'}`);
  console.log(`/privacy-policy-2/: ${policyOk ? 'ALL PASS' : 'FAILED'}`);
  console.log('======================================================');
}

main().catch(console.error);
