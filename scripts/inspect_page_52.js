import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

async function inspectPage() {
  const nonce = 'f5b146aecd';
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/52?context=edit', {
    headers: {
      'Cookie': cookieHeader,
      'X-WP-Nonce': nonce
    }
  });
  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Title:', data.title);
  console.log('Status:', data.status);
  console.log('Slug:', data.slug);
  console.log('Template:', data.template);
  console.log('Meta keys:', Object.keys(data.meta || {}));
  fs.writeFileSync('page_52_edit.json', JSON.stringify(data, null, 2));
  console.log('Saved page_52_edit.json');
}

inspectPage().catch(console.error);
