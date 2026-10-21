import { getProdAuth } from './prod_auth_helper.js';

async function checkClasses() {
  const { siteUrl, cookies, nonce } = await getProdAuth();
  for (const id of [50, 52, 102, 103, 120]) {
    const res = await fetch(`${siteUrl}/wp-json/wp/v2/pages/${id}?context=edit`, {
      headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
    });
    const data = await res.json();
    const content = data.content?.raw || '';
    const classes = new Set();
    const re = /class="([^"]+)"/g;
    let match;
    while ((match = re.exec(content)) !== null) {
      match[1].split(/\s+/).forEach(c => {
        if (c.startsWith('re-')) classes.add(c);
      });
    }
    console.log(`Page ${id} (${data.slug}) has ${classes.size} re- classes:`);
    console.log(Array.from(classes).sort().join(', '));
  }
}

checkClasses().catch(console.error);
