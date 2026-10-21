import fs from 'fs';

async function check() {
  const res = await fetch('https://reflectionelite.com/shop/');
  const html = await res.text();
  const desktopNav = html.match(/<nav[^>]*id="primary-site-navigation-desktop"[\s\S]*?<\/nav>/i);
  if (desktopNav) {
    console.log('=== DESKTOP NAV ===\n', desktopNav[0]);
  }
}

check().catch(console.error);
