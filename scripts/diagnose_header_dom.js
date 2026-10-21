import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function diagnose() {
  const res = await fetch(`${WP_URL}/shop/`);
  const html = await res.text();

  console.log('=== HEADER HTML STRUCTURE ===');
  const mastheadMatch = html.match(/<header[\s\S]*?<\/header>/i);
  if (mastheadMatch) {
    fs.writeFileSync('header_dump.html', mastheadMatch[0]);
    console.log('Saved masthead HTML to header_dump.html (length: ' + mastheadMatch[0].length + ')');
  }

  // Look for any cart mention in header
  const headerCartMentions = [...mastheadMatch[0].matchAll(/<li[^>]*menu-item[^>]*>[\s\S]*?<\/li>/gi)].map(m => m[0]);
  console.log('Menu items found in header:');
  headerCartMentions.forEach((m, idx) => {
    console.log(`[${idx}]`, m.replace(/\s+/g, ' '));
  });
}

diagnose().catch(console.error);
