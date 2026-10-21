import puppeteer from 'puppeteer-core';
import path from 'path';

const brainDir = 'C:\\Users\\haseeb\\.gemini\\antigravity\\brain\\de9ea39a-cece-46b8-8bfb-32a9c75ec2c5';

async function verify() {
  console.log('Launching Chrome to verify live deployment...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
  
  // Set Mobile Viewport (iPhone 14/15 Pro: 393 x 852)
  await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  console.log('Navigating to https://reflectionelite.com/ ...');
  await page.goto('https://reflectionelite.com/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // Capture Mobile Slide 1
  console.log('Capturing Live Mobile View - Slide 1...');
  await page.screenshot({ path: path.join(brainDir, 'live_mobile_slide_1.png') });

  // Wait 5 seconds for auto-slide to trigger
  console.log('Waiting 5s for auto-slide to transition to Slide 2...');
  await new Promise(r => setTimeout(r, 5000));

  // Capture Mobile Slide 2
  console.log('Capturing Live Mobile View - Slide 2...');
  await page.screenshot({ path: path.join(brainDir, 'live_mobile_slide_2.png') });

  // Now switch to Desktop View
  console.log('Switching to Desktop Viewport (1440 x 900)...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5, isMobile: false });
  await page.goto('https://reflectionelite.com/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log('Capturing Live Desktop View...');
  await page.screenshot({ path: path.join(brainDir, 'live_desktop_hero.png') });

  await browser.close();
  console.log('Verification screenshots captured successfully!');
}

verify().catch(console.error);
