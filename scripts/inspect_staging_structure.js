import fs from 'fs';

async function inspectStaging() {
  console.log('=== INSPECTING STAGING SITE STRUCTURE (reflectionelite.ataanalytiq.com) ===');
  
  // 1. Fetch public pages from staging
  console.log('\n1. Fetching pages from staging...');
  const resPages = await fetch('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages?per_page=100');
  if (resPages.ok) {
    const pages = await resPages.json();
    console.log(`Found ${pages.length} pages on staging:`);
    pages.forEach(p => {
      console.log(`  ID: ${p.id} | Slug: ${p.slug} | Title: "${p.title?.rendered}" | Status: ${p.status} | Link: ${p.link}`);
    });
  } else {
    console.error('Failed to fetch pages:', resPages.status);
  }

  // 2. Fetch products from staging
  console.log('\n2. Fetching products from staging...');
  const resProducts = await fetch('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/product?per_page=20');
  if (resProducts.ok) {
    const products = await resProducts.json();
    console.log(`Found ${products.length} products on staging:`);
    products.forEach(pr => {
      console.log(`  ID: ${pr.id} | Slug: ${pr.slug} | Title: "${pr.title?.rendered}" | Link: ${pr.link}`);
    });
  } else {
    console.log('Product endpoint not public or requires auth:', resProducts.status);
  }

  // 3. Inspect live site structure for Book Survey and navigation
  console.log('\n3. Checking live site (reflectionelite.com) pages for Book Survey & menus...');
  const resLivePages = await fetch('https://reflectionelite.com/wp-json/wp/v2/pages?per_page=100');
  if (resLivePages.ok) {
    const livePages = await resLivePages.json();
    console.log(`Found ${livePages.length} pages on live:`);
    livePages.forEach(p => {
      if (p.slug.includes('survey') || p.slug.includes('book') || p.slug.includes('consult') || p.slug.includes('custom') || p.title?.rendered.toLowerCase().includes('survey')) {
        console.log(`  * MATCH ON LIVE: ID ${p.id} | Slug: ${p.slug} | Title: "${p.title?.rendered}" | Link: ${p.link}`);
      }
    });
  }
}

inspectStaging().catch(console.error);
