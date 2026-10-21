import fs from 'fs';
import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  const auth = await getProdAuth();
  const res = await fetch(`${auth.siteUrl}/wp-json/wp/v2/pages/68?context=edit`, {
    headers: { Cookie: auth.cookies, 'X-WP-Nonce': auth.nonce }
  });
  const data = await res.json();
  const content = data.content?.raw || '';
  fs.writeFileSync('page_68_current_live.html', content);
  console.log('Saved page_68_current_live.html, size:', content.length);

  const idx = content.indexOf('TRENDING ERA');
  console.log('TRENDING ERA index:', idx);
  if (idx !== -1) {
    // Find the end of this section
    const sectionEnd = content.indexOf('</section>', idx);
    console.log('End of Trending Era section at index:', sectionEnd);
    console.log('Content after </section> (next 600 chars):');
    console.log(content.substring(sectionEnd, sectionEnd + 600));
  }
}

main().catch(console.error);
