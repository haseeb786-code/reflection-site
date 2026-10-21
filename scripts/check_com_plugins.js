import { getProdAuth } from './prod_auth_helper.js';

async function checkComPlugins() {
  const { siteUrl, cookies, nonce } = await getProdAuth();

  const res = await fetch(`${siteUrl}/wp-json/wp/v2/plugins`, {
    headers: { 'Cookie': cookies, 'X-WP-Nonce': nonce }
  });
  if (res.ok) {
    const plugins = await res.json();
    console.log('Plugins on reflectionelite.com:');
    plugins.forEach(p => console.log(`- [${p.status}] ${p.name} (${p.plugin})`));
  } else {
    console.log('Plugin check status:', res.status);
  }
}

checkComPlugins().catch(console.error);
