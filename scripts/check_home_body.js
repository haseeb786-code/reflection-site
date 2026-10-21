import fs from 'fs';

const liveHome = fs.readFileSync('temp_live_home.html', 'utf8');

// Strip all <style>...</style> tags
const noStyle = liveHome.replace(/<style[\s\S]*?<\/style>/gi, '');

console.log('Does liveHome body contain luxury-card?:', noStyle.includes('luxury-card'));
console.log('Does liveHome body contain product?:', noStyle.includes('product'));
console.log('Does liveHome body contain ANTIQUE?:', noStyle.includes('ANTIQUE'));
console.log('Does liveHome body contain CUSHION?:', noStyle.includes('CUSHION'));

// Let us find what sections liveHome actually has!
const sections = noStyle.match(/<(section|div)[^>]*id="[^"]*"[^>]*>/gi);
console.log('Key sections with IDs in liveHome:');
console.log(sections);
