import { getProdAuth } from './prod_auth_helper.js';

async function inspectAboutContent() {
  const { siteUrl, cookies, nonce } = await getProdAuth();
  const res = await fetch(`${siteUrl}/wp-json/wp/v2/pages/50?context=edit`, {
    headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
  });
  const data = await res.json();
  const content = data.content?.raw || '';
  
  // Extract style id="te-about-styles"
  const styleMatch = content.match(/<style id="te-about-styles">([\s\S]*?)<\/style>/i);
  if (styleMatch) {
    console.log('--- Found te-about-styles (length:', styleMatch[1].length, ') ---');
    console.log(styleMatch[1].slice(0, 1500));
  } else {
    console.log('No te-about-styles found');
  }

  // Extract non-header HTML snippet to see classes
  const cleanHtml = content
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .trim();

  console.log('\n--- Page 50 HTML sample (first 1500 chars) ---');
  console.log(cleanHtml.slice(0, 1500));
}

inspectAboutContent().catch(console.error);
