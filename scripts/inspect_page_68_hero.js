import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  const { siteUrl, cookies } = await getProdAuth();
  const res = await fetch(`${siteUrl}/wp-json/wp/v2/pages/68`, {
    headers: { Cookie: cookies }
  });
  const page = await res.json();
  const content = page.content.rendered;
  const heroMatch = content.match(/<section[^>]*class="[^"]*hero[^"]*"[\s\S]*?<\/section>/i) 
                 || content.match(/<div[^>]*class="[^"]*hero[^"]*"[\s\S]*?<\/div>/i);
  if (heroMatch) {
    console.log('=== HERO SECTION ===');
    console.log(heroMatch[0]);
  } else {
    console.log('Hero not found. Content slice:');
    console.log(content.slice(0, 1500));
  }
}

main().catch(console.error);
