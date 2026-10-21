import { getProdAuth } from './prod_auth_helper.js';
import fs from 'fs';

async function main() {
  const auth = await getProdAuth();
  console.log('1. Fetching current Page 68 from WP REST API...');
  const res = await fetch(`${auth.siteUrl}/wp-json/wp/v2/pages/68?context=edit`, {
    headers: { Cookie: auth.cookies, 'X-WP-Nonce': auth.nonce }
  });
  const data = await res.json();
  const raw = data.content?.raw || '';
  console.log('Fetched raw length:', raw.length);

  // 2. Save full backup
  fs.writeFileSync('backups/page_68_pre_showcase_addition_20261019.html', raw, 'utf8');
  console.log('✓ Saved backups/page_68_pre_showcase_addition_20261019.html');

  // 3. Locate Block 1: <div class="re-hero-content-block">...</div>
  const blockStart = raw.indexOf('<div class="re-hero-content-block">');
  if (blockStart === -1) {
    throw new Error('Could not find <div class="re-hero-content-block"> in Page 68 raw content!');
  }

  // Also include the comment right before it if present
  let commentStart = raw.lastIndexOf('<!-- Structured Text Block', blockStart);
  let replaceStart = commentStart !== -1 ? commentStart : blockStart;

  const blockEnd = raw.indexOf('</div>', raw.indexOf('</div>', raw.indexOf('</div>', blockStart) + 1) + 1); // nested divs: tagline, h1, cta buttons (with 2 a's), close content-block
  // Safer: find closing </section> of re-hero-section
  const sectionEnd = raw.indexOf('</section>', blockStart);
  if (sectionEnd === -1) {
    throw new Error('Could not find </section> after hero content block!');
  }

  const removedBlock = raw.substring(replaceStart, sectionEnd).trim();
  fs.writeFileSync('backups/page_68_removed_block_1.html', removedBlock, 'utf8');
  console.log('✓ Saved exact removed block to backups/page_68_removed_block_1.html:');
  console.log(removedBlock);

  // New content insertion:
  // After </section>, insert screen-reader H1, [te_category_showcase], [te_duo_showcase]
  const INSERTION = `
  <h1 class="screen-reader-text" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">Reflection Elite - Handcrafted Luxury Mirrors</h1>

  <!-- CATEGORY SHOWCASE SECTION -->
  [te_category_showcase]

  <!-- DUO MIRROR SHOWCASE SECTION -->
  [te_duo_showcase]
`;

  // Construct new page content:
  // 1) From start up to replaceStart (which removes the comment and re-hero-content-block)
  // 2) Keep the </section> of re-hero-section
  // 3) Append INSERTION
  // 4) Continue with rest of raw after </section>
  const beforeBlock = raw.substring(0, replaceStart).trimEnd() + '\n  ';
  const afterSection = raw.substring(sectionEnd + '</section>'.length);

  const updatedRaw = beforeBlock + '</section>' + INSERTION + afterSection;
  console.log('Updated content length:', updatedRaw.length);

  // Verify deletion
  if (updatedRaw.includes('ELEVATE YOUR') || updatedRaw.includes('THE ART OF REFLECTION')) {
    throw new Error('Sanity check failed: updated content still contains removed text!');
  }
  if (!updatedRaw.includes('[te_category_showcase]') || !updatedRaw.includes('[te_duo_showcase]')) {
    throw new Error('Sanity check failed: shortcodes not present in updated content!');
  }

  // 4. Update Page 68 via REST API
  console.log('2. Updating Page 68 via WP REST API...');
  const updateRes = await fetch(`${auth.siteUrl}/wp-json/wp/v2/pages/68`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: auth.cookies,
      'X-WP-Nonce': auth.nonce
    },
    body: JSON.stringify({
      content: updatedRaw
    })
  });

  const updateData = await updateRes.json();
  if (updateRes.status !== 200) {
    throw new Error(`Failed to update page 68: ${updateRes.status} ${JSON.stringify(updateData)}`);
  }
  console.log('✓ Page 68 updated successfully (status 200)!');

  // 5. Purge Hostinger Cache
  console.log('3. Purging Hostinger cache...');
  try {
    const purgeRes = await fetch(`${auth.siteUrl}/wp-json/hostinger-tools-plugin/v1/clear-cache`, {
      method: 'DELETE',
      headers: { Cookie: auth.cookies, 'X-WP-Nonce': auth.nonce }
    });
    console.log('Hostinger clear-cache status:', purgeRes.status);
  } catch (err) {
    console.warn('Cache clear warning:', err.message);
  }

  // 6. Test frontend render
  console.log('4. Checking live frontend HTML render...');
  const frontRes = await fetch(`${auth.siteUrl}/?nocache=${Date.now()}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const frontHtml = await frontRes.text();
  console.log('Frontend fetch status:', frontRes.status);
  console.log('Contains te-cat-showcase-section:', frontHtml.includes('te-cat-showcase-section'));
  console.log('Contains te-duo-showcase-section:', frontHtml.includes('te-duo-showcase-section'));
  console.log('Contains screen-reader H1:', frontHtml.includes('Reflection Elite - Handcrafted Luxury Mirrors'));
  console.log('Contains old ELEVATE YOUR:', frontHtml.includes('ELEVATE YOUR'));
  console.log('Contains old THE ART OF REFLECTION:', frontHtml.includes('THE ART OF REFLECTION'));

  const h1Matches = frontHtml.match(/<h1[\s\S]*?<\/h1>/gi) || [];
  console.log('Frontend <h1> count:', h1Matches.length);
  h1Matches.forEach((h, i) => console.log(`  H1 [${i}]:`, h.replace(/\s+/g, ' ')));
}

main().catch(err => {
  console.error('ERROR in update_page_68_restructure:', err);
  process.exit(1);
});
