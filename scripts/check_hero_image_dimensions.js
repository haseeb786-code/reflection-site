import fs from 'fs';

async function checkImages() {
  const urls = [
    'https://reflectionelite.com/wp-content/uploads/2026/10/banner_standing_mirror.jpg',
    'https://reflectionelite.com/wp-content/uploads/2026/10/banner_round_mirror.jpg'
  ];

  for (const url of urls) {
    const filename = url.split('/').pop();
    const res = await fetch(url);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filename, buf);
    console.log(`Saved ${filename}, size: ${buf.length} bytes`);

    // Parse JPEG dimensions
    let offset = 2;
    let width = 0, height = 0;
    while (offset < buf.length) {
      if (buf[offset] !== 0xFF) break;
      const marker = buf[offset + 1];
      if (marker === 0xC0 || marker === 0xC2) { // SOF0 or SOF2
        height = buf.readUInt16BE(offset + 5);
        width = buf.readUInt16BE(offset + 7);
        break;
      }
      const len = buf.readUInt16BE(offset + 2);
      offset += 2 + len;
    }
    console.log(`${filename}: ${width} x ${height} (aspect ratio: ${(width / height).toFixed(4)}, height/width: ${(height / width).toFixed(4)})`);
  }
}

checkImages().catch(console.error);
