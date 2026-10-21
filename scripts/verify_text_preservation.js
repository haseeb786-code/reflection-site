const PROD_URL = 'https://reflectionelite.com';

async function main() {
  console.log('=== VERIFYING TEXT PRESERVATION ON ABOUT US & CONTACT ===');
  
  // 1. About Us
  const aboutRes = await fetch(`${PROD_URL}/about-us/?v=` + Date.now());
  const aboutHtml = await aboutRes.text();
  
  const aboutSnippets = [
    'WHERE REFLECTION BECOMES ART',
    'Bespoke Venetian Mirrors & Architectural Glass',
    'The Origins of Reflection Elite',
    'Reflection Elite was founded with a single, uncompromising vision: to revive the centuries-old art of Venetian glassmaking and bring architectural mirror craftsmanship into the modern luxury home',
    'Every mirror in our atelier begins not as a mass-produced panel, but as a hand-selected sheet of ultra-clear architectural glass',
    'From our dedicated workshop, our master artisans hand-bevel, bevel-cut, antique, and mirror-coat each piece individually',
    'Why Discerning Clients Choose Our Atelier',
    '100% Handcrafted Venetian Heritage',
    'Custom Laser-Templated Sizing',
    'Museum-Grade Antiquing',
    'Turnkey Luxury Installation',
    'Our 5-Stage Artisan Journey',
    'Consultation & Brief',
    'Laser Templating',
    'Atelier Crafting',
    'Multi-Stage Inspection',
    'White-Glove Delivery',
    'Visit Our Atelier & Design Studio',
    'Schedule a Private Studio Appointment'
  ];

  let aboutAllFound = true;
  for (const s of aboutSnippets) {
    const found = aboutHtml.includes(s);
    console.log(`[About Us] [${found ? 'PASS' : 'FAIL'}] "${s.slice(0, 40)}..."`);
    if (!found) aboutAllFound = false;
  }

  // 2. Contact
  const contactRes = await fetch(`${PROD_URL}/contact/?v=` + Date.now());
  const contactHtml = await contactRes.text();

  const contactSnippets = [
    'CONNECT WITH OUR ATELIER',
    'Direct Consultation, Laser Templating Bookings & Bespoke Inquiries',
    'Direct Phone & WhatsApp',
    'Atelier Studio Location',
    'Email Consultation',
    'Operating Hours',
    'Send an Atelier Inquiry',
    'Tell Us About Your Project',
    'Full Name',
    'Email Address',
    'Phone / WhatsApp',
    'Project Type / Mirror Style',
    'Approximate Dimensions & Special Requirements',
    'SUBMIT ATELIER INQUIRY',
    'Frequently Asked Questions',
    'How do I schedule a laser templating survey?',
    'What is your standard production lead time?',
    'Can you create custom shapes or reproduce vintage designs?',
    'Do you deliver and install outside our primary service area?'
  ];

  let contactAllFound = true;
  for (const s of contactSnippets) {
    const found = contactHtml.includes(s);
    console.log(`[Contact] [${found ? 'PASS' : 'FAIL'}] "${s.slice(0, 40)}..."`);
    if (!found) contactAllFound = false;
  }

  console.log('\n======================================================');
  console.log(`About Us text preserved: ${aboutAllFound ? 'YES - 100%' : 'NO'}`);
  console.log(`Contact text preserved: ${contactAllFound ? 'YES - 100%' : 'NO'}`);
  console.log('======================================================');
}

main().catch(console.error);
