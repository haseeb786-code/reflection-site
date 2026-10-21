import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

const TARGET_PAGES = [
  { id: 52, slug: 'home', label: 'Home' },
  { id: 7, slug: 'shop', label: 'Shop' },
  { id: 1144, slug: 'product', label: 'Product' },
  { id: 674, slug: 'about-us', label: 'About Us' },
  { id: 943, slug: 'contact', label: 'Contact' },
  { id: 1511, slug: 'privacy-policy-2', label: 'Privacy Policy' },
  { id: 1519, slug: 'refund-policy', label: 'Refund Policy' },
  { id: 1598, slug: 'shipping-policy', label: 'Shipping Policy' },
  { id: 1615, slug: 'terms-of-service', label: 'Terms of Service' },
  { id: 8, slug: 'cart', label: 'Cart' },
  { id: 9, slug: 'checkout', label: 'Checkout' }
];

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

async function alignStagingPages() {
  const nonce = await getFreshNonce();

  for (const item of TARGET_PAGES) {
    console.log(`\nFetching Page ${item.id} (${item.slug} - ${item.label})...`);
    const fetchRes = await fetch(`https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/${item.id}`, {
      headers: { Cookie: cookieHeader }
    });
    if (!fetchRes.ok) {
      console.error(`Failed to fetch page ${item.id}:`, fetchRes.status);
      continue;
    }

    const pageData = await fetchRes.json();
    let content = pageData.content?.raw || pageData.content?.rendered || '';

    let changed = false;

    // 1. Align Announcement Bar
    if (content.includes('FREE COMPREHENSIVE ON-SITE CONSULTATION')) {
      content = content.replace(
        /FREE COMPREHENSIVE ON-SITE CONSULTATION &amp; LASER TEMPLATING &bull; BESPOKE LUXURY MIRRORS/g,
        'Complimentary Insured White-Glove Logistics &amp; Laser Templating Across India'
      );
      content = content.replace(
        /FREE COMPREHENSIVE ON-SITE CONSULTATION & LASER TEMPLATING • BESPOKE LUXURY MIRRORS/g,
        'Complimentary Insured White-Glove Logistics & Laser Templating Across India'
      );
      changed = true;
      console.log(`  ✓ Updated announcement bar text on Page ${item.id}`);
    }

    // 2. Align Action Button to point to custom-dimensions
    if (content.includes('href="https://reflectionelite.ataanalytiq.com/contact/" class="header-quote-btn"') ||
        content.includes('href="/contact/" class="header-quote-btn"')) {
      content = content.replace(
        /href="https:\/\/reflectionelite\.ataanalytiq\.com\/contact\/" class="header-quote-btn"/g,
        'href="https://reflectionelite.ataanalytiq.com/custom-dimensions/" class="header-quote-btn"'
      );
      content = content.replace(
        /href="\/contact\/" class="header-quote-btn"/g,
        'href="https://reflectionelite.ataanalytiq.com/custom-dimensions/" class="header-quote-btn"'
      );
      changed = true;
      console.log(`  ✓ Updated BOOK SURVEY button link to /custom-dimensions/ on Page ${item.id}`);
    }

    if (!changed) {
      console.log(`  No changes needed for Page ${item.id}`);
      continue;
    }

    const updatePayload = {
      content: content,
      template: pageData.template || 'elementor_canvas',
      meta: {
        _elementor_edit_mode: ''
      }
    };

    const updateRes = await fetch(`https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/${item.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
        'X-WP-Nonce': nonce
      },
      body: JSON.stringify(updatePayload)
    });

    if (!updateRes.ok) {
      console.error(`  Error saving Page ${item.id}:`, updateRes.status, await updateRes.text());
    } else {
      console.log(`  ✓ Page ${item.id} successfully updated on staging!`);
    }
  }
}

alignStagingPages().catch(console.error);
