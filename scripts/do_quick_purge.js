import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

async function purge() {
  console.log('Fetching toolbox to get purge nonce...');
  const tRes = await fetch('https://reflectionelite.ataanalytiq.com/wp-admin/admin.php?page=litespeed-toolbox', {
    headers: { 'Cookie': cookieHeader }
  });
  const tHtml = await tRes.text();
  const tMatch = tHtml.match(/href="([^"]*LSCWP_CTRL=purge[^"]*litespeed_type=purge_all[^"]*)"/i);
  if (tMatch) {
    const tpUrl = tMatch[1].replace(/&amp;/g, '&');
    console.log('Found Toolbox Purge URL:', tpUrl);
    const tpRes = await fetch(tpUrl, { headers: { 'Cookie': cookieHeader } });
    console.log('LiteSpeed Cache Purge Result Status:', tpRes.status);
  } else {
    console.log('Could not find specific purge_all link in toolbox.');
  }
}

purge().catch(console.error);
