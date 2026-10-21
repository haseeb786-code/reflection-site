import { getProdAuth } from './prod_auth_helper.js';
import fs from 'fs';

async function main() {
  const auth = await getProdAuth();

  // 1. Check PHP snippet support in WPCode
  const res = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-snippet-manager&custom=1`, {
    headers: { Cookie: auth.cookies }
  });
  const html = await res.text();
  const hasPhpType = html.includes('value="php"');
  const isPhpDisabled = html.includes('value="php" disabled');
  console.log('1. WPCode PHP snippet support:');
  console.log('   - value="php" present:', hasPhpType);
  console.log('   - value="php" disabled:', isPhpDisabled);

  // 2. Check for the arched LED mirror image in media library
  console.log('\n2. Searching media library for arched LED mirror image...');
  const mediaRes = await fetch(`${auth.siteUrl}/wp-json/wp/v2/media?per_page=100`, {
    headers: { Cookie: auth.cookies, 'X-WP-Nonce': auth.nonce }
  });
  const mediaItems = await mediaRes.json();
  const candidateImages = mediaItems.map(m => ({
    id: m.id,
    title: m.title?.rendered,
    slug: m.slug,
    url: m.source_url
  })).filter(m => /led|arch|mirror|vanity|bath/i.test(m.title + ' ' + m.slug + ' ' + m.url));
  console.log('   - Candidate media in WP:', candidateImages);

  // 3. Check Page 68 for "THE ART OF REFLECTION" / "ELEVATE YOUR SANCTUARY"
  console.log('\n3. Checking Homepage (Page 68) content to be deleted...');
  const pageRes = await fetch(`${auth.siteUrl}/wp-json/wp/v2/pages/68?context=edit`, {
    headers: { Cookie: auth.cookies, 'X-WP-Nonce': auth.nonce }
  });
  const pageData = await pageRes.json();
  const raw = pageData.content?.raw || '';
  const hasArt = raw.includes('THE ART OF REFLECTION');
  const hasElevate = raw.includes('ELEVATE YOUR SANCTUARY');
  const hasExplore = raw.includes('EXPLORE THE COLLECTION');
  const hasBespoke = raw.includes('COMMISSION BESPOKE');
  console.log('   - "THE ART OF REFLECTION" found:', hasArt);
  console.log('   - "ELEVATE YOUR SANCTUARY" found:', hasElevate);
  console.log('   - "EXPLORE THE COLLECTION" found:', hasExplore);
  console.log('   - "COMMISSION BESPOKE" found:', hasBespoke);

  // 4. Check H1 count on Homepage
  const h1Matches = [...raw.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  console.log('   - H1 tags found in Page 68:', h1Matches.map(m => m[0]));

  // 5. Check WooCommerce categories and real counts
  console.log('\n4. Checking WooCommerce categories & counts...');
  const catRes = await fetch(`${auth.siteUrl}/wp-json/wc/v3/products/categories?per_page=50`, {
    headers: {
      Cookie: auth.cookies,
      'X-WP-Nonce': auth.nonce
    }
  });
  if (catRes.ok) {
    const cats = await catRes.json();
    console.log('   - WooCommerce Categories:', cats.map(c => ({ id: c.id, name: c.name, slug: c.slug, count: c.count })));
  } else {
    // Try WP terms
    const termRes = await fetch(`${auth.siteUrl}/wp-json/wp/v2/product_cat?per_page=50`, {
      headers: { Cookie: auth.cookies, 'X-WP-Nonce': auth.nonce }
    });
    const terms = await termRes.json();
    console.log('   - WP Terms (product_cat):', terms.map(c => ({ id: c.id, name: c.name, slug: c.slug, count: c.count })));
  }
}

main().catch(console.error);
