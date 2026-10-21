import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'process.env.PROD_WP_APP_PASS || "[REDACTED]"';
const auth = { 
  Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64')}`,
  'Content-Type': 'application/json' 
};

async function updateStore() {
  console.log('=== UPDATING PAYMENT GATEWAYS & CONTACT SUPPORT LABEL ===\n');

  // STEP 1: CONFIGURE WOOCOMMERCE PAYMENT GATEWAYS
  console.log('1. Disabling COD gateway...');
  const codRes = await fetch(`${WP_URL}/wp-json/wc/v3/payment_gateways/cod`, {
    method: 'PUT',
    headers: auth,
    body: JSON.stringify({ enabled: false })
  });
  const codData = await codRes.json();
  console.log('[SUCCESS] COD Gateway enabled =', codData.enabled);

  console.log('\n2. Configuring Razorpay as the SOLE payment method...');
  const gatewayTitle = 'Razorpay (100% Full Payment OR 50% Advance with COD)';

  const gatewayDesc = [
    '<div style="background:#141824; border:1px solid rgba(212, 175, 55, 0.4); border-left:4px solid #d4af37; padding:18px; border-radius:8px; margin:10px 0; box-shadow:0 6px 20px rgba(0,0,0,0.5);">',
    '<h4 style="margin:0 0 12px 0; color:#f5e7a9; font-family:\'Cinzel\',serif; font-size:16px; letter-spacing:0.5px;">💳 Razorpay Payment Options:</h4>',
    '<div style="margin-bottom:12px; padding:12px 14px; background:rgba(255,255,255,0.04); border-radius:6px; border:1px solid rgba(255,255,255,0.08);">',
    '<p style="margin:0 0 4px 0; color:#ffffff; font-weight:700; font-size:14px;">1️⃣ Option 1: 100% Full Prepayment</p>',
    '<p style="margin:0; font-size:13px; color:#cbd5e1; line-height:1.5;">If you want to purchase your mirror with full prepayment, pay the <strong>100% order amount</strong> via Razorpay number <strong style="color:#f5e7a9;">917387463103</strong> and place your order.</p>',
    '</div>',
    '<div style="margin-bottom:14px; padding:12px 14px; background:rgba(255,255,255,0.04); border-radius:6px; border:1px solid rgba(255,255,255,0.08);">',
    '<p style="margin:0 0 4px 0; color:#ffffff; font-weight:700; font-size:14px;">2️⃣ Option 2: Cash on Delivery (50% Advance)</p>',
    '<p style="margin:0; font-size:13px; color:#cbd5e1; line-height:1.5;">If you want Cash on Delivery, you need to pay <strong>50% of the amount first</strong> via Razorpay number <strong style="color:#f5e7a9;">917387463103</strong> to initiate handcrafted manufacturing, and pay the remaining 50% at the time of delivery.</p>',
    '</div>',
    '<div style="margin-bottom:14px; text-align:center; padding:12px; background:#0b0f17; border-radius:6px; border:1px solid rgba(212,175,55,0.3);">',
    '<span style="font-size:13px; color:#94a3b8; display:block; margin-bottom:6px;">Razorpay Payment Number:</span>',
    '<span style="font-size:18px; font-weight:bold; color:#07090d; background:linear-gradient(135deg, #f5d77f, #d4af37); padding:5px 18px; border-radius:4px; font-family:\'Montserrat\',sans-serif; letter-spacing:1px; display:inline-block;">917387463103</span>',
    '</div>',
    '<p style="margin:0 0 12px 0; font-size:13px; color:#94a3b8; line-height:1.5; text-align:center;">After transferring either the 100% full amount or the 50% advance, tap the button below to send your payment screenshot on WhatsApp to confirm your order:</p>',
    '<div style="text-align:center;">',
    '<a href="https://wa.me/917387463103?text=Hi%2C%20I%20have%20transferred%20the%20payment%20via%20Razorpay%20to%20917387463103.%20Here%20is%20my%20screenshot%20for%20order%20confirmation." target="_blank" style="display:inline-flex; align-items:center; gap:8px; background-color:#25D366; color:#ffffff; font-weight:bold; padding:12px 24px; border-radius:6px; text-decoration:none; font-size:14px; box-shadow:0 4px 15px rgba(37,211,102,0.35);">📱 Send Payment Screenshot on WhatsApp (+91 7387463103)</a>',
    '</div>',
    '</div>'
  ].join('');

  const gatewayInstructions = [
    '<div style="background:#141824; border:1px solid rgba(212, 175, 55, 0.4); border-left:4px solid #22c55e; padding:18px; border-radius:8px; margin:16px 0; box-shadow:0 8px 25px rgba(0,0,0,0.6);">',
    '<h3 style="margin:0 0 10px 0; color:#4ade80; font-size:18px; font-family:\'Cinzel\',serif;">✅ Order Placed! Send Payment Screenshot on WhatsApp</h3>',
    '<p style="margin:0 0 10px 0; font-size:15px; color:#f1f5f9;">Razorpay Payment Number: <strong style="color:#07090d; background:linear-gradient(135deg, #f5d77f, #d4af37); padding:3px 10px; border-radius:4px; font-family:\'Montserrat\',sans-serif;">917387463103</strong></p>',
    '<ul style="margin:0 0 14px 20px; font-size:13px; color:#cbd5e1; line-height:1.6;">',
    '<li><strong>100% Prepayment:</strong> Transfer full amount for immediate express processing.</li>',
    '<li><strong>Cash on Delivery:</strong> Transfer 50% advance first; pay remaining 50% upon delivery.</li>',
    '</ul>',
    '<p style="margin:0 0 14px 0; font-size:14px; color:#94a3b8; line-height:1.6;">Once transferred, click the button below to share your transaction screenshot on WhatsApp so our workshop can begin handcrafting your mirror immediately:</p>',
    '<a href="https://wa.me/917387463103?text=Hi%2C%20here%20is%20my%20payment%20screenshot%20for%20my%20order." target="_blank" style="display:inline-flex; align-items:center; gap:8px; background-color:#25D366; color:#ffffff; font-weight:bold; padding:12px 26px; border-radius:6px; text-decoration:none; font-size:15px; box-shadow:0 4px 15px rgba(37,211,102,0.35);">💬 Click Here to Send Payment Screenshot on WhatsApp</a>',
    '</div>'
  ].join('');

  const bacsRes = await fetch(`${WP_URL}/wp-json/wc/v3/payment_gateways/bacs`, {
    method: 'PUT',
    headers: auth,
    body: JSON.stringify({
      enabled: true,
      title: gatewayTitle,
      description: gatewayDesc,
      settings: {
        instructions: gatewayInstructions
      }
    })
  });
  const bacsData = await bacsRes.json();
  console.log('[SUCCESS] Razorpay Gateway configured:');
  console.log(' - Title:', bacsData.title);
  console.log(' - Enabled:', bacsData.enabled);

  // STEP 2: FIX "CONCIERGE" TO "Contact Support" IN WPCODE FOOTER
  console.log('\n3. Updating WPCode footer with "Contact Support"...');
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

  // Extract current header content to preserve it
  const headerMatch = html.match(/<textarea[^>]*id="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  const currentHeader = headerMatch ? headerMatch[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&') : '';

  const newFooterHtml = `
<!-- Reflection Elite Contact Support Floating WhatsApp -->
<a href="https://wa.me/917387463103?text=Hi%20Reflection%20Elite,%20I%20am%20interested%20in%20your%20luxury%20mirrors." 
   target="_blank" 
   rel="noopener noreferrer" 
   class="wa-floating-concierge" 
   aria-label="Contact Reflection Elite Support on WhatsApp">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.06-2.146-.541-1.854-.77-3.047-2.662-3.14-2.785-.092-.122-.741-.986-.741-1.88 0-.895.469-1.334.636-1.516.166-.182.365-.228.487-.228.122 0 .243.002.349.006.111.005.26-.042.406.31.15.362.512 1.248.558 1.339.045.091.076.197.015.319-.06.121-.091.197-.182.303-.091.106-.192.237-.274.319-.092.091-.188.19-.081.373.106.183.473.78 1.014 1.262.697.621 1.285.813 1.468.904.182.091.289.076.395-.045.106-.122.456-.531.577-.714.122-.182.243-.152.41-.091s1.063.501 1.245.592c.182.091.303.137.349.213.045.076.045.441-.099.846zm-3.392-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.88l-1.304 4.76 4.877-1.278c1.401.764 3.003 1.198 4.703 1.198 5.523 0 10-4.477 10-10 0-5.522-4.477-10-10-10z"/>
  </svg>
  <span>Contact Support</span>
</a>
`;

  const formBody = new URLSearchParams();
  formBody.append('insert-headers-and-footers_nonce', nonce);
  formBody.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-headers-footers');
  formBody.append('ihaf_insert_header', currentHeader);
  formBody.append('ihaf_insert_body', '');
  formBody.append('ihaf_insert_footer', newFooterHtml);

  const saveRes = await fetch(`${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': allCookies
    },
    body: formBody.toString(),
    redirect: 'manual'
  });
  console.log('[SUCCESS] WPCode footer saved (HTTP', saveRes.status, ') with "Contact Support"');

  // STEP 3: UPDATE HOMEPAGE TO REPLACE ANY "Concierge" WITH "Contact Support"
  console.log('\n4. Updating Homepage (Page 68) text...');
  const pageRes = await fetch(`${WP_URL}/wp-json/wp/v2/pages/68`, { headers: auth });
  const pageData = await pageRes.json();
  let content = pageData.content.raw || pageData.content.rendered;
  content = content.replace(/WhatsApp Concierge/g, 'Contact Support');
  content = content.replace(/Concierge/g, 'Support');

  const updatePageRes = await fetch(`${WP_URL}/wp-json/wp/v2/pages/68`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({ content: content })
  });
  console.log('[SUCCESS] Homepage updated (HTTP', updatePageRes.status, ')');

  console.log('\n========================================================');
  console.log('Store updates completed successfully!');
  console.log('1. COD removed, ONLY Razorpay available at checkout.');
  console.log('2. Razorpay explains 100% full payment vs 50% advance for COD.');
  console.log('3. Green button label corrected to "Contact Support".');
  console.log('========================================================\n');
}

updateStore().catch(console.error);
