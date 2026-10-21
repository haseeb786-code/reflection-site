import fs from 'fs';
import http from 'https';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
const nonce = 'f5b146aecd';

// We can read the payload from scripts/build_staging_policies.js
const policiesScript = fs.readFileSync('scripts/build_staging_policies.js', 'utf8');
const payloadMatch = policiesScript.match(/const fullGutenbergPayload = `([\s\S]*?)`;\s*async/);
const payload = payloadMatch ? payloadMatch[1] : '';

const subPolicies = [
  { slug: 'staging-terms-of-service', title: 'Terms of Service — Staging Preview' },
  { slug: 'staging-privacy-policy', title: 'Privacy Policy — Staging Preview' },
  { slug: 'staging-shipping-policy', title: 'Shipping Policy — Staging Preview' },
  { slug: 'staging-refund-policy', title: 'Refund Policy — Staging Preview' }
];

async function deploySubPolicies() {
  for (const p of subPolicies) {
    const postData = JSON.stringify({
      title: p.title,
      slug: p.slug,
      status: 'publish',
      template: 'elementor_canvas',
      content: payload,
      meta: { _elementor_edit_mode: '' }
    });

    await new Promise((resolve) => {
      const req = http.request('https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages', {
        method: 'POST',
        headers: {
          'Cookie': cookieHeader,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'X-WP-Nonce': nonce
        }
      }, res => {
        let b = '';
        res.on('data', d => b += d);
        res.on('end', () => {
          console.log(`Deployed ${p.slug}: status ${res.statusCode}`);
          resolve();
        });
      });
      req.write(postData);
      req.end();
    });
  }
  console.log('All individual staging policy pages deployed!');
}

deploySubPolicies();
