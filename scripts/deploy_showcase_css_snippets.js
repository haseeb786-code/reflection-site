import { getProdAuth } from './prod_auth_helper.js';

async function createSnippet(auth, title, code) {
  console.log(`Creating WPCode snippet: "${title}"...`);
  const formPageRes = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-snippet-manager&custom=1`, {
    headers: { 'Cookie': auth.cookies }
  });
  const html = await formPageRes.text();
  const nonce = (html.match(/name="wpcode-save-snippet-nonce"[^>]*value="([^"]+)"/i) || [])[1];
  if (!nonce) throw new Error('Could not get nonce for ' + title);

  const params = new URLSearchParams();
  params.append('wpcode_snippet_title', title);
  params.append('wpcode_active', '1');
  params.append('wpcode_snippet_type', 'html');
  params.append('wpcode_snippet_code', code);
  params.append('wpcode_auto_insert', '1');
  params.append('wpcode_auto_insert_location', 'site_wide_header');
  params.append('wpcode_priority', '10');
  params.append('wpcode-save-snippet-nonce', nonce);
  params.append('_wp_http_referer', '/wp-admin/admin.php?page=wpcode-snippet-manager&custom=1');

  const res = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-snippet-manager`, {
    method: 'POST',
    headers: {
      'Cookie': auth.cookies,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString(),
    redirect: 'manual'
  });

  console.log(`✓ Post status for ${title}:`, res.status);
  const location = res.headers.get('location');
  console.log(`  Location:`, location);
}

const CATEGORY_SHOWCASE_CSS = `
<style id="te-category-showcase-css">
/* ============================================================
   SNIPPET: te-category-showcase
   Scope: Category Showcase Section on Homepage
   ============================================================ */
.te-cat-showcase-section {
  background: #000000 !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 96px 0 !important;
  box-sizing: border-box !important;
  position: relative !important;
  clear: both !important;
}
.te-cat-showcase-container {
  max-width: 1200px !important;
  margin: 0 auto !important;
  padding: 0 24px !important;
  box-sizing: border-box !important;
}
.te-cat-showcase-grid {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 48px !important;
}
.te-cat-list-col {
  flex: 0 0 54% !important;
  max-width: 54% !important;
}
.te-cat-nav-list {
  display: flex !important;
  flex-direction: column !important;
  gap: 26px !important;
}
.te-cat-item {
  display: block !important;
  line-height: 1.15 !important;
}
.te-cat-name {
  font-family: var(--font-trajan), 'Cinzel', serif !important;
  font-size: clamp(38px, 4vw, 58px) !important;
  color: #f2ece4 !important;
  letter-spacing: 0.05em !important;
  text-transform: uppercase !important;
  font-weight: 400 !important;
  display: inline-block !important;
}
.te-cat-cap {
  font-size: 1.18em !important;
}
.te-cat-num {
  font-family: var(--font-trajan), 'Cinzel', serif !important;
  font-size: 0.42em !important;
  vertical-align: super !important;
  margin-left: 6px !important;
  color: #f2ece4 !important;
  font-weight: normal !important;
}
.te-cat-link {
  display: inline-flex !important;
  align-items: baseline !important;
  text-decoration: none !important;
  color: inherit !important;
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.4, 1), color 0.3s ease !important;
}
.te-cat-link:hover,
.te-cat-link:focus {
  color: var(--color-gold, #c5a880) !important;
  transform: translateX(6px) !important;
  text-decoration: underline !important;
  text-decoration-color: var(--color-gold, #c5a880) !important;
  text-underline-offset: 6px !important;
}
.te-cat-link:hover .te-cat-name,
.te-cat-link:focus .te-cat-name,
.te-cat-link:hover .te-cat-num,
.te-cat-link:focus .te-cat-num {
  color: var(--color-gold, #c5a880) !important;
}
.te-cat-link:focus {
  outline: 2px solid var(--color-gold, #c5a880) !important;
  outline-offset: 4px !important;
}
.te-cat-item-plain {
  color: #f2ece4 !important;
  cursor: default !important;
  user-select: none !important;
}

.te-cat-media-col {
  flex: 0 0 42% !important;
  max-width: 480px !important;
  margin: 0 auto !important;
}
.te-cat-frame-wrap {
  border: 1.5px solid rgba(197, 168, 128, 0.45) !important;
  border-radius: 8px !important;
  overflow: hidden !important;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7) !important;
  background: #08090b !important;
}
.te-cat-showcase-img {
  width: 100% !important;
  height: auto !important;
  aspect-ratio: 4 / 5 !important;
  object-fit: cover !important;
  object-position: center top !important;
  display: block !important;
}

@media (max-width: 768px) {
  .te-cat-showcase-section {
    padding: 56px 0 !important;
  }
  .te-cat-showcase-container {
    padding: 0 20px !important;
  }
  .te-cat-showcase-grid {
    flex-direction: column !important;
    gap: 36px !important;
  }
  .te-cat-list-col {
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }
  .te-cat-nav-list {
    gap: 18px !important;
  }
  .te-cat-name {
    font-size: clamp(28px, 7vw, 38px) !important;
  }
  .te-cat-media-col {
    flex: 0 0 100% !important;
    max-width: 100% !important;
    width: 100% !important;
  }
}
@media (prefers-reduced-motion: reduce) {
  .te-cat-link {
    transition: none !important;
    transform: none !important;
  }
  .te-cat-link:hover,
  .te-cat-link:focus {
    transform: none !important;
  }
}
</style>
`.trim();

const DUO_SHOWCASE_CSS = `
<style id="te-duo-showcase-css">
/* ============================================================
   SNIPPET: te-duo-showcase
   Scope: Duo Mirror Showcase (Silver Crown & Rococo Floral)
   ============================================================ */
.te-duo-showcase-section {
  background: #ffffff !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 72px 0 !important;
  box-sizing: border-box !important;
  position: relative !important;
  clear: both !important;
}
.te-duo-showcase-container {
  max-width: 1400px !important;
  margin: 0 auto !important;
  padding: 0 24px !important;
  box-sizing: border-box !important;
}
.te-duo-showcase-grid {
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  gap: 28px !important;
  align-items: stretch !important;
}
.te-duo-panel {
  display: flex !important;
  flex-direction: column !important;
  position: relative !important;
}
.te-duo-panel-inner {
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
  background: #fbfbfc !important;
  border-radius: 2px !important;
  overflow: hidden !important;
  box-sizing: border-box !important;
}
.te-duo-panel-left .te-duo-panel-inner {
  justify-content: center !important;
  align-items: center !important;
  padding: 36px 24px !important;
  cursor: default !important;
  user-select: none !important;
}
.te-duo-panel-right .te-duo-panel-inner {
  padding: 24px 24px 36px 24px !important;
}

/* Left panel explicitly non-clickable */
.te-duo-panel-left,
.te-duo-panel-left * {
  cursor: default !important;
}

/* Right panel clickable link */
.te-duo-card-link {
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
  text-decoration: none !important;
  color: inherit !important;
  outline: none !important;
}
.te-duo-card-link:focus-visible .te-duo-panel-inner {
  outline: 2px solid var(--color-gold, #c5a880) !important;
  outline-offset: 3px !important;
}

/* Caption Row */
.te-duo-caption-row {
  display: flex !important;
  justify-content: space-between !important;
  align-items: baseline !important;
  margin-bottom: 20px !important;
  padding: 0 4px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
  padding-bottom: 12px !important;
}
.te-duo-prod-title {
  font-family: var(--font-trajan), 'Cinzel', serif !important;
  font-size: clamp(14px, 1.15vw, 17px) !important;
  font-weight: 600 !important;
  letter-spacing: 0.14em !important;
  color: #111111 !important;
  text-transform: uppercase !important;
  transition: color 0.3s ease !important;
}
.te-duo-card-link:hover .te-duo-prod-title {
  color: var(--color-gold, #c5a880) !important;
}
.te-duo-prod-price {
  font-family: var(--font-trajan), 'Cinzel', serif !important;
  font-size: clamp(13px, 1.05vw, 16px) !important;
  font-weight: 500 !important;
  letter-spacing: 0.08em !important;
  color: #111111 !important;
}

/* Image Wrappers */
.te-duo-img-wrap {
  width: 100% !important;
  flex: 1 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  overflow: hidden !important;
}
.te-duo-img {
  max-width: 100% !important;
  max-height: 580px !important;
  width: auto !important;
  height: auto !important;
  object-fit: contain !important;
  display: block !important;
  margin: 0 auto !important;
}
.te-duo-img-interactive {
  transition: transform 0.4s ease !important;
}
.te-duo-card-link:hover .te-duo-img-interactive {
  transform: scale(1.03) !important;
}

@media (max-width: 768px) {
  .te-duo-showcase-section {
    padding: 48px 0 !important;
  }
  .te-duo-showcase-container {
    padding: 0 20px !important;
  }
  .te-duo-showcase-grid {
    grid-template-columns: 1fr !important;
    gap: 24px !important;
  }
  .te-duo-panel-left .te-duo-panel-inner {
    padding: 24px 16px !important;
  }
  .te-duo-panel-right .te-duo-panel-inner {
    padding: 20px 16px 24px 16px !important;
  }
  .te-duo-img {
    max-height: 440px !important;
  }
}
@media (prefers-reduced-motion: reduce) {
  .te-duo-img-interactive {
    transition: none !important;
    transform: none !important;
  }
  .te-duo-card-link:hover .te-duo-img-interactive {
    transform: none !important;
  }
}
</style>
`.trim();

async function main() {
  const auth = await getProdAuth();
  console.log('Authenticated to:', auth.siteUrl);

  await createSnippet(auth, 'te-category-showcase', CATEGORY_SHOWCASE_CSS);
  await createSnippet(auth, 'te-duo-showcase', DUO_SHOWCASE_CSS);

  console.log('\n======================================================');
  console.log('✓ BOTH SHOWCASE CSS SNIPPETS CREATED IN WPCODE!');
  console.log('======================================================');
}

main().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});
