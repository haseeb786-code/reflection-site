import { getProdAuth } from './prod_auth_helper.js';

async function checkNonces() {
  const { siteUrl, cookies } = await getProdAuth();
  const editorRes = await fetch(`${siteUrl}/wp-admin/theme-editor.php?file=functions.php&theme=astra`, {
    headers: { Cookie: cookies }
  });
  const html = await editorRes.text();

  const matches = [...html.matchAll(/(nonce["']?\s*[:=]\s*["']([^"']+)["'])/gi)];
  console.log('Matches for nonce:');
  for (const m of matches) {
    console.log(m[0]);
  }

  // Also search for wp.themePluginEditor or settings
  const editorSettings = html.match(/_wpFileEditorL10n\s*=\s*(\{[\s\S]*?\});/);
  if (editorSettings) {
    console.log('_wpFileEditorL10n:', editorSettings[1]);
  }

  const wpThemePluginEditor = html.match(/wp\.themePluginEditor\s*=\s*(\{[\s\S]*?\});/);
  if (wpThemePluginEditor) {
    console.log('wp.themePluginEditor:', wpThemePluginEditor[1]);
  }
}

checkNonces().catch(console.error);
