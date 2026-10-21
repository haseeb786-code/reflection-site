import fs from 'fs';

const html = fs.readFileSync('shopify_live_homepage.html', 'utf8');

function inspectSection(id, label) {
  const start = html.indexOf(`id="shopify-section-${id}"`);
  if (start === -1) {
    console.log(`[${label}] ${id} NOT FOUND`);
    return;
  }
  const nextSection = html.indexOf('shopify-section', start + 100);
  const snippet = html.substring(start, nextSection !== -1 ? nextSection : start + 6000);
  
  const imgs = [...snippet.matchAll(/<img[^>]+src="([^">]+)"/g)].map(m => m[1]);
  
  const text = snippet.replace(/<style[\s\S]*?<\/style>/gi, '')
                      .replace(/<script[\s\S]*?<\/script>/gi, '')
                      .replace(/<[^>]+>/g, ' ')
                      .replace(/\s+/g, ' ')
                      .trim();
  
  console.log(`\n========================================`);
  console.log(`SECTION: ${label} (${id})`);
  console.log(`HTML size: ${snippet.length}`);
  console.log(`Images:`, imgs);
  console.log(`Text excerpt:`, text.substring(0, 400));
}

inspectSection('template--21609896640601__section_F9fMc4', 'Section 11');
inspectSection('template--21609896640601__collection_list_rqG3qq', 'Section 12');
inspectSection('template--21609896640601__1779689947e0ef5f5e', 'Section 13');
inspectSection('template--21609896640601__section_7PyBNb', 'Section 15 (Email)');
inspectSection('sections--21609896771673__section_tQFiwz', 'Section 16 (FAQ)');
