import { getProdAuth } from './prod_auth_helper.js';

async function checkCssRules() {
  const { siteUrl, cookies, nonce } = await getProdAuth();
  const res = await fetch(`${siteUrl}/wp-json/wp/v2/pages/50?context=edit`, {
    headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
  });
  const data = await res.json();
  const content = data.content?.raw || '';
  const styleMatch = content.match(/<style id="te-about-styles">([\s\S]*?)<\/style>/i);
  if (!styleMatch) {
    console.log('No te-about-styles');
    return;
  }
  const css = styleMatch[1];
  const classesToCheck = [
    're-story-section-heading',
    're-highlights-card-title',
    're-story-paragraph',
    're-story-hero',
    're-story-origins-section',
    're-highlights-card',
    're-dark-accent',
    're-story-pillar',
    're-btn-primary'
  ];

  for (const cls of classesToCheck) {
    const has = css.includes(cls);
    console.log(`${cls} in te-about-styles: ${has}`);
    if (has) {
      const idx = css.indexOf(cls);
      console.log('   Snippet: ' + css.slice(Math.max(0, idx - 20), Math.min(css.length, idx + 140)).replace(/\s+/g, ' '));
    }
  }
}

checkCssRules().catch(console.error);
