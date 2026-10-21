import { getProdAuth } from './prod_auth_helper.js';
import fs from 'fs';
import path from 'path';

async function backup() {
  const backupDir = path.resolve('backups/pre_hero_ticker_slider_v2_20261019');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const auth = await getProdAuth();

  // 1. Backup all WP pages
  console.log('Backing up WordPress pages...');
  const pagesRes = await fetch(`${auth.siteUrl}/wp-json/wp/v2/pages?per_page=100`, {
    headers: { 'Cookie': auth.cookies }
  });
  const pages = await pagesRes.json();
  fs.writeFileSync(path.join(backupDir, 'all_pages.json'), JSON.stringify(pages, null, 2), 'utf8');

  // Specifically save Page 68 (home)
  const homePage = pages.find(p => p.id === 68);
  if (homePage) {
    fs.writeFileSync(path.join(backupDir, 'page_68_home.html'), homePage.content.rendered, 'utf8');
    console.log('✓ Saved page 68 home HTML');
  }

  // 2. Backup WPCode Global Header & Footer
  console.log('Backing up WPCode Headers & Footers...');
  const hfRes = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode-headers-footers`, {
    headers: { Cookie: auth.cookies }
  });
  const hfHtml = await hfRes.text();
  const headerMatch = hfHtml.match(/<textarea[^>]*name="ihaf_insert_header"[^>]*>([\s\S]*?)<\/textarea>/i);
  const footerMatch = hfHtml.match(/<textarea[^>]*name="ihaf_insert_footer"[^>]*>([\s\S]*?)<\/textarea>/i);

  if (headerMatch) {
    const headerCode = headerMatch[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"');
    fs.writeFileSync(path.join(backupDir, 'wpcode_header.html'), headerCode, 'utf8');
  }
  if (footerMatch) {
    const footerCode = footerMatch[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"');
    fs.writeFileSync(path.join(backupDir, 'wpcode_footer.html'), footerCode, 'utf8');
  }
  console.log('✓ Saved WPCode header and footer');

  // 3. Backup WPCode snippets table/page
  const listRes = await fetch(`${auth.siteUrl}/wp-admin/admin.php?page=wpcode`, {
    headers: { Cookie: auth.cookies }
  });
  const listHtml = await listRes.text();
  fs.writeFileSync(path.join(backupDir, 'wpcode_snippets_list.html'), listHtml, 'utf8');
  console.log('✓ Saved WPCode snippets list HTML');

  console.log('Backup completed successfully in:', backupDir);
}

backup().catch(console.error);
