import fs from 'fs';

function getJpgDimensions(buffer) {
  let i = 4;
  while (i < buffer.length) {
    while (buffer[i] === 0xff) i++;
    const marker = buffer[i++];
    if (marker === 0xd8 || marker === 0xd9) continue;
    const len = buffer.readUInt16BE(i);
    if (marker >= 0xc0 && marker <= 0xc3) {
      const height = buffer.readUInt16BE(i + 3);
      const width = buffer.readUInt16BE(i + 5);
      return { width, height };
    }
    i += len;
  }
  return null;
}

try {
  const wp1 = fs.readFileSync('test_wp_card1.jpg');
  console.log('WP Card 1 size:', wp1.length, getJpgDimensions(wp1));
} catch(e) { console.log(e.message); }

try {
  const wp4 = fs.readFileSync('test_wp_card4.jpg');
  console.log('WP Card 4 size:', wp4.length, getJpgDimensions(wp4));
} catch(e) { console.log(e.message); }

try {
  const sp4 = fs.readFileSync('shopify_card4.jpg');
  console.log('Shopify Card 4 size:', sp4.length, getJpgDimensions(sp4));
} catch(e) { console.log(e.message); }
