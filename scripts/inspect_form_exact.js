import { getProdAuth } from './prod_auth_helper.js';

async function inspectFormExact() {
  const { siteUrl, cookies } = await getProdAuth();
  const editorRes = await fetch(`${siteUrl}/wp-admin/theme-editor.php?file=functions.php&theme=astra`, {
    headers: {
      Cookie: cookies,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      Referer: `${siteUrl}/wp-admin/theme-editor.php`
    }
  });
  const html = await editorRes.text();

  const formMatch = html.match(/<form[^>]*id="template"[^>]*>([\s\S]*?)<\/form>/i);
  if (!formMatch) {
    console.log('No form found');
    return;
  }
  console.log('Form opening tag:', formMatch[0].slice(0, 100));
  const inputs = [...formMatch[1].matchAll(/<input[^>]+>/gi)].map(m => m[0]);
  console.log('Inputs:\n', inputs.join('\n'));

  // Also check if there are scripts setting ajax data
  const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  for (const s of scripts) {
    if (s.includes('wp.themePluginEditor') || s.includes('edit-theme-plugin-file')) {
      console.log('Found editor script:\n', s.slice(0, 500));
    }
  }
}

inspectFormExact().catch(console.error);
