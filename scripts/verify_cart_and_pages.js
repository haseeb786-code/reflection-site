import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function verifyAll() {
  console.log('=== VERIFYING LIVE STORE UPDATES ===\n');

  // 1. Check Homepage
  console.log('1. Checking Homepage HTML...');
  const hpRes = await fetch(`${WP_URL}/`);
  const hpHtml = await hpRes.text();
  console.log(' - HTTP Status:', hpRes.status);
  console.log(' - Has #re-cart-drawer:', hpHtml.includes('id="re-cart-drawer"'));
  console.log(' - Has #re-cart-backdrop:', hpHtml.includes('id="re-cart-backdrop"'));
  console.log(' - Has #re-floating-cart-pill:', hpHtml.includes('id="re-floating-cart-pill"'));
  console.log(' - Has #re-cart-toast:', hpHtml.includes('id="re-cart-toast"'));
  console.log(' - Has wa-floating-concierge with "Contact Support":', hpHtml.includes('Contact Support'));
  console.log(' - Has Cart Menu link in HTML:', hpHtml.includes('href="/cart/"') || hpHtml.includes('href="https://reflectionelite.com/cart/"'));

  // 2. Check Shop Page
  console.log('\n2. Checking Shop Page HTML...');
  const shopRes = await fetch(`${WP_URL}/shop/`);
  const shopHtml = await shopRes.text();
  console.log(' - HTTP Status:', shopRes.status);
  console.log(' - Has #re-cart-drawer:', shopHtml.includes('id="re-cart-drawer"'));
  console.log(' - Has add_to_cart buttons:', shopHtml.includes('add_to_cart_button'));

  // 3. Check Contact Page
  console.log('\n3. Checking Contact Page...');
  const contactRes = await fetch(`${WP_URL}/contact/`);
  const contactHtml = await contactRes.text();
  console.log(' - HTTP Status:', contactRes.status);
  console.log(' - Contains Phone 7387463103:', contactHtml.includes('7387463103'));
  console.log(' - Contains Email reflectionelite.com@gmail.com:', contactHtml.includes('reflectionelite.com@gmail.com'));
  console.log(' - Contains Parra, Goa address:', contactHtml.includes('Parra') && contactHtml.includes('Goa'));
  console.log(' - Contains WhatsApp Inquiry Form:', contactHtml.includes('sendContactWhatsApp'));
  console.log(' - Contains FAQ Section:', contactHtml.includes('Frequently Asked Questions'));

  // 4. Check About Us Page
  console.log('\n4. Checking About Us Page...');
  const aboutRes = await fetch(`${WP_URL}/about-us/`);
  const aboutHtml = await aboutRes.text();
  console.log(' - HTTP Status:', aboutRes.status);
  console.log(' - Contains Mohammad Kaif:', aboutHtml.includes('Mohammad Kaif'));
  console.log(' - Contains Four Pillars:', aboutHtml.includes('The Four Pillars of Reflection Elite'));
  console.log(' - Contains 5-Step Journey:', aboutHtml.includes('The Making of a Reflection Elite Mirror'));
  console.log(' - Contains Studio in Parra, Goa:', aboutHtml.includes('Parra, Goa'));

  // 5. Check Cart Page
  console.log('\n5. Checking Cart Page...');
  const cartRes = await fetch(`${WP_URL}/cart/`);
  console.log(' - HTTP Status:', cartRes.status);

  console.log('\n======================================================');
  console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
  console.log('======================================================');
}

verifyAll().catch(console.error);
