import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'process.env.PROD_WP_APP_PASS || "[REDACTED]"';
const authHeader = { Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64')}` };

async function uploadLocalImage(filename) {
  const filePath = path.join(rootDir, 'assets', 'images', filename);
  if (!fs.existsSync(filePath)) {
    console.error('File does not exist:', filePath);
    return null;
  }
  const ext = path.extname(filename).toLowerCase();
  const mimeMap = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp'
  };
  const mimeType = mimeMap[ext] || 'image/jpeg';
  const fileData = fs.readFileSync(filePath);

  console.log(`Uploading ${filename} (${fileData.length} bytes)...`);
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/media`, {
    method: 'POST',
    headers: {
      ...authHeader,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': mimeType
    },
    body: fileData
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`Failed to upload ${filename}: ${res.status}`, err);
    return null;
  }
  const media = await res.json();
  console.log(`[SUCCESS] Uploaded ${filename} -> Media ID ${media.id}`);
  return { id: media.id };
}

async function main() {
  console.log('Uploading 4 local high-res photos for Silver Crown framed...');
  const imageFiles = [
    'silver-crown-framed-1.webp',
    'silver-crown-framed-2.webp',
    'silver-crown-framed-3.webp',
    'silver-crown-framed-4.webp'
  ];

  const uploadedImages = [];
  for (const f of imageFiles) {
    const up = await uploadLocalImage(f);
    if (up) uploadedImages.push(up);
  }

  // Load shopify export data for Silver Crown framed
  const shopifyFile = path.join(rootDir, 'data', 'shopify_export.json');
  const shopify = JSON.parse(fs.readFileSync(shopifyFile, 'utf8'));
  const p = shopify.products.find(x => x.handle === 'silver-crown-framed');

  // Check categories on WP
  const catsRes = await fetch(`${WP_URL}/wp-json/wc/v3/products/categories?per_page=100`, { headers: authHeader });
  const cats = await catsRes.json();
  const venetianCat = cats.find(c => c.name.toLowerCase() === 'venetian');

  console.log('Creating Silver Crown framed product on WooCommerce...');
  const body = {
    name: p.title,
    slug: p.handle,
    type: 'simple',
    status: 'publish',
    description: p.body_html || '',
    regular_price: '38137.00',
    sale_price: '35900.00',
    price: '35900.00',
    categories: venetianCat ? [{ id: venetianCat.id }] : [],
    images: uploadedImages
  };

  const createRes = await fetch(`${WP_URL}/wp-json/wc/v3/products`, {
    method: 'POST',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Failed to create product: ${createRes.status} ${err}`);
  }

  const created = await createRes.json();
  console.log(`[SUCCESS] Created "Silver Crown framed" (ID: ${created.id}, Price: ₹${created.price}, Images: ${created.images.length})`);
}

main().catch(console.error);
