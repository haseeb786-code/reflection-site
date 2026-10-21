const fs = require('fs');

const html = fs.readFileSync('wpcode_manager.html', 'utf8');
const rows = html.match(/<tr[^>]*id="snippet-[^"]*"[\s\S]*?<\/tr>/g) || [];
console.log('Found snippet rows:', rows.length);

const titles = [...html.matchAll(/class="row-title"[^>]*>([^<]+)<\/a>/g)].map(m => m[1]);
console.log('Titles found:', titles);

const ids = [...html.matchAll(/data-id="(\d+)"/g)].map(m => m[1]);
console.log('Snippet data-ids:', ids);

const addNew = html.match(/href="([^"]*wpcode-snippet-manager[^"]*)"/g);
console.log('WPCode manager links:', addNew);

const tableMatch = html.match(/<table class="wp-list-table[^"]*"[\s\S]*?<\/table>/);
if (tableMatch) {
  console.log('Table found, length:', tableMatch[0].length);
  fs.writeFileSync('wpcode_table.html', tableMatch[0]);
} else {
  console.log('No wp-list-table found. Looking for empty state or other tables...');
  const bodyMatch = html.match(/<div id="wpbody-content"[\s\S]*?<\/div><!-- wpbody-content -->/);
  if (bodyMatch) {
    fs.writeFileSync('wpcode_body.html', bodyMatch[0]);
    console.log('Saved wpbody-content');
  }
}
