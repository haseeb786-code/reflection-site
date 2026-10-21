import { cookieHeader } from './staging_real_data_helper.js';

async function listWprTemplates() {
  const res = await fetch(`https://reflectionelite.ataanalytiq.com/wp-admin/edit.php?post_type=wpr_templates`, {
    headers: { 'Cookie': cookieHeader }
  });
  const html = await res.text();
  const rows = [...html.matchAll(/<tr\s+id="post-(\d+)"[^>]*>([\s\S]*?)<\/tr>/g)];
  console.log(`Found ${rows.length} wpr_templates rows:`);
  for (const r of rows) {
    const id = r[1];
    const rowHtml = r[2];
    const titleMatch = rowHtml.match(/class="row-title"[^>]*>([\s\S]*?)<\/a>/);
    const title = titleMatch ? titleMatch[1].trim() : 'Unknown';
    console.log(`- ID: ${id} | Title: ${title}`);
  }
}

listWprTemplates().catch(console.error);
