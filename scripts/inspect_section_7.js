import fs from 'fs';

const html = fs.readFileSync('shopify_live_homepage.html', 'utf8');
const target = 'template--21609896640601__slideshow_Xq6zkH';
const start = html.indexOf(target);

if (start !== -1) {
  const nextTarget = 'template--21609896640601__blocks_QQHpmz';
  const end = html.indexOf(nextTarget);
  const sectionHtml = html.substring(start - 30, end !== -1 ? end - 30 : start + 10000);
  fs.writeFileSync('section_7_slideshow.html', sectionHtml);
  console.log('Saved section 7 HTML, size:', sectionHtml.length);
  
  // Also check images in section 7
  const imgMatches = [...sectionHtml.matchAll(/<img[^>]+src="([^">]+)"/g)].map(m => m[1]);
  console.log('Images in section 7:', imgMatches);
  
  // Look for text content
  const texts = sectionHtml.replace(/<style[\s\S]*?<\/style>/gi, '')
                           .replace(/<script[\s\S]*?<\/script>/gi, '')
                           .replace(/<[^>]+>/g, ' ')
                           .replace(/\s+/g, ' ')
                           .trim();
  console.log('Text content excerpt:', texts.substring(0, 500));
} else {
  console.log('Target not found!');
}
