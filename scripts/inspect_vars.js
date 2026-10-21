import fs from 'fs';

const html = fs.readFileSync('order_pay_dump.html', 'utf8');

const varsMatch = html.match(/var razorpay_wc_checkout_vars = ([^;]+);/);
if (varsMatch) {
  console.log('razorpay_wc_checkout_vars:\n', JSON.stringify(JSON.parse(varsMatch[1]), null, 2));
}

console.log('\n--- Buttons & Inputs on page ---');
const btnMatches = [...html.matchAll(/<(?:button|a|input)[^>]*(?:razorpay|pay|order|submit)[^>]*>/gi)];
btnMatches.forEach(b => console.log('Element:', b[0]));

console.log('\n--- Actual HTML element of btn-razorpay ---');
const btnTagIdx = html.indexOf('<button id="btn-razorpay"');
if (btnTagIdx !== -1) {
  console.log(html.substring(btnTagIdx - 200, btnTagIdx + 600));
}



