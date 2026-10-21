import { getProdAuth } from './prod_auth_helper.js';

async function inspectCom() {
  console.log('=== LOGGING IN TO REFLECTIONELITE.COM VIA ENV CREDENTIALS ===');
  const { siteUrl, cookies, nonce } = await getProdAuth();
  console.log('Extracted Nonce on reflectionelite.com:', nonce);

  // 1. Check Reading Settings
  if (nonce) {
    const setRes = await fetch(`${siteUrl}/wp-json/wp/v2/settings`, {
      headers: { 'Cookie': cookies, 'X-WP-Nonce': nonce }
    });
    if (setRes.ok) {
      const settings = await setRes.json();
      console.log('Settings on reflectionelite.com:', {
        show_on_front: settings.show_on_front,
        page_on_front: settings.page_on_front,
        page_for_posts: settings.page_for_posts
      });
    }

    // 2. Check Active Theme
    const themeRes = await fetch(`${siteUrl}/wp-json/wp/v2/themes?status=active`, {
      headers: { 'Cookie': cookies, 'X-WP-Nonce': nonce }
    });
    if (themeRes.ok) {
      const themes = await themeRes.json();
      console.log('Active theme on reflectionelite.com:', themes.map(t => ({ name: t.name?.rendered, stylesheet: t.stylesheet })));
    }
  }

  // 3. List Pages
  const pagesRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages?per_page=100`, {
    headers: { 'Cookie': cookies }
  });
  if (pagesRes.ok) {
    const pages = await pagesRes.json();
    console.log(`Discovered ${pages.length} pages on reflectionelite.com:`);
    pages.forEach(p => {
      console.log(`ID: ${String(p.id).padEnd(5)} | Slug: ${p.slug.padEnd(25)} | Status: ${p.status.padEnd(8)} | Title: ${p.title?.rendered}`);
    });
  }
}

inspectCom().catch(console.error);
