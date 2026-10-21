import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

async function check() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/post.php?post=1984&action=elementor', {
    headers: {
      'Cookie': cookieHeader,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  });

  console.log('Elementor editor HTTP status:', res.status);
  const html = await res.text();
  console.log('HTML length:', html.length);
  fs.writeFileSync('elementor_editor_frame.html', html);
  
  const elementorConfigMatch = html.match(/var ElementorConfig\s*=\s*(\{[^;]+\});/);
  if (elementorConfigMatch) {
    try {
      const config = JSON.parse(elementorConfigMatch[1]);
      console.log('ElementorConfig Nonces:', config.nonces);
      console.log('ElementorConfig Post ID:', config.document?.id);
    } catch(e) {
      console.log('Could not parse ElementorConfig as JSON:', e.message);
    }
  } else {
    console.log('No ElementorConfig match');
    // Check if there is a nonce anywhere
    const nonces = [...html.matchAll(/"nonce":"([a-f0-9]+)"/g)].map(m => m[1]);
    console.log('Nonces found:', nonces);
  }
}

check().catch(console.error);
