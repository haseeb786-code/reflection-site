import { getProdAuth } from './prod_auth_helper.js';

async function deleteTestUser() {
  const auth = await getProdAuth();
  console.log('Deleting test customer (ID 2)...');
  const res = await fetch('https://reflectionelite.com/wp-json/wp/v2/users/2?force=true&reassign=1', {
    method: 'DELETE',
    headers: {
      'Cookie': auth.cookies,
      'X-WP-Nonce': auth.nonce
    }
  });
  console.log('Delete status:', res.status);
  const data = await res.json();
  console.log('Deleted user confirmation:', data.deleted ? 'SUCCESS' : 'FAILED');
}
deleteTestUser();
