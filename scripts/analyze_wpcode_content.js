import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync('backups/production_com_pre_swap_20261018/wpcode_headers_footers.json', 'utf8'));

console.log('=== WPCODE HEADER DETAILS ===');
console.log('Total length:', data.ihaf_insert_header.length);
// Check if there are other scripts or just re-luxury-editorial-design-system
const headerSections = data.ihaf_insert_header.split(/<style|<script/i);
console.log('Header tags count:', headerSections.length);
headerSections.forEach((s, idx) => {
  console.log(`Tag ${idx} preview:`, s.slice(0, 100).replace(/\n/g, ' '));
});

console.log('\n=== WPCODE FOOTER DETAILS ===');
console.log('Total length:', data.ihaf_insert_footer.length);
const footerSections = data.ihaf_insert_footer.split(/<script|<style/i);
console.log('Footer tags count:', footerSections.length);
footerSections.forEach((s, idx) => {
  console.log(`Tag ${idx} preview:`, s.slice(0, 100).replace(/\n/g, ' '));
});
