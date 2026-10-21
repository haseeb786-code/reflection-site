import { getProdAuth } from './prod_auth_helper.js';

async function updateSnippet(auth, snippetId, code) {
  console.log(`Updating snippet ID ${snippetId}...`);
  const formPageRes = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-snippet-manager&snippet_id=${snippetId}`, {
    headers: { 'Cookie': auth.cookies }
  });
  const html = await formPageRes.text();
  const nonce = (html.match(/name="wpcode-save-snippet-nonce"[^>]*value="([^"]+)"/i) || [])[1];
  const title = (html.match(/name="wpcode_snippet_title"[^>]*value="([^"]+)"/i) || [])[1] || 'Snippet ' + snippetId;

  if (!nonce) throw new Error('Could not get nonce for snippet ' + snippetId);

  const params = new URLSearchParams();
  params.append('wpcode_snippet_id', String(snippetId));
  params.append('wpcode_snippet_title', title);
  params.append('wpcode_active', '1');
  params.append('wpcode_snippet_type', 'html');
  params.append('wpcode_snippet_code', code);
  params.append('wpcode_auto_insert', '1');
  params.append('wpcode_auto_insert_location', 'site_wide_header');
  params.append('wpcode_priority', '10');
  params.append('wpcode-save-snippet-nonce', nonce);
  params.append('_wp_http_referer', `/wp-admin/admin.php?page=wpcode-snippet-manager&snippet_id=${snippetId}`);

  const res = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-snippet-manager`, {
    method: 'POST',
    headers: {
      'Cookie': auth.cookies,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString(),
    redirect: 'manual'
  });

  console.log(`✓ Updated snippet ${snippetId} (${title}), status:`, res.status);
}

const CATEGORY_CSS = `
<style id="te-category-showcase-css">
/* ============================================================
   SNIPPET: te-category-showcase
   Scope: Category Showcase Section on Homepage
   ============================================================ */
.te-cat-showcase-section {
  background: #000000 !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 88px 0 !important;
  box-sizing: border-box !important;
  position: relative !important;
  clear: both !important;
}
.te-cat-showcase-container {
  max-width: 1260px !important;
  margin: 0 auto !important;
  padding: 0 36px !important;
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
  flex: 1 1 56% !important;
  min-width: 0 !important;
}
.te-cat-nav-list {
  display: flex !important;
  flex-direction: column !important;
  gap: 30px !important;
}
.te-cat-item {
  display: block !important;
  line-height: 1.18 !important;
  white-space: nowrap !important;
}
.te-cat-name {
  font-family: var(--font-trajan), 'Cinzel', serif !important;
  font-size: clamp(30px, 3.2vw, 48px) !important;
  color: #f7f4ee !important;
  letter-spacing: 0.05em !important;
  text-transform: uppercase !important;
  font-weight: 500 !important;
  display: inline-block !important;
}
.te-cat-num {
  font-family: var(--font-trajan), 'Cinzel', serif !important;
  font-size: 0.52em !important;
  vertical-align: 0.65em !important;
  margin-left: 10px !important;
  color: #f7f4ee !important;
  font-weight: 400 !important;
  display: inline-block !important;
}
.te-cat-link {
  display: inline-flex !important;
  align-items: baseline !important;
  text-decoration: none !important;
  color: inherit !important;
  cursor: pointer !important;
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), color 0.28s ease !important;
}
.te-cat-link:hover {
  transform: translateX(8px) !important;
}
.te-cat-link:hover .te-cat-name,
.te-cat-link:hover .te-cat-num {
  color: var(--color-gold, #c5a880) !important;
}
.te-cat-media-col {
  flex: 0 0 44% !important;
  max-width: 480px !important;
  display: flex !important;
  justify-content: flex-end !important;
}
.te-cat-frame-wrap {
  width: 100% !important;
  max-width: 460px !important;
  border-radius: 12px !important;
  overflow: hidden !important;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.75) !important;
}
.te-cat-showcase-img {
  width: 100% !important;
  height: auto !important;
  max-height: 640px !important;
  object-fit: cover !important;
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
    gap: 40px !important;
    text-align: center !important;
  }
  .te-cat-list-col {
    flex: 1 1 100% !important;
    max-width: 100% !important;
  }
  .te-cat-nav-list {
    gap: 22px !important;
    align-items: center !important;
  }
  .te-cat-name {
    font-size: clamp(26px, 7vw, 36px) !important;
  }
  .te-cat-media-col {
    flex: 1 1 100% !important;
    max-width: 380px !important;
    margin: 0 auto !important;
    justify-content: center !important;
  }
}
@media (prefers-reduced-motion: reduce) {
  .te-cat-link {
    transition: none !important;
    transform: none !important;
  }
}
</style>
`.trim();

const DUO_CSS = `
<style id="te-duo-showcase-css">
/* ============================================================
   SNIPPET: te-duo-showcase
   Scope: Duo Mirror Showcase Section on Homepage
   ============================================================ */
.te-duo-showcase-section {
  background: #ffffff !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 68px 0 !important;
  box-sizing: border-box !important;
  position: relative !important;
  clear: both !important;
}
.te-duo-showcase-container {
  max-width: 1360px !important;
  margin: 0 auto !important;
  padding: 0 28px !important;
  box-sizing: border-box !important;
}
.te-duo-showcase-grid {
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  gap: 32px !important;
  align-items: stretch !important;
}
.te-duo-panel {
  display: flex !important;
  flex-direction: column !important;
  position: relative !important;
  min-height: 580px !important;
}
.te-duo-panel-inner {
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
  background: #fbfbfc !important;
  border-radius: 2px !important;
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
  cursor: pointer !important;
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
  font-size: 15px !important;
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
  font-size: 14px !important;
  font-weight: 500 !important;
  letter-spacing: 0.08em !important;
  color: #111111 !important;
}

/* Image Wrappers */
.te-duo-img-wrap {
  width: 100% !important;
  flex: 1 1 auto !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-height: 480px !important;
}
.te-duo-img {
  width: 100% !important;
  height: auto !important;
  max-height: 520px !important;
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
    padding: 44px 0 !important;
  }
  .te-duo-showcase-container {
    padding: 0 18px !important;
  }
  .te-duo-showcase-grid {
    grid-template-columns: 1fr !important;
    gap: 24px !important;
  }
  .te-duo-panel {
    min-height: auto !important;
  }
  .te-duo-panel-left .te-duo-panel-inner {
    padding: 24px 16px !important;
  }
  .te-duo-panel-right .te-duo-panel-inner {
    padding: 20px 16px 24px 16px !important;
  }
  .te-duo-img-wrap {
    min-height: 320px !important;
  }
  .te-duo-img {
    max-height: 380px !important;
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
  await updateSnippet(auth, 226, CATEGORY_CSS);
  await updateSnippet(auth, 227, DUO_CSS);

  // Clear Hostinger Cache
  console.log('Purging Hostinger cache...');
  const purgeRes = await fetch(`${auth.siteUrl}/wp-json/hostinger-tools-plugin/v1/clear-cache`, {
    method: 'DELETE',
    headers: { Cookie: auth.cookies, 'X-WP-Nonce': auth.nonce }
  });
  console.log('Cache purge status:', purgeRes.status);
}

main().catch(console.error);
