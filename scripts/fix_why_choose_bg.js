import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  console.log('1. Authenticating to WordPress...');
  const { siteUrl, cookies, nonce } = await getProdAuth();

  console.log('2. Fetching Page 68...');
  const pageRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/68?context=edit`, {
    headers: { Cookie: cookies, 'X-WP-Nonce': nonce }
  });
  if (!pageRes.ok) {
    throw new Error(`Failed to fetch Page 68: HTTP ${pageRes.status}`);
  }

  const pageData = await pageRes.json();
  let content = pageData.content?.raw || '';

  // Locate re-why-choose-section
  const sectionIdx = content.indexOf('id="re-why-choose-section"');
  if (sectionIdx === -1) {
    throw new Error('re-why-choose-section not found in Page 68!');
  }

  // Replace #383838 with #000000 in this section
  const targetBg = 'background-color: #383838 !important;';
  const newBg = 'background-color: #000000 !important;';

  if (!content.includes(targetBg)) {
    throw new Error('Could not find target background-color in Page 68!');
  }

  content = content.replace(targetBg, newBg);

  console.log('3. Updating Page 68 with pure black background (#000000)...');
  const updateRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/68`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookies,
      'X-WP-Nonce': nonce
    },
    body: JSON.stringify({ content })
  });

  if (!updateRes.ok) {
    const errText = await updateRes.text();
    throw new Error(`Failed to update Page 68: HTTP ${updateRes.status} - ${errText}`);
  }
  console.log('? Page 68 updated successfully.');

  console.log('4. Purging Hostinger cache...');
  const purgeRes = await fetch(`${siteUrl}/wp-json/hostinger-tools-plugin/v1/clear-cache`, {
    method: 'DELETE',
    headers: {
      'Cookie': cookies,
      'X-WP-Nonce': nonce
    }
  });

  if (purgeRes.ok) {
    console.log('? Hostinger cache purged successfully.');
  } else {
    console.warn(`Purge returned HTTP ${purgeRes.status}`);
  }

  console.log('ALL DONE!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
