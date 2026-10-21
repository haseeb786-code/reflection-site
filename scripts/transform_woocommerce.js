import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const exportFile = path.join(rootDir, 'data', 'shopify_export.json');
if (!fs.existsSync(exportFile)) {
  console.error('Error: data/shopify_export.json not found.');
  process.exit(1);
}

const shopifyData = JSON.parse(fs.readFileSync(exportFile, 'utf8'));

// Helper to escape CSV cell
function escapeCsv(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// 1. Export Categories CSV
const categoriesHeader = ['Name', 'Slug', 'Parent', 'Description', 'Display type'];
const categoriesRows = [categoriesHeader.join(',')];

for (const cat of shopifyData.collections) {
  categoriesRows.push([
    escapeCsv(cat.title),
    escapeCsv(cat.handle),
    '',
    escapeCsv(cat.body_html ? cat.body_html.replace(/<[^>]+>/g, '').trim() : ''),
    'default'
  ].join(','));
}

const catOutputPath = path.join(rootDir, 'data', 'woocommerce_categories.csv');
fs.writeFileSync(catOutputPath, categoriesRows.join('\r\n'), 'utf8');
console.log(`Generated ${categoriesRows.length - 1} categories in: ${catOutputPath}`);

// 2. Export Products CSV
const productHeaders = [
  'Type',
  'SKU',
  'Name',
  'Published',
  'Is featured?',
  'Visibility in catalog',
  'Short description',
  'Description',
  'Tax status',
  'Tax class',
  'In stock?',
  'Stock',
  'Backorders allowed?',
  'Sold individually?',
  'Weight (kg)',
  'Regular price',
  'Categories',
  'Tags',
  'Images',
  'Parent',
  'Position',
  'Attribute 1 name',
  'Attribute 1 value(s)',
  'Attribute 1 visible',
  'Attribute 1 global',
  'Attribute 2 name',
  'Attribute 2 value(s)',
  'Attribute 2 visible',
  'Attribute 2 global',
  'Attribute 3 name',
  'Attribute 3 value(s)',
  'Attribute 3 visible',
  'Attribute 3 global'
];

const productCsvRows = [productHeaders.join(',')];

for (const p of shopifyData.products) {
  const isVariable = p.variants && p.variants.length > 1;
  const categoriesStr = (p.collections || []).map(c => c.title).join(', ') || 'Uncategorized';
  const tagsStr = p.tags || '';
  const imagesStr = (p.images || []).map(img => img.src).join(', ');
  const parentSku = `REF-${p.handle.toUpperCase()}`;

  if (!isVariable) {
    // Simple Product
    const v = p.variants[0] || {};
    const sku = v.sku || parentSku;
    const price = v.price || '0';
    const stock = v.inventory_quantity || 0;
    const inStock = stock > 0 ? 1 : 1; // Default available for ordering

    productCsvRows.push([
      'simple',
      escapeCsv(sku),
      escapeCsv(p.title),
      1, // Published
      0, // Is featured
      'visible',
      '',
      escapeCsv(p.body_html || ''),
      'taxable',
      'standard',
      inStock,
      stock,
      0,
      0,
      v.weight || '',
      price,
      escapeCsv(categoriesStr),
      escapeCsv(tagsStr),
      escapeCsv(imagesStr),
      '', // Parent
      0,
      '', '', '', '',
      '', '', '', '',
      '', '', '', ''
    ].join(','));
  } else {
    // Variable Product Parent Row
    const opt1 = p.options[0];
    const opt2 = p.options[1];
    const opt3 = p.options[2];

    productCsvRows.push([
      'variable',
      escapeCsv(parentSku),
      escapeCsv(p.title),
      1,
      0,
      'visible',
      '',
      escapeCsv(p.body_html || ''),
      'taxable',
      'standard',
      1,
      '',
      0,
      0,
      '',
      '', // Parent regular price is blank in variable
      escapeCsv(categoriesStr),
      escapeCsv(tagsStr),
      escapeCsv(imagesStr),
      '',
      0,
      opt1 ? escapeCsv(opt1.name) : '',
      opt1 ? escapeCsv(opt1.values.join(', ')) : '',
      1, 1,
      opt2 ? escapeCsv(opt2.name) : '',
      opt2 ? escapeCsv(opt2.values.join(', ')) : '',
      1, 1,
      opt3 ? escapeCsv(opt3.name) : '',
      opt3 ? escapeCsv(opt3.values.join(', ')) : '',
      1, 1
    ].join(','));

    // Variation Children Rows
    let pos = 1;
    for (const v of p.variants) {
      const varSku = v.sku || `${parentSku}-VAR-${pos}`;
      const varImg = v.image_id ? (p.images.find(img => img.id === v.image_id)?.src || '') : '';
      
      productCsvRows.push([
        'variation',
        escapeCsv(varSku),
        escapeCsv(`${p.title} - ${v.title}`),
        1,
        0,
        'visible',
        '',
        '',
        'taxable',
        'standard',
        1,
        v.inventory_quantity || 0,
        0,
        0,
        v.weight || '',
        v.price || '0',
        '', // variations inherit category
        '',
        escapeCsv(varImg),
        escapeCsv(parentSku), // Parent
        pos,
        opt1 ? escapeCsv(opt1.name) : '',
        v.option1 ? escapeCsv(v.option1) : '',
        1, 1,
        opt2 ? escapeCsv(opt2.name) : '',
        v.option2 ? escapeCsv(v.option2) : '',
        1, 1,
        opt3 ? escapeCsv(opt3.name) : '',
        v.option3 ? escapeCsv(v.option3) : '',
        1, 1
      ].join(','));
      pos++;
    }
  }
}

const prodOutputPath = path.join(rootDir, 'data', 'woocommerce_products.csv');
fs.writeFileSync(prodOutputPath, productCsvRows.join('\r\n'), 'utf8');
console.log(`Generated ${productCsvRows.length - 1} product/variant rows in: ${prodOutputPath}`);

// 3. Export 301 SEO Redirects
const redirectHeaders = ['Source URL (Shopify)', 'Target URL (WooCommerce)', 'Status Code'];
const redirectRows = [redirectHeaders.join(',')];

for (const p of shopifyData.products) {
  redirectRows.push([
    escapeCsv(`/products/${p.handle}`),
    escapeCsv(`/product/${p.handle}/`),
    '301'
  ].join(','));
}

for (const c of shopifyData.collections) {
  redirectRows.push([
    escapeCsv(`/collections/${c.handle}`),
    escapeCsv(`/product-category/${c.handle}/`),
    '301'
  ].join(','));
}

for (const pg of shopifyData.pages) {
  redirectRows.push([
    escapeCsv(`/pages/${pg.handle}`),
    escapeCsv(`/${pg.handle}/`),
    '301'
  ].join(','));
}

const redirectOutputPath = path.join(rootDir, 'data', 'seo_301_redirects.csv');
fs.writeFileSync(redirectOutputPath, redirectRows.join('\r\n'), 'utf8');
console.log(`Generated ${redirectRows.length - 1} SEO 301 redirects in: ${redirectOutputPath}`);
