import { getProdAuth } from './prod_auth_helper.js';

async function listThemeFiles() {
  const { siteUrl, cookies } = await getProdAuth();
  const editorRes = await fetch(`${siteUrl}/wp-admin/theme-editor.php?theme=astra`, {
    headers: { Cookie: cookies }
  });
  const html = await editorRes.text();
  const fileMatches = [...html.matchAll(/href="[^"]*file=([^"&]+)[^"]*"/g)].map(m => m[1]);
  console.log('Theme files available in theme-editor:');
  console.log(Array.from(new Set(fileMatches)).sort());
}

listThemeFiles().catch(console.error);
