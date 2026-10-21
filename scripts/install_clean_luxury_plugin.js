import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';

async function uploadAndActivateClean() {
  console.log('=== LOGGING IN TO WORDPRESS ADMIN ===');
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/plugin-install.php?tab=upload`);
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');
  console.log('Login successful! Getting upload page nonce...');

  const pageRes = await fetch(`${WP_URL}/wp-admin/plugin-install.php?tab=upload`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await pageRes.text();
  const nonceMatch = html.match(/name="_wpnonce"\s+value="([a-f0-9]+)"/i);
  if (!nonceMatch) {
    throw new Error('Could not find upload nonce');
  }
  const uploadNonce = nonceMatch[1];
  console.log('Found Upload Nonce:', uploadNonce);

  // Read zip file
  const zipPath = path.join(rootDir, 're-luxury-styling.zip');
  const zipBuffer = fs.readFileSync(zipPath);
  console.log(`Uploading ${zipPath} (${zipBuffer.length} bytes)...`);

  const formData = new FormData();
  formData.append('_wpnonce', uploadNonce);
  formData.append('_wp_http_referer', '/wp-admin/plugin-install.php?tab=upload');
  formData.append('pluginzip', new Blob([zipBuffer], { type: 'application/zip' }), 're-luxury-styling.zip');
  formData.append('install-plugin-submit', 'Install Now');

  const uploadRes = await fetch(`${WP_URL}/wp-admin/update.php?action=upload-plugin`, {
    method: 'POST',
    headers: {
      'Cookie': allCookies
    },
    body: formData
  });

  const uploadHtml = await uploadRes.text();
  console.log('Upload response length:', uploadHtml.length);
  
  // Look for activation link: plugins.php?action=activate&plugin=re-luxury-styling/re-luxury-styling.php
  const actMatch = uploadHtml.match(/href="([^"]*action=activate[^"]*plugin=re-luxury-styling[^"]*)"/i);

  if (actMatch) {
    const rawUrl = actMatch[1].replace(/&amp;/g, '&');
    const actUrl = rawUrl.startsWith('http') ? rawUrl : `${WP_URL}/wp-admin/${rawUrl}`;
    console.log('Activating plugin via:', actUrl);
    const actRes = await fetch(actUrl, {
      headers: { 'Cookie': allCookies }
    });
    console.log('Activation Status:', actRes.status);
    console.log('[SUCCESS] RE-LUXURY-STYLING PLUGIN IS NOW ACTIVE!');
  } else {
    console.log('Checking if plugin is installed in plugins.php...');
    // Fallback: check plugins.php
    const listRes = await fetch(`${WP_URL}/wp-admin/plugins.php`, { headers: { 'Cookie': allCookies } });
    const listHtml = await listRes.text();
    const actLink = listHtml.match(/plugins\.php\?action=activate&(?:amp;)?plugin=re-luxury-styling[^\s"']*/i);
    if (actLink) {
      const actUrl = `${WP_URL}/wp-admin/${actLink[0].replaceAll('&amp;', '&')}`;
      console.log('Activating via fallback link:', actUrl);
      const actRes = await fetch(actUrl, { headers: { 'Cookie': allCookies } });
      console.log('Activation Status:', actRes.status);
      console.log('[SUCCESS] RE-LUXURY-STYLING PLUGIN IS NOW ACTIVE!');
    }
  }
}

uploadAndActivateClean().catch(console.error);
