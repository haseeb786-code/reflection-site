import fs from 'fs';
import path from 'path';
import { getFreshNonce, cookieHeader } from './staging_real_data_helper.js';

const BACKUP_DIR = path.resolve('./backups/live_pre_swap_20261018');

async function fullBackup() {
  console.log('=== STEP 1: INITIATING FULL BACKUP OF LIVE PAGES & SETTINGS ===');
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const nonce = await getFreshNonce();

  // 1. Backup Settings
  console.log('Backing up WP settings...');
  const settingsRes = await fetch('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/settings', {
    headers: { 'Cookie': cookieHeader, 'X-WP-Nonce': nonce }
  });
  if (settingsRes.ok) {
    const settings = await settingsRes.json();
    fs.writeFileSync(path.join(BACKUP_DIR, 'settings.json'), JSON.stringify(settings, null, 2), 'utf8');
    console.log('Settings backed up successfully.');
  } else {
    console.warn('Failed to backup settings:', settingsRes.status);
  }

  // 2. Fetch all pages (context=edit to preserve raw content and Gutenberg blocks)
  const listRes = await fetch('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages?per_page=100', {
    headers: { 'Cookie': cookieHeader }
  });
  const allPagesSummary = await listRes.json();
  fs.writeFileSync(path.join(BACKUP_DIR, 'all_pages_summary.json'), JSON.stringify(allPagesSummary, null, 2), 'utf8');

  console.log(`Discovered ${allPagesSummary.length} total pages. Backing up full edit payloads...`);
  const backedUpPages = [];

  for (const p of allPagesSummary) {
    try {
      const pageRes = await fetch(`https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/${p.id}?context=edit`, {
        headers: { 'Cookie': cookieHeader, 'X-WP-Nonce': nonce }
      });
      if (!pageRes.ok) {
        console.error(`Error fetching page ${p.id} (${p.slug}): ${pageRes.status}`);
        continue;
      }
      const pageData = await pageRes.json();
      const filename = `page_${p.id}_${p.slug}.json`;
      fs.writeFileSync(path.join(BACKUP_DIR, filename), JSON.stringify(pageData, null, 2), 'utf8');
      backedUpPages.push({ id: p.id, slug: p.slug, title: pageData.title?.raw || pageData.title?.rendered, file: filename });
      console.log(`✓ Backed up Page ${p.id} [${p.slug}] (${pageData.content?.raw?.length || 0} bytes)`);
    } catch (err) {
      console.error(`Exception backing up page ${p.id}:`, err.message);
    }
  }

  // 3. Backup live theme and menu info
  fs.writeFileSync(path.join(BACKUP_DIR, 'manifest.json'), JSON.stringify({
    timestamp: new Date().toISOString(),
    total_pages_backed_up: backedUpPages.length,
    pages: backedUpPages
  }, null, 2), 'utf8');

  console.log(`\n=== BACKUP COMPLETE: ${backedUpPages.length} pages safely stored in ${BACKUP_DIR} ===`);
}

fullBackup().catch(err => {
  console.error('BACKUP FAILED:', err);
  process.exit(1);
});
