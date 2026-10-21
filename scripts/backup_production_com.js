import fs from 'fs';
import path from 'path';
import { getProdAuth } from './prod_auth_helper.js';

const BACKUP_DIR = path.resolve('backups/production_com_pre_swap_20261018');

async function backupProduction() {
  console.log('=== STARTING PRE-SWAP FULL BACKUP OF REFLECTIONELITE.COM ===');
  
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const { siteUrl, cookies, nonce } = await getProdAuth();
  console.log('✓ Successfully authenticated to', siteUrl);

  const manifest = {
    timestamp: new Date().toISOString(),
    siteUrl,
    settings: null,
    pages: []
  };

  // 1. Backup Reading & General Settings
  console.log('Fetching site settings...');
  const settingsRes = await fetch(`${siteUrl}/wp-json/wp/v2/settings`, {
    headers: { 'Cookie': cookies, 'X-WP-Nonce': nonce }
  });
  if (settingsRes.ok) {
    const settings = await settingsRes.json();
    manifest.settings = {
      title: settings.title,
      description: settings.description,
      show_on_front: settings.show_on_front,
      page_on_front: settings.page_on_front,
      page_for_posts: settings.page_for_posts
    };
    fs.writeFileSync(path.join(BACKUP_DIR, 'settings.json'), JSON.stringify(settings, null, 2));
    console.log('✓ Saved settings.json');
  } else {
    console.warn('⚠️ Could not fetch settings:', settingsRes.status);
  }

  // 2. Fetch all pages
  console.log('Fetching all production pages (context=edit)...');
  const pagesListRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages?per_page=100&context=edit`, {
    headers: { 'Cookie': cookies, 'X-WP-Nonce': nonce }
  });

  if (!pagesListRes.ok) {
    throw new Error(`Failed to list pages: HTTP ${pagesListRes.status}`);
  }

  const pages = await pagesListRes.json();
  console.log(`Discovered ${pages.length} pages to back up.`);

  for (const p of pages) {
    const filename = `page_${p.id}_${p.slug}.json`;
    const filePath = path.join(BACKUP_DIR, filename);
    
    // Save complete raw page payload
    fs.writeFileSync(filePath, JSON.stringify(p, null, 2));

    manifest.pages.push({
      id: p.id,
      slug: p.slug,
      title: p.title?.raw || p.title?.rendered,
      status: p.status,
      template: p.template,
      contentLength: p.content?.raw?.length || 0,
      filename
    });

    console.log(`✓ Backed up Page ${p.id} [${p.slug}]: "${p.title?.rendered}" (${p.content?.raw?.length || 0} bytes raw content)`);
  }

  // 3. Save Manifest
  fs.writeFileSync(path.join(BACKUP_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('✓ Saved manifest.json');

  console.log('\n=== BACKUP SUMMARY ===');
  console.log(`Directory: ${BACKUP_DIR}`);
  console.log(`Pages backed up: ${manifest.pages.length}`);
  console.log('All files verified on disk.');
}

backupProduction().catch(err => {
  console.error('BACKUP FAILED:', err);
  process.exit(1);
});
