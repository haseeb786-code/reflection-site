import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
const nonce = 'f5b146aecd';

async function check() {
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/1984?context=edit', {
    headers: { 'Cookie': cookieHeader, 'X-WP-Nonce': nonce }
  });
  const d = await res.json();
  console.log('Page 1984 Content length:', (d.content?.raw || '').length);
  console.log('Page 1984 Elementor Data length:', (d.meta?._elementor_data || '').length);
  console.log('Page 1984 Meta keys:', Object.keys(d.meta || {}));
  console.log('Page 1984 Template:', d.template);
}

check().catch(console.error);
