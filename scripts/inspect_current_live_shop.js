const res = await fetch('https://reflectionelite.com/shop/?v=' + Date.now());
const html = await res.text();

console.log('HTML length:', html.length);
console.log('Includes arched:', /arched/i.test(html));
console.log('Includes lumen:', /lumen/i.test(html));
console.log('Includes bespoke:', /bespoke/i.test(html));

// Print all H1s and H2s
const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
console.log('H1s:', h1s);

const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
console.log('H2s:', h2s);

// Check if HIGH STRENGTH METAL MATERIALS is present
console.log('Includes HIGH STRENGTH:', html.includes('HIGH STRENGTH METAL MATERIALS'));
// Check if result count is present
console.log('Includes result-count:', html.includes('woocommerce-result-count'));
