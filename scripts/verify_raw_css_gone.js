import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function verifyRawCssGone() {
  console.log('=== VERIFYING THAT RAW CSS IS 100% GONE ===\n');

  // Test 1: Home page
  console.log('1. Checking Homepage: https://reflectionelite.com/ ...');
  const resHome = await fetch(WP_URL + '/?cache_bust=' + Date.now());
  const htmlHome = await resHome.text();

  const rawCssSnippet = '/* === RE-LUXURY-CART-SYSTEM-START === */';
  const hasRawSnippet = htmlHome.includes(rawCssSnippet);
  console.log('   Contains RE-LUXURY-CART-SYSTEM:', hasRawSnippet);

  // If it's present, let's verify if it's strictly inside <style>
  if (hasRawSnippet) {
    const idx = htmlHome.indexOf(rawCssSnippet);
    const beforeSnippet = htmlHome.substring(Math.max(0, idx - 100), idx);
    const afterSnippet = htmlHome.substring(idx, Math.min(htmlHome.length, idx + 200));
    console.log('   Context before snippet:\n', beforeSnippet);
    console.log('   Context after snippet:\n', afterSnippet);

    const isInsideStyle = beforeSnippet.includes('<style');
    console.log('   Is inside <style> tag?', isInsideStyle ? '✅ YES (VALID CSS, NOT VISIBLE TEXT)' : '❌ NO (RAW VISIBLE TEXT)');
  } else {
    console.log('   Snippet not found at all.');
  }

  // Test 2: Order received / checkout page
  console.log('\n2. Checking Checkout/Order page...');
  const resCheckout = await fetch(WP_URL + '/checkout/?cache_bust=' + Date.now());
  const htmlCheckout = await resCheckout.text();
  const checkoutHasRaw = htmlCheckout.includes(rawCssSnippet);
  console.log('   Checkout contains snippet:', checkoutHasRaw);
  if (checkoutHasRaw) {
    const idx = htmlCheckout.indexOf(rawCssSnippet);
    const before = htmlCheckout.substring(Math.max(0, idx - 100), idx);
    console.log('   Is inside <style> tag?', before.includes('<style') ? '✅ YES (VALID CSS, NOT VISIBLE TEXT)' : '❌ NO');
  }

  // Test 3: Check Partial Payment product
  console.log('\n3. Checking if Partial Payment product is gone...');
  const resPart = await fetch(WP_URL + '/product/partial-payment/');
  console.log('   /product/partial-payment/ HTTP status:', resPart.status, resPart.status === 404 ? '✅ 404 NOT FOUND (REMOVED)' : '⚠️ Still accessible');

  // Test 4: Check Policy pages
  console.log('\n4. Checking Policy pages...');
  const resPriv = await fetch(WP_URL + '/privacy-policy/');
  console.log('   /privacy-policy/ HTTP status:', resPriv.status, resPriv.status === 200 ? '✅ 200 OK' : '❌ FAILED');

  const resRef = await fetch(WP_URL + '/refund_returns/');
  console.log('   /refund_returns/ HTTP status:', resRef.status, resRef.status === 200 ? '✅ 200 OK' : '❌ FAILED');

  console.log('\n=== VERIFICATION COMPLETE ===');
}

verifyRawCssGone().catch(console.error);
