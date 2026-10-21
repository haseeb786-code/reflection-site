import fs from 'fs';

const pages = [
  { id: 68, slug: 'home' },
  { id: 6, slug: 'shop' },
  { id: 50, slug: 'about-us' },
  { id: 52, slug: 'contact' },
  { id: 120, slug: 'custom-dimensions' },
  { id: 103, slug: 'refund_returns-2' },
  { id: 102, slug: 'privacy-policy-2' },
  { id: 7, slug: 'cart' },
  { id: 8, slug: 'checkout' }
];

console.log('--- Inspecting Raw Header on All Pages ---');
for (const p of pages) {
  const file = `raw_page_${p.id}_${p.slug}.html`;
  if (!fs.existsSync(file)) {
    console.log(p.slug, 'FILE NOT FOUND');
    continue;
  }
  const content = fs.readFileSync(file, 'utf8');
  const hasHeader = content.includes('re-unified-header-container');
  const hasSearch = content.includes('re-search-toggle-btn');
  const hasAccount = content.includes('re-account-link');
  const hasBookSurveyRow = content.includes('re-book-survey-row');
  const headerStart = content.indexOf('<header class="re-unified-header-container"');
  const headerEnd = content.indexOf('</header>', headerStart);
  const headerLen = headerStart !== -1 && headerEnd !== -1 ? headerEnd - headerStart + 9 : 0;
  console.log(p.slug.padEnd(20), '| hasHeader:', hasHeader, '| hasSearch:', hasSearch, '| hasAccount:', hasAccount, '| hasBookSurveyRow:', hasBookSurveyRow, '| headerLen:', headerLen);
}
