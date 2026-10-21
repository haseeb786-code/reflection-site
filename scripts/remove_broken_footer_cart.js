import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function removeBrokenFooterCart() {
  console.log('=== REMOVING BROKEN UNSTYLED FOOTER CART DRAWER ===\n');

  // Step 1: Login
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

  // Step 2: Fetch WPCode
  const res3 = await fetch(`${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await res3.text();
  const nonceMatch = html.match(/id="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i) 
                  || html.match(/name="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i);
  if (!nonceMatch) throw new Error('Could not find WPCode nonce');
  const nonce = nonceMatch[1];

  const headerMatch = html.match(/<textarea[^>]*id="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  const headerVal = headerMatch ? headerMatch[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, '&') : '';

  // Clean Footer: ONLY Keep clean WhatsApp Concierge
  const cleanFooter = `<!-- Reflection Elite Contact Support Floating WhatsApp -->
<a href="https://wa.me/917387463103?text=Hi%20Reflection%20Elite,%20I%20am%20interested%20in%20your%20luxury%20mirrors." 
   target="_blank" 
   rel="noopener noreferrer" 
   class="wa-floating-concierge" 
   aria-label="Contact Reflection Elite Support on WhatsApp">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.06-2.146-.541-1.854-.77-3.047-2.662-3.14-2.785-.092-.122-.741-.986-.741-1.88 0-.895.469-1.334.636-1.516.166-.182.365-.228.487-.228.122 0 .243.002.349.006.111.005.26-.042.406.31.15.362.512 1.248.558 1.339.045.091.076.197.015.319-.06.121-.091.197-.182.303-.091.106-.192.237-.274.319-.092.091-.188.19-.081.373.106.183.473.78 1.014 1.262.697.621 1.285.813 1.468.904.182.091.289.076.395-.045.106-.122.456-.531.577-.714.122-.182.243-.152.41-.091s1.063.501 1.245.592c.182.091.303.137.349.213.045.076.045.441-.099.846zm-3.392-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.88l-1.304 4.76 4.877-1.278c1.401.764 3.003 1.198 4.703 1.198 5.523 0 10-4.477 10-10 0-5.522-4.477-10-10-10z"/>
  </svg>
  <span>Contact Support</span>
</a>`;

  // Step 3: Save WPCode
  console.log('Saving cleaned WPCode without the broken footer cart drawer...');
  const formBody = new URLSearchParams();
  formBody.append('insert-headers-and-footers_nonce', nonce);
  formBody.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-headers-footers');
  formBody.append('ihaf_insert_header', headerVal);
  formBody.append('ihaf_insert_body', '');
  formBody.append('ihaf_insert_footer', cleanFooter);
  formBody.append('submit', 'Save');

  const saveRes = await fetch(`${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': allCookies },
    body: formBody.toString()
  });
  console.log('Save response status:', saveRes.status);

  // Step 4: Purge LiteSpeed Cache
  console.log('Purging LiteSpeed cache...');
  const dashRes = await fetch(`${WP_URL}/wp-admin/`, { headers: { 'Cookie': allCookies } });
  const dashHtml = await dashRes.text();
  const purgeMatch = dashHtml.match(/href="([^"]*litespeed-purge-all[^"]*)"/i) || dashHtml.match(/href="([^"]*purge_all[^"]*)"/i);
  if (purgeMatch) {
    const rawPurge = purgeMatch[1].replace(/&amp;/g, '&');
    const purgeUrl = rawPurge.startsWith('http') ? rawPurge : `${WP_URL}/wp-admin/${rawPurge}`;
    const pRes = await fetch(purgeUrl, { headers: { 'Cookie': allCookies } });
    console.log('LiteSpeed Cache purged! Status:', pRes.status);
  }

  // Step 5: Verify live homepage
  console.log('Verifying live homepage...');
  const homeRes = await fetch(`${WP_URL}/?nocache=${Date.now()}`);
  const homeHtml = await homeRes.text();
  
  const hasDrawer = homeHtml.includes('re-cart-drawer');
  const hasEmptyText = homeHtml.includes('Explore our master handcrafted Italian');
  const hasShoppingBag = homeHtml.includes('Shopping Bag 0');

  console.log('\n--- VERIFICATION RESULTS ---');
  console.log('Has re-cart-drawer in HTML:', hasDrawer);
  console.log('Has empty bag text:', hasEmptyText);
  console.log('Has Shopping Bag 0:', hasShoppingBag);

  if (!hasDrawer && !hasEmptyText && !hasShoppingBag) {
    console.log('\n[SUCCESS] The broken unstyled footer elements are COMPLETELY GONE from the live site!');
  } else {
    console.warn('\n[WARNING] Elements might still be cached or present.');
  }
}

removeBrokenFooterCart().catch(console.error);
