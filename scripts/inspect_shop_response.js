import fs from 'fs';

async function inspectShopHtml() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/shop/?nocache=' + Date.now(), {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();
  console.log('HTML length:', html.length);
  
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  console.log('Title:', titleMatch ? titleMatch[1] : 'none');
  
  const elementorMatches = html.match(/elementor-(\d+)/g);
  console.log('Elementor IDs:', [...new Set(elementorMatches)]);
  
  const bodyMatch = html.match(/<body[^>]*class="([^"]+)"/i);
  console.log('Body classes:', bodyMatch ? bodyMatch[1] : 'none');

  fs.writeFileSync('shop_live_rendered.html', html, 'utf8');
  console.log('Saved rendered shop HTML to shop_live_rendered.html');
}

inspectShopHtml().catch(console.error);
