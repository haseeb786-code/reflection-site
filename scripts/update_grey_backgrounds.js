import fs from 'fs';
import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  const auth = await getProdAuth();
  console.log('1. Fetching Page 68 from:', auth.siteUrl);

  const res = await fetch(`${auth.siteUrl}/wp-json/wp/v2/pages/68?context=edit`, {
    headers: { Cookie: auth.cookies, 'X-WP-Nonce': auth.nonce }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch Page 68: HTTP ${res.status}`);
  }

  const pageData = await res.json();
  let content = pageData.content?.raw || '';

  // Backup
  fs.writeFileSync('backups/page_68_before_grey_bg_update.html', content);
  console.log('✅ Backup saved to backups/page_68_before_grey_bg_update.html');

  // 1. Update #re-why-choose-section background from #000000 to #383838 (Shopify color-scheme-4 rgb(56 56 56))
  if (content.includes('id="re-why-choose-section"')) {
    content = content.replace(
      /#re-why-choose-section\s*\{\s*position:\s*relative\s*!important;\s*width:\s*100vw\s*!important;\s*left:\s*50%\s*!important;\s*right:\s*50%\s*!important;\s*margin-left:\s*-50vw\s*!important;\s*margin-right:\s*-50vw\s*!important;\s*background-color:\s*#[0-9a-fA-F]+\s*!important;/g,
      `#re-why-choose-section {
      position: relative !important;
      width: 100vw !important;
      left: 50% !important;
      right: 50% !important;
      margin-left: -50vw !important;
      margin-right: -50vw !important;
      background-color: #383838 !important;`
    );
    console.log('✅ Updated #re-why-choose-section background to #383838');
  }

  // 2. Update #re-email-subscribe-section background from #000000 to #353535 (Shopify color-scheme-2 rgb(53 53 53))
  // and update input pill to white background with dark text & arrow matching Shopify editor screenshot
  if (content.includes('id="re-email-subscribe-section"')) {
    content = content.replace(
      /#re-email-subscribe-section\s*\{\s*position:\s*relative\s*!important;\s*width:\s*100vw\s*!important;\s*left:\s*50%\s*!important;\s*right:\s*50%\s*!important;\s*margin-left:\s*-50vw\s*!important;\s*margin-right:\s*-50vw\s*!important;\s*background-color:\s*#[0-9a-fA-F]+\s*!important;/g,
      `#re-email-subscribe-section {
      position: relative !important;
      width: 100vw !important;
      left: 50% !important;
      right: 50% !important;
      margin-left: -50vw !important;
      margin-right: -50vw !important;
      background-color: #353535 !important;`
    );

    // Update input group styling in #re-email-subscribe-section
    content = content.replace(
      /#re-email-subscribe-section \.re-sub-input-group\s*\{[^}]+\}/g,
      `#re-email-subscribe-section .re-sub-input-group {
      display: flex;
      align-items: center;
      border: 1px solid #ffffff;
      border-radius: 100px;
      padding: 4px 8px 4px 22px;
      background: #ffffff !important;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
    }`
    );

    content = content.replace(
      /#re-email-subscribe-section \.re-sub-input\s*\{[^}]+\}/g,
      `#re-email-subscribe-section .re-sub-input {
      flex: 1;
      background: transparent;
      border: none;
      color: #000000 !important;
      font-family: 'Montserrat', -apple-system, sans-serif;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.05em;
      outline: none;
      padding: 12px 0;
    }`
    );

    content = content.replace(
      /#re-email-subscribe-section \.re-sub-input::placeholder\s*\{[^}]+\}/g,
      `#re-email-subscribe-section .re-sub-input::placeholder {
      color: #333333 !important;
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 0.08em;
    }`
    );

    content = content.replace(
      /#re-email-subscribe-section \.re-sub-button\s*\{[^}]+\}/g,
      `#re-email-subscribe-section .re-sub-button {
      background: transparent;
      border: none;
      color: #000000 !important;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.3s ease;
      padding: 0;
    }`
    );

    content = content.replace(
      /#re-email-subscribe-section \.re-sub-button:hover\s*\{[^}]+\}/g,
      `#re-email-subscribe-section .re-sub-button:hover {
      transform: translateX(4px);
      color: #000000 !important;
    }`
    );

    console.log('✅ Updated #re-email-subscribe-section background to #353535 and input pill to white/black');
  }

  // Update Page 68
  console.log('2. Updating Page 68 via REST API...');
  const updateRes = await fetch(`${auth.siteUrl}/wp-json/wp/v2/pages/68`, {
    method: 'POST',
    headers: {
      'Cookie': auth.cookies,
      'X-WP-Nonce': auth.nonce,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content })
  });

  if (!updateRes.ok) {
    const errText = await updateRes.text();
    throw new Error(`Failed to update Page 68: HTTP ${updateRes.status} - ${errText}`);
  }

  console.log('✅ Page 68 successfully updated!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
