import { getFreshNonce, cookieHeader } from './staging_real_data_helper.js';

async function checkPost1398Meta() {
  const nonce = await getFreshNonce();
  const res = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/admin-ajax.php?action=elementor_ajax', {
    method: 'POST',
    headers: {
      'Cookie': cookieHeader,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'actions=' + encodeURIComponent(JSON.stringify({
      get_document_config: {
        action: 'get_document_config',
        data: { id: 1398 }
      }
    }))
  });
  console.log('AJAX Status:', res.status);
  const data = await res.json();
  console.log('Document config data:', data);
}

checkPost1398Meta().catch(console.error);
