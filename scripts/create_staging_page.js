import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
const page52 = JSON.parse(fs.readFileSync('page_52_edit.json', 'utf8'));

async function createStaging() {
  const nonce = 'f5b146aecd';

  console.log('Duplicating Page 52 ("Home") into Staging Page...');
  const payload = {
    title: 'Home — Staging Preview (Trending Era)',
    slug: 'staging-home',
    status: 'publish', // Published at /staging-home/ so client can review via shareable link without login
    template: 'elementor_canvas',
    meta: {
      _elementor_edit_mode: 'builder',
      _elementor_template_type: 'wp-page',
      _elementor_data: page52.meta._elementor_data || '[]',
      _elementor_page_settings: page52.meta._elementor_page_settings || {}
    }
  };

  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieHeader,
      'X-WP-Nonce': nonce
    },
    body: JSON.stringify(payload)
  });

  console.log('Response status:', res.status);
  const data = await res.json();
  if (res.ok) {
    console.log('Staging page created successfully!');
    console.log('Page ID:', data.id);
    console.log('Slug:', data.slug);
    console.log('Link:', data.link);
    fs.writeFileSync('staging_page_info.json', JSON.stringify(data, null, 2));
  } else {
    console.error('Failed to create staging page:', data);
  }
}

createStaging().catch(console.error);
