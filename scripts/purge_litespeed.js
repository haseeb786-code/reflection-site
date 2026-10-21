import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
const WP_URL = 'https://reflectionelite.ataanalytiq.com';

async function purge() {
  console.log('Fetching wp-admin dashboard to find LiteSpeed purge URL...');
  const dashRes = await fetch(`${WP_URL}/wp-admin/`, {
    headers: {
      'Cookie': cookieHeader,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  });

  const html = await dashRes.text();
  console.log('Dashboard fetch status:', dashRes.status);
  
  const purgeMatch = html.match(/href="([^"]*(?:litespeed-purge-all|purge_all|litespeed_purge)[^"]*)"/i);
  if (purgeMatch) {
    const rawPurge = purgeMatch[1].replace(/&amp;/g, '&');
    const purgeUrl = rawPurge.startsWith('http') ? rawPurge : `${WP_URL}/wp-admin/${rawPurge}`;
    console.log('Purging LiteSpeed cache via:', purgeUrl);
    const pRes = await fetch(purgeUrl, {
      headers: {
        'Cookie': cookieHeader,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    console.log('Purge response status:', pRes.status);
  } else {
    console.log('Looking for admin-post.php litespeed action...');
    const nonceMatch = html.match(/name="_wpnonce"\s+value="([a-f0-9]+)"/);
    console.log('Nonce:', nonceMatch ? nonceMatch[1] : 'not found');
  }

  // Also purge specifically for post 1984
  console.log('\nChecking staging-home directly after purge...');
  const checkRes = await fetch(`${WP_URL}/staging-home/?lscache=none&purge=${Date.now()}`, {
    headers: {
      'Cookie': cookieHeader,
      'Cache-Control': 'no-cache'
    }
  });
  const checkHtml = await checkRes.text();
  console.log('Check HTML length:', checkHtml.length);
  console.log('Has ARCHITECTURAL GLASS?', checkHtml.includes('ARCHITECTURAL GLASS'));
  console.log('Has cycle-1?', checkHtml.includes('cycle-1'));
  console.log('Has FRAMELESS SHOWER?', checkHtml.includes('FRAMELESS SHOWER'));
}

purge().catch(console.error);
