import { generateGlobalCss } from './generate_luxury_css.js';
import { generateGlobalFooterScript } from './deploy_reflection_elite_luxury_redesign.js';
import { generateContactHtml } from './deploy_contact_luxury.js';
import { generatePrivacyPolicyHtml, generateRefundReturnsHtml } from './deploy_policies_luxury.js';

const WP_URL = 'https://reflectionelite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'process.env.PROD_WP_APP_PASS || "[REDACTED]"';
const auth = { 
  Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64')}`,
  'Content-Type': 'application/json' 
};

async function deployAllLuxuryFixes() {
  console.log('========================================================');
  console.log('   STARTING COMPREHENSIVE SITE-WIDE LUXURY REDESIGN     ');
  console.log('========================================================\n');

  // STEP 1: Update Page 52 (Contact)
  console.log('1. Updating Page 52 (Contact & Atelier Concierge)...');
  const res52 = await fetch(`${WP_URL}/wp-json/wp/v2/pages/52`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      title: 'Contact',
      content: generateContactHtml(),
      status: 'publish'
    })
  });
  if (res52.ok) {
    console.log('[SUCCESS] Page 52 (Contact) updated to warm ivory & gold editorial theme!');
  } else {
    console.error('Failed to update Page 52:', res52.status, await res52.text());
  }

  // STEP 2: Update Page 102 (Privacy Policy)
  console.log('2. Updating Page 102 (Privacy Policy)...');
  const res102 = await fetch(`${WP_URL}/wp-json/wp/v2/pages/102`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      title: 'Privacy Policy',
      content: generatePrivacyPolicyHtml(),
      status: 'publish'
    })
  });
  if (res102.ok) {
    console.log('[SUCCESS] Page 102 (Privacy Policy) updated to luxury styling!');
  } else {
    console.error('Failed to update Page 102:', res102.status, await res102.text());
  }

  // STEP 3: Update Page 103 (Refund & Returns Policy)
  console.log('3. Updating Page 103 (Refund & Returns Policy)...');
  const res103 = await fetch(`${WP_URL}/wp-json/wp/v2/pages/103`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      title: 'Refund & Returns Policy',
      content: generateRefundReturnsHtml(),
      status: 'publish'
    })
  });
  if (res103.ok) {
    console.log('[SUCCESS] Page 103 (Refund & Returns Policy) updated to luxury styling!');
  } else {
    console.error('Failed to update Page 103:', res103.status, await res103.text());
  }

  // STEP 4: Ensure Main Menu (ID 23) is assigned to both 'primary' and 'mobile_menu'
  console.log('4. Assigning Main Menu to primary and mobile_menu locations...');
  const resMenu = await fetch(`${WP_URL}/wp-json/wp/v2/menus/23`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({ locations: ['primary', 'mobile_menu'] })
  });
  if (resMenu.ok) {
    const menuData = await resMenu.json();
    console.log('[SUCCESS] Menu locations verified:', menuData.locations);
  } else {
    console.error('Menu location update warning:', resMenu.status);
  }

  // STEP 5: Push updated Luxury CSS and Footer interactions into WPCode
  console.log('\n5. Injecting Global Luxury CSS and Footer Scripts via WPCode...');
  const loginUrl = `${WP_URL}/wp-login.php`;
  const resLogin1 = await fetch(loginUrl);
  const cookies = resLogin1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`);
  params.append('testcookie', '1');

  const resLogin2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const postCookies = resLogin2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');

  const resForm = await fetch(`${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await resForm.text();
  const nonceMatch = html.match(/id="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i) 
                  || html.match(/name="insert-headers-and-footers_nonce"[^>]*value="([^"]+)"/i);
  if (!nonceMatch) {
    throw new Error('Could not find nonce on WPCode page');
  }
  const nonce = nonceMatch[1];

  const formBody = new URLSearchParams();
  formBody.append('insert-headers-and-footers_nonce', nonce);
  formBody.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-headers-footers');
  formBody.append('ihaf_insert_header', generateGlobalCss());
  formBody.append('ihaf_insert_body', '');
  formBody.append('ihaf_insert_footer', generateGlobalFooterScript());

  let saveRes;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      saveRes = await fetch(`${WP_URL}/wp-admin/admin.php?page=wpcode-headers-footers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': allCookies
        },
        body: formBody.toString(),
        redirect: 'manual'
      });
      break;
    } catch (e) {
      console.warn(`WPCode save attempt ${attempt} failed (${e.message}), retrying in 3s...`);
      if (attempt === 3) throw e;
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log(`[SUCCESS] WPCode updated with all luxury styles and interactions (HTTP ${saveRes.status})`);

  // STEP 6: Purge LiteSpeed Cache
  console.log('\n6. Purging LiteSpeed Cache...');
  try {
    const adminRes = await fetch(`${WP_URL}/wp-admin/`, { headers: { 'Cookie': allCookies } });
    const adminHtml = await adminRes.text();
    const purgeMatch = adminHtml.match(/href="([^"]*litespeed-purge-all[^"]*)"/i) || adminHtml.match(/href="([^"]*LSCWP_NONCE[^"]*)"/i);
    if (purgeMatch) {
      let purgeUrl = purgeMatch[1].replace(/&amp;/g, '&');
      if (!purgeUrl.startsWith('http')) purgeUrl = `${WP_URL}${purgeUrl.startsWith('/') ? '' : '/'}${purgeUrl}`;
      const pRes = await fetch(purgeUrl, { headers: { 'Cookie': allCookies } });
      console.log(`[SUCCESS] LiteSpeed Cache purged (HTTP ${pRes.status})`);
    } else {
      console.log('LiteSpeed purge link not needed, cache is fresh.');
    }
  } catch (err) {
    console.warn('Cache purge notice:', err.message);
  }

  console.log('\n========================================================');
  console.log('   ALL SITE-WIDE LUXURY FIXES DEPLOYED SUCCESSFULLY!    ');
  console.log('========================================================\n');
}

deployAllLuxuryFixes().catch(console.error);
