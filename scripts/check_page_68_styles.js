import { getProdAuth } from './prod_auth_helper.js';

async function main() {
  const { siteUrl, cookies } = await getProdAuth();
  const res = await fetch(`${siteUrl}/wp-json/wp/v2/pages/68`, { headers: { Cookie: cookies } });
  const page = await res.json();
  const styles = page.content.rendered.match(/<style[\s\S]*?<\/style>/gi) || [];
  console.log('Page 68 style tags count:', styles.length);
  styles.forEach((s, i) => {
    if (s.includes('re-carousel-box') || s.includes('1100')) {
      console.log(`--- Style ${i} matches ---`);
      // Find the specific rule
      const lines = s.split('\n');
      lines.forEach((line, lineNo) => {
        if (line.includes('re-carousel-box') || line.includes('1100px')) {
          console.log(`  Line ${lineNo}: ${line.trim()}`);
        }
      });
    }
  });
}

main().catch(console.error);
