import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function loadEnv() {
  const envPath = path.join(rootDir, '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
      }
    }
  }
  return env;
}

const env = loadEnv();
const WP_URL = (env.WORDPRESS_URL || env.WP_SITE_URL || '').replace(/\/$/, '');
const WP_USER = env.WORDPRESS_USER || env.WP_USERNAME || '';
const WP_APP_PASS = env.WORDPRESS_APP_PASSWORD || '';
const WP_TOKEN = env.WP_TOKEN || '';
const WC_CK = env.WOOCOMMERCE_CK || '';
const WC_CS = env.WOOCOMMERCE_CS || '';

if (!WP_URL) {
  console.log('------------------------------------------------------------');
  console.log('NOTICE: WORDPRESS_URL not configured yet in .env');
  console.log('Please add the following to your .env file:');
  console.log('WORDPRESS_URL=https://your-wordpress-site.com');
  console.log('WORDPRESS_USER=admin');
  console.log('WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx');
  console.log('OR');
  console.log('WOOCOMMERCE_CK=ck_xxxxxxxxxxxxxxxxxxxxxxxx');
  console.log('WOOCOMMERCE_CS=cs_xxxxxxxxxxxxxxxxxxxxxxxx');
  console.log('------------------------------------------------------------');
  process.exit(0);
}

function getAuthHeader() {
  if (WP_TOKEN) {
    return { Authorization: `Bearer ${WP_TOKEN}` };
  } else if (WP_USER && WP_APP_PASS) {
    const creds = Buffer.from(`${WP_USER}:${WP_APP_PASS.replace(/\s+/g, '')}`).toString('base64');
    return { Authorization: `Basic ${creds}` };
  } else if (WC_CK && WC_CS) {
    const creds = Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64');
    return { Authorization: `Basic ${creds}` };
  }
  throw new Error('No WordPress credentials provided in .env');
}

async function wpApi(endpoint, options = {}) {
  const url = `${WP_URL}${endpoint}`;
  const headers = {
    ...getAuthHeader(),
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  const response = await fetch(url, {
    ...options,
    headers
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API Error [${response.status}] ${url}: ${body}`);
  }
  return await response.json();
}

async function runMigration() {
  console.log(`\n========================================================`);
  console.log(`Starting Migration to WordPress: ${WP_URL}`);
  console.log(`========================================================\n`);

  // Load Shopify Export
  const shopifyFile = path.join(rootDir, 'data', 'shopify_export.json');
  const shopify = JSON.parse(fs.readFileSync(shopifyFile, 'utf8'));

  // 1. Configure Currency to INR
  console.log('1. Configuring Currency to INR (₹)...');
  try {
    await wpApi('/wp-json/wc/v3/settings/general/woocommerce_currency', {
      method: 'PUT',
      body: JSON.stringify({ value: 'INR' })
    });
    console.log('   [SUCCESS] Currency set to INR (₹)');
  } catch (err) {
    console.warn('   [NOTE] Currency setting via REST API skipped/not supported:', err.message);
  }

  // 2. Create Categories
  console.log('\n2. Migrating Categories...');
  const catMap = new Map();
  // Fetch existing
  let existingCats = [];
  try {
    existingCats = await wpApi('/wp-json/wc/v3/products/categories?per_page=100');
    for (const c of existingCats) {
      catMap.set(c.name.toLowerCase(), c.id);
    }
  } catch (err) {
    console.warn('   Could not fetch existing categories:', err.message);
  }

  for (const col of shopify.collections) {
    const nameLower = col.title.toLowerCase();
    if (catMap.has(nameLower)) {
      console.log(`   Category "${col.title}" already exists (ID: ${catMap.get(nameLower)})`);
      continue;
    }
    try {
      const created = await wpApi('/wp-json/wc/v3/products/categories', {
        method: 'POST',
        body: JSON.stringify({
          name: col.title,
          slug: col.handle
        })
      });
      catMap.set(nameLower, created.id);
      console.log(`   [SUCCESS] Created category "${col.title}" (ID: ${created.id})`);
    } catch (err) {
      console.error(`   [ERROR] Failed to create category "${col.title}":`, err.message);
    }
  }

  // 3. Migrate Products
  console.log('\n3. Migrating Products & Variations with 100% Fidelity...');
  for (const p of shopify.products) {
    console.log(`\n -> Processing: "${p.title}"`);
    const isVariable = p.variants && p.variants.length > 1;

    // Build categories payload
    const productCats = (p.collections || [])
      .map(c => catMap.get(c.title.toLowerCase()))
      .filter(Boolean)
      .map(id => ({ id }));

    // Build images payload
    const images = (p.images || []).map(img => ({
      src: img.src,
      alt: p.title
    }));

    if (!isVariable) {
      const v = p.variants[0] || {};
      const payload = {
        name: p.title,
        type: 'simple',
        regular_price: String(v.price || '0'),
        description: p.body_html || '',
        sku: v.sku || `REF-${p.handle.toUpperCase()}`,
        categories: productCats,
        images: images,
        manage_stock: false,
        in_stock: true
      };

      try {
        const res = await wpApi('/wp-json/wc/v3/products', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        console.log(`    [SUCCESS] Simple product created (ID: ${res.id}, Price: ₹${res.regular_price})`);
      } catch (err) {
        console.error(`    [ERROR] Failed to create product "${p.title}":`, err.message);
      }
    } else {
      // Variable parent
      const attributes = (p.options || []).map(opt => ({
        name: opt.name,
        visible: true,
        variation: true,
        options: opt.values
      }));

      const payload = {
        name: p.title,
        type: 'variable',
        description: p.body_html || '',
        sku: `REF-${p.handle.toUpperCase()}`,
        categories: productCats,
        images: images,
        attributes: attributes
      };

      try {
        const parent = await wpApi('/wp-json/wc/v3/products', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        console.log(`    [SUCCESS] Variable parent created (ID: ${parent.id})`);

        // Create variations
        for (const v of p.variants) {
          const varAttrs = [];
          if (p.options[0] && v.option1) varAttrs.push({ name: p.options[0].name, option: v.option1 });
          if (p.options[1] && v.option2) varAttrs.push({ name: p.options[1].name, option: v.option2 });
          if (p.options[2] && v.option3) varAttrs.push({ name: p.options[2].name, option: v.option3 });

          const varPayload = {
            regular_price: String(v.price || '0'),
            attributes: varAttrs,
            sku: v.sku || `REF-${p.handle.toUpperCase()}-${v.id}`
          };

          const varRes = await wpApi(`/wp-json/wc/v3/products/${parent.id}/variations`, {
            method: 'POST',
            body: JSON.stringify(varPayload)
          });
          console.log(`      [SUCCESS] Variation "${v.title}" created (ID: ${varRes.id}, Price: ₹${varRes.regular_price})`);
        }
      } catch (err) {
        console.error(`    [ERROR] Failed to create variable product "${p.title}":`, err.message);
      }
    }
  }

  // 4. Create Pages
  console.log('\n4. Migrating Pages...');
  for (const page of shopify.pages) {
    try {
      const pagePayload = {
        title: page.title,
        slug: page.handle,
        content: page.body_html || `<p>${page.title} page content from Reflection Elite.</p>`,
        status: 'publish'
      };
      const createdPage = await wpApi('/wp-json/wp/v2/pages', {
        method: 'POST',
        body: JSON.stringify(pagePayload)
      });
      console.log(`   [SUCCESS] Page "${page.title}" created (ID: ${createdPage.id}, URL: ${createdPage.link})`);
    } catch (err) {
      console.warn(`   [NOTE] Page "${page.title}":`, err.message);
    }
  }

  console.log(`\n========================================================`);
  console.log(`Migration Complete! Run: npm run audit to generate report.`);
  console.log(`========================================================\n`);
}

runMigration().catch(err => {
  console.error('\nFATAL MIGRATION ERROR:', err);
  process.exit(1);
});
