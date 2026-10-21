import { getProdAuth } from './prod_auth_helper.js';

async function testFunctionsSave() {
  const { siteUrl, cookies } = await getProdAuth();
  const editorRes = await fetch(`${siteUrl}/wp-admin/theme-editor.php?file=functions.php&theme=astra`, {
    headers: { Cookie: cookies }
  });
  const html = await editorRes.text();

  const nonceMatch = html.match(/name="nonce"\s+value="([a-f0-9]+)"/i);
  console.log('Nonce:', nonceMatch?.[1]);

  const contentMatch = html.match(/<textarea[^>]*id="newcontent"[^>]*>([\s\S]*?)<\/textarea>/i);
  console.log('Found textarea?', !!contentMatch);

  // Check form inputs
  const formMatch = html.match(/<form[^>]*id="template"[^>]*>([\s\S]*?)<\/form>/i);
  if (formMatch) {
    const inputs = [...formMatch[1].matchAll(/<input[^>]+name="([^"]+)"[^>]+value="([^"]*)"/gi)];
    for (const inp of inputs) {
      console.log(` - input ${inp[1]} = ${inp[2]}`);
    }
  }

  // Let's also check if there is an error notice currently in html
  const noticeMatch = html.match(/<div[^>]*class="notice[^"]*"[^>]*>([\s\S]*?)<\/div>/gi);
  if (noticeMatch) {
    console.log('Notices:', noticeMatch);
  }
}

testFunctionsSave().catch(console.error);
