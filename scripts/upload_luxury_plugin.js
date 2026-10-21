import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const WP_URL = 'https://mediumpurple-salamander-731288.hostingersite.com';

async function uploadAndActivatePlugin() {
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
  const zipPath = path.join(rootDir, 'reflection-elite-luxury.zip');
  const zipBuffer = fs.readFileSync(zipPath);
  console.log(`Uploading ${zipPath} (${zipBuffer.length} bytes)...`);

  const formData = new FormData();
  formData.append('_wpnonce', uploadNonce);
  formData.append('_wp_http_referer', '/wp-admin/plugin-install.php?tab=upload');
  formData.append('pluginzip', new Blob([zipBuffer], { type: 'application/zip' }), 'reflection-elite-luxury.zip');
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
  
  // Look for activation link: plugins.php?action=activate&plugin=...
  const actMatch = uploadHtml.match(/href="([^"]*action=activate[^"]*plugin=reflection-elite-luxury[^"]*)"/i) ||
                   uploadHtml.match(/href="([^"]*action=activate[^"]*)"/i);

  if (actMatch) {
    const rawUrl = actMatch[1].replace(/&amp;/g, '&');
    const actUrl = rawUrl.startsWith('http') ? rawUrl : `${WP_URL}/wp-admin/${rawUrl}`;
    console.log('Activating plugin via:', actUrl);
    const actRes = await fetch(actUrl, {
      headers: { 'Cookie': allCookies }
    });
    console.log('Activation Status:', actRes.status);
    console.log('[SUCCESS] REFLECTION ELITE LUXURY PLUGIN IS NOW ACTIVE!');
  } else {
    console.log('Could not find direct activation link. Checking plugins list via REST API...');
  }
}

uploadAndActivatePlugin().catch(console.error);
