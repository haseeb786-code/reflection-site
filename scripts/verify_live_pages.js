import fs from 'fs';

const liveUrls = [
  { name: 'Home', url: 'https://reflectionelite.ataanalytiq.com/' },
  { name: 'Shop', url: 'https://reflectionelite.ataanalytiq.com/shop/' },
  { name: 'Product Showcase', url: 'https://reflectionelite.ataanalytiq.com/product/' },
  { name: 'Cart', url: 'https://reflectionelite.ataanalytiq.com/cart/' },
  { name: 'Checkout', url: 'https://reflectionelite.ataanalytiq.com/checkout/' },
  { name: 'About Us', url: 'https://reflectionelite.ataanalytiq.com/about-us/' },
  { name: 'Contact Us', url: 'https://reflectionelite.ataanalytiq.com/contact/' },
  { name: 'Terms of Service', url: 'https://reflectionelite.ataanalytiq.com/terms-of-service/' },
  { name: 'Privacy Policy', url: 'https://reflectionelite.ataanalytiq.com/privacy-policy-2/' },
  { name: 'Refund Policy', url: 'https://reflectionelite.ataanalytiq.com/refund-policy/' },
  { name: 'Shipping Policy', url: 'https://reflectionelite.ataanalytiq.com/shipping-policy/' }
];

async function verify() {
  console.log('=== VERIFYING ALL LIVE PRODUCTION URLS ===');
  let hasFailure = false;

  for (const page of liveUrls) {
    try {
      const res = await fetch(page.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      const html = await res.text();
      const status = res.status;

      // Checks
      const hasTrajan = html.includes('Trajan Pro');
      const hasTrendingStyles = html.includes('te-live-page') || html.includes('trending-era');
      const hasStagingLinks = html.includes('staging-') || html.includes('?demo=1');

      console.log(`[${page.name}] ${page.url}`);
      console.log(`  - HTTP Status: ${status}`);
      console.log(`  - Trajan Pro Present: ${hasTrajan}`);
      console.log(`  - Trending Era Theme Applied: ${hasTrendingStyles}`);
      console.log(`  - Staging/Demo Links Absent: ${!hasStagingLinks}`);
      console.log(`  - Page Byte Size: ${html.length}`);

      if (status !== 200 || !hasTrajan || !hasTrendingStyles || hasStagingLinks) {
        console.error(`  --> ISSUE DETECTED on ${page.name}`);
        hasFailure = true;
      }
    } catch (e) {
      console.error(`  --> FETCH ERROR on ${page.name}:`, e.message);
      hasFailure = true;
    }
  }

  if (hasFailure) {
    console.error('\nFAILED: One or more pages did not meet verification criteria!');
    process.exit(1);
  } else {
    console.log('\nSUCCESS: All 11 live production pages verified with 100% fidelity!');
  }
}

verify().catch(console.error);
