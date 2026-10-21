import fs from 'fs';
import path from 'path';
import { getProdAuth } from './prod_auth_helper.js';

const BACKUP_DIR = path.resolve('backups/production_com_pre_swap_20261018');
const isDryRun = process.argv.includes('--dry-run');

async function rollbackProduction() {
  console.log(`=== STARTING RESTORE / ROLLBACK FOR REFLECTIONELITE.COM ${isDryRun ? '(DRY RUN)' : '(LIVE EXECUTION)'} ===`);

  const manifestPath = path.join(BACKUP_DIR, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest not found at: ${manifestPath}`);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  console.log(`Found backup from ${manifest.timestamp} with ${manifest.pages.length} pages.`);

  const { siteUrl, cookies, nonce } = await getProdAuth();
  console.log('✓ Successfully authenticated to', siteUrl);

  for (const item of manifest.pages) {
    const pageFilePath = path.join(BACKUP_DIR, item.filename);
    if (!fs.existsSync(pageFilePath)) {
      console.error(`Missing backup file: ${pageFilePath}`);
      continue;
    }

    const pageData = JSON.parse(fs.readFileSync(pageFilePath, 'utf8'));
    console.log(`\nRestoring Page ${item.id} [${item.slug}] - "${item.title}"...`);

    const payload = {
      title: pageData.title?.raw ?? pageData.title?.rendered ?? item.title,
      content: pageData.content?.raw ?? '',
      template: pageData.template ?? '',
      slug: pageData.slug ?? item.slug,
      status: pageData.status ?? 'publish'
    };

    if (isDryRun) {
      console.log(`[DRY RUN] Would restore Page ${item.id} with ${payload.content.length} chars of content, template="${payload.template}"`);
    } else {
      const res = await fetch(`${siteUrl}/wp-json/wp/v2/pages/${item.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies,
          'X-WP-Nonce': nonce
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        console.log(`✓ Successfully restored Page ${item.id} [${item.slug}]`);
      } else {
        const errText = await res.text();
        console.error(`✗ Failed to restore Page ${item.id}: HTTP ${res.status} - ${errText}`);
      }
    }
  }

  // Restore Settings
  const settingsPath = path.join(BACKUP_DIR, 'settings.json');
  if (fs.existsSync(settingsPath)) {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    console.log('\nRestoring Reading Settings...');
    if (isDryRun) {
      console.log(`[DRY RUN] Would restore show_on_front="${settings.show_on_front}", page_on_front=${settings.page_on_front}`);
    } else {
      const res = await fetch(`${siteUrl}/wp-json/wp/v2/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies,
          'X-WP-Nonce': nonce
        },
        body: JSON.stringify({
          show_on_front: settings.show_on_front,
          page_on_front: settings.page_on_front,
          page_for_posts: settings.page_for_posts
        })
      });
      if (res.ok) {
        console.log('✓ Successfully restored reading settings.');
      } else {
        console.error(`✗ Failed to restore settings: HTTP ${res.status}`);
      }
    }
  }

  console.log(`\n=== ROLLBACK ${isDryRun ? 'DRY-RUN VERIFICATION' : 'EXECUTION'} COMPLETED ===`);
}

rollbackProduction().catch(err => {
  console.error('ROLLBACK ENCOUNTERED ERROR:', err);
  process.exit(1);
});
