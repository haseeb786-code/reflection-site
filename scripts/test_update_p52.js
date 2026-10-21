import fs from 'fs';
import { getReUnifiedHeader } from './re_header_system.js';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

const STAGING_URL = 'https://reflectionelite.ataanalytiq.com';

async function getFreshNonce() {
  const res = await fetch(`${STAGING_URL}/wp-admin/index.php`, {
    headers: {
      'Cookie': cookieHeader,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const html = await res.text();
  const match = html.match(/wpApiSettings\s*=\s*\{[^}]*?"nonce":"([^"]+)"/);
  if (!match) throw new Error('Could not extract fresh nonce from wp-admin/index.php');
  return match[1];
}

async function updateP52() {
  console.log('Fetching Page 52...');
  const res = await fetch(`${STAGING_URL}/wp-json/wp/v2/pages/52`, {
    headers: { Cookie: cookieHeader }
  });
  const data = await res.json();
  let content = data.content?.raw || data.content?.rendered || '';

  // Remove any existing unified header or old header
  content = content.replace(/<style id="re-unified-header-system">[\s\S]*?<\/header>/gi, '');
  content = content.replace(/<!--\s*REPLICATED EXACT HEADER SYSTEM[\s\S]*?<\/header>/gi, '');
  content = content.replace(/<header class="re-unified-header-container"[\s\S]*?<\/header>/gi, '');
  content = content.replace(/<div class="announcement-bar">[\s\S]*?<\/header>/gi, '');

  // Strip Gutenberg wrapper comments if present
  content = content.replace(/<!-- \/?wp:html -->/gi, '');

  const newHeader = getReUnifiedHeader(STAGING_URL, 'home');

  // Insert newHeader right after <div class="te-live-page"> or <div class="te-staging-page">
  if (content.includes('<div class="te-live-page">')) {
    content = content.replace('<div class="te-live-page">', '<div class="te-live-page">\n' + newHeader);
  } else if (content.includes('<div class="te-staging-page">')) {
    content = content.replace('<div class="te-staging-page">', '<div class="te-staging-page">\n' + newHeader);
  } else {
    content = newHeader + '\n' + content;
  }

  // Wrap the entire content in <!-- wp:html --> so WordPress preserves HTML without wpautop
  const wrappedContent = `<!-- wp:html -->\n${content.trim()}\n<!-- /wp:html -->`;

  const nonce = await getFreshNonce();
  const updateRes = await fetch(`${STAGING_URL}/wp-json/wp/v2/pages/52`, {
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

  if (updateRes.ok) {
    console.log('✓ Successfully updated Page 52 with clean unified header in wp:html block!');
  } else {
    console.error('Failed to update Page 52:', updateRes.status, await updateRes.text());
  }
}

updateP52().catch(console.error);
