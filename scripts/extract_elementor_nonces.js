import fs from 'fs';

const html = fs.readFileSync('elementor_editor_frame.html', 'utf8');

const nonceMatch = html.match(/"nonces":\s*(\{[^}]+\})/);
console.log('Nonces match:', nonceMatch ? nonceMatch[1] : 'not found');

const ajaxUrlMatch = html.match(/"ajaxurl":\s*"([^"]+)"/);
console.log('ajaxurl:', ajaxUrlMatch ? ajaxUrlMatch[1] : 'not found');
