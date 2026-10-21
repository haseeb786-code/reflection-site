import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

async function getFreshNonce() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/index.php', {
    headers: {
      'Cookie': cookieHeader,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const html = await res.text();
  const match = html.match(/wpApiSettings\s*=\s*\{[^}]*?"nonce":"([^"]+)"/);
  if (!match) throw new Error('Could not extract fresh nonce from wp-admin/index.php');
  console.log('Obtained fresh WP Nonce on staging:', match[1]);
  return match[1];
}

async function realignPolicies() {
  const nonce = await getFreshNonce();

  // 1. Read real live policies
  let livePrivacy = fs.readFileSync('live_page_102_privacy-policy-2.html', 'utf8');
  let liveRefund = fs.readFileSync('live_page_103_refund_returns-2.html', 'utf8');

  // Replace live domain with staging domain in content
  const stagingLogoHtml = `<a href="https://reflectionelite.ataanalytiq.com/" class="header-logo"><img decoding="async" src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/Logo-Reflection-e1777369196767-1024x186.png" alt="Reflection Elite" style="height:40px; width:auto; display:block;"></a>`;

  function adaptToStaging(html) {
    let out = html.replace(/https:\/\/reflectionelite\.com\//g, 'https://reflectionelite.ataanalytiq.com/');
    out = out.replace(/<a href="\/" class="header-logo"[\s\S]*?<\/a>/i, stagingLogoHtml);
    return out;
  }

  livePrivacy = adaptToStaging(livePrivacy);
  liveRefund = adaptToStaging(liveRefund);

  // 2. Update Page 1511 (privacy-policy-2) on staging with exact live content
  console.log('1. Updating Page 1511 on staging with real live Privacy Policy content...');
  const resPrivacy = await fetch('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/1511', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieHeader,
      'X-WP-Nonce': nonce
    },
    body: JSON.stringify({
      title: 'Privacy Policy',
      content: livePrivacy,
      template: 'elementor_canvas',
      meta: { _elementor_edit_mode: '' }
    })
  });
  console.log('Privacy policy update status:', resPrivacy.status);

  // 3. Update Page 1519 on staging with exact live Refund & Returns content
  console.log('2. Updating Page 1519 on staging with real live Refund & Returns Policy content...');
  const resRefund = await fetch('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/1519', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieHeader,
      'X-WP-Nonce': nonce
    },
    body: JSON.stringify({
      title: 'Refund & Returns Policy',
      slug: 'refund-policy',
      content: liveRefund,
      template: 'elementor_canvas',
      meta: { _elementor_edit_mode: '' }
    })
  });
  console.log('Refund policy update status:', resRefund.status);

  // Also check if refund_returns-2 slug exists on staging or create a redirection/page for it
  const resRefund2 = await fetch('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages?slug=refund_returns-2', {
    headers: { Cookie: cookieHeader }
  });
  const existingRefund2 = await resRefund2.json();
  if (!Array.isArray(existingRefund2) || existingRefund2.length === 0) {
    console.log('Creating refund_returns-2 alias page on staging so both slugs work...');
    await fetch('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
        'X-WP-Nonce': nonce
      },
      body: JSON.stringify({
        title: 'Refund & Returns Policy',
        slug: 'refund_returns-2',
        status: 'publish',
        content: liveRefund,
        template: 'elementor_canvas',
        meta: { _elementor_edit_mode: '' }
      })
    });
  }

  // 4. Trash / Unpublish the invented pages: Page 1598 (shipping-policy) and Page 1615 (terms-of-service)
  console.log('3. Trashing invented boilerplate pages on staging (shipping-policy, terms-of-service)...');
  const trashShipping = await fetch('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/1598', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieHeader,
      'X-WP-Nonce': nonce
    },
    body: JSON.stringify({ status: 'draft' })
  });
  console.log('Drafted shipping-policy (ID 1598):', trashShipping.status);

  const trashTerms = await fetch('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/1615', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieHeader,
      'X-WP-Nonce': nonce
    },
    body: JSON.stringify({ status: 'draft' })
  });
  console.log('Drafted terms-of-service (ID 1615):', trashTerms.status);

  // 5. Update header navigation and footers on core staging pages to remove references to shipping-policy and terms-of-service
  console.log('4. Updating staging core pages navigation: POLICIES -> /refund-policy/ (or /privacy-policy-2/)...');
  const coreIds = [52, 7, 1144, 674, 943, 8, 9, 2027];
  for (const id of coreIds) {
    const res = await fetch(`https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/${id}`, {
      headers: { Cookie: cookieHeader }
    });
    if (!res.ok) continue;
    const d = await res.json();
    let c = d.content?.raw || d.content?.rendered || '';
    let changed = false;

    // Update POLICIES link in nav to /refund-policy/
    if (c.includes('href="https://reflectionelite.ataanalytiq.com/shipping-policy/"')) {
      c = c.replace(/href="https:\/\/reflectionelite\.ataanalytiq\.com\/shipping-policy\/"/g, 'href="https://reflectionelite.ataanalytiq.com/refund-policy/"');
      changed = true;
    }
    if (c.includes('href="/shipping-policy/"')) {
      c = c.replace(/href="\/shipping-policy\/"/g, 'href="/refund-policy/"');
      changed = true;
    }

    // In footer, replace terms-of-service link with refund-policy or privacy-policy
    if (c.includes('terms-of-service')) {
      c = c.replace(/<a[^>]*href="[^"]*terms-of-service[^"]*"[^>]*>.*?<\/a>/gi, '<a href="https://reflectionelite.ataanalytiq.com/refund-policy/">Refund Policy</a>');
      changed = true;
    }

    if (changed) {
      await fetch(`https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookieHeader,
          'X-WP-Nonce': nonce
        },
        body: JSON.stringify({ content: c, template: 'elementor_canvas', meta: { _elementor_edit_mode: '' } })
      });
      console.log(`  ✓ Updated links on Page ${id}`);
    }
  }

  console.log('✓ Staging policies realigned strictly to real live content!');
}

realignPolicies().catch(console.error);
