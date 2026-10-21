import { cookieHeader } from './staging_real_data_helper.js';
import fs from 'fs';

async function checkWprThemeBuilder() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/admin.php?page=wpr-theme-builder', {
    headers: { 'Cookie': cookieHeader }
  });
  const html = await res.text();
  fs.writeFileSync('wpr_theme_builder.html', html, 'utf8');
  console.log('Saved wpr_theme_builder.html, Length:', html.length);
  // look for 1398 or archive or shop
  const lines = html.split('\n').filter(l => l.includes('1398') || l.includes('Archive') || l.includes('Product') || l.includes('Shop'));
  console.log('Matching lines:', lines.slice(0, 10));
}

checkWprThemeBuilder().catch(console.error);
