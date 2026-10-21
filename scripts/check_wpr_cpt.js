import { cookieHeader } from './staging_real_data_helper.js';

async function checkWprPostTypes() {
  for (const pt of ['wpr_theme_builder', 'wpr_templates', 'elementor_library']) {
    const res = await fetch(`https://reflectionelite.ataanalytiq.com/wp-admin/edit.php?post_type=${pt}`, {
      headers: { 'Cookie': cookieHeader }
    });
    console.log(`post_type=${pt} status:`, res.status);
    const html = await res.text();
    const rows = [...html.matchAll(/class="row-title"[^>]*>([\s\S]*?)<\/a>/g)].map(m => m[1].trim());
    console.log(`Titles for ${pt}:`, rows);
  }
}

checkWprPostTypes().catch(console.error);
