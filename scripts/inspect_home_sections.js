import fs from 'fs';

const homeHtml = fs.readFileSync('home.html', 'utf8');

console.log('=== HOMEPAGE SECTION INSPECTION ===');

// Check style blocks for font-family
const fontFamilies = [...homeHtml.matchAll(/font-family:\s*([^;!]+)/gi)].map(m => m[1].trim());
const uniqueFonts = [...new Set(fontFamilies)];
console.log('Font families found in inline/internal CSS:');
uniqueFonts.forEach(f => console.log(' -', f));

// Check elementor data or sections
// Let's see if elementor sections exist: class="elementor-section" or class="e-con" (Elementor Flexbox Containers)
const eContainers = [...homeHtml.matchAll(/class="[^"]*(elementor-section|e-con|elementor-top-section)[^"]*"[^>]*>/gi)];
console.log('\nElementor section/container matches count:', eContainers.length);

// Let's inspect the main content structure
// Find all data-element_type="section" or data-element_type="container"
const topContainers = [...homeHtml.matchAll(/<div[^>]*class="[^"]*(?:elementor-top-section|e-con-boxed|e-con-full)[^"]*"[^>]*data-id="([^"]+)"[^>]*>/gi)];
console.log('Top containers:', topContainers.length);

// Let's list all major visible text blocks & sections in visual order
// Let's find all widgets or headings in order
const headingsAndBanners = [...homeHtml.matchAll(/<(?:h[1-6]|p|a|span)[^>]*class="[^"]*(?:elementor-heading-title|elementor-button-text|elementor-cta__title|elementor-image-box-title)[^"]*"[^>]*>([\s\S]*?)<\/(?:h[1-6]|p|a|span)>/gi)];
console.log('\nKey Elements in Homepage order:');
headingsAndBanners.forEach((m, idx) => {
  const text = m[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
  if (text && text.length > 2) {
    console.log(`${idx + 1}. ${text}`);
  }
});
