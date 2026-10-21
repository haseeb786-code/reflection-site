import fs from 'fs';

const css = fs.readFileSync('shopify_compiled_styles.css', 'utf8');
const idx = css.indexOf('.comparison-slider');
if (idx !== -1) {
  console.log('Found .comparison-slider at:', idx);
  console.log(css.substring(idx, idx + 2500));
} else {
  console.log('.comparison-slider not found in compiled_styles');
}
