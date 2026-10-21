import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./wp_session_cookies.json', 'utf8'));
const cookieHeader = cookies.map(c => c.name + '=' + c.value).join('; ');

const pageIds = [52, 7, 674, 943, 1511, 1519, 1598, 1615, 8, 9];

async function inspectPages() {
  console.log('=== INSPECTING STAGING CORE PAGES CONTENT ===');
  for (const id of pageIds) {
    const res = await fetch(`https://reflectionelite.ataanalytiq.com/wp-json/wp/v2/pages/${id}`, {
      headers: { Cookie: cookieHeader }
    });
    if (!res.ok) {
      console.log(`Page ${id} error:`, res.status);
      continue;
    }
    const data = await res.json();
    const raw = data.content?.rendered || '';
    const hasBanner = raw.includes('announcement-bar');
    const hasHeader = raw.includes('site-header');
    const bannerTextMatch = raw.match(/<div class="announcement-bar"[^>]*>([\s\S]*?)<\/div>/i);
    const navMatch = raw.match(/<nav class="main-nav"[^>]*>([\s\S]*?)<\/nav>/i);
    const actionMatch = raw.match(/<a[^>]*class="(?:header-quote-btn|btn-action)"[^>]*>([\s\S]*?)<\/a>/i);

    console.log(`Page ${id} (${data.slug}) - Title: "${data.title?.rendered}"`);
    console.log(`  Template: ${data.template}`);
    console.log(`  Has Announcement Bar: ${hasBanner}`);
    if (bannerTextMatch) console.log(`  Announcement Text: "${bannerTextMatch[1].replace(/<[^>]+>/g, '').trim()}"`);
    console.log(`  Has Site Header: ${hasHeader}`);
    if (actionMatch) console.log(`  Action Button: "${actionMatch[0].trim()}"`);
  }
}

inspectPages().catch(console.error);
