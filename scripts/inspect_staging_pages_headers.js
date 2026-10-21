import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

const STAGING_URL = 'https://reflectionelite.ataanalytiq.com';

const PAGES = [
  { id: 52, slug: 'home' },
  { id: 7, slug: 'shop' },
  { id: 674, slug: 'about-us' },
  { id: 943, slug: 'contact' },
  { id: 1511, slug: 'privacy-policy-2' },
  { id: 1519, slug: 'refund-policy' },
  { id: 8, slug: 'cart' },
  { id: 9, slug: 'checkout' },
  { id: 2027, slug: 'custom-dimensions' },
  { id: 1144, slug: 'product' }
];

async function checkAll() {
  for (const p of PAGES) {
    const res = await fetch(`${STAGING_URL}/wp-json/wp/v2/pages/${p.id}`, {
      headers: { Cookie: cookieHeader }
    });
    if (!res.ok) {
      console.log(`Page ${p.id} (${p.slug}): HTTP ${res.status}`);
      continue;
    }
    const data = await res.json();
    const raw = data.content?.raw || data.content?.rendered || '';
    const hasUnifiedHeader = raw.includes('reUnifiedHeader') || raw.includes('re-unified-header');
    const hasOldSiteHeader = raw.includes('site-header');
    const hasAnnouncement = raw.includes('announcement-bar');
    console.log(`Page ${p.id} (${p.slug}): length=${raw.length}, unified=${hasUnifiedHeader}, site-header=${hasOldSiteHeader}, announcement=${hasAnnouncement}`);
  }
}

checkAll().catch(console.error);
