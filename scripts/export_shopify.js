import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Simple .env reader without extra dependencies
function loadEnv() {
  const envPath = path.join(rootDir, '.env');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env file not found');
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        env[key] = val;
      }
    }
  }
  return env;
}

const env = loadEnv();
const SHOP = env.SHOPIFY_SHOP_DOMAIN;
const TOKEN = env.SHOPIFY_ACCESS_TOKEN;
const API_VERSION = '2024-07';

if (!SHOP || !TOKEN) {
  console.error('Error: SHOPIFY_SHOP_DOMAIN and SHOPIFY_ACCESS_TOKEN must be in .env');
  process.exit(1);
}

const headers = {
  'X-Shopify-Access-Token': TOKEN,
  'Content-Type': 'application/json'
};

async function fetchShopify(endpoint) {
  const url = `https://${SHOP}/admin/api/${API_VERSION}/${endpoint}`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Shopify API error on ${endpoint}: ${response.status} ${response.statusText} - ${errText}`);
  }
  return await response.json();
}

async function exportAll() {
  console.log(`Starting export from ${SHOP}...`);

  // 1. Shop details
  console.log('Fetching shop details...');
  const shopData = await fetchShopify('shop.json');

  // 2. Collections
  console.log('Fetching custom collections...');
  const customCollData = await fetchShopify('custom_collections.json');
  console.log('Fetching smart collections...');
  const smartCollData = await fetchShopify('smart_collections.json');
  const collections = [...(customCollData.custom_collections || []), ...(smartCollData.smart_collections || [])];

  // 3. Collects (mapping products to collections)
  console.log('Fetching collection-to-product mapping (collects)...');
  const collectsData = await fetchShopify('collects.json?limit=250');
  const collects = collectsData.collects || [];

  // Map product ID to collection IDs
  const productCollectionsMap = {};
  for (const c of collects) {
    if (!productCollectionsMap[c.product_id]) {
      productCollectionsMap[c.product_id] = [];
    }
    const coll = collections.find(item => item.id === c.collection_id);
    if (coll) {
      productCollectionsMap[c.product_id].push({
        id: coll.id,
        title: coll.title,
        handle: coll.handle
      });
    }
  }

  // 4. Products
  console.log('Fetching products...');
  const productsData = await fetchShopify('products.json?limit=250');
  const products = productsData.products || [];

  // Attach mapped collections to each product
  for (const product of products) {
    product.collections = productCollectionsMap[product.id] || [];
  }

  // 5. Pages
  console.log('Fetching pages...');
  let pages = [];
  try {
    const pagesData = await fetchShopify('pages.json');
    pages = pagesData.pages || [];
  } catch (err) {
    console.warn('Warning: Could not fetch pages:', err.message);
  }

  const exportResult = {
    exportDate: new Date().toISOString(),
    shop: shopData.shop,
    collections,
    products,
    pages
  };

  const outputPath = path.join(rootDir, 'data', 'shopify_export.json');
  fs.writeFileSync(outputPath, JSON.stringify(exportResult, null, 2), 'utf8');

  console.log('\n=== Export Complete ===');
  console.log(`Products extracted: ${products.length}`);
  console.log(`Collections extracted: ${collections.length}`);
  console.log(`Pages extracted: ${pages.length}`);
  console.log(`Saved to: ${outputPath}`);
}

exportAll().catch(err => {
  console.error('Export failed:', err);
  process.exit(1);
});
