import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
const nonce = 'f5b146aecd';

async function updateMode() {
  console.log('Setting _elementor_edit_mode to empty on Page 1984...');
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/1984', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieHeader,
      'X-WP-Nonce': nonce
    },
    body: JSON.stringify({
      template: 'elementor_canvas',
      meta: {
        _elementor_edit_mode: ''
      }
    })
  });

  console.log('Update status:', res.status);
  const data = await res.json();
  console.log('Page 1984 edit mode now:', data.meta?._elementor_edit_mode);

  // Purge cache
  const url1 = 'https://reflectionelite.ataanalytiq.com/wp-admin/admin.php?page=litespeed-toolbox&LSCWP_CTRL=purge&LSCWP_NONCE=3dfeaf3e77&litespeed_type=purge_all';
  await fetch(url1, { headers: { 'Cookie': cookieHeader } });

  // Check frontend
  const checkRes = await fetch('https://reflectionelite.ataanalytiq.com/staging-home/?cb=' + Date.now());
  const html = await checkRes.text();
  console.log('Staging HTML length:', html.length);
  console.log('Has ARCHITECTURAL GLASS?', html.includes('ARCHITECTURAL GLASS'));
  console.log('Has cycle-1?', html.includes('cycle-1'));
  console.log('Has FRAMELESS SHOWER?', html.includes('FRAMELESS SHOWER'));
}

updateMode().catch(console.error);
