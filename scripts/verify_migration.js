import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('=== VERIFYING MIGRATION ASSETS & DATA INTEGRITY ===\n');

let pass = 0;
let fail = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    pass++;
  } else {
    console.error(`[FAIL] ${message}`);
    fail++;
  }
}

// 1. Verify shopify_export.json
const exportPath = path.join(rootDir, 'data', 'shopify_export.json');
assert(fs.existsSync(exportPath), 'data/shopify_export.json exists');
const shopify = JSON.parse(fs.readFileSync(exportPath, 'utf8'));

assert(shopify.shop && shopify.shop.currency === 'INR', 'Store currency is INR');
assert(shopify.products && shopify.products.length === 9, 'All 9 Shopify products extracted');
assert(shopify.collections && shopify.collections.length === 5, 'All 5 Shopify collections extracted');
assert(shopify.pages && shopify.pages.length === 2, 'All 2 Shopify content pages extracted');

// 2. Verify woocommerce_categories.csv
const catPath = path.join(rootDir, 'data', 'woocommerce_categories.csv');
assert(fs.existsSync(catPath), 'data/woocommerce_categories.csv exists');
const catContent = fs.readFileSync(catPath, 'utf8').trim().split('\r\n');
assert(catContent.length === 6, 'Categories CSV contains 1 header + 5 category rows');

// 3. Verify woocommerce_products.csv
const prodPath = path.join(rootDir, 'data', 'woocommerce_products.csv');
assert(fs.existsSync(prodPath), 'data/woocommerce_products.csv exists');
const prodContent = fs.readFileSync(prodPath, 'utf8').trim().split('\r\n');
assert(prodContent.length === 14, 'Products CSV contains 1 header + 13 product rows (7 simple, 2 variable parents, 4 variations)');

// Check specific key pricing
const prodCsvText = prodContent.join('\n');
assert(prodCsvText.includes('81500.00'), 'Antique venetian cushion price (81500.00) preserved');
assert(prodCsvText.includes('58787.00'), 'Modern victorian variant price (58787.00) preserved');
assert(prodCsvText.includes('7500.00'), 'Mosaic mirror art 42x48 price (7500.00) preserved');
assert(prodCsvText.includes('14000.00'), 'Rococo floral price (14000.00) preserved');
assert(prodCsvText.includes('35900.00'), 'Silver Crown framed price (35900.00) preserved');

// 4. Verify SEO Redirects
const seoPath = path.join(rootDir, 'data', 'seo_301_redirects.csv');
assert(fs.existsSync(seoPath), 'data/seo_301_redirects.csv exists');
const seoContent = fs.readFileSync(seoPath, 'utf8').trim().split(/\r?\n/);
assert(seoContent.length === 19, 'SEO Redirects contains 1 header + 18 redirect rules (11 products including aliases, 5 collections, 2 pages)');

// 5. Verify Local Images
const imagesDir = path.join(rootDir, 'assets', 'images');
assert(fs.existsSync(imagesDir), 'assets/images directory exists');
const files = fs.readdirSync(imagesDir);
assert(files.length === 27, `All 27 high-res mirror product images downloaded locally (found ${files.length})`);

const validSizes = files.every(f => fs.statSync(path.join(imagesDir, f)).size > 0);
assert(validSizes, 'All 27 image files have valid, non-zero file sizes on disk');

console.log(`\n========================================`);
console.log(`VERIFICATION SUMMARY: ${pass} PASSED, ${fail} FAILED`);
console.log(`========================================`);

if (fail > 0) {
  process.exit(1);
}
