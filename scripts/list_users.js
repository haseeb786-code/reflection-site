import { getProdAuth } from './prod_auth_helper.js';

async function run() {
  const auth = await getProdAuth();
  const res = await fetch('https://reflectionelite.com/wp-json/wp/v2/users?context=edit', {
    headers: {
      'Cookie': auth.cookies,
      'X-WP-Nonce': auth.nonce
    }
  });
  const users = await res.json();
  console.log('Total users:', users.length);
  users.forEach(u => console.log(`ID: ${u.id} | Username: ${u.username} | Email: ${u.email} | Roles: ${u.roles.join(', ')}`));
}
run();
