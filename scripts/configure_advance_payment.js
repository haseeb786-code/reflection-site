import fs from 'fs';

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'process.env.PROD_WP_APP_PASS || "[REDACTED]"';
const auth = { 
  Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64')}`,
  'Content-Type': 'application/json' 
};

async function setupAdvancePayment() {
  console.log('=== CONFIGURING 50% ADVANCE (RAZORPAY) + WHATSAPP SCREENSHOT GATEWAY ===\n');

  const desc = [
    '<div style="background:#141824; border:1px solid rgba(212, 175, 55, 0.4); border-left:4px solid #d4af37; padding:16px; border-radius:8px; margin:10px 0; box-shadow:0 6px 20px rgba(0,0,0,0.5);">',
    '<p style="margin:0 0 10px 0; font-size:15px; font-weight:600; color:#f5e7a9; font-family:\'Cinzel\',serif; letter-spacing:0.5px;">👑 <strong>Payment Policy:</strong> 50% Advance is required to initiate handcrafted manufacturing. The remaining 50% is payable upon doorstep delivery.</p>',
    '<p style="margin:0 0 12px 0; font-size:14px; color:#e2e8f0;">💳 <strong>Pay 50% via Razorpay Number:</strong> <span style="font-size:17px; font-weight:bold; color:#07090d; background:linear-gradient(135deg, #f5d77f, #d4af37); padding:4px 12px; border-radius:4px; font-family:\'Montserrat\',sans-serif; letter-spacing:1px; display:inline-block; margin-left:4px;">917387463103</span></p>',
    '<p style="margin:0 0 14px 0; font-size:13px; color:#94a3b8; line-height:1.5;">After transferring the 50% advance, tap below to send your payment confirmation screenshot on WhatsApp to activate immediate artisan production.</p>',
    '<a href="https://wa.me/917387463103?text=Hi%2C%20I%20have%20transferred%20the%2050%25%20advance%20payment%20via%20Razorpay%20to%20917387463103.%20Here%20is%20my%20screenshot%20for%20order%20confirmation." target="_blank" style="display:inline-flex; align-items:center; gap:8px; background-color:#25D366; color:#ffffff; font-weight:bold; padding:12px 22px; border-radius:6px; text-decoration:none; font-size:14px; box-shadow:0 4px 15px rgba(37,211,102,0.35);">📱 Send Payment Screenshot on WhatsApp (+91 7387463103)</a>',
    '</div>'
  ].join('');

  const instructions = [
    '<div style="background:#141824; border:1px solid rgba(212, 175, 55, 0.4); border-left:4px solid #22c55e; padding:18px; border-radius:8px; margin:16px 0; box-shadow:0 8px 25px rgba(0,0,0,0.6);">',
    '<h3 style="margin:0 0 10px 0; color:#4ade80; font-size:18px; font-family:\'Cinzel\',serif;">✅ Order Placed! Send 50% Advance Screenshot on WhatsApp</h3>',
    '<p style="margin:0 0 10px 0; font-size:15px; color:#f1f5f9;">Please transfer <strong>50% of your total order amount</strong> via Razorpay to Number: <strong style="color:#07090d; background:linear-gradient(135deg, #f5d77f, #d4af37); padding:3px 10px; border-radius:4px; font-family:\'Montserrat\',sans-serif;">917387463103</strong></p>',
    '<p style="margin:0 0 14px 0; font-size:14px; color:#94a3b8; line-height:1.6;">Once transferred, click the button below to share your transaction screenshot on WhatsApp so our workshop can begin handcrafting your mirror immediately:</p>',
    '<a href="https://wa.me/917387463103?text=Hi%2C%20here%20is%20my%2050%25%20advance%20payment%20screenshot%20for%20my%20order." target="_blank" style="display:inline-flex; align-items:center; gap:8px; background-color:#25D366; color:#ffffff; font-weight:bold; padding:12px 26px; border-radius:6px; text-decoration:none; font-size:15px; box-shadow:0 4px 15px rgba(37,211,102,0.35);">💬 Click Here to Send Payment Screenshot on WhatsApp</a>',
    '</div>'
  ].join('');

  // 1. Enable and configure BACS as "50% Advance (Razorpay) + 50% Cash on Delivery"
  const bacsRes = await fetch(`${WP_URL}/wp-json/wc/v3/payment_gateways/bacs`, {
    method: 'PUT',
    headers: auth,
    body: JSON.stringify({
      enabled: true,
      title: '50% Advance (Razorpay) + 50% on Delivery',
      description: desc,
      settings: {
        instructions: instructions
      }
    })
  });
  const bacsData = await bacsRes.json();
  console.log('[SUCCESS] BACS Gateway configured:');
  console.log(' - Title:', bacsData.title);
  console.log(' - Enabled:', bacsData.enabled);

  // 2. Disable automated Razorpay API plugin gateway so only this manual 50% method is active
  const rzpRes = await fetch(`${WP_URL}/wp-json/wc/v3/payment_gateways/razorpay`, {
    method: 'PUT',
    headers: auth,
    body: JSON.stringify({
      enabled: false
    })
  });
  const rzpData = await rzpRes.json();
  console.log('\n[SUCCESS] Automated Razorpay API popup gateway disabled: enabled =', rzpData.enabled);

  // 3. Keep Cash on Delivery also available or note
  const codRes = await fetch(`${WP_URL}/wp-json/wc/v3/payment_gateways/cod`, { headers: auth });
  const codData = await codRes.json();
  console.log('[INFO] Cash on Delivery (COD) gateway status: enabled =', codData.enabled);
}

setupAdvancePayment().catch(console.error);
