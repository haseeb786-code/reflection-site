import { getProdAuth } from './prod_auth_helper.js';

async function inspectProdPages() {
  const { siteUrl, cookies } = await getProdAuth();
  
  // Let's inspect page list via REST API
  const res = await fetch(`${siteUrl}/wp-json/wp/v2/pages?per_page=20`, {
    headers: { Cookie: cookies }
  });
  if (res.ok) {
    const pages = await res.json();
    console.log(`Found ${pages.length} pages on production:`);
    pages.forEach(p => {
      console.log(`ID: ${p.id}, slug: ${p.slug}, title: ${p.title?.rendered}, template: ${p.template}`);
    });
  } else {
    console.log('REST API status:', res.status);
  }
}

inspectProdPages().catch(console.error);
