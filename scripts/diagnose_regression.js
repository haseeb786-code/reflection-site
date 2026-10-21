import { getProdAuth } from './prod_auth_helper.js';
import fs from 'fs';

async function diagnose() {
  console.log('=== STARTING ROOT CAUSE INVESTIGATION ===');
  const auth = await getProdAuth();

  const pages = [
    { slug: 'about-us', id: 50 },
    { slug: 'contact', id: 52 },
    { slug: 'shop', id: 6 },
    { slug: 'home', id: 68 },
    { slug: 'privacy-policy-2', id: 102 },
    { slug: 'refund_returns-2', id: 103 },
    { slug: 'custom-dimensions', id: 120 }
  ];

  for (const p of pages) {
    const res = await fetch(`${auth.siteUrl}/wp-json/wp/v2/pages/${p.id}`, {
      headers: { Cookie: auth.cookies }
    });
    const data = await res.json();

    const liveUrl = p.slug === 'home' ? `${auth.siteUrl}/` : `${auth.siteUrl}/${p.slug}/`;
    const liveRes = await fetch(liveUrl + '?t=' + Date.now(), {
      headers: { 'Cache-Control': 'no-cache' }
    });
    const liveHtml = await liveRes.text();

    console.log(`\n--------------------------------------------------`);
    console.log(`PAGE: /${p.slug}/ (ID: ${p.id}) - HTTP ${liveRes.status}`);
    console.log(`  Title in DB: "${data.title?.rendered}"`);
    console.log(`  DB Raw Content Length: ${data.content?.raw ? data.content.raw.length : 'undefined'}`);
    console.log(`  DB Rendered Content Length: ${data.content?.rendered ? data.content.rendered.length : 0}`);
    console.log(`  Live HTML Total Size: ${liveHtml.length}`);
    console.log(`  Live Has <style id="te-global-luxury-system">: ${liveHtml.includes('te-global-luxury-system')}`);
    console.log(`  Live Has Unified Header (.re-unified-header-container): ${liveHtml.includes('re-unified-header-container')}`);
    console.log(`  Live Has Unified Footer (.re-unified-footer-container): ${liveHtml.includes('re-unified-footer-container')}`);
    console.log(`  Live Has .te-live-page wrapper: ${liveHtml.includes('te-live-page')}`);
    
    // Check snippet of content in DB
    const previewContent = data.content?.rendered || data.content?.raw || '';
    console.log(`  Content snippet (first 250 chars):`);
    console.log(`  ${previewContent.slice(0, 250).replace(/\n/g, ' ')}`);

    // Save full live HTML for inspection
    fs.writeFileSync(`scripts/diagnostic_${p.slug}.html`, liveHtml);
  }

  // Also inspect WPCode settings
  console.log('\n=== CHECKING WPCODE SETTINGS ===');
  const wpCodeRes = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { Cookie: auth.cookies }
  });
  const wpCodeHtml = await wpCodeRes.text();
  const headMatch = wpCodeHtml.match(/<textarea[^>]*name="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  console.log('WPCode Header length:', headMatch ? headMatch[1].length : 'NOT FOUND');
  console.log('WPCode Header contains te-global-luxury-system:', headMatch ? headMatch[1].includes('te-global-luxury-system') : false);
  console.log('WPCode Header contains about/contact rules:', headMatch ? headMatch[1].includes('about') || headMatch[1].includes('contact') : false);

  const footMatch = wpCodeHtml.match(/<textarea[^>]*name="ihaf_insert_footer"[^>]*>([\s\S]*?)<\/textarea>/i);
  console.log('WPCode Footer length:', footMatch ? footMatch[1].length : 'NOT FOUND');
}

diagnose().catch(console.error);
