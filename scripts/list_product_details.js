const WP_URL = 'https://reflectionelite.com';
const WP_USER = 'admin';
const WP_APP_PASS = 'oOei QLY7 j1mC Wb6U Gndx qYFg';
const authHeader = { Authorization: `Basic ${Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString('base64')}` };

async function listProducts() {
  const res = await fetch(`${WP_URL}/wp-json/wc/v3/products?per_page=20`, { headers: authHeader });
  const products = await res.json();
  for (const p of products) {
    const cats = p.categories.map(c => `${c.name} (${c.slug})`).join(', ');
    console.log(`ID: ${p.id} | Slug: ${p.slug} | Price: ₹${p.price} | Cats: [${cats}]`);
  }
}

listProducts().catch(console.error);
