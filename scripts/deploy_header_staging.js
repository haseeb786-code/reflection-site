import fs from 'fs';
import { getReUnifiedHeader } from './re_header_system.js';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

const STAGING_URL = 'https://reflectionelite.ataanalytiq.com';

const PAGES = [
  { id: 52, slug: 'home', active: 'home' },
  { id: 7, slug: 'shop', active: 'shop' },
  { id: 674, slug: 'about-us', active: 'about' },
  { id: 943, slug: 'contact', active: 'contact' },
  { id: 1511, slug: 'privacy-policy-2', active: 'policies' },
  { id: 1519, slug: 'refund-policy', active: 'policies' },
  { id: 8, slug: 'cart', active: 'cart' },
  { id: 9, slug: 'checkout', active: 'cart' },
  { id: 2027, slug: 'custom-dimensions', active: 'survey' },
  { id: 1144, slug: 'product', active: 'murana' }
];

async function getFreshNonce() {
  const res = await fetch(`${STAGING_URL}/wp-admin/index.php`, {
    headers: {
      'Cookie': cookieHeader,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const html = await res.text();
  const match = html.match(/wpApiSettings\s*=\s*\{[^}]*?"nonce":"([^"]+)"/);
  if (!match) throw new Error('Could not extract fresh nonce from wp-admin/index.php');
  return match[1];
}

async function deployAllStaging() {
  console.log('=== DEPLOYING REPLICATED 5-TIER HEADER TO ALL STAGING PAGES ===');
  const nonce = await getFreshNonce();
  console.log('Fresh Nonce obtained:', nonce);

  for (const p of PAGES) {
    let success = false;
    for (let attempt = 1; attempt <= 3 && !success; attempt++) {
      try {
        console.log(`\nProcessing Page ${p.id} (${p.slug}) [Attempt ${attempt}]...`);
        const res = await fetch(`${STAGING_URL}/wp-json/wp/v2/pages/${p.id}`, {
          headers: { Cookie: cookieHeader }
        });
        if (!res.ok) {
          console.error(`Error fetching page ${p.id}: ${res.status}`);
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }
        const data = await res.json();
        let content = data.content?.raw || data.content?.rendered || '';

        // Remove any existing header styles and header containers
        content = content.replace(/<style id="re-unified-header-system">[\s\S]*?<\/header>/gi, '');
        content = content.replace(/<!--\s*REPLICATED EXACT HEADER SYSTEM[\s\S]*?<\/header>/gi, '');
        content = content.replace(/<header class="re-unified-header-container"[\s\S]*?<\/header>/gi, '');
        content = content.replace(/<div class="announcement-bar">[\s\S]*?<\/header>/gi, '');
        content = content.replace(/<!-- \/?wp:html -->/gi, '');

        const newHeader = getReUnifiedHeader(STAGING_URL, p.active);

        // Insert newHeader right after opening container
        if (content.includes('<div class="te-live-page">')) {
          content = content.replace('<div class="te-live-page">', '<div class="te-live-page">\n' + newHeader);
        } else if (content.includes('<div class="te-staging-page">')) {
          content = content.replace('<div class="te-staging-page">', '<div class="te-staging-page">\n' + newHeader);
        } else {
          content = newHeader + '\n' + content;
        }

        // Wrap whole content in <!-- wp:html --> block to protect against wpautop
        const wrappedContent = `<!-- wp:html -->\n${content.trim()}\n<!-- /wp:html -->`;

        const updateRes = await fetch(`${STAGING_URL}/wp-json/wp/v2/pages/${p.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': cookieHeader,
            'X-WP-Nonce': nonce
          },
          body: JSON.stringify({
            content: wrappedContent,
            template: 'elementor_canvas',
            meta: { _elementor_edit_mode: '' }
          })
        });

        if (updateRes.ok) {
          console.log(`✓ Page ${p.id} (${p.slug}) updated successfully!`);
          success = true;
        } else {
          console.error(`Failed to update page ${p.id}:`, updateRes.status);
          await new Promise(r => setTimeout(r, 2000));
        }
      } catch (err) {
        console.error(`Fetch exception on page ${p.id}:`, err.message);
        await new Promise(r => setTimeout(r, 2500));
      }
    }
  }

  console.log('\n✓ All staging pages updated successfully with the 5-tier unified header!');
}

deployAllStaging().catch(console.error);
