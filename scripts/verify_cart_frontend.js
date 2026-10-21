import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function verify() {
  console.log('=== VERIFYING LIVE FRONTEND ===');
  const res = await fetch(`${WP_URL}/shop/?t=${Date.now()}`);
  const html = await res.text();

  console.log('1. Contains RE-LUXURY-CART-SYSTEM-START:', html.includes('RE-LUXURY-CART-SYSTEM-START'));
  console.log('2. Contains #re-cart-drawer:', html.includes('id="re-cart-drawer"'));
  console.log('3. Contains #re-cart-backdrop:', html.includes('id="re-cart-backdrop"'));
  console.log('4. Contains #re-cart-toast:', html.includes('id="re-cart-toast"'));
  console.log('5. Contains #re-floating-cart-pill:', html.includes('id="re-floating-cart-pill"'));
  console.log('6. Contains enhanceNavCartItem:', html.includes('enhanceNavCartItem'));
  console.log('7. Contains re-mobile-cart-btn:', html.includes('re-mobile-cart-btn'));
  console.log('8. Contains menu-item-85:', html.includes('menu-item-85'));
  console.log('9. Contains Contact menu item 74:', html.includes('menu-item-74'));
  console.log('10. Contains Proceed to Checkout button:', html.includes('Proceed to Checkout / Payment'));
}

verify().catch(console.error);
