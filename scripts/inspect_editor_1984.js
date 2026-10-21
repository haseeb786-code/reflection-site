import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

async function run() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/post.php?post=1984&action=edit', {
    headers: { 'Cookie': cookieHeader }
  });
  const html = await res.text();
  fs.writeFileSync('editor_1984.html', html);
  console.log('Saved editor_1984.html, length:', html.length);
  const elementorMatch = html.match(/elementor-editor-button[^>]*href="([^"]+)"/i);
  console.log('Elementor editor URL:', elementorMatch ? elementorMatch[1] : 'not found');
  const postContentMatch = html.match(/<textarea[^>]*id="content"[^>]*>([\s\S]*?)<\/textarea>/i);
  console.log('Content textarea length:', postContentMatch ? postContentMatch[1].length : 'no textarea');
  if (postContentMatch) {
    console.log('Snippet of textarea:', postContentMatch[1].slice(0, 300));
  }
}

run().catch(console.error);
