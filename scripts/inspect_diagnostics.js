import fs from 'fs';

function inspectFile(filename) {
  const html = fs.readFileSync(filename, 'utf8');
  console.log(`\n=== INSPECTING ${filename} ===`);
  console.log('HTML size:', html.length);
  
  // Look for entry-content
  const entryIdx = html.indexOf('class="entry-content');
  if (entryIdx !== -1) {
    console.log('--- Context around entry-content (600 chars) ---');
    console.log(html.substring(entryIdx, entryIdx + 600));
  } else {
    console.log('No entry-content class found.');
  }

  // Look for any unstyled tags or style tags
  const stylesCount = (html.match(/<style/g) || []).length;
  console.log('Total <style> tags in page:', stylesCount);

  // Check if te-global-luxury-system exists
  const hasTeGlobal = html.includes('te-global-luxury-system');
  console.log('Has te-global-luxury-system:', hasTeGlobal);

  // Find what classes are inside the content
  const classes = new Set();
  const classMatches = html.matchAll(/class="([^"]+)"/g);
  for (const m of classMatches) {
    m[1].split(/\s+/).forEach(c => classes.add(c));
  }
  const luxuryClasses = Array.from(classes).filter(c => c.startsWith('re-') || c.startsWith('te-') || c.includes('card') || c.includes('pillar') || c.includes('hero'));
  console.log('Luxury/custom classes found:', luxuryClasses);
}

inspectFile('scripts/diagnostic_about-us.html');
inspectFile('scripts/diagnostic_contact.html');
inspectFile('scripts/diagnostic_shop.html');
