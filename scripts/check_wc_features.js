import fs from 'fs';

const WP_URL = 'https://reflectionelite.com';

async function checkWcFeatures() {
  const loginUrl = `${WP_URL}/wp-login.php`;
  const res1 = await fetch(loginUrl);
  const cookies = res1.headers.getSetCookie();
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');

  const params = new URLSearchParams();
  params.append('log', 'admin');
  params.append('pwd', 'process.env.PROD_WP_PASS || "[REDACTED]"');
  params.append('wp-submit', 'Log In');
  params.append('redirect_to', `${WP_URL}/wp-admin/admin.php?page=wc-settings&tab=advanced&section=features`);
  params.append('testcookie', '1');

  const res2 = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader },
    body: params.toString(),
    redirect: 'manual'
  });

  const postCookies = res2.headers.getSetCookie();
  const allCookies = [...cookies, ...postCookies].map(c => c.split(';')[0]).join('; ');

  const res3 = await fetch(`${WP_URL}/wp-admin/admin.php?page=wc-settings&tab=advanced&section=features`, {
    headers: { 'Cookie': allCookies }
  });
  const html = await res3.text();
  
  // Extract all feature settings table rows / labels / checkboxes
  const trMatches = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  console.log(`=== FOUND ${trMatches.length} TABLE ROWS ON FEATURES PAGE ===\n`);
  
  for (const tr of trMatches) {
    const text = tr[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const hasChecked = tr[1].includes('checked');
    const inputMatch = tr[1].match(/name="([^"]+)"/);
    const inputName = inputMatch ? inputMatch[1] : '';
    if (text) {
      console.log(`- [${hasChecked ? 'ENABLED' : 'DISABLED'}] ${inputName}: ${text.substring(0, 160)}`);
    }
  }

  // Also check options.php or razorpay settings page
  const resRazorpay = await fetch(`${WP_URL}/wp-admin/admin.php?page=wc-settings&tab=checkout&section=razorpay`, {
    headers: { 'Cookie': allCookies }
  });
  const rzpHtml = await resRazorpay.text();
  console.log('\n=== RAZORPAY SETTINGS PAGE INSPECTION ===');
  const rzpRows = [...rzpHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  for (const tr of rzpRows) {
    const text = tr[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text.toLowerCase().includes('key') || text.toLowerCase().includes('webhook') || text.toLowerCase().includes('test') || text.toLowerCase().includes('enable')) {
      const isChecked = tr[1].includes('checked');
      const valMatch = tr[1].match(/value="([^"]*)"/);
      console.log(`- ${text.substring(0, 100)} => Checked: ${isChecked}, Val: ${valMatch ? (valMatch[1].includes('sec') ? '[REDACTED]' : valMatch[1]) : 'N/A'}`);
    }
  }
}

checkWcFeatures().catch(console.error);
