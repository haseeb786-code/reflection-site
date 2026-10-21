import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'process.env.PROD_WP_APP_PASS || "[REDACTED]"';
const auth = { 
  Authorization: 'Basic ' + Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64'),
  'Content-Type': 'application/json' 
};

function generateContactHtml() {
  return `
<!-- HERO SECTION -->
<div style="background: radial-gradient(circle at 50% 20%, #1a2233 0%, #0c111a 60%, #06090e 100%); border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 16px; padding: 60px 24px; margin-bottom: 50px; text-align: center; box-shadow: 0 15px 40px rgba(0,0,0,0.7), 0 0 30px rgba(212, 175, 55, 0.1);">
  <div style="max-width: 820px; margin: 0 auto;">
    <span style="display: inline-block; background: rgba(212, 175, 55, 0.12); color: #d4af37; border: 1px solid rgba(212, 175, 55, 0.35); padding: 6px 18px; border-radius: 50px; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 18px; font-family: 'Cinzel', serif;">
      ★ Bespoke Concierge &amp; Atelier Support ★
    </span>
    <h1 style="font-family: 'Cinzel', serif; font-size: clamp(28px, 4.5vw, 46px); font-weight: 800; line-height: 1.2; margin: 0 0 16px 0; color: #ffffff; letter-spacing: 1px;">
      Connect with Reflection Elite
    </h1>
    <p style="font-family: 'Montserrat', sans-serif; font-size: 16px; line-height: 1.7; color: #cbd5e1; margin: 0 auto; max-width: 680px; font-weight: 300;">
      Whether you wish to commission a bespoke made-to-measure mirror, discuss architectural dimensions for your villa, or inquire about an existing order, our master glassmakers and concierge team are at your service.
    </p>
  </div>
</div>

<!-- 4 ESSENTIAL CONTACT CHANNELS -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-bottom: 50px;">
  
  <!-- WhatsApp Hotline Card -->
  <div style="background: #121722; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 14px; padding: 28px 22px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5); display: flex; flex-direction: column; justify-content: space-between;">
    <div>
      <div style="font-size: 34px; margin-bottom: 12px;">💬</div>
      <h3 style="font-family: 'Cinzel', serif; font-size: 18px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0;">WhatsApp Concierge</h3>
      <p style="font-size: 13px; color: #94a3b8; margin: 0 0 16px 0; line-height: 1.6;">Direct line to our workshop master. Instant replies for custom sizing, order tracking &amp; payment screenshots.</p>
      <div style="font-size: 17px; font-weight: 700; color: #25D366; margin-bottom: 18px; font-family: 'Montserrat', sans-serif;">+91 7387463103</div>
    </div>
    <a href="https://wa.me/917387463103?text=Hi%20Reflection%20Elite,%20I%20would%20like%20to%20inquire%20about%20your%20luxury%20mirrors." target="_blank" style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: #ffffff; font-weight: 700; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase; padding: 12px 20px; border-radius: 6px; text-decoration: none; display: block; box-shadow: 0 4px 15px rgba(37,211,102,0.35);">
      Chat on WhatsApp Now →
    </a>
  </div>

  <!-- Email Support Card -->
  <div style="background: #121722; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 14px; padding: 28px 22px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5); display: flex; flex-direction: column; justify-content: space-between;">
    <div>
      <div style="font-size: 34px; margin-bottom: 12px;">✉️</div>
      <h3 style="font-family: 'Cinzel', serif; font-size: 18px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0;">Email Support</h3>
      <p style="font-size: 13px; color: #94a3b8; margin: 0 0 16px 0; line-height: 1.6;">Send official trade inquiries, architectural blueprints, commercial quotes, or billing questions.</p>
      <div style="font-size: 15px; font-weight: 600; color: #f5e7a9; margin-bottom: 18px; font-family: 'Montserrat', sans-serif; word-break: break-all;">reflectionelite.com@gmail.com</div>
    </div>
    <a href="mailto:reflectionelite.com@gmail.com?subject=Reflection%20Elite%20Inquiry" style="background: linear-gradient(135deg, #f5d77f 0%, #d4af37 100%); color: #07090d; font-weight: 700; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase; padding: 12px 20px; border-radius: 6px; text-decoration: none; display: block; box-shadow: 0 4px 15px rgba(212,175,55,0.3);">
      Send Email Inquiry →
    </a>
  </div>

  <!-- Workshop & Studio Address Card -->
  <div style="background: #121722; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 14px; padding: 28px 22px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5); display: flex; flex-direction: column; justify-content: space-between;">
    <div>
      <div style="font-size: 34px; margin-bottom: 12px;">📍</div>
      <h3 style="font-family: 'Cinzel', serif; font-size: 18px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0;">Studio &amp; Workshop</h3>
      <p style="font-size: 13px; color: #94a3b8; margin: 0 0 14px 0; line-height: 1.6;">
        <strong style="color: #ffffff;">Reflection Elite (KGN GLASS)</strong><br />
        On the way of Saligaon Road, Parra,<br />
        Goa – 403510, India
      </p>
      <div style="font-size: 12px; color: #d4af37; font-weight: 600; margin-bottom: 16px;">
        Mon – Sat: 10:00 AM – 8:00 PM IST
      </div>
    </div>
    <a href="https://maps.google.com/?q=15.5652917,73.7909758" target="_blank" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(212, 175, 55, 0.4); color: #f1f5f9; font-weight: 600; font-size: 13px; padding: 12px 20px; border-radius: 6px; text-decoration: none; display: block;">
      View Studio Location ↗
    </a>
  </div>

  <!-- Pan-India Fragile Transit Card -->
  <div style="background: #121722; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 14px; padding: 28px 22px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5); display: flex; flex-direction: column; justify-content: space-between;">
    <div>
      <div style="font-size: 34px; margin-bottom: 12px;">🛡️</div>
      <h3 style="font-family: 'Cinzel', serif; font-size: 18px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0;">Safe Freight Pan-India</h3>
      <p style="font-size: 13px; color: #94a3b8; margin: 0 0 14px 0; line-height: 1.6;">
        Specialized courier handling with heavy-duty wooden crating. 100% Zero-Breakage Guarantee across all Indian states.
      </p>
      <div style="font-size: 12px; color: #f5e7a9; font-weight: 600; margin-bottom: 16px;">
        Tracking updates via SMS &amp; WhatsApp
      </div>
    </div>
    <a href="/shop/" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(212, 175, 55, 0.4); color: #f1f5f9; font-weight: 600; font-size: 13px; padding: 12px 20px; border-radius: 6px; text-decoration: none; display: block;">
      Explore Catalog →
    </a>
  </div>

</div>

<!-- INTERACTIVE INQUIRY & BESPOKE CUSTOMIZATION SECTION -->
<div style="background: #121620; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 16px; padding: 40px 28px; margin-bottom: 50px; box-shadow: 0 15px 35px rgba(0,0,0,0.6);">
  <div style="text-align: center; max-width: 650px; margin: 0 auto 30px auto;">
    <span style="font-family: 'Cinzel', serif; font-size: 12px; color: #d4af37; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">Direct Workshop Inquiry</span>
    <h2 style="font-family: 'Cinzel', serif; font-size: 28px; color: #ffffff; margin: 8px 0 12px 0;">Request a Custom Size or Consultation</h2>
    <p style="font-size: 14px; color: #94a3b8; margin: 0; line-height: 1.6;">Need a custom size for your powder room, bedroom console, or hotel project? Fill out your details below to open a direct pre-filled WhatsApp chat with our master craftsman.</p>
  </div>

  <div style="max-width: 600px; margin: 0 auto;">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
      <div>
        <label style="display: block; font-size: 12px; text-transform: uppercase; color: #cbd5e1; font-weight: 600; margin-bottom: 6px; letter-spacing: 1px;">Your Name</label>
        <input type="text" id="contact_name" placeholder="e.g. Kaif Khan" style="width: 100%; box-sizing: border-box; background: #1a2232; border: 1px solid rgba(212, 175, 55, 0.3); color: #fff; border-radius: 6px; padding: 12px 14px; font-size: 14px;" />
      </div>
      <div>
        <label style="display: block; font-size: 12px; text-transform: uppercase; color: #cbd5e1; font-weight: 600; margin-bottom: 6px; letter-spacing: 1px;">Phone / WhatsApp</label>
        <input type="tel" id="contact_phone" placeholder="e.g. 9876543210" style="width: 100%; box-sizing: border-box; background: #1a2232; border: 1px solid rgba(212, 175, 55, 0.3); color: #fff; border-radius: 6px; padding: 12px 14px; font-size: 14px;" />
      </div>
    </div>

    <div style="margin-bottom: 16px;">
      <label style="display: block; font-size: 12px; text-transform: uppercase; color: #cbd5e1; font-weight: 600; margin-bottom: 6px; letter-spacing: 1px;">Inquiry Type</label>
      <select id="contact_type" style="width: 100%; box-sizing: border-box; background: #1a2232; border: 1px solid rgba(212, 175, 55, 0.3); color: #fff; border-radius: 6px; padding: 12px 14px; font-size: 14px;">
        <option value="Custom Sizing &amp; Dimensions">Bespoke / Custom Mirror Sizing</option>
        <option value="Existing Order Status">Existing Order Inquiry &amp; Tracking</option>
        <option value="Interior Designer / Architect Commission">Interior Designer / Architect Commission</option>
        <option value="Payment / 50% Advance Question">Payment &amp; 50% Advance Inquiry</option>
        <option value="General Inquiry">General Product Inquiry</option>
      </select>
    </div>

    <div style="margin-bottom: 24px;">
      <label style="display: block; font-size: 12px; text-transform: uppercase; color: #cbd5e1; font-weight: 600; margin-bottom: 6px; letter-spacing: 1px;">Message / Custom Dimensions</label>
      <textarea id="contact_message" rows="4" placeholder="Tell us your mirror model of interest, dimensions (e.g., 36x24 inches), or design requirements..." style="width: 100%; box-sizing: border-box; background: #1a2232; border: 1px solid rgba(212, 175, 55, 0.3); color: #fff; border-radius: 6px; padding: 12px 14px; font-size: 14px; line-height: 1.5;"></textarea>
    </div>

    <button type="button" onclick="sendContactWhatsApp()" style="width: 100%; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: #ffffff; font-family: 'Cinzel', serif; font-weight: 700; font-size: 15px; letter-spacing: 1.5px; text-transform: uppercase; padding: 16px; border: none; border-radius: 6px; cursor: pointer; box-shadow: 0 6px 20px rgba(37,211,102,0.35); display: flex; align-items: center; justify-content: center; gap: 10px;">
      <svg style="width: 22px; height: 22px; fill: #fff;" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.06-2.146-.541-1.854-.77-3.047-2.662-3.14-2.785-.092-.122-.741-.986-.741-1.88 0-.895.469-1.334.636-1.516.166-.182.365-.228.487-.228.122 0 .243.002.349.006.111.005.26-.042.406.31.15.362.512 1.248.558 1.339.045.091.076.197.015.319-.06.121-.091.197-.182.303-.091.106-.192.237-.274.319-.092.091-.188.19-.081.373.106.183.473.78 1.014 1.262.697.621 1.285.813 1.468.904.182.091.289.076.395-.045.106-.122.456-.531.577-.714.122-.182.243-.152.41-.091s1.063.501 1.245.592c.182.091.303.137.349.213.045.076.045.441-.099.846zm-3.392-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.88l-1.304 4.76 4.877-1.278c1.401.764 3.003 1.198 4.703 1.198 5.523 0 10-4.477 10-10 0-5.522-4.477-10-10-10z"/></svg>
      Send Inquiry on WhatsApp (+91 7387463103)
    </button>
  </div>
</div>

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
</script>

<!-- FREQUENTLY ASKED QUESTIONS -->
<div style="margin-bottom: 40px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <span style="font-family: 'Cinzel', serif; font-size: 12px; color: #d4af37; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">Customer Guidance</span>
    <h2 style="font-family: 'Cinzel', serif; font-size: 26px; color: #ffffff; margin: 6px 0 0 0;">Frequently Asked Questions</h2>
  </div>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px;">
    <div style="background: #121722; border: 1px solid rgba(255,255,255,0.08); border-left: 3px solid #d4af37; padding: 20px; border-radius: 8px;">
      <h4 style="font-family: 'Cinzel', serif; font-size: 16px; color: #f5e7a9; margin: 0 0 8px 0;">How does the 50% Advance work?</h4>
      <p style="font-size: 13px; color: #cbd5e1; margin: 0; line-height: 1.6;">Because all our luxury mirrors are handcrafted to order, you can pay 50% advance via Razorpay number <strong style="color:#f5e7a9;">917387463103</strong> to begin fabrication, and pay the remaining 50% upon delivery.</p>
    </div>

    <div style="background: #121722; border: 1px solid rgba(255,255,255,0.08); border-left: 3px solid #d4af37; padding: 20px; border-radius: 8px;">
      <h4 style="font-family: 'Cinzel', serif; font-size: 16px; color: #f5e7a9; margin: 0 0 8px 0;">What if the mirror is damaged in transit?</h4>
      <p style="font-size: 13px; color: #cbd5e1; margin: 0; line-height: 1.6;">We pack every piece in heavy-duty bolted wooden crates. In the rare event of transit damage, simply record an unboxing video and share it on WhatsApp within 48 hours for a 100% free immediate replacement.</p>
    </div>

    <div style="background: #121722; border: 1px solid rgba(255,255,255,0.08); border-left: 3px solid #d4af37; padding: 20px; border-radius: 8px;">
      <h4 style="font-family: 'Cinzel', serif; font-size: 16px; color: #f5e7a9; margin: 0 0 8px 0;">Can I customize mirror dimensions?</h4>
      <p style="font-size: 13px; color: #cbd5e1; margin: 0; line-height: 1.6;">Yes! All Venetian, Murano, and LED mirrors can be tailored to exact millimetric dimensions for your bathrooms, vanities, or living room foyers. Contact us on WhatsApp with your dimensions.</p>
    </div>

    <div style="background: #121722; border: 1px solid rgba(255,255,255,0.08); border-left: 3px solid #d4af37; padding: 20px; border-radius: 8px;">
      <h4 style="font-family: 'Cinzel', serif; font-size: 16px; color: #f5e7a9; margin: 0 0 8px 0;">How long does delivery take?</h4>
      <p style="font-size: 13px; color: #cbd5e1; margin: 0; line-height: 1.6;">In-stock mirrors dispatch in 2–4 days. Bespoke handcrafted pieces take 7–10 business days for glass cutting and polishing. Delivery across metro cities takes 3–6 days via fragile freight logistics.</p>
    </div>
  </div>
</div>
  `;
}

function generateAboutUsHtml() {
  return `
<!-- HERO SECTION -->
<div style="background: radial-gradient(circle at 50% 20%, #1a2233 0%, #0c111a 60%, #06090e 100%); border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 16px; padding: 65px 24px; margin-bottom: 50px; text-align: center; box-shadow: 0 15px 40px rgba(0,0,0,0.7), 0 0 30px rgba(212, 175, 55, 0.1);">
  <div style="max-width: 860px; margin: 0 auto;">
    <span style="display: inline-block; background: rgba(212, 175, 55, 0.12); color: #d4af37; border: 1px solid rgba(212, 175, 55, 0.35); padding: 6px 18px; border-radius: 50px; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 18px; font-family: 'Cinzel', serif;">
      ★ Heritage Italian &amp; Venetian Craftsmanship ★
    </span>
    <h1 style="font-family: 'Cinzel', serif; font-size: clamp(30px, 4.8vw, 48px); font-weight: 800; line-height: 1.2; margin: 0 0 18px 0; color: #ffffff; letter-spacing: 1px;">
      The Story of Reflection Elite
    </h1>
    <p style="font-family: 'Montserrat', sans-serif; font-size: 17px; line-height: 1.8; color: #cbd5e1; margin: 0 auto; max-width: 720px; font-weight: 300;">
      Born from a reverence for the centuries-old glassmaking traditions of Venice and Murano, Reflection Elite creates museum-grade architectural mirrors that transform living spaces into realms of grandeur and light.
    </p>
  </div>
</div>

<!-- THE ATELIER STORY & PHILOSOPHY -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 36px; align-items: center; margin-bottom: 60px;">
  <div>
    <span style="font-family: 'Cinzel', serif; font-size: 12px; color: #d4af37; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 10px;">Our Atelier Origins</span>
    <h2 style="font-family: 'Cinzel', serif; font-size: 30px; font-weight: 800; color: #ffffff; margin: 0 0 18px 0; line-height: 1.3;">
      Reviving Renaissance Glass Art for Modern Luxury Living
    </h2>
    <p style="font-size: 15px; line-height: 1.8; color: #cbd5e1; margin: 0 0 16px 0; font-weight: 300;">
      Founded by <strong style="color: #f5e7a9;">Mohammad Kaif</strong> at our atelier in Parra, Goa, Reflection Elite was founded with a single uncompromising mission: to liberate luxury homeowners and designers from fragile, mass-produced commercial glass and restore the tactile majesty of authentic hand-beveled Venetian mirrors.
    </p>
    <p style="font-size: 15px; line-height: 1.8; color: #cbd5e1; margin: 0 0 24px 0; font-weight: 300;">
      Every Reflection Elite creation begins with 4–5mm distortion-free optical float glass. Each bevel, rosette, cushion border, and floral scroll is hand-ground and polished by master artisans using traditional diamond-grit techniques. Sealed with moisture-impervious backing, our mirrors are built to endure decades without silvering oxidation or coastal tarnish.
    </p>
    <div style="display: flex; gap: 14px; flex-wrap: wrap;">
      <a href="/shop/" style="background: linear-gradient(135deg, #f5d77f 0%, #d4af37 100%); color: #07090d; font-family: 'Cinzel', serif; font-weight: 700; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; padding: 13px 26px; border-radius: 6px; text-decoration: none; box-shadow: 0 4px 15px rgba(212,175,55,0.3);">
        Explore Collection →
      </a>
      <a href="https://wa.me/917387463103?text=Hi%20Mohammad%20Kaif,%20I%20would%20like%20to%20discuss%20a%20mirror%20commission." target="_blank" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(212,175,55,0.4); color: #ffffff; font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 13px; padding: 13px 22px; border-radius: 6px; text-decoration: none;">
        Speak with Atelier Lead ↗
      </a>
    </div>
  </div>

  <div style="background: #121722; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 14px; padding: 28px; box-shadow: 0 15px 35px rgba(0,0,0,0.6);">
    <h3 style="font-family: 'Cinzel', serif; font-size: 20px; color: #f5e7a9; margin: 0 0 18px 0; border-bottom: 1px solid rgba(212,175,55,0.25); padding-bottom: 10px;">
      Atelier Highlights
    </h3>
    <ul style="list-style: none; padding: 0; margin: 0; font-size: 14px; color: #cbd5e1; line-height: 2;">
      <li style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px;">
        <span style="color: #d4af37; font-size: 18px;">⚜️</span>
        <div><strong style="color: #ffffff;">4–5mm High-Clarity Float Glass:</strong> Zero optical distortion with razor-sharp reflection fidelity.</div>
      </li>
      <li style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px;">
        <span style="color: #d4af37; font-size: 18px;">🛡️</span>
        <div><strong style="color: #ffffff;">Anti-Humidity Sealed Backing:</strong> High-density moisture-resistant MDF shields against humidity, steam, and oxidation.</div>
      </li>
      <li style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px;">
        <span style="color: #d4af37; font-size: 18px;">📦</span>
        <div><strong style="color: #ffffff;">Bolted Reinforced Wooden Crating:</strong> Multi-layer shock-dampening transit packaging ensuring 100% zero glass breakage.</div>
      </li>
      <li style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px;">
        <span style="color: #d4af37; font-size: 18px;">💳</span>
        <div><strong style="color: #ffffff;">50% Advance Handcrafted Flexibility:</strong> Pay 50% to initiate custom build, balance upon doorstep arrival.</div>
      </li>
      <li style="display: flex; align-items: flex-start; gap: 10px;">
        <span style="color: #d4af37; font-size: 18px;">📐</span>
        <div><strong style="color: #ffffff;">Made-to-Measure Tailoring:</strong> Custom sizing for grand foyers, luxury master baths, and boutique hotel suites.</div>
      </li>
    </ul>
  </div>
</div>

<!-- THE 4 PILLARS OF OUR QUALITY -->
<div style="margin-bottom: 60px;">
  <div style="text-align: center; margin-bottom: 35px;">
    <span style="font-family: 'Cinzel', serif; font-size: 12px; color: #d4af37; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;">Standards of Distinction</span>
    <h2 style="font-family: 'Cinzel', serif; font-size: 32px; font-weight: 800; color: #ffffff; margin: 6px 0 10px 0;">The Four Pillars of Reflection Elite</h2>
    <div style="width: 70px; height: 2px; background: linear-gradient(90deg, transparent, #d4af37, transparent); margin: 0 auto;"></div>
  </div>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;">
    <!-- Pillar 1 -->
    <div style="background: #141924; border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 12px; padding: 26px 20px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
      <div style="font-size: 32px; margin-bottom: 12px;">🎨</div>
      <h3 style="font-family: 'Cinzel', serif; font-size: 17px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0;">Artisanal Venetian Beveling</h3>
      <p style="font-size: 13px; color: #94a3b8; margin: 0; line-height: 1.6;">Elaborate cushion cuts, scalloped edges, and floral rosettes hand-carved by veteran glass craftsmen with decades of heritage.</p>
    </div>

    <!-- Pillar 2 -->
    <div style="background: #141924; border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 12px; padding: 26px 20px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
      <div style="font-size: 32px; margin-bottom: 12px;">🔬</div>
      <h3 style="font-family: 'Cinzel', serif; font-size: 17px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0;">Engineered Longevity</h3>
      <p style="font-size: 13px; color: #94a3b8; margin: 0; line-height: 1.6;">Pure silver reflective deposition shielded by hydrophobic anti-corrosion sealant. Zero black spots even in high-humidity master bathrooms.</p>
    </div>

    <!-- Pillar 3 -->
    <div style="background: #141924; border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 12px; padding: 26px 20px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
      <div style="font-size: 32px; margin-bottom: 12px;">📦</div>
      <h3 style="font-family: 'Cinzel', serif; font-size: 17px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0;">Fortified Crated Transit</h3>
      <p style="font-size: 13px; color: #94a3b8; margin: 0; line-height: 1.6;">Every piece travels in high-density foam cushions inside a bolted industrial pine-wood crate for zero transit breakage to any Indian pincode.</p>
    </div>

    <!-- Pillar 4 -->
    <div style="background: #141924; border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 12px; padding: 26px 20px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
      <div style="font-size: 32px; margin-bottom: 12px;">💎</div>
      <h3 style="font-family: 'Cinzel', serif; font-size: 17px; font-weight: 700; color: #ffffff; margin: 0 0 8px 0;">White-Glove Concierge</h3>
      <p style="font-size: 13px; color: #94a3b8; margin: 0; line-height: 1.6;">Direct WhatsApp consultation from blueprint conception through installation support. We stand behind every mirror with pride.</p>
    </div>
  </div>
</div>

<!-- THE 5-STEP ARTISAN JOURNEY -->
<div style="background: #101520; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 16px; padding: 40px 24px; margin-bottom: 50px; box-shadow: 0 15px 35px rgba(0,0,0,0.6);">
  <div style="text-align: center; margin-bottom: 30px;">
    <span style="font-family: 'Cinzel', serif; font-size: 12px; color: #d4af37; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">From Glass to Masterpiece</span>
    <h2 style="font-family: 'Cinzel', serif; font-size: 26px; color: #ffffff; margin: 6px 0 0 0;">The Making of a Reflection Elite Mirror</h2>
  </div>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
    <div style="background: #161c28; border: 1px solid rgba(255,255,255,0.06); padding: 20px; border-radius: 8px; text-align: center;">
      <span style="font-family: 'Cinzel', serif; font-size: 24px; color: #d4af37; font-weight: 800; display: block; margin-bottom: 8px;">01</span>
      <h4 style="font-family: 'Cinzel', serif; font-size: 15px; color: #ffffff; margin: 0 0 6px 0;">Diamond Precision Cut</h4>
      <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5;">Ultra-clear float glass scored and cut to exact millimetric dimensions.</p>
    </div>
    <div style="background: #161c28; border: 1px solid rgba(255,255,255,0.06); padding: 20px; border-radius: 8px; text-align: center;">
      <span style="font-family: 'Cinzel', serif; font-size: 24px; color: #d4af37; font-weight: 800; display: block; margin-bottom: 8px;">02</span>
      <h4 style="font-family: 'Cinzel', serif; font-size: 15px; color: #ffffff; margin: 0 0 6px 0;">Hand-Beveled Grinding</h4>
      <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5;">Multi-tier water-cooled diamond wheel beveling creates prismatic light refraction.</p>
    </div>
    <div style="background: #161c28; border: 1px solid rgba(255,255,255,0.06); padding: 20px; border-radius: 8px; text-align: center;">
      <span style="font-family: 'Cinzel', serif; font-size: 24px; color: #d4af37; font-weight: 800; display: block; margin-bottom: 8px;">03</span>
      <h4 style="font-family: 'Cinzel', serif; font-size: 15px; color: #ffffff; margin: 0 0 6px 0;">Venetian Etching</h4>
      <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5;">Floral rosettes, cushion crowns, and corner accents etched with classical motifs.</p>
    </div>
    <div style="background: #161c28; border: 1px solid rgba(255,255,255,0.06); padding: 20px; border-radius: 8px; text-align: center;">
      <span style="font-family: 'Cinzel', serif; font-size: 24px; color: #d4af37; font-weight: 800; display: block; margin-bottom: 8px;">04</span>
      <h4 style="font-family: 'Cinzel', serif; font-size: 15px; color: #ffffff; margin: 0 0 6px 0;">Dual-Layer Moisture Seal</h4>
      <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5;">Hydrophobic coating bonded to heavy-gauge moisture-resistant backboard.</p>
    </div>
    <div style="background: #161c28; border: 1px solid rgba(255,255,255,0.06); padding: 20px; border-radius: 8px; text-align: center;">
      <span style="font-family: 'Cinzel', serif; font-size: 24px; color: #d4af37; font-weight: 800; display: block; margin-bottom: 8px;">05</span>
      <h4 style="font-family: 'Cinzel', serif; font-size: 15px; color: #ffffff; margin: 0 0 6px 0;">Bolted Crate Dispatch</h4>
      <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5;">Encased in reinforced wooden crates and dispatched with insured pan-India tracking.</p>
    </div>
  </div>
</div>

<!-- STUDIO ADDRESS & CTA BANNER -->
<div style="background: linear-gradient(135deg, #141b28 0%, #1e283d 50%, #141b28 100%); border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 14px; padding: 40px 24px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
  <h3 style="font-family: 'Cinzel', serif; font-size: 24px; color: #ffffff; margin: 0 0 10px 0;">Visit Our Design Studio in Goa</h3>
  <p style="font-size: 14px; color: #cbd5e1; margin: 0 0 24px 0; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6;">
    <strong style="color: #f5e7a9;">Reflection Elite (KGN GLASS)</strong><br />
    On the way of Saligaon Road, Parra, Goa – 403510, India<br />
    Phone &amp; WhatsApp: <strong style="color: #25D366;">+91 7387463103</strong> • Email: <strong style="color: #f5e7a9;">reflectionelite.com@gmail.com</strong>
  </p>
  <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
    <a href="/shop/" style="background: linear-gradient(135deg, #f5d77f 0%, #d4af37 100%); color: #07090d; font-family: 'Cinzel', serif; font-weight: 700; font-size: 14px; padding: 14px 30px; border-radius: 6px; text-decoration: none; box-shadow: 0 4px 15px rgba(212,175,55,0.35);">
      View Mirror Collection →
    </a>
    <a href="https://wa.me/917387463103?text=Hi%20Reflection%20Elite,%20I%20would%20like%20to%20consult%20about%20a%20mirror." target="_blank" style="background: #25D366; color: #ffffff; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 14px; padding: 14px 26px; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
      Chat on WhatsApp (+91 7387463103)
    </a>
  </div>
</div>
  `;
}

async function updatePages() {
  console.log('=== UPDATING CONTACT & ABOUT US PAGES ===\n');

  console.log('1. Updating Contact Page (ID 52)...');
  const contactRes = await fetch(`${WP_URL}/wp-json/wp/v2/pages/52`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      content: generateContactHtml()
    })
  });
  console.log('Contact Page update status:', contactRes.status);
  const contactData = await contactRes.json();
  console.log('Contact Page updated successfully! URL:', contactData.link);

  console.log('\n2. Updating About Us Page (ID 50)...');
  const aboutRes = await fetch(`${WP_URL}/wp-json/wp/v2/pages/50`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      content: generateAboutUsHtml()
    })
  });
  console.log('About Us Page update status:', aboutRes.status);
  const aboutData = await aboutRes.json();
  console.log('About Us Page updated successfully! URL:', aboutData.link);
}

updatePages().catch(console.error);
