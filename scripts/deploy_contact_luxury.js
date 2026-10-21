import { generateGlobalCss } from './generate_luxury_css.js';
import { generateGlobalFooterScript } from './deploy_reflection_elite_luxury_redesign.js';

const WP_URL = 'https://reflectionelite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'process.env.PROD_WP_APP_PASS || "[REDACTED]"';
const auth = { 
  Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64')}`,
  'Content-Type': 'application/json' 
};

// GENERATE LUXURY EDITORIAL "CONTACT & BESPOKE ATELIER CONCIERGE" HTML (Page ID 52)
// Designed in accordance with Reflection Elite luxury visual design system:
// Warm ivory (#F7F1E8), champagne gold (#C7A15A), deep espresso (#2A170D), warm walnut (#68462E)
export function generateContactHtml() {
  return `<div class="re-contact-page-wrapper"><div class="re-contact-hero"><div class="re-catalog-breadcrumb">HOME / CONTACT</div><div class="re-sub-title-accent">&mdash; BESPOKE CONCIERGE &amp; ATELIER SUPPORT &mdash;</div><h1 class="re-contact-title">Connect with <span class="re-serif-italic">Reflection Elite</span></h1><p class="re-contact-hero-sub">Whether you wish to commission a bespoke made-to-measure mirror, discuss architectural blueprints for your villa, or inquire about an existing order, our master glassmakers and concierge team are at your service.</p></div><div class="re-contact-inner-container"><div class="re-contact-cards-grid"><div class="re-contact-card"><div class="re-contact-card-top"><div class="re-contact-icon-badge">&#128172;</div><h3 class="re-contact-card-title">WhatsApp Concierge</h3><p class="re-contact-card-desc">Direct line to our workshop master. Instant replies for custom sizing, order tracking, and high-resolution video consultations.</p><div class="re-contact-highlight">+91 7387463103</div></div><div class="re-contact-card-action"><a href="https://wa.me/917387463103?text=Hi%20Reflection%20Elite%2C%20I%20would%20like%20to%20inquire%20about%20your%20luxury%20mirrors." target="_blank" rel="noopener noreferrer" class="re-btn-primary">CHAT ON WHATSAPP &rarr;</a></div></div><div class="re-contact-card"><div class="re-contact-card-top"><div class="re-contact-icon-badge">&#9993;&#65039;</div><h3 class="re-contact-card-title">Email Atelier</h3><p class="re-contact-card-desc">Send official trade inquiries, architectural drawings, commercial hospitality RFQs, or billing correspondence.</p><div class="re-contact-highlight-email">reflectionelite.com@gmail.com</div></div><div class="re-contact-card-action"><a href="mailto:reflectionelite.com@gmail.com?subject=Reflection%20Elite%20Atelier%20Inquiry" class="re-btn-secondary">SEND EMAIL INQUIRY &rarr;</a></div></div><div class="re-contact-card"><div class="re-contact-card-top"><div class="re-contact-icon-badge">&#128205;</div><h3 class="re-contact-card-title">Studio &amp; Workshop</h3><p class="re-contact-card-desc"><strong class="re-dark-accent">Reflection Elite (KGN GLASS)</strong><br>On the way of Saligaon Road, Parra,<br>Goa &ndash; 403510, India</p><div class="re-contact-hours">Mon &ndash; Sat: 10:00 AM &ndash; 8:00 PM IST</div></div><div class="re-contact-card-action"><a href="https://maps.google.com/?q=15.5652917,73.7909758" target="_blank" rel="noopener noreferrer" class="re-btn-secondary">VIEW STUDIO LOCATION &#8599;</a></div></div><div class="re-contact-card"><div class="re-contact-card-top"><div class="re-contact-icon-badge">&#128737;&#65039;</div><h3 class="re-contact-card-title">Safe Freight Pan-India</h3><p class="re-contact-card-desc">Specialized fragile handling with heavy-duty bolted pine wooden crating. 100% Zero-Breakage Guarantee across every Indian state.</p><div class="re-contact-hours">Dispatched with Insured Tracking Updates</div></div><div class="re-contact-card-action"><a href="/shop/" class="re-btn-secondary">EXPLORE CATALOG &rarr;</a></div></div></div><div class="re-contact-inquiry-container"><div class="re-inquiry-header"><div class="re-sub-title-accent">&mdash; DIRECT WORKSHOP INQUIRY &mdash;</div><h2 class="re-inquiry-heading">Request a Custom Size or Architectural Consultation</h2><div class="re-gold-divider-mini"></div><p class="re-inquiry-sub">Need bespoke dimensions for your powder room, grand foyer, or hospitality suite? Submit your specifications below to initiate a direct pre-filled WhatsApp consultation with our lead artisan.</p></div><div class="re-inquiry-form-card"><div class="re-form-row-2"><div class="re-form-group"><label class="re-form-label" for="contact_name">Your Name</label><input type="text" id="contact_name" class="re-form-input" placeholder="e.g. Mohammad Kaif" required /></div><div class="re-form-group"><label class="re-form-label" for="contact_phone">Phone / WhatsApp Number</label><input type="tel" id="contact_phone" class="re-form-input" placeholder="e.g. +91 98765 43210" required /></div></div><div class="re-form-group"><label class="re-form-label" for="contact_type">Inquiry Type</label><select id="contact_type" class="re-form-select"><option value="Bespoke Sizing &amp; Dimensions">Bespoke / Custom Mirror Sizing</option><option value="Existing Order Status">Existing Order Inquiry &amp; Tracking</option><option value="Interior Designer / Architect Commission">Interior Designer / Architect Commission</option><option value="Payment / 50% Advance Question">Payment &amp; 50% Advance Inquiry</option><option value="General Inquiry">General Product Inquiry</option></select></div><div class="re-form-group"><label class="re-form-label" for="contact_message">Message &amp; Dimensions</label><textarea id="contact_message" class="re-form-textarea" rows="4" placeholder="Describe your preferred mirror model, wall dimensions (e.g. 48 x 32 inches), finish, or architectural requirements..."></textarea></div><button type="button" onclick="sendContactWhatsApp()" class="re-btn-whatsapp-submit"><svg class="re-btn-icon-wa" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.06-2.146-.541-1.854-.77-3.047-2.662-3.14-2.785-.092-.122-.741-.986-.741-1.88 0-.895.469-1.334.636-1.516.166-.182.365-.228.487-.228.122 0 .243.002.349.006.111.005.26-.042.406.31.15.362.512 1.248.558 1.339.045.091.076.197.015.319-.06.121-.091.197-.182.303-.091.106-.192.237-.274.319-.092.091-.188.19-.081.373.106.183.473.78 1.014 1.262.697.621 1.285.813 1.468.904.182.091.289.076.395-.045.106-.122.456-.531.577-.714.122-.182.243-.152.41-.091s1.063.501 1.245.592c.182.091.303.137.349.213.045.076.045.441-.099.846zm-3.392-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.88l-1.304 4.76 4.877-1.278c1.401.764 3.003 1.198 4.703 1.198 5.523 0 10-4.477 10-10 0-5.522-4.477-10-10-10z"/></svg><span>SEND INQUIRY ON WHATSAPP (+91 7387463103) &rarr;</span></button></div></div><div class="re-contact-faq-section"><div class="re-section-header"><div class="re-sub-title-accent">&mdash; CLIENT GUIDANCE &mdash;</div><h2 class="re-section-title">Frequently Asked Questions</h2><div class="re-gold-divider"></div></div><div class="re-faq-grid"><div class="re-faq-card"><h4 class="re-faq-card-title">How does the 50% Advance work?</h4><p class="re-faq-card-desc">Because all our luxury mirrors are handcrafted to order, you can pay a 50% advance via Razorpay number <strong class="re-gold-text">917387463103</strong> to commence glass cutting and polishing. The remaining 50% balance is settled upon delivery.</p></div><div class="re-faq-card"><h4 class="re-faq-card-title">What if my mirror is damaged in transit?</h4><p class="re-faq-card-desc">Every shipment is encased in heavy-duty bolted wooden crates. In the rare event of transit damage, simply record an unboxing video and share it with us on WhatsApp within 48 hours for a 100% free immediate replacement or full refund.</p></div><div class="re-faq-card"><h4 class="re-faq-card-title">Can I customize mirror dimensions?</h4><p class="re-faq-card-desc">Yes! All Venetian, Murano, and LED mirrors can be tailored to exact millimetric dimensions for your bathrooms, vanities, or living room foyers. Contact our design concierge on WhatsApp with your blueprints.</p></div><div class="re-faq-card"><h4 class="re-faq-card-title">How long does fabrication and delivery take?</h4><p class="re-faq-card-desc">In-stock mirrors dispatch in 2&ndash;4 business days. Bespoke handcrafted pieces take 7&ndash;10 business days for artisanal glass cutting and polishing. Transit across metro Indian cities takes 3&ndash;6 days via insured fragile freight.</p></div></div></div></div></div>

<script>
function sendContactWhatsApp() {
  var name = document.getElementById('contact_name').value || 'Customer';
  var phone = document.getElementById('contact_phone').value || 'Not provided';
  var type = document.getElementById('contact_type').value || 'General';
  var msg = document.getElementById('contact_message').value || 'I am interested in Reflection Elite mirrors.';

  var text = "Hi Reflection Elite,%0A%0A*Name:* " + encodeURIComponent(name) + 
             "%0A*Phone:* " + encodeURIComponent(phone) + 
             "%0A*Inquiry:* " + encodeURIComponent(type) + 
             "%0A*Details:* " + encodeURIComponent(msg);

  window.open("https://wa.me/917387463103?text=" + text, "_blank");
}
</script>`;
}

export async function deployContactPage() {
  console.log('=== DEPLOYING CONTACT LUXURY EDITORIAL REDESIGN (PAGE ID 52) ===\n');

  console.log('1. Updating Page 52 (Contact)...');
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/pages/52`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      title: 'Contact',
      content: generateContactHtml(),
      status: 'publish'
    })
  });

  if (res.ok) {
    console.log('[SUCCESS] Page 52 (Contact) updated with luxury warm ivory & gold editorial theme!');
  } else {
    console.error('Failed to update page 52:', res.status, await res.text());
    process.exit(1);
  }
}

// When run directly
if (process.argv[1]?.endsWith('deploy_contact_luxury.js')) {
  deployContactPage().catch(console.error);
}
