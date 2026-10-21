import fs from 'fs';

if (fs.existsSync('data/shopify_export.json')) {
  const content = fs.readFileSync('data/shopify_export.json', 'utf8');
  console.log('Size of shopify_export.json:', content.length);
  const data = JSON.parse(content);
  console.log('Keys in shopify_export:', Object.keys(data));
  const urls = [...content.matchAll(/https?:\/\/[^\s"']+\.(jpg|png|webp|jpeg)/gi)].map(m => m[0]);
  console.log('Total image URLs:', urls.length);
  const uniqueUrls = [...new Set(urls)];
  console.log('Sample image URLs:', uniqueUrls.slice(0, 15));
} else {
  console.log('No data/shopify_export.json found');
}
