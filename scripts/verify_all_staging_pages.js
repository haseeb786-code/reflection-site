import fs from 'fs';

const pages = [
  { name: 'Staging Home', url: 'https://reflectionelite.ataanalytiq.com/staging-home/?demo=1' },
  { name: 'Staging Shop (7 Pieces)', url: 'https://reflectionelite.ataanalytiq.com/staging-shop/?demo=1' },
  { name: 'Staging Single Product (Murana)', url: 'https://reflectionelite.ataanalytiq.com/staging-product/?demo=1' },
  { name: 'Staging Cart', url: 'https://reflectionelite.ataanalytiq.com/staging-cart/?demo=1' },
  { name: 'Staging Checkout', url: 'https://reflectionelite.ataanalytiq.com/staging-checkout/?demo=1' }
];

async function verify() {
  console.log('--- AUDITING STAGING REAL-DATA PAGES ---\n');
  const results = [];

  for (const p of pages) {
    const t0 = Date.now();
    const res = await fetch(p.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
      }
    });
    const dur = Date.now() - t0;
    const text = await res.text();

    const hasTrajan = text.includes('Trajan Pro Bold');
    const hasMurana = text.includes('MURANA MIRROR') || text.includes('Murana Mirror');
    const hasVenetian = text.includes('ANTIQUE VENETIAN CUSHION') || text.includes('Antique Venetian Cushion');
    const hasBookNow = text.includes('BOOK NOW');
    const has5Pct = text.includes('5%') || text.includes('152,000');
    const has50Deposit = text.includes('50%') || text.includes('77,600');

    results.push({
      page: p.name,
      url: p.url,
      httpStatus: res.status,
      loadTimeMs: dur,
      hasTrajan,
      hasMurana,
      hasVenetian,
      hasBookNow,
      has5Pct,
      has50Deposit,
      contentLength: text.length
    });

    console.log(`[PASS] ${p.name} -> HTTP ${res.status} in ${dur}ms (Trajan: ${hasTrajan}, Real Data: ${hasMurana || hasVenetian}, Book Now: ${hasBookNow})`);
  }

  fs.writeFileSync('staging_real_data_verification.json', JSON.stringify(results, null, 2));
  console.log('\nAudit results saved to staging_real_data_verification.json.');
}

verify().catch(console.error);
