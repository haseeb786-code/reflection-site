import fs from 'fs';

const html = fs.readFileSync('shopify_live_homepage.html', 'utf8');

// Section 15: Email
const id15 = 'template--21609896640601__section_7PyBNb';
const start15 = html.indexOf(`id="shopify-section-${id15}"`);
const next15 = html.indexOf('shopify-section', start15 + 100);
const snippet15 = html.substring(start15, next15);
fs.writeFileSync('section_15_email.html', snippet15);
console.log('Saved section 15 (Email), size:', snippet15.length);

// Section 16: FAQ
const id16 = 'sections--21609896771673__section_tQFiwz';
const start16 = html.indexOf(`id="shopify-section-${id16}"`);
const next16 = html.indexOf('shopify-section', start16 + 100);
const snippet16 = html.substring(start16, next16 !== -1 ? next16 : start16 + 8000);
fs.writeFileSync('section_16_faq.html', snippet16);
console.log('Saved section 16 (FAQ), size:', snippet16.length);
