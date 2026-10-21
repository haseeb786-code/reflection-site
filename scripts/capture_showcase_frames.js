import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const htmlPath = 'file:///' + path.resolve(__dirname, '../portfolio_showcase.html').replace(/\\/g, '/');

async function capture() {
  console.log('Launching Chrome to capture high-res portfolio reel slides...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  await page.goto(htmlPath, { waitUntil: 'networkidle0' });

  // Scene indices: 0, 1, 2, 3, 4
  const scenes = [
    { idx: 0, name: 'reel_slide_1_architecture.png' },
    { idx: 1, name: 'reel_slide_2_aesthetics.png' },
    { idx: 2, name: 'reel_slide_3_product_customizer.png' },
    { idx: 3, name: 'reel_slide_4_indian_payments.png' },
    { idx: 4, name: 'reel_slide_5_roi_savings.png' }
  ];

  for (const s of scenes) {
    console.log(`Setting scene ${s.idx + 1}...`);
    await page.evaluate((idx) => {
      // Pause automatic playback and force specific scene
      playScene(idx);
    }, s.idx);
    await new Promise(r => setTimeout(r, 600)); // wait for transition
    await page.screenshot({ path: s.name, type: 'png' });
    console.log(`Captured ${s.name}`);
  }

  await browser.close();
  console.log('All 5 high-resolution portfolio slides captured successfully!');
}

capture().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
