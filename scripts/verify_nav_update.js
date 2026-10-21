import puppeteer from 'puppeteer';

async function verifyNav() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 1. Desktop at 1440px
  console.log('1. Testing Desktop at 1440px...');
  const pageDesktop = await browser.newPage();
  await pageDesktop.setViewport({ width: 1440, height: 900 });
  await pageDesktop.goto('https://reflectionelite.com/', { waitUntil: 'networkidle2', timeout: 60000 });
  await pageDesktop.waitForSelector('.re-desktop-nav-links', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  const desktopLinks = await pageDesktop.evaluate(() => {
    const nav = document.querySelector('.re-desktop-nav-links');
    if (!nav) return { error: 'nav not found' };
    const items = Array.from(nav.querySelectorAll('a')).map(a => ({
      text: a.textContent.trim(),
      href: a.getAttribute('href')
    }));
    const rect = nav.getBoundingClientRect();
    const cs = window.getComputedStyle(nav);
    return {
      items,
      count: items.length,
      rect: { left: Math.round(rect.left), width: Math.round(rect.width), right: Math.round(rect.right) },
      justifyContent: cs.justifyContent,
      display: cs.display
    };
  });
  console.log('Desktop 1440px Nav links:', desktopLinks);
  await pageDesktop.screenshot({ path: 'verify_nav_1440px.png', fullPage: false });
  console.log('✓ Saved verify_nav_1440px.png');
  await pageDesktop.close();

  // 2. Desktop at 1920px
  console.log('2. Testing Desktop at 1920px...');
  const page1920 = await browser.newPage();
  await page1920.setViewport({ width: 1920, height: 1080 });
  await page1920.goto('https://reflectionelite.com/', { waitUntil: 'networkidle2', timeout: 60000 });
  await page1920.waitForSelector('.re-desktop-nav-links', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));
  await page1920.screenshot({ path: 'verify_nav_1920px.png', fullPage: false });
  console.log('✓ Saved verify_nav_1920px.png');
  await page1920.close();

  await browser.close();
  console.log('✓ Verification completed successfully!');
}

verifyNav().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
