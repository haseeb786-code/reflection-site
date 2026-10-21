import fs from 'fs';

const html = fs.readFileSync('order_pay_dump.html', 'utf8');

console.log('--- Search: checkout.razorpay.com/v1/checkout.js ---');
const exactMatches = [];
let idx = 0;
while ((idx = html.indexOf('checkout.razorpay.com', idx)) !== -1) {
  const snippet = html.substring(Math.max(0, idx - 100), Math.min(html.length, idx + 200));
  exactMatches.push({ index: idx, snippet });
  idx += 'checkout.razorpay.com'.length;
}
console.log('Found occurrences:', exactMatches.length);
exactMatches.forEach((m, i) => {
  console.log(`\nOccurrence #${i + 1}:`);
  console.log(m.snippet);
});

console.log('\n--- Checking for all script tags related to Razorpay ---');
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
while ((match = scriptRegex.exec(html)) !== null) {
  const tag = match[0];
  if (/razorpay/i.test(tag)) {
    count++;
    console.log(`\n[Razorpay Script #${count}]`);
    const openTag = tag.match(/<script\b[^>]*>/i)[0];
    console.log('Tag:', openTag);
    if (!openTag.includes('src=')) {
      console.log('Inline Code (first 300 chars):', match[1].trim().substring(0, 300));
    }
  }
}
