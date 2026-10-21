import { getProdAuth } from './prod_auth_helper.js';

const NEW_CATEGORY_SHOWCASE_HTML = `
      <!-- CATEGORY SHOWCASE SECTION -->
      <section class="te-cat-showcase-section" id="teCatShowcase">
        <div class="te-cat-showcase-container">
          <div class="te-cat-showcase-grid">
            <div class="te-cat-list-col">
              <nav class="te-cat-nav-list" aria-label="Mirror Categories Showcase">
                <div class="te-cat-item">
                  <a href="https://reflectionelite.com/product-category/led-mirror/" class="te-cat-link" title="Explore LED Mirrors">
                    <span class="te-cat-name">LED</span><span class="te-cat-num">(01)</span>
                  </a>
                </div>
                <div class="te-cat-item">
                  <a href="https://reflectionelite.com/product-category/frame-mirror/" class="te-cat-link" title="Explore Frame Mirrors">
                    <span class="te-cat-name">FRAME</span><span class="te-cat-num">(02)</span>
                  </a>
                </div>
                <div class="te-cat-item">
                  <a href="https://reflectionelite.com/product-category/diy-glass-mirror/" class="te-cat-link" title="Explore DIY Glass Mirrors">
                    <span class="te-cat-name">DIY GLASS</span><span class="te-cat-num">(03)</span>
                  </a>
                </div>
                <div class="te-cat-item">
                  <a href="https://reflectionelite.com/product-category/venetian-mirror/" class="te-cat-link" title="Explore Venetian Mirrors">
                    <span class="te-cat-name">VENETIAN</span><span class="te-cat-num">(04)</span>
                  </a>
                </div>
                <div class="te-cat-item">
                  <a href="https://reflectionelite.com/product-category/vanished-murano-mirror/" class="te-cat-link" title="Explore Vanished Murano Mirrors">
                    <span class="te-cat-name">VANISHED MURANO</span><span class="te-cat-num">(05)</span>
                  </a>
                </div>
              </nav>
            </div>
            <div class="te-cat-media-col">
              <div class="te-cat-frame-wrap">
                <a href="https://reflectionelite.com/product-category/led-mirror/" title="View Arched LED Mirrors">
                  <img loading="lazy" decoding="async" src="https://reflectionelite.com/wp-content/uploads/2026/10/arched-led-contemporary-mirror.png" alt="Arched LED backlit luxury vanity mirror" class="te-cat-showcase-img" width="832" height="1248" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
`.trim();

async function updatePage68() {
  const { siteUrl, cookies, nonce } = await getProdAuth();
  console.log('1. Authenticated to:', siteUrl);

  const pageRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/68?context=edit`, {
    headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
  });
  const pageData = await pageRes.json();
  let content = pageData.content?.raw || '';

  const catRegex = /<!--\s*CATEGORY SHOWCASE SECTION\s*-->[\s\S]*?<\/section>/i;
  const catRegexFallback = /<section[^>]*class="[^"]*te-cat-showcase-section[^"]*"[\s\S]*?<\/section>/i;

  if (catRegex.test(content)) {
    content = content.replace(catRegex, NEW_CATEGORY_SHOWCASE_HTML);
    console.log('✓ Replaced category showcase section via catRegex');
  } else if (catRegexFallback.test(content)) {
    content = content.replace(catRegexFallback, NEW_CATEGORY_SHOWCASE_HTML);
    console.log('✓ Replaced category showcase section via fallback regex');
  } else {
    throw new Error('Category showcase section not found in page 68 raw content!');
  }

  console.log('2. Updating page 68...');
  const updateRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/68`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookies,
      'X-WP-Nonce': nonce
    },
    body: JSON.stringify({ content })
  });

  if (updateRes.ok) {
    console.log('✓ Page 68 updated successfully!');
  } else {
    const err = await updateRes.text();
    throw new Error('Failed to update page 68: ' + err.slice(0, 300));
  }

  // Purge cache
  console.log('3. Purging Hostinger CDN & server cache...');
  const purgeRes = await fetch(`${siteUrl}/wp-json/hostinger-tools-plugin/v1/clear-cache`, {
    method: 'DELETE',
    headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
  });
  console.log('✓ Cache purge HTTP status:', purgeRes.status);
}

updatePage68().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});
