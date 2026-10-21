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

async function createCustomDimensionsPage() {
  const nonce = await getFreshNonce();

  // Read the content from page_120_live_content.html
  let content = fs.readFileSync('page_120_live_content.html', 'utf8');

  // Replace live URLs with staging URLs if needed
  content = content.replace(/https:\/\/reflectionelite\.com\/custom-dimensions\//g, 'https://reflectionelite.ataanalytiq.com/custom-dimensions/');
  content = content.replace(/https:\/\/reflectionelite\.com\/shop\//g, 'https://reflectionelite.ataanalytiq.com/shop/');
  content = content.replace(/https:\/\/reflectionelite\.com\/contact\//g, 'https://reflectionelite.ataanalytiq.com/contact/');
  content = content.replace(/https:\/\/reflectionelite\.com\/about-us\//g, 'https://reflectionelite.ataanalytiq.com/about-us/');
  content = content.replace(/https:\/\/reflectionelite\.com\/cart\//g, 'https://reflectionelite.ataanalytiq.com/cart/');
  content = content.replace(/https:\/\/reflectionelite\.com\//g, 'https://reflectionelite.ataanalytiq.com/');

  // Ensure announcement bar has exact live text
  content = content.replace(/Complimentary Insured White-Glove Logistics &amp; Laser Templating Across India/g, 'Complimentary Insured White-Glove Logistics &amp; Laser Templating Across India');

  // Ensure header has the brand logo image matching staging style
  const stagingLogoHtml = `<a href="https://reflectionelite.ataanalytiq.com/" class="header-logo"><img decoding="async" src="https://reflectionelite.ataanalytiq.com/wp-content/uploads/2026/04/Logo-Reflection-e1777369196767-1024x186.png" alt="Reflection Elite" style="height:40px; width:auto; display:block;"></a>`;
  content = content.replace(/<a href="\/" class="header-logo"[\s\S]*?<\/a>/i, stagingLogoHtml);

  // Check if custom-dimensions page already exists on staging
  const checkRes = await fetch('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages?slug=custom-dimensions', {
    headers: { Cookie: cookieHeader }
  });
  const existing = await checkRes.json();

  let targetId = null;
  let method = 'POST';
  let endpoint = 'https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages';

  if (Array.isArray(existing) && existing.length > 0) {
    targetId = existing[0].id;
    endpoint = `https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/${targetId}`;
    console.log(`Found existing custom-dimensions page (ID: ${targetId}), updating...`);
  } else {
    console.log('Creating new custom-dimensions page on staging...');
  }

  const payload = {
    title: 'Custom Dimensions & Bespoke Design',
    slug: 'custom-dimensions',
    status: 'publish',
    template: 'elementor_canvas',
    content: content,
    meta: {
      _elementor_edit_mode: ''
    }
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieHeader,
      'X-WP-Nonce': nonce
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to save custom-dimensions page: HTTP ${res.status} - ${errText}`);
  }

  const result = await res.json();
  console.log(`✓ Custom Dimensions page published successfully!`);
  console.log(`  ID: ${result.id}`);
  console.log(`  URL: ${result.link}`);
}

createCustomDimensionsPage().catch(console.error);
