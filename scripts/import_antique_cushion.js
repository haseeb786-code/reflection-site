import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const WP_URL = 'http://reflection-elite.local';
const creds = Buffer.from('haseeb:1u1YAUYqfnjnnPyA3zsoPVib').toString('base64');
const authHeader = { Authorization: `Basic ${creds}` };

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
  console.log(`Uploaded ${filename} -> Media ID ${media.id}`);
  return { id: media.id };
}

async function main() {
  const shopifyFile = path.join(rootDir, 'data', 'shopify_export.json');
  const shopify = JSON.parse(fs.readFileSync(shopifyFile, 'utf8'));

  const p = shopify.products.find(prod => prod.handle === 'antique-venetian-cushion');
  if (!p) {
    console.error('Could not find antique-venetian-cushion in shopify_export.json');
    return;
  }

  console.log('Uploading 6 local high-res photos for Antique venetian cushion...');
  const imageFiles = [
    'antique-venetian-cushion-1.webp',
    'antique-venetian-cushion-2.webp',
    'antique-venetian-cushion-3.webp',
    'antique-venetian-cushion-4.jpg',
    'antique-venetian-cushion-5.jpg',
    'antique-venetian-cushion-6.jpg'
  ];

  const imagePayload = [];
  for (const f of imageFiles) {
    const uploaded = await uploadLocalImage(f);
    if (uploaded) imagePayload.push(uploaded);
  }

  // Get Venetian category ID
  const catRes = await fetch(`${WP_URL}/wp-json/wc/v3/products/categories?slug=venetian-mirror`, {
    headers: authHeader
  });
  const cats = await catRes.json();
  const catId = cats.length > 0 ? cats[0].id : 20;

  const v = p.variants[0] || {};
  const productPayload = {
    name: p.title,
    type: 'simple',
    regular_price: String(v.price || '81500'),
    description: p.body_html || '',
    sku: v.sku || 'REF-ANTIQUE-VENETIAN-CUSHION',
    categories: [{ id: catId }],
    images: imagePayload,
    manage_stock: false,
    in_stock: true
  };

  const createRes = await fetch(`${WP_URL}/wp-json/wc/v3/products`, {
    method: 'POST',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productPayload)
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    console.error('Failed to create Antique venetian cushion product:', err);
    return;
  }

  const created = await createRes.json();
  console.log(`[SUCCESS] Antique venetian cushion created! ID: ${created.id}, Price: ₹${created.regular_price}, Images: ${created.images.length}`);
}

main().catch(console.error);
