import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const exportFile = path.join(rootDir, 'data', 'shopify_export.json');
const data = JSON.parse(fs.readFileSync(exportFile, 'utf8'));
const imagesDir = path.join(rootDir, 'assets', 'images');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const tasks = [];
for (const p of data.products) {
  if (p.images && p.images.length > 0) {
    p.images.forEach((img, idx) => {
      const cleanUrl = img.src.split('?')[0];
      const ext = path.extname(cleanUrl) || '.jpg';
      const safeTitle = p.handle.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${safeTitle}-${idx + 1}${ext}`;
      tasks.push({ url: img.src, filename, productTitle: p.title });
    });
  }
}

console.log(`Starting download of ${tasks.length} images...`);

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`Status ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function run() {
  let count = 0;
  for (const t of tasks) {
    const dest = path.join(imagesDir, t.filename);
    try {
      await downloadImage(t.url, dest);
      count++;
      console.log(`[${count}/${tasks.length}] Downloaded: ${t.filename}`);
    } catch (e) {
      console.error(`Failed ${t.filename}: ${e.message}`);
    }
  }
  console.log(`\nFinished downloading ${count} images to assets/images/`);
}

run();
