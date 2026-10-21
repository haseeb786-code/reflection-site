import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  const { siteUrl, cookies } = await getProdAuth();
  const pages = [68, 6, 50, 52, 120, 103, 102, 7, 8];
  
  for (const id of pages) {
    const res = await fetch(`${siteUrl}/wp-json/wp/v2/pages/${id}`, {
      headers: { Cookie: cookies }
    });
    const page = await res.json();
    console.log(`\n=================== PAGE ${id}: ${page.slug} ===================`);
    const content = page.content.rendered;
    
    // Header
    const headerMatch = content.match(/<header[\s\S]*?<\/header>/i);
    if (headerMatch) {
      console.log('Header length:', headerMatch[0].length);
      const rowInner = headerMatch[0].match(/<div class="re-header-row-inner">([\s\S]*?)<\/div>/i);
      if (rowInner) {
        console.log('re-header-row-inner:', rowInner[0]);
      }
    } else {
      console.log('NO <header> tag found.');
    }

    // Footer
    const footerMatch = content.match(/<footer[\s\S]*?<\/footer>/i);
    if (footerMatch) {
      console.log('Footer length:', footerMatch[0].length);
      console.log('Footer class:', footerMatch[0].slice(0, 100));
    } else {
      console.log('NO <footer> tag found.');
    }
  }
}

main().catch(console.error);
