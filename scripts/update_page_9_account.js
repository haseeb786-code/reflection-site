import { getProdAuth } from './prod_auth_helper.js';

async function updatePage9() {
  console.log('Fetching Cart (Page 7) to extract exact header and footer templates...');
  const auth = await getProdAuth();
  const res7 = await fetch('https://reflectionelite.com/wp-json/wp/v2/pages/7?context=edit', {
    headers: {
      'Cookie': auth.cookies,
      'X-WP-Nonce': auth.nonce
    }
  });
  const data7 = await res7.json();
  const raw7 = data7.content.raw;
  
  // Extract header part up to </header>
  const headerEndIdx = raw7.indexOf('</header>') + '</header>'.length;
  const headerHtml = raw7.substring(0, headerEndIdx);
  
  // Extract footer part starting from <footer
  const footerStartIdx = raw7.lastIndexOf('<footer class="site-footer">');
  const footerHtml = raw7.substring(footerStartIdx);
  
  const page9Content = `${headerHtml}
<div class="shop-hero" style="min-height: 28vh;">
  <div class="shop-hero-content" style="padding: 24px;">
    <div class="hero-tagline">&mdash; CLIENT ATELIER ACCESS &mdash;</div>
    <h1 style="font-size: 2.2rem; margin-bottom: 6px;">MY ACCOUNT</h1>
    <p style="font-size: 0.9rem;">Manage your bespoke commissions, orders, and atelier profile.</p>
  </div>
</div>

<div class="te-wc-container" style="max-width: 900px; margin: 40px auto; padding: 0 20px;">
  <!-- wp:shortcode -->
  [woocommerce_my_account]
  <!-- /wp:shortcode -->
</div>

${footerHtml}`;

  console.log('Updating Page 9 (My Account)...');
  const updateRes = await fetch('https://reflectionelite.com/wp-json/wp/v2/pages/9', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': auth.cookies,
      'X-WP-Nonce': auth.nonce
    },
    body: JSON.stringify({
      content: page9Content
    })
  });
  
  console.log('Update status:', updateRes.status);
  const updatedData = await updateRes.json();
  console.log('Updated Page 9 ID:', updatedData.id, 'Title:', updatedData.title?.rendered);
  
  // Clear Hostinger cache
  console.log('Purging Hostinger CDN cache...');
  const cacheRes = await fetch('https://reflectionelite.com/wp-json/hostinger-tools-plugin/v1/clear-cache', {
    method: 'DELETE',
    headers: {
      'Cookie': auth.cookies,
      'X-WP-Nonce': auth.nonce
    }
  });
  console.log('Cache clear status:', cacheRes.status);
}

updatePage9();
