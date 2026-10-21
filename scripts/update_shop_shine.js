import fs from 'fs';
import { getReUnifiedHeader } from './re_header_system.js';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

async function updateShopPages() {
  const nonceRes = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/index.php', {
    headers: { Cookie: cookieHeader }
  });
  const html = await nonceRes.text();
  const nonce = html.match(/wpApiSettings\s*=\s*\{[^}]*?"nonce":"([^"]+)"/)[1];

  for (const id of [7, 1992]) {
    const res = await fetch(`https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/${id}`, {
      headers: { Cookie: cookieHeader }
    });
    const data = await res.json();
    let content = data.content?.raw || data.content?.rendered || '';
    content = content.replace(/<style id="re-unified-header-system">[\s\S]*?<\/header>/gi, '');
    content = content.replace(/<!--\s*REPLICATED EXACT HEADER SYSTEM[\s\S]*?<\/header>/gi, '');
    content = content.replace(/<header class="re-unified-header-container"[\s\S]*?<\/header>/gi, '');
    content = content.replace(/<div class="announcement-bar">[\s\S]*?<\/header>/gi, '');
    content = content.replace(/<!-- \/?wp:html -->/gi, '');

    const newHeader = getReUnifiedHeader('https://reflectionelite.ataanalytiq.com', 'shop');
    content = newHeader + '\n' + content;
    const wrappedContent = `<!-- wp:html -->\n${content.trim()}\n<!-- /wp:html -->`;

    const upd = await fetch(`https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
        'X-WP-Nonce': nonce
      },
      body: JSON.stringify({
        content: wrappedContent,
        template: 'elementor_canvas',
        meta: { _elementor_edit_mode: '' }
      })
    });
    console.log(`Page ${id} updated status:`, upd.status);
  }
}

updateShopPages().catch(console.error);
