const PROD_URL = 'https://reflectionelite.com';

const pages = [
  '/',
  '/shop/',
  '/about-us/',
  '/contact/',
  '/custom-dimensions/',
  '/privacy-policy-2/',
  '/product/antique-venetian-cushion/',
  '/cart/',
  '/checkout/'
];

async function main() {
  console.log('=== VERIFYING HTTP STATUS & BASIC INTEGRITY ACROSS ALL CORE PAGES ===');
  for (const p of pages) {
    const res = await fetch(`${PROD_URL}${p}?v=` + Date.now());
    const text = await res.text();
    const isOk = res.status === 200;
    const hasCss = text.includes('id="te-global-luxury-system"');
    console.log(`[${isOk && hasCss ? 'OK' : 'ERROR'}] ${p} (Status: ${res.status}, Head CSS: ${hasCss}, Length: ${text.length})`);
  }
}

main().catch(console.error);
