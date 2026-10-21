import fs from 'fs';

const html = fs.readFileSync('shop_live_rendered.html', 'utf8');
const match = html.match(/<div[^>]*class="[^"]*elementor-1398[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
if (match) {
  console.log('elementor-1398 snippet:', match[0].slice(0, 500));
} else {
  // find elementor-1398 in html
  const idx = html.indexOf('elementor-1398');
  console.log('Context around elementor-1398:');
  console.log(html.slice(idx - 100, idx + 400));
}
